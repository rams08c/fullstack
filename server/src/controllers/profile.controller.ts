import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services';
import { CreateProfileDto, UpdateProfileDto } from '../models';

export class ProfileController {
    private profileService: ProfileService;

    constructor() {
        this.profileService = new ProfileService();
    }

    /**
     * Get profile by user ID
     * GET /api/profile/user/:userId
     */
    getProfileByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.params;
            const profile = await this.profileService.getProfileByUserId(userId);

            if (!profile) {
                res.status(404).json({
                    success: false,
                    message: `Profile for user ID ${userId} not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: profile,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create profile for user
     * POST /api/profile/user/:userId
     */
    createProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.params;
            const dto: CreateProfileDto = req.body;

            // Override userId from body with userId from params for security
            dto.userId = parseInt(userId, 10);

            const profile = await this.profileService.createProfile(userId, dto);

            res.status(201).json({
                success: true,
                message: 'Profile created successfully',
                data: profile,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update profile
     * PUT /api/profile/user/:userId
     */
    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.params;
            const dto: UpdateProfileDto = req.body;
            const profile = await this.profileService.updateProfile(userId, dto);

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: profile,
            });
        } catch (error) {
            next(error);
        }
    };
}
