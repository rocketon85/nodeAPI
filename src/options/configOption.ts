import { Service } from 'typedi';

const dotenv = require('dotenv');
const path = require('path');

@Service()
export class ConfigOption {

    constructor() {
        dotenv.config({
            path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
        });
    }

    public NODE_ENV:string = process.env.NODE_ENV || 'development';
    public HOST:string = process.env.HOST || 'localhost';
    public PORT:number = parseInt(process.env.PORT as string) || 3000;
}

