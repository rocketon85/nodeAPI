import 'reflect-metadata';
import { Container } from 'typedi';

import app from './App';
import {AppDbContext} from './dal/dbcontext';

const dbContext = Container.get(AppDbContext);

app.listen(3000, () => {
    
    return console.log(`server is listening on ${3000}`)
  });
