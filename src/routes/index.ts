import { Router, Request, Response, NextFunction } from 'express';

import UserRouter from './userRoute';

export class MainRouter {
  public Router: Router

  constructor() {
    this.Router = Router();
    this.init();
  }

  init() {
    this.Router.use('/api/user', UserRouter);
  }
}

const mainRouter = new MainRouter();
export default mainRouter.Router;
