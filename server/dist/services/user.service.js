"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const utils_1 = require("../utils");
class UserService {
    async createUser(dto) {
        // Hash password before saving
        const hashedPassword = await (0, utils_1.hashPassword)(dto.password);
        const user = await prisma_1.default.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hashedPassword,
            },
        });
        return user;
    }
    async getUserById(id) {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            throw new Error(`Invalid ID: ${id}`);
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
            },
        });
        return user;
    }
    async getUserByEmail(email) {
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        return user;
    }
    async updateUser(id, dto) {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            throw new Error(`Invalid ID: ${id}`);
        }
        // Check if user exists
        const existingUser = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            throw new Error(`User with ID ${id} not found`);
        }
        // Hash password if provided
        const updateData = { ...dto };
        if (dto.password) {
            updateData.password = await (0, utils_1.hashPassword)(dto.password);
        }
        const user = await prisma_1.default.user.update({
            where: { id: userId },
            data: updateData,
        });
        return user;
    }
    async deleteUser(id) {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            throw new Error(`Invalid ID: ${id}`);
        }
        // Check if user exists
        const existingUser = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            throw new Error(`User with ID ${id} not found`);
        }
        const user = await prisma_1.default.user.delete({
            where: { id: userId },
        });
        return user;
    }
    /**
     * Validate user credentials for login
     * @param email - User email
     * @param password - Plain text password
     * @returns User if credentials are valid, null otherwise
     */
    async validateCredentials(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user || !user.password) {
            return null;
        }
        const isPasswordValid = await (0, utils_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    /**
     * Update user's refresh token key
     * @param userId - User ID
     * @param refreshTokenKey - New refresh token key
     */
    async updateRefreshToken(userId, refreshTokenKey) {
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { refreshTokenKey },
        });
    }
}
exports.UserService = UserService;
