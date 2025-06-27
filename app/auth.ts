import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export function authorize(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try { 
        payload = verifyToken(token);
    } catch (error) {
        console.error('[AUTH] Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!payload) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!payload.email) {
        return res.status(401).json({ error: 'Token does not contain email' });
    }

    console.log(`[AUTH] User authenticated with email: ${payload.email}`);
    req.auth = { email: payload.email };

    next();
}

export function generateToken(email: string): string {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        console.error('[AUTH] JWT_SECRET is not defined');
        throw new Error('JWT_SECRET is not defined');
    }
    
    return jwt.sign({ email }, secret, { expiresIn: '1h' });
}

export function verifyToken(token: string): jwt.JwtPayload | null {
    console.log(`[AUTH] Verifying token: ${token}`);
    if (!token) {
        console.error('[AUTH] No token provided');
        return null;
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
        console.error('[AUTH] JWT_SECRET is not defined');
        throw new Error('JWT_SECRET is not defined');
    }

    try {
        return jwt.verify(token, secret) as jwt.JwtPayload;
    } catch (error) {
        console.error('[AUTH] Token verification failed:', error);
        return null;
    }
}