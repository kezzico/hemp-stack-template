import dotenv from 'dotenv';
import express from 'express';
import v1 from './app/v1.js';

dotenv.config();

const app = express();

app.use((req, res, next) => {
    console.log(`🚦 [${new Date().toISOString()}]`)
    console.log(`🚦 [${req.method} ${req.url}]`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.send('Ok');
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// API versioning -- start with v1 (see app/v1.ts)
app.use('/v1', v1);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express listening on port ${PORT}`);
});


