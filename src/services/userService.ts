import {Service, Container} from 'typedi';

import { LoggerService } from './loggerService';
import { AppDbContext } from '../contexts/dbcontext';
import { UserDomain } from '../domains/userDomain';

export class UserService {
    private logger = Container.get(LoggerService);
    private dbContext = Container.get(AppDbContext);

    constructor() {
    }

    public async login(username:string, password:string): Promise<UserDomain> {
        return new Promise((resolve, reject) => {
            var userRepository = this.dbContext.manager.getRepository(UserDomain);

            userRepository.findOneBy({name: username, password: password}).then((user) => {
                if(user == null){
                     reject("not found");
                }else{
                    this.logger.info("user founded.");
                    resolve(user);
                }
            }).catch((reason) => {
                reject(reason);
            })
        })
    }
}

