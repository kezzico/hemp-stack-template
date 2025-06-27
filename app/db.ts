import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

console.log("[RTSV][MYSQL] Initializing database connection...");
console.log(`[RTSV][MYSQL] Using environment variables:
  DB_HOST: ${process.env.DB_HOST}, DB_USER: ${process.env.DB_USER}, DB_SCHEMA: ${process.env.DB_SCHEMA}`);

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection()
  .then(() => console.log(`[RTSV][MYSQL] connected to ${process.env.DB_SCHEMA}`))
  .catch((err) => {
    console.error(`[RTSV][MYSQL] Failed to connect to the database: ${err.message}`);
    process.exit(1);
  });


const db = pool;
export default db;
