import { injectable } from 'inversify';
import { DatabaseConnection } from '../interface/database_connection.interface'
import { createPool, Pool } from 'mysql2/promise';
import { PoolConnection } from 'mysql2';


@injectable()
export class MySqlConnection implements DatabaseConnection {
    public connection: Pool;
 
    constructor() {

        let connection = createPool({
            host: process.env.WISECUT_DATABASE_HOST ,
            user: process.env.WISECUT_DATABASE_USER ,
            password: process.env.WISECUT_DATABASE_PASSWORD,
            database: process.env.WISECUT_DATABASE ,
            connectionLimit: 3,
            waitForConnections: true
        });
        this.connection = connection;

    }
     async connect(): Promise<any> {
        return await this.connection.getConnection();
    }

}
