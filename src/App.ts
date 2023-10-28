import { Container, Service } from 'typedi';
import "reflect-metadata";
import { info } from 'console';

import express, { Response, Request, NextFunction } from "express";
import morgan from "morgan";

import mainRoute from './routes';
import * as bodyParser from 'body-parser';
import cors from "cors";
import helmet from "helmet";

import  requireJwtMiddleware from './middlewares/jwt';
import {DecodeResult, ExpirationStatus, Session, decodeSession, encodeSession, checkExpirationStatus} from "./utils/jwt";

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./options/swaggerOptions";

import {UserService} from './services/user';

//import * as router from './routes/routes';

class App {
  public app: express.Application;
 
  constructor () {
    this.app = express();
    
    this.app.use(express.static(__dirname + '/temp'));
    this.routes();
  }

  // Configure API endpoints.
  private routes(): void {
    this.app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    
    this.app.use(morgan("tiny"));
    this.app.use(express.static("public"));

    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(mainRoute);
    // this.app.use("/protected", requireJwtMiddleware);
    this.app.use(requireJwtMiddleware);


    // Set up an HTTP Post listener at /sessions, which will "log in" the caller and return a JWT 
    this.app.post("/api/user/authenticate", (req: Request, res: Response) => {
    //   let userService: UserService;
    // userService = new UserService();
    const userService = Container.get(UserService);
    userService.login("","").then((user) => {
      info("user added route");
      info(user);
    });

      // This route is unprotected, anybody can call it
      const SECRET_KEY_HERE = "1dad12k313jn1n1k3";
      // TODO: Validate username/password
      const session = encodeSession(SECRET_KEY_HERE, {
          id: 1,
          username: "some user",
          dateCreated: new Date().getMilliseconds()        
      });
      
      res.status(201).json(session);
    });

    // Set up an HTTP Get listener at /protected. The request can only access it if they have a valid JWT token
    this.app.get("/protected", (req: Request, res: Response) => {
      // The auth middleware protects this route and sets res.locals.session which can be accessed here
      const session: Session = res.locals.session;

      res.status(200).json({ message: `Your username is ${session.username}` });
    });

    const specs = swaggerJsDoc(options);
    this.app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
  }
}

export default new App().app