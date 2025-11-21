import { Router } from 'express';
import { UserController } from '../controllers';
import { validationMiddleware, authenticateToken } from '../middlewares';
import { CreateUserDto, UpdateUserDto } from '../models';

const router = Router();
const userController = new UserController();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register',
    validationMiddleware(CreateUserDto),
    userController.register
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Protected
 */
router.get('/:id', authenticateToken, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Protected
 */
router.put(
    '/:id',
    authenticateToken,
    validationMiddleware(UpdateUserDto),
    userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Protected
 */
router.delete('/:id', authenticateToken, userController.deleteUser);

export default router;
