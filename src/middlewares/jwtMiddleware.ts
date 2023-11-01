import { Request, Response, NextFunction } from "express";
import {DecodeResult, ExpirationStatus, Session, decodeSession, encodeSession, checkExpirationStatus} from "../utils/jwt";
import { Container } from 'typedi';

import { JwtOption } from '../options/jwtOption';
import { LoggerService } from "../services/loggerService";

function requireJwtMiddleware(request: Request, response: Response, next: NextFunction) {
    var jwtOption = Container.get(JwtOption);
    var logger = Container.get(LoggerService);

    logger.trace("jwtMiddleware");
    const unauthorized = (message: string) => response.status(401).json({
        ok: false,
        status: 401,
        message: message
    });
    if(request.path.indexOf('/api/user/authenticate') > -1 || request.path.indexOf('api-docs') > -1|| request.path.indexOf('docs') > -1) {
        next(); 
        return;
    }
    
    
    const requestHeader = "Authorization";
    const responseHeader = "Bearer ";
    const header = request.header("Authorization");
    if (!header) {
        unauthorized(`Required ${requestHeader} header not found.`);
        return;
    }
    const SECRET_KEY_HERE = jwtOption.KEY;
    const decodedSession: DecodeResult = decodeSession(SECRET_KEY_HERE, header.replace(responseHeader,""));
    
    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        unauthorized(`Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`);
        return;
    }

    const expiration: ExpirationStatus = checkExpirationStatus(decodedSession.session);

    if (expiration === "expired") {
        unauthorized(`Authorization token has expired. Please create a new authorization token.`);
        return;
    }

    let session: Session;

    if (expiration === "grace") {
        // Automatically renew the session and send it back with the response
        const { token, expires, issued } = encodeSession(SECRET_KEY_HERE, decodedSession.session);
        session = {
            ...decodedSession.session,
            expires: expires,
            issued: issued
        };

        response.setHeader(requestHeader, responseHeader + token);
    } else {
        session = decodedSession.session;
    }

    // Set the session on response.locals object for routes to access
    response.locals = {
        ...response.locals,
        session: session
    };

    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}

export default requireJwtMiddleware;