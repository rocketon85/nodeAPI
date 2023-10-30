import { Service } from 'typedi';

const dotenv = require('dotenv');
const path = require('path');

@Service()
export class JwtOption {

    constructor() {
        dotenv.config({
            path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
        });
    }

    public KEY:string = process.env.JWT_KEY || 'Yh2k7QSu4l8CZg5p6X3Pna9L0Miy4D3Bvt0JVr87UcOj69Kqw5R2Nmf4FWs03Hdx';
}

