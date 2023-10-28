import { info } from 'console';
import {Service, Container} from 'typedi';

import {AppDbContext} from '../dal/dbcontext';
import {User} from '../domain/user';

@Service()
export class UserService {
    private random:number;
    private dbContext = Container.get(AppDbContext);

    constructor() {
        this.random = Math.floor(Math.random() * (1000 - 10 + 1)) + 10; 
        // this.dbContext.connect();
    }

    public async login(username:string, password:string): Promise<User> {
        info("Injected service " + this.random);
        return new Promise((resolve, reject) => {
            // this.dbContext.connect().then(() =>{
                const model = new User();
                model.name = "Me and Bears";
                model.password = "I am near polar bears";
        
                this.dbContext.AppDataStore.manager.save(model).then((user) => {
                    info("user added service");
                    resolve(user);
                });
            })
        // });
    }
}

