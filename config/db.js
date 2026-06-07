const mysql = require('mysql2/promise')
class Database {
    constructor() {
        if (Database._instance) {
            return Database._instance;
        }
        this._pool = mysql.createPool({
            host: process.env.db_host || "localhost",
            user: process.env.db_user || "root",
            password: process.env.db_pass || "12345678",
            database: process.env.db_name || "Nodejs",
        })
        Database._instance = this;
    }
    async query(sql, params = []) {
        const [rows] = await this._pool.query(sql, params);
        return rows;
    }

    async execute(sql, params = []) {
        const [result] = await this._pool.execute(sql, params);
        return result;
    }

    async connect() {
        const conn = await this._pool.getConnection();
        console.log('MySQL connected');
        conn.release();
    }
    async disconnect() {
        await this._pool.end();
        console.log('MySQL pool closed');
        Database._instance = null;
    }
}

module.exports = new Database();