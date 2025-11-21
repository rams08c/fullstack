import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils';

/**
 * Extend Express Request to include user property
 */
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
            };
        }
    }
}

/**
 * Middleware to authenticate JWT tokens
 * Extracts token from Authorization header and verifies it
 */
export async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required',
            });
            return;
        }

        // Verify token
        const payload: JwtPayload = verifyAccessToken(token);

        // Attach user info to request
        req.user = {
            userId: payload.userId,
            email: payload.email,
        };

        next();
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Access token expired') {
                res.status(403).json({
                    success: false,
                    message: 'Access token expired',
                });
                return;
            }
        }

        res.status(403).json({
            success: false,
            message: 'Invalid access token',
        });
    }
}
