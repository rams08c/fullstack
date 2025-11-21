import prisma from '../config/prisma';
import { CreateProfileDto, Profile, UpdateProfileDto } from '../models';

export class ProfileService {
    async createProfile(userId: string, dto: CreateProfileDto): Promise<Profile> {
        const uId = parseInt(userId, 10);
        if (isNaN(uId)) {
            throw new Error(`Invalid User ID: ${userId}`);
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: uId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        // Check if profile already exists
        const existingProfile = await prisma.profile.findUnique({ where: { userId: uId } });
        if (existingProfile) {
            throw new Error(`Profile for user ID ${userId} already exists`);
        }

        const profile = await prisma.profile.create({
            data: {
                ...dto,
                userId: uId,
            },
        });
        return profile;
    }

    async getProfileByUserId(userId: string): Promise<Profile | null> {
        const uId = parseInt(userId, 10);
        if (isNaN(uId)) {
            throw new Error(`Invalid User ID: ${userId}`);
        }
        const profile = await prisma.profile.findUnique({
            where: { userId: uId },
        });
        return profile;
    }

    async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Profile> {
        const uId = parseInt(userId, 10);
        if (isNaN(uId)) {
            throw new Error(`Invalid User ID: ${userId}`);
        }

        // Check if profile exists
        const existingProfile = await prisma.profile.findUnique({ where: { userId: uId } });
        if (!existingProfile) {
            throw new Error(`Profile for user ID ${userId} not found`);
        }

        const profile = await prisma.profile.update({
            where: { userId: uId },
            data: {
                ...dto,
            },
        });
        return profile;
    }
}
