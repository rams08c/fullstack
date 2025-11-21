import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

// Environment variables with defaults for development
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

/**
 * JWT Payload interface
 */
export interface JwtPayload {
    userId: number;
    email: string;
}

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT access token
 * @param payload - User data to encode in token
 * @returns JWT access token
 */
export function generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRY,
    } as jwt.SignOptions);
}

/**
 * Generate a JWT refresh token
 * @param payload - User data to encode in token
 * @returns JWT refresh token
 */
export function generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRY,
    } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT access token
 * @param token - JWT access token
 * @returns Decoded payload
 * @throws Error if token is invalid or expired
 */
export function verifyAccessToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Access token expired');
        }
        throw new Error('Invalid access token');
    }
}

/**
 * Verify and decode a JWT refresh token
 * @param token - JWT refresh token
 * @returns Decoded payload
 * @throws Error if token is invalid or expired
 */
export function verifyRefreshToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token expired');
        }
        throw new Error('Invalid refresh token');
    }
}

/**
 * Generate a random refresh token key for database storage
 * @returns Random string
 */
export function generateRefreshTokenKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
