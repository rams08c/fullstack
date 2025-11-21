"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const utils_1 = require("../utils");
/**
 * Middleware to authenticate JWT tokens
 * Extracts token from Authorization header and verifies it
 */
async function authenticateToken(req, res, next) {
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
        const payload = (0, utils_1.verifyAccessToken)(token);
        // Attach user info to request
        req.user = {
            userId: payload.userId,
            email: payload.email,
        };
        next();
    }
    catch (error) {
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
