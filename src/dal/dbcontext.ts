import { info } from 'console';
import {Service} from 'typedi';
import { DataSource, DataSourceOptions, EntityManager } from "typeorm"

import { User } from "../domain/user"

@Service()
export class AppDbContext {
    public AppDataStore: DataSource;

    constructor() {
        const dbSettings ={
            type: "sqlite",
            database: ":memory:",
            dropSchema: false,
            entities: [User],
            synchronize: true,
            logging: true
        } as any;

        this.AppDataStore = new DataSource(dbSettings)
        this.AppDataStore.initialize().then((value: DataSource)=>{
            info(`In memory Db initialized`);
            this.createSource().then((status) => {
                info(`Db source created`);
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

                this.AppDataStore.manager.save(model).then((user) => {
                    info("user added service");
                    resolve(user);
                });
            }));
            
            promises.push(new Promise((resolve, reject) => {
                const model = new User();
                model.name = "user";
                model.password = "user123";

                this.AppDataStore.manager.save(model).then((user) => {
                    info("user added service");
                    resolve(user);
                });
            }));

            return Promise.all(promises);
        } catch (err:any) {
            console.error(`dbConnectionManager - error initializing db. Error: ${err.message}`)
        }
    }

}
