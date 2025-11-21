import { Router } from 'express';
import { CategoryController } from '../controllers';
import { validationMiddleware, authenticateToken } from '../middlewares';
import { CreateCategoryDto, UpdateCategoryDto } from '../models';

const router = Router();
const categoryController = new CategoryController();

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Protected
 */
router.post(
    '/',
    authenticateToken,
    validationMiddleware(CreateCategoryDto),
    categoryController.createCategory
);

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Protected
 */
router.get('/', authenticateToken, categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Protected
 */
router.get('/:id', authenticateToken, categoryController.getCategoryById);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Protected
 */
router.put(
    '/:id',
    authenticateToken,
    validationMiddleware(UpdateCategoryDto),
    categoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Protected
 */
router.delete('/:id', authenticateToken, categoryController.deleteCategory);

export default router;
