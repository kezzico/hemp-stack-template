import dotenv from 'dotenv';
import express from 'express';
import v1 from './app/v1.js';

dotenv.config();

const app = express();

console.log('[RTSV][EXPRESS] 🚔🚔 ADDING MIDDLEWARE FOR TRAFFIC MONITORING 🚔🚔')
app.use((req, res, next) => {
    console.log(`[RTSV][EXPRESS]🚦 Incoming Traffic -- ${req.method} -- ${req.url}]`);
    next();
});

setInterval(() => {
    console.log(`[RTSV][EXPRESS] 🫀 Heart Beat 🫀 [${new Date().toISOString()}]`)
}, 10 * 60 * 1000 )

console.log('[RTSV][EXPRESS] 📄 Adding data parsing middleware ')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.send('Ok');
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[RTSV][EXPRESS] 🚨🚨 Unhandled error:\n\n', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

console.log('[RTSV][EXPRESS] 📱 include /v1')
app.use('/v1', v1);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`[RTSV][EXPRESS] 🚀🚀 listening on port ${PORT}`);
});


