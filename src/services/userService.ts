import { info } from 'console';
import {Service, Container} from 'typedi';

import { LoggerService } from './loggerService';
import { AppDbContext } from '../contexts/dbcontext';
import { User } from '../domains/userDomain';

@Service()
export class UserService {
    private logger = Container.get(LoggerService);
    private dbContext = Container.get(AppDbContext);

    constructor() {
    }

    public async login(username:string, password:string): Promise<User> {
        return new Promise((resolve, reject) => {
            const model = new User();
            model.name = "Me and Bears";
            model.password = "I am near polar bears";
    
            this.dbContext.manager.save(model).then((user) => {
                info("user added service");
                resolve(user);
            });
        })
    }
}

