import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services';
import { LoginDto, RefreshTokenDto } from '../models';
import {
    generateAccessToken,
    generateRefreshToken,
    generateRefreshTokenKey,
    verifyRefreshToken,
    hashPassword,
} from '../utils';

export class AuthController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * User login
     * POST /api/auth/login
     */
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: LoginDto = req.body;

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
        } catch (error) {
            next(error);
        }
    };

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: RefreshTokenDto = req.body;

            // Verify refresh token
            let payload;
            try {
                payload = verifyRefreshToken(dto.refreshToken);
            } catch (error) {
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
            const accessToken = generateAccessToken({
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
        } catch (error) {
            next(error);
        }
    };

    /**
     * User logout
     * POST /api/auth/logout
     */
    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        } catch (error) {
            next(error);
        }
    };
}
