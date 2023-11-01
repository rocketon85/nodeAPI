import {Service, Container} from 'typedi';

import { LoggerService } from './loggerService';
import { LocalizationService } from './localizationService';
import { AppDbContext } from '../contexts/dbcontext';
import { UserDomain } from '../domains/userDomain';

export class UserService {
    private logger = Container.get(LoggerService);
    private dbContext = Container.get(AppDbContext);
    private localization = Container.get(LocalizationService);

    constructor() {
    }

    public async login(username:string, password:string): Promise<UserDomain> {
        return new Promise((resolve, reject) => {
            var userRepository = this.dbContext.manager.getRepository(UserDomain);

            userRepository.findOneBy({name: username, password: password}).then((user) => {
                this.logger.trace();
                if(user == null){
                    this.logger.warn(this.localization.__('User.NotFound'));
                    reject(this.localization.__('User.NotFound'));
                }else{
                    this.logger.debug(this.localization.__('User.Found'));
                    resolve(user);
                }
            }).catch((reason) => {
                this.logger.error(reason);
                reject(reason);
            })
        })
    }

    public async getAll(): Promise<UserDomain[]> {
        return new Promise((resolve, reject) => {
            var userRepository = this.dbContext.manager.getRepository(UserDomain);

            userRepository.find().then((users) => {
                this.logger.trace();
                if(users == null){
                    this.logger.warn(this.localization.__('Users.NotFound'));
                    reject(this.localization.__('Users.NotFound'));
                }else{
                    this.logger.debug(this.localization.__('Users.Found'));
                    resolve(users);
                }
            }).catch((reason) => {
                this.logger.error(reason);
                reject(reason);
            })
        })
    }
}

