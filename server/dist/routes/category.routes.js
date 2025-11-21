"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
const router = (0, express_1.Router)();
const categoryController = new controllers_1.CategoryController();
/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Protected
 */
router.post('/', middlewares_1.authenticateToken, (0, middlewares_1.validationMiddleware)(models_1.CreateCategoryDto), categoryController.createCategory);
/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Protected
 */
router.get('/', middlewares_1.authenticateToken, categoryController.getAllCategories);
/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Protected
 */
router.get('/:id', middlewares_1.authenticateToken, categoryController.getCategoryById);
/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Protected
 */
router.put('/:id', middlewares_1.authenticateToken, (0, middlewares_1.validationMiddleware)(models_1.UpdateCategoryDto), categoryController.updateCategory);
/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Protected
 */
router.delete('/:id', middlewares_1.authenticateToken, categoryController.deleteCategory);
exports.default = router;
