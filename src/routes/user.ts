import { Container, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { info } from 'console';

import {UserService} from '../services/user';
import * as Auth from '../middlewares/jwt';
import * as token from '../utils/jwt';

export class UserRouter {
  router: Router

  constructor() {
    this.router = Router();
    this.init();
  }


  public getAll(req: Request, res: Response, next: NextFunction) {
    res.json({
      message: 'Hello World User!'
    })
  }

  
  public createToken(req: Request, res: Response, next: NextFunction) {
    res.json({
      message: ""
    })
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
  public login(req: Request, res: Response) {
    let name: string;
    let password: string;
     
    name = req.body["name"];
    password = req.body["password"];

    const userService = Container.get(UserService);

    // let userService: UserService;
    // userService = new UserService();

    userService.login(name, password).then((user) => {
      info("user added route");
      info(user);
    })

    if(name == password) {
        res.status(200)
            .send({
                message: 'Success',
                status: res.status
            });
    }else{
        res.status(500)
            .send({
                message: "sad",
                status: res.status,
            });
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('', this.getAll);
    this.router.post('/login', this.login);
    this.router.post('/createToken', this.createToken);
  }

}

const userRouter = new UserRouter();

export default userRouter.router;