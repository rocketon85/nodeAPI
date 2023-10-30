import { Container } from 'typedi';
import express, { Response, Request, NextFunction } from "express";
import morgan from "morgan";
import mainRoute from './routes';
import * as bodyParser from 'body-parser';
import cors from "cors";
import helmet from "helmet";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";


import  requireJwtMiddleware from './middlewares/jwtMiddleware';
import {DecodeResult, ExpirationStatus, Session, decodeSession, encodeSession, checkExpirationStatus} from "./utils/jwt";

import { swaggerOption } from "./options/swaggerOption";
import { LoggerService } from './services/loggerService';
import { UserService } from './services/userService';

//import * as router from './routes/routes';

class App {
  private logger = Container.get(LoggerService);

  public App: express.Application;
 
  constructor () {
    this.App = express();
    
    this.App.use(express.static(__dirname + '/temp'));
    this.routes();
  }

  // Configure API endpoints.
  private routes(): void {
    this.App.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    
    this.App.use(bodyParser.urlencoded({ extended: false }));
    this.App.use(bodyParser.json());
    
    this.App.use(morgan("tiny"));
    this.App.use(express.static("public"));

    this.App.use(helmet());
    this.App.use(cors());
    this.App.use(express.json());
    this.App.use(mainRoute);
    // this.App.use("/protected", requireJwtMiddleware);
    this.App.use(requireJwtMiddleware);

    // Set up an HTTP Get listener at /protected. The request can only access it if they have a valid JWT token
    this.App.get("/protected", (req: Request, res: Response) => {
      // The auth middleware protects this route and sets res.locals.session which can be accessed here
      const session: Session = res.locals.session;

      res.status(200).json({ message: `Your username is ${session.username}` });
    });

    const specs = swaggerJsDoc(swaggerOption);
    this.App.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
  }
}

export default new App().App