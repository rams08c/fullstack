import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services';
import { CreateCategoryDto, UpdateCategoryDto } from '../models';

export class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    /**
     * Create a new category
     * POST /api/categories
     */
    createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: CreateCategoryDto = req.body;
            const category = await this.categoryService.createCategory(dto);

            res.status(201).json({
                success: true,
                message: 'Category created successfully',
                data: category,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get category by ID
     * GET /api/categories/:id
     */
    getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategoryById(id);

            if (!category) {
                res.status(404).json({
                    success: false,
                    message: `Category with ID ${id} not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: category,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get all categories
     * GET /api/categories
     */
    getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categories = await this.categoryService.getAllCategories();

            res.status(200).json({
                success: true,
                data: categories,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update category
     * PUT /api/categories/:id
     */
    updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const dto: UpdateCategoryDto = req.body;
            const category = await this.categoryService.updateCategory(id, dto);

            res.status(200).json({
                success: true,
                message: 'Category updated successfully',
                data: category,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete category
     * DELETE /api/categories/:id
     */
    deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.categoryService.deleteCategory(id);

            res.status(200).json({
                success: true,
                message: 'Category deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    };
}
