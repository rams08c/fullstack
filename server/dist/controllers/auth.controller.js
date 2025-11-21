"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
class AuthController {
    constructor() {
        /**
         * User login
         * POST /api/auth/login
         */
        this.login = async (req, res, next) => {
            try {
                const dto = req.body;
                // Validate credentials
                const user = await this.userService.validateCredentials(dto.email, dto.password);
                if (!user) {
                    res.status(401).json({
                        success: false,
                        message: 'Invalid email or password',
                    });
                    return;
                }
                // Generate tokens
                const accessToken = (0, utils_1.generateAccessToken)({
                    userId: user.id,
                    email: user.email,
                });
                const refreshToken = (0, utils_1.generateRefreshToken)({
                    userId: user.id,
                    email: user.email,
                });
                // Generate and store refresh token key
                const refreshTokenKey = (0, utils_1.generateRefreshTokenKey)();
                await this.userService.updateRefreshToken(user.id, await (0, utils_1.hashPassword)(refreshTokenKey));
                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    data: {
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                        },
                        accessToken,
                        refreshToken,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Refresh access token
         * POST /api/auth/refresh
         */
        this.refresh = async (req, res, next) => {
            try {
                const dto = req.body;
                // Verify refresh token
                let payload;
                try {
                    payload = (0, utils_1.verifyRefreshToken)(dto.refreshToken);
                }
                catch (error) {
                    res.status(403).json({
                        success: false,
                        message: 'Invalid or expired refresh token',
                    });
                    return;
                }
                // Get user
                const user = await this.userService.getUserById(payload.userId.toString());
                if (!user) {
                    res.status(403).json({
                        success: false,
                        message: 'User not found',
                    });
                    return;
                }
                // Generate new access token
                const accessToken = (0, utils_1.generateAccessToken)({
                    userId: user.id,
                    email: user.email,
                });
                res.status(200).json({
                    success: true,
                    message: 'Token refreshed successfully',
                    data: {
                        accessToken,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * User logout
         * POST /api/auth/logout
         */
        this.logout = async (req, res, next) => {
            try {
                // Get user ID from authenticated request
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: 'Unauthorized',
                    });
                    return;
                }
                // Clear refresh token
                await this.userService.updateRefreshToken(userId, null);
                res.status(200).json({
                    success: true,
                    message: 'Logout successful',
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.userService = new services_1.UserService();
    }
}
exports.AuthController = AuthController;
