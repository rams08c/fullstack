import { Router } from 'express';
import { ProfileController } from '../controllers';
import { validationMiddleware, authenticateToken } from '../middlewares';
import { CreateProfileDto, UpdateProfileDto } from '../models';

const router = Router();
const profileController = new ProfileController();

/**
 * @route   GET /api/profile/user/:userId
 * @desc    Get profile by user ID
 * @access  Protected
 */
router.get('/user/:userId', authenticateToken, profileController.getProfileByUserId);

/**
 * @route   POST /api/profile/user/:userId
 * @desc    Create profile for user
 * @access  Protected
 */
router.post(
    '/user/:userId',
    authenticateToken,
    validationMiddleware(CreateProfileDto),
    profileController.createProfile
);

/**
 * @route   PUT /api/profile/user/:userId
 * @desc    Update profile
 * @access  Protected
 */
router.put(
    '/user/:userId',
    authenticateToken,
    validationMiddleware(UpdateProfileDto),
    profileController.updateProfile
);

export default router;
