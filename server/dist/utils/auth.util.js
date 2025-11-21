"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.generateRefreshTokenKey = generateRefreshTokenKey;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = 10;
// Environment variables with defaults for development
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, SALT_ROUNDS);
}
/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
async function comparePassword(password, hashedPassword) {
    return bcrypt_1.default.compare(password, hashedPassword);
}
/**
 * Generate a JWT access token
 * @param payload - User data to encode in token
 * @returns JWT access token
 */
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRY,
    });
}
/**
 * Generate a JWT refresh token
 * @param payload - User data to encode in token
 * @returns JWT refresh token
 */
function generateRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRY,
    });
}
/**
 * Verify and decode a JWT access token
 * @param token - JWT access token
 * @returns Decoded payload
 * @throws Error if token is invalid or expired
 */
function verifyAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_ACCESS_SECRET);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
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
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('Refresh token expired');
        }
        throw new Error('Invalid refresh token');
    }
}
/**
 * Generate a random refresh token key for database storage
 * @returns Random string
 */
function generateRefreshTokenKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
