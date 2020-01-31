import { appendFileSync } from "fs";
import Fenix from '../index';
const moment = require('moment');

export enum LogType {
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL
}

export default class LoggerManager {
    private path: string;
    private namespace: string;

    constructor(namespace: string, path: string = './logs') {
        this.path = path;
        this.namespace = namespace;
    }

    private write(file: string, data: string) {
        appendFileSync(`${this.path}/${file}.txt`, `\n${data}`, { encoding: 'utf-8' });/*
        let archive = readFileSync(`${LoggerManager.path}/${file}.txt`);
        if (archive.byteLength > 1e7)
        {
            archive = archive.slice(200, )
        }*/
    }

    public log(data: any, logtype: LogType) {
        let debug = Fenix.getConfig().DEBUG;
        logtype = debug && logtype === LogType.INFO ? LogType.DEBUG : logtype;
        data = this.logString(data, debug);

        switch (logtype) {
            case LogType.DEBUG:
                if (!debug) return;
                this.write('debug', data);
                break;
            case LogType.INFO:
                this.write('info', data);
                break;
            case LogType.WARN:
                this.write('warn', data);
                break;
            case LogType.ERROR:
                this.write('error', data);
                break;
            case LogType.FATAL:
                this.write('fatal', data);
                break;
        }
        console.log(data);
    }

    public debug(data: any) {
        this.log(data, LogType.DEBUG);
    }

    private logString(args: string[] | string, debug: boolean = false) {
        return `${debug ? '[DEBUG] ' : ''}[${moment().format("HH:mm:ss")}] [${this.namespace.toUpperCase()}] >> ${args}`;
    }
}