import {Service, Container} from 'typedi';

import { LoggerService } from '../services/loggerService';
import { UserService } from '../services/userService';
import { UserDomain } from '../domains/userDomain';


export class UserController{
    private logger = Container.get(LoggerService);
    private userService:UserService;

    constructor(){
        this.userService = new UserService();
    }

    public login(name:string, password:string):Promise<UserDomain>{
        return new Promise( ( resolve, reject ) => {
            this.userService.login(name, password).then((user) => {
                resolve(user);
            }).catch((reason) => {
                reject(reason);
            });
        });
    }

    public getAll():Promise<UserDomain[]>{
        return new Promise( ( resolve, reject ) => {
            this.userService.getAll().then((users) => {
                resolve(users);
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
}