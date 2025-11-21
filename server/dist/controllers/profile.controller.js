"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const services_1 = require("../services");
class ProfileController {
    constructor() {
        /**
         * Get profile by user ID
         * GET /api/profile/user/:userId
         */
        this.getProfileByUserId = async (req, res, next) => {
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
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Create profile for user
         * POST /api/profile/user/:userId
         */
        this.createProfile = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const dto = req.body;
                // Override userId from body with userId from params for security
                dto.userId = parseInt(userId, 10);
                const profile = await this.profileService.createProfile(userId, dto);
                res.status(201).json({
                    success: true,
                    message: 'Profile created successfully',
                    data: profile,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update profile
         * PUT /api/profile/user/:userId
         */
        this.updateProfile = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const dto = req.body;
                const profile = await this.profileService.updateProfile(userId, dto);
                res.status(200).json({
                    success: true,
                    message: 'Profile updated successfully',
                    data: profile,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.profileService = new services_1.ProfileService();
    }
}
exports.ProfileController = ProfileController;
