import { Router, Request, Response, NextFunction } from 'express';

import UserRouter from './userRoute';

export class MainRouter {
  public Router: Router

  constructor() {
    this.Router = Router();
    this.init();
  }

  init() {
    // placeholder route handler
    this.Router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!'
      });
    });
    this.Router.get('/a', (req, res, next) => {
      res.json({
        message: 'Hello World a!'
      });
    });

    this.Router.use('/api/user', UserRouter);
  }
}

const mainRouter = new MainRouter();
export default mainRouter.Router;
