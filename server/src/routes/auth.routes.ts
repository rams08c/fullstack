import { Router } from 'express';
import { AuthController } from '../controllers';
import { validationMiddleware, authenticateToken } from '../middlewares';
import { LoginDto, RefreshTokenDto } from '../models';

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post(
    '/login',
    validationMiddleware(LoginDto),
    authController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
    '/refresh',
    validationMiddleware(RefreshTokenDto),
    authController.refresh
);

/**
 * @route   POST /api/auth/logout
 * @desc    User logout
 * @access  Protected
 */
router.post(
    '/logout',
    authenticateToken,
    authController.logout
);

export default router;
