"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class ProfileService {
    async createProfile(userId, dto) {
        const uId = parseInt(userId, 10);
        if (isNaN(uId)) {
            throw new Error(`Invalid User ID: ${userId}`);
        }
        // Check if user exists
        const user = await prisma_1.default.user.findUnique({ where: { id: uId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        // Check if profile already exists
        const existingProfile = await prisma_1.default.profile.findUnique({ where: { userId: uId } });
        if (existingProfile) {
            throw new Error(`Profile for user ID ${userId} already exists`);
        }
        const profile = await prisma_1.default.profile.create({
            data: {
                ...dto,
                userId: uId,
            },
        });
        return profile;
    }
    async getProfileByUserId(userId) {
        const uId = parseInt(userId, 10);
        if (isNaN(uId)) {
            throw new Error(`Invalid User ID: ${userId}`);
        }
        const profile = await prisma_1.default.profile.findUnique({
            where: { userId: uId },
        });
        return profile;
    }
    async updateProfile(userId, dto) {
        const uId = parseInt(userId, 10);
        if (isNaN(uId)) {
            throw new Error(`Invalid User ID: ${userId}`);
        }
        // Check if profile exists
        const existingProfile = await prisma_1.default.profile.findUnique({ where: { userId: uId } });
        if (!existingProfile) {
            throw new Error(`Profile for user ID ${userId} not found`);
        }
        const profile = await prisma_1.default.profile.update({
            where: { userId: uId },
            data: {
                ...dto,
            },
        });
        return profile;
    }
}
exports.ProfileService = ProfileService;
