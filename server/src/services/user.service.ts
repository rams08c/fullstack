import prisma from '../config/prisma';
import { CreateUserDto, UpdateUserDto, User } from '../models';
import { hashPassword, comparePassword } from '../utils';

export class UserService {
    async createUser(dto: CreateUserDto): Promise<User> {
        // Hash password before saving
        const hashedPassword = await hashPassword(dto.password);

        const user = await prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hashedPassword,
            },
        });
        return user;
    }

    async getUserById(id: string): Promise<User | null> {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            throw new Error(`Invalid ID: ${id}`);
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
            },
        });
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    }

    async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            throw new Error(`Invalid ID: ${id}`);
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            throw new Error(`User with ID ${id} not found`);
        }

        // Hash password if provided
        const updateData: any = { ...dto };
        if (dto.password) {
            updateData.password = await hashPassword(dto.password);
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        return user;
    }

    async deleteUser(id: string): Promise<User> {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            throw new Error(`Invalid ID: ${id}`);
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            throw new Error(`User with ID ${id} not found`);
        }

        const user = await prisma.user.delete({
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
    async validateCredentials(email: string, password: string): Promise<User | null> {
        const user = await this.getUserByEmail(email);
        if (!user || !user.password) {
            return null;
        }

        const isPasswordValid = await comparePassword(password, user.password);
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
    async updateRefreshToken(userId: number, refreshTokenKey: string | null): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshTokenKey },
        });
    }
}
