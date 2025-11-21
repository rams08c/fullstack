import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto } from '../models';
import { generateAccessToken, generateRefreshToken, generateRefreshTokenKey, hashPassword } from '../utils';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * Register a new user
     * POST /api/users/register
     */
    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: CreateUserDto = req.body;
            const user = await this.userService.createUser(dto);

            // Generate tokens
            const accessToken = generateAccessToken({
                userId: user.id,
                email: user.email,
            });

            const refreshToken = generateRefreshToken({
                userId: user.id,
                email: user.email,
            });

            // Generate and store refresh token key
            const refreshTokenKey = generateRefreshTokenKey();
            await this.userService.updateRefreshToken(user.id, await hashPassword(refreshTokenKey));

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
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update user
     * PUT /api/users/:id
     */
    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const dto: UpdateUserDto = req.body;
            const user = await this.userService.updateUser(id, dto);

            // Remove password from response
            const { password, ...userWithoutPassword } = user;

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: userWithoutPassword,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete user
     * DELETE /api/users/:id
     */
    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(id);

            res.status(200).json({
                success: true,
                message: 'User deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    };
}
