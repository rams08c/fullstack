"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
const router = (0, express_1.Router)();
const userController = new controllers_1.UserController();
/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (0, middlewares_1.validationMiddleware)(models_1.CreateUserDto), userController.register);
/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Protected
 */
router.get('/:id', middlewares_1.authenticateToken, userController.getUserById);
/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Protected
 */
router.put('/:id', middlewares_1.authenticateToken, (0, middlewares_1.validationMiddleware)(models_1.UpdateUserDto), userController.updateUser);
/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Protected
 */
router.delete('/:id', middlewares_1.authenticateToken, userController.deleteUser);
exports.default = router;
