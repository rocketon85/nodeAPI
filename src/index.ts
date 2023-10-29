// import 'reflect-metadata';
import { Container } from 'typedi';

import app from './App';
import { AppDbContext } from './dal/dbcontext';
import { LoggerService } from './services/logger';
import { Config } from './utils/config';

const config = Container.get(Config);
const logger = Container.get(LoggerService);
const dbContext = Container.get(AppDbContext);

app.listen(config.PORT, () => {
    logger.info(`server is listening on ${config.PORT}`);
});
