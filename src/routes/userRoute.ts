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
 * @swagger
 * components:
 *  schemas:
 *    Task:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: the auto-generated id of task
 *        name:
 *          type: string
 *          description: the name of the task
 *        description:
 *          type: string
 *          description: the description of the task
 *      required:
 *        - name
 *        - description
 *      example:
 *        id: gQBOyGbxcQy6tEp0aZ78X
 *        name: My first Task
 *        description: I have to do Something
 *    TaskNotFound:
 *      type: object
 *      properties:
 *        msg:
 *          type: string
 *          description: A message for the not found task
 *      example:
 *        msg: Task was not found
 *
 *  parameters:
 *    taskId:
 *      in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: the task id
 */

/**
 * @swagger
 * tags:
 *  name: Tasks
 *  description: Tasks endpoint
 */

/**
 * @swagger
 * /tasks:
 *  get:
 *    summary: Returns a list of tasks
 *    tags: [Tasks]
 *    responses:
 *      200:
 *        description: the list of tasks
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Task'
 */
  public authenticate(req: Request, res: Response, next: NextFunction) {
    let name:string = req.body["username"];
    let password:string = req.body["password"];
    const logger = Container.get(LoggerService);
    const localization = Container.get(LocalizationService);
    var userController = new UserController();

    userController.login(name, password).then((user) => {
      var jwtOption = Container.get(JwtOption);

      // This route is unprotected, anybody can call it
      const SECRET_KEY_HERE = jwtOption.KEY;
      // TODO: Validate username/password
      const session = encodeSession(SECRET_KEY_HERE, {
          id: user.id,
          username: user.name,
          dateCreated: new Date().getMilliseconds()        
      });
      logger.info(localization.__('Hello'));
      res.status(200).json(session);
    } ).catch((reason) => {
      res.status(401).json({
        ok: false,
        status: 401,
        message: reason
      });
    });
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    res.json({
      message: 'Hello World User!'
    })
  }

  init() {
    this.Router.get('', this.getAll);
    this.Router.post('/authenticate', this.authenticate);
  }

}

const userRouter = new UserRouter();
export default userRouter.Router;