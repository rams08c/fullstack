"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const services_1 = require("../services");
class CategoryController {
    constructor() {
        /**
         * Create a new category
         * POST /api/categories
         */
        this.createCategory = async (req, res, next) => {
            try {
                const dto = req.body;
                const category = await this.categoryService.createCategory(dto);
                res.status(201).json({
                    success: true,
                    message: 'Category created successfully',
                    data: category,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get category by ID
         * GET /api/categories/:id
         */
        this.getCategoryById = async (req, res, next) => {
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
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get all categories
         * GET /api/categories
         */
        this.getAllCategories = async (req, res, next) => {
            try {
                const categories = await this.categoryService.getAllCategories();
                res.status(200).json({
                    success: true,
                    data: categories,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update category
         * PUT /api/categories/:id
         */
        this.updateCategory = async (req, res, next) => {
            try {
                const { id } = req.params;
                const dto = req.body;
                const category = await this.categoryService.updateCategory(id, dto);
                res.status(200).json({
                    success: true,
                    message: 'Category updated successfully',
                    data: category,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete category
         * DELETE /api/categories/:id
         */
        this.deleteCategory = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.categoryService.deleteCategory(id);
                res.status(200).json({
                    success: true,
                    message: 'Category deleted successfully',
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.categoryService = new services_1.CategoryService();
    }
}
exports.CategoryController = CategoryController;
