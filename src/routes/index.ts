import { Router, Request, Response, NextFunction } from 'express';
import UserRouter from './user';
// import GroupRouter from './group';
// import VideoRouter from './video';
// import AdminRouter from './admin';

const fs = require('fs');
const url = require('url');

export class MainRouter {
  router: Router

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    // placeholder route handler
    this.router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!'
      });
    });
    this.router.get('/a', (req, res, next) => {
      res.json({
        message: 'Hello World a!'
      });
    });

    this.router.use('/user', UserRouter);
    // this.router.use('/group', GroupRouter);
    // this.router.use('/video', VideoRouter);
    // this.router.use('/admin', AdminRouter);
  }

}

const mainRouter = new MainRouter();
mainRouter.init();

export default mainRouter.router;
