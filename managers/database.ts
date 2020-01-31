import { ConnectionConfig, createConnection, Connection, MysqlError } from "mysql";
import LoggerManager, { LogType } from "./logger";

export default class DatabaseManager {
    private connectionConfig: ConnectionConfig;
    private connection: Connection;
    private logger: LoggerManager = new LoggerManager('database');

    constructor(configuration: ConnectionConfig) {
        this.connectionConfig = configuration;
        this.logger.debug('Loggin in MYSQL...');
        this.connection = createConnection(this.connectionConfig);
        this.logger.log('MYSQL ready.', LogType.INFO);
    }

    public runQuery(query: string) {
        this.logger.debug(`Running query ${query}`);
        return new Promise((resolve, reject) => this.connection.query(query, (error: MysqlError, rows: any) => {
            if (error) return reject(error);
            return resolve(rows);
        }))
    }
}