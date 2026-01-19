import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// configuration for sql server 
const config = {
  server: process.env.DB_SEVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWOED,
  options: {
    encrypt: false,           // use true for Azure SQL
    enableAirthAbort: true
  },
  port: parseInt(process.env.DB_PORT, 10)
};

// create a connection pool and export it as a promise
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to the database');
    return pool;
  })
  .catch(err => {
    console.log('Database connection failed', err);
    throw err;
  });

export { sql, poolPromise };
