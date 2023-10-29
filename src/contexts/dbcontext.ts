import { Service, Container } from 'typedi';
import { DataSource, DataSourceOptions, EntityManager } from "typeorm"

import { LoggerService } from '../services/loggerService';
import { User } from "../domains/userDomain"

@Service()
export class AppDbContext extends DataSource {
    private loggerService = Container.get(LoggerService);

    constructor(options: DataSourceOptions) {
        const dbSettings ={
            type: "sqlite",
            database: ":memory:",
            dropSchema: false,
            entities: [User],
            synchronize: true,
            logging: true
        } as any;
        super(dbSettings);

        this.initialize().then(()=>{
            this.loggerService.debug(`In memory Db initialized`);
            this.loggerService.trace(`In memory Db initialized`);
            this.createSource().then((status) => {
                this.loggerService.debug(`Db source created`);
            });
        });
    }

    public async createSource():Promise<any>{
        try {
            
            var promises = [];

            promises.push(new Promise((resolve, reject) => {
                const model = new User();
                model.name = "admin";
                model.password = "admin123";

                this.manager.save(model).then((user) => {
                    this.loggerService.debug("user added");
                    this.loggerService.debug(user);
                    resolve(user);
                });
            }));
            
            promises.push(new Promise((resolve, reject) => {
                const model = new User();
                model.name = "user";
                model.password = "user123";

                this.manager.save(model).then((user) => {
                    this.loggerService.debug("user added");
                    this.loggerService.debug(user);
                    resolve(user);
                });
            }));

            return Promise.all(promises);
        } catch (err:any) {
            this.loggerService.error(`error creating db source. Error: ${err.message}`)
        }
    }
}
