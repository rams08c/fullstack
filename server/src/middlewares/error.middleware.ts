import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Centralized error handling middleware
 */
export function errorHandler(
    error: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error('Error:', error);

    // Default error response
    let statusCode = 500;
    let message = 'Internal Server Error';
    let details: any = undefined;

    // Handle custom AppError
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // Handle Prisma errors
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = 400;

        switch (error.code) {
            case 'P2002':
                // Unique constraint violation
                const target = (error.meta?.target as string[]) || [];
                message = `A record with this ${target.join(', ')} already exists`;
                details = { fields: target };
                break;
            case 'P2025':
                // Record not found
                statusCode = 404;
                message = 'Record not found';
                break;
            case 'P2003':
                // Foreign key constraint violation
                message = 'Related record not found';
                break;
            case 'P2014':
                // Invalid ID
                message = 'Invalid ID provided';
                break;
            default:
                message = 'Database operation failed';
                details = { code: error.code };
        }
    }
    // Handle Prisma validation errors
    else if (error instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Invalid data provided';
    }
    // Handle generic errors with custom messages
    else if (error.message) {
        // Check for common error patterns
        if (error.message.includes('not found')) {
            statusCode = 404;
            message = error.message;
        } else if (error.message.includes('already exists')) {
            statusCode = 409;
            message = error.message;
        } else if (error.message.includes('Invalid')) {
            statusCode = 400;
            message = error.message;
        } else {
            message = error.message;
        }
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(details && { details }),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
}
