"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
class UserController {
    constructor() {
        /**
         * Register a new user
         * POST /api/users/register
         */
        this.register = async (req, res, next) => {
            try {
                const dto = req.body;
                const user = await this.userService.createUser(dto);
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
                // Remove password from response
                const { password, ...userWithoutPassword } = user;
                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    data: {
                        user: userWithoutPassword,
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
         * Get user by ID
         * GET /api/users/:id
         */
        this.getUserById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const user = await this.userService.getUserById(id);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: `User with ID ${id} not found`,
                    });
                    return;
                }
                // Remove password from response
                const { password, ...userWithoutPassword } = user;
                res.status(200).json({
                    success: true,
                    data: userWithoutPassword,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update user
         * PUT /api/users/:id
         */
        this.updateUser = async (req, res, next) => {
            try {
                const { id } = req.params;
                const dto = req.body;
                const user = await this.userService.updateUser(id, dto);
                // Remove password from response
                const { password, ...userWithoutPassword } = user;
                res.status(200).json({
                    success: true,
                    message: 'User updated successfully',
                    data: userWithoutPassword,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete user
         * DELETE /api/users/:id
         */
        this.deleteUser = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.userService.deleteUser(id);
                res.status(200).json({
                    success: true,
                    message: 'User deleted successfully',
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.userService = new services_1.UserService();
    }
}
exports.UserController = UserController;
