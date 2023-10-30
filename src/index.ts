// import 'reflect-metadata';
import { Container } from 'typedi';

import app from './App';
import { AppDbContext } from './contexts/dbcontext';
import { LoggerService } from './services/loggerService';
import { ConfigOption } from './options/configOption';
import { JwtOption } from './options/jwtOption';

const config = Container.get(ConfigOption);
const jwtConfig = Container.get(JwtOption);
const logger = Container.get(LoggerService);
const dbContext = Container.get(AppDbContext);

app.listen(config.PORT, () => {
    logger.info(`server is listening on ${config.PORT}`);
});
