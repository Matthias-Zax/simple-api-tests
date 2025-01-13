import * as informix from 'informixdb';

export class DatabaseHelper {
    private connection: any;
    private static instance: DatabaseHelper;
    private connectionString: string;

    private constructor() {
        // Informix connection string
        this.connectionString = 
            `SERVER=${process.env.DB_SERVER || 'localhost'};` +
            `DATABASE=${process.env.DB_NAME || 'corporate_actions'};` +
            `HOST=${process.env.DB_HOST || 'localhost'};` +
            `SERVICE=${process.env.DB_PORT || '9088'};` +
            `UID=${process.env.DB_USER || 'informix'};` +
            `PWD=${process.env.DB_PASSWORD || 'informix'};` +
            'PROTOCOL=onsoctcp;' +
            'DELIMIDENT=y;';
    }

    public static getInstance(): DatabaseHelper {
        if (!DatabaseHelper.instance) {
            DatabaseHelper.instance = new DatabaseHelper();
        }
        return DatabaseHelper.instance;
    }

    private async getConnection(): Promise<any> {
        if (!this.connection) {
            this.connection = await new Promise((resolve, reject) => {
                informix.open(this.connectionString, (err, conn) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(conn);
                });
            });
        }
        return this.connection;
    }

    /**
     * Execute a query and return all results
     */
    async query<T>(sql: string, params: any[] = []): Promise<T[]> {
        const conn = await this.getConnection();
        return new Promise((resolve, reject) => {
            conn.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result as T[]);
            });
        });
    }

    /**
     * Execute a query and return a single result
     */
    async queryOne<T>(sql: string, params: any[] = []): Promise<T | null> {
        const results = await this.query<T>(sql, params);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Execute a query that doesn't return results (INSERT, UPDATE, DELETE)
     */
    async execute(sql: string, params: any[] = []): Promise<void> {
        const conn = await this.getConnection();
        return new Promise((resolve, reject) => {
            conn.query(sql, params, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /**
     * Begin a transaction
     */
    async beginTransaction(): Promise<void> {
        const conn = await this.getConnection();
        return new Promise((resolve, reject) => {
            conn.beginTransaction((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /**
     * Commit a transaction
     */
    async commitTransaction(): Promise<void> {
        const conn = await this.getConnection();
        return new Promise((resolve, reject) => {
            conn.commitTransaction((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /**
     * Rollback a transaction
     */
    async rollbackTransaction(): Promise<void> {
        const conn = await this.getConnection();
        return new Promise((resolve, reject) => {
            conn.rollbackTransaction((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /**
     * Clean up test data
     */
    async cleanup(tables: string[]): Promise<void> {
        try {
            await this.beginTransaction();
            for (const table of tables) {
                await this.execute(`DELETE FROM ${table}`);
            }
            await this.commitTransaction();
        } catch (error) {
            await this.rollbackTransaction();
            throw error;
        }
    }

    /**
     * Insert test data
     */
    async seedTestData(table: string, data: any[]): Promise<void> {
        try {
            await this.beginTransaction();
            
            for (const row of data) {
                const columns = Object.keys(row);
                const values = Object.values(row);
                const placeholders = columns.map(() => '?').join(',');
                
                const sql = `
                    INSERT INTO ${table} (${columns.join(',')})
                    VALUES (${placeholders})
                `;
                
                await this.execute(sql, values);
            }
            
            await this.commitTransaction();
        } catch (error) {
            await this.rollbackTransaction();
            throw error;
        }
    }

    /**
     * Close the connection
     */
    async close(): Promise<void> {
        if (this.connection) {
            return new Promise((resolve, reject) => {
                this.connection.close((err: Error) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this.connection = null;
                    resolve();
                });
            });
        }
    }
}
