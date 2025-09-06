import dotenv from 'dotenv';
import express from 'express';

import { createPool } from "mysql2/promise";
import SampleRouter from './app/sample_router.js';

dotenv.config();
const app = express();

console.log(`[index.js] app launch ${new Date().toISOString()}`);

app.use((req, res, next) => {
    console.log(`[index.js] 🚦 Incoming Traffic -- ${req.method} -- ${req.url}]`);
    next();
});

setInterval(() => {
    console.log(`[index.js] 🫀 Heart Beat 🫀 [${new Date().toISOString()}]`)
}, 10 * 60 * 1000 )

// Global error handler
app.use((err, req, res, next) => {
    console.error('[index.js] 🚨🚨 Unhandled error:\n\n', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.send('Ok');
});

const dbpool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

app.use('/hello', SampleRouter({ dbpool }));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`[index.js] 🚀🚀 listening on port ${PORT}`);
});
