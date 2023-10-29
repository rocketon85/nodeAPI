// import 'reflect-metadata';
import { Container } from 'typedi';

import app from './App';
import { AppDbContext } from './contexts/dbcontext';
import { LoggerService } from './services/loggerService';
import { Config } from './utils/config';

const config = Container.get(Config);
const logger = Container.get(LoggerService);
const dbContext = Container.get(AppDbContext);

app.listen(config.PORT, () => {
    logger.info(`server is listening on ${config.PORT}`);
});
