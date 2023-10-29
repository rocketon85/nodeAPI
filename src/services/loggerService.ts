import {Service} from 'typedi';
import { createStream } from "rotating-file-stream";
import { BaseLogger,Logger, ILogObjMeta, ISettingsParam, ILogObj } from "tslog";

@Service()
export class LoggerService<LogObj> extends Logger<ILogObj> {
  constructor() {
    super();

    const stream = createStream("tslog.log", {
        size: "10M", // rotate every 10 MegaBytes written
        interval: "1d", // rotate daily
        compress: "gzip", // compress rotated files
    });

    this.attachTransport((logObj) => {
        stream.write(JSON.stringify(logObj) + "\n");
    });
  }
}