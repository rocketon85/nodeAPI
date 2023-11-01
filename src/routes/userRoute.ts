import { Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';

import { UserController } from '../controllers/userController';
import { LoggerService } from '../services/loggerService';
import { LocalizationService } from '../services/localizationService';
import {DecodeResult, ExpirationStatus, Session, decodeSession, encodeSession, checkExpirationStatus} from "../utils/jwt";
import { JwtOption } from '../options/jwtOption';

export class UserRouter {
  public Router: Router;

  constructor() {
    this.Router = Router();
    this.init();
  }

    /**
     * @openapi
     * '/api/user/authenticate':
     *  post:
     *     tags:
     *     - User Controller
     *     summary: Authenticate
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - username
     *              - password
     *            properties:
     *              username:
     *                type: string
     *                default: user 
     *              password:
     *                type: string
     *                default: user123
     *     responses:
     *      200:
     *        description: Success
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Server Error
     */
  public authenticate(req: Request, res: Response, next: NextFunction) {
    let name:string = req.body["username"];
    let password:string = req.body["password"];
    const logger = Container.get(LoggerService);
    const localization = Container.get(LocalizationService);
    var userController = new UserController();

    userController.login(name, password).then((user) => {
      var jwtOption = Container.get(JwtOption);
      const SECRET_KEY_HERE = jwtOption.KEY;
      const session = encodeSession(SECRET_KEY_HERE, {
          id: user.id,
          username: user.name,
          dateCreated: new Date().getMilliseconds()        
      });
      res.status(200).json(session);
    } ).catch((reason) => {
      res.status(401).json({
        ok: false,
        status: 401,
        message: reason
      });
    });
  }

  /**
     * @openapi
     * '/api/user/users':
     *  get:
     *     tags:
     *     - User Controller
     *     summary: Get all users
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
  public getAll(req: Request, res: Response, next: NextFunction) {
    const logger = Container.get(LoggerService);
    const localization = Container.get(LocalizationService);
    var userController = new UserController();

    userController.getAll().then((users) => {
      res.status(200).json(users);
    } ).catch((reason) => {
      res.status(401).json({
        ok: false,
        status: 401,
        message: reason
      });
    });
  }

  init() {
    this.Router.get('/users', this.getAll);
    this.Router.post('/authenticate', this.authenticate);
  }
}

const userRouter = new UserRouter();
export default userRouter.Router;