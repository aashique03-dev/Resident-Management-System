import { poolPromise } from '../config/db.js';
import sql from 'mssql';

export default class User {
    static async findByEmail(email) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');
        return result.recordset[0];
    }

    static async create({ username, email, passwordHash, role }) {
        const pool = await poolPromise;
        await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('passwordHash', sql.VarChar, passwordHash)
            .input('role', sql.VarChar, role)
            .query(`INSERT INTO Users (username, email, passwordHash, role) 
                    VALUES (@username, @email, @passwordHash, @role)`);
    }
}
