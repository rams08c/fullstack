"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
const router = (0, express_1.Router)();
const authController = new controllers_1.AuthController();
/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post('/login', (0, middlewares_1.validationMiddleware)(models_1.LoginDto), authController.login);
/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', (0, middlewares_1.validationMiddleware)(models_1.RefreshTokenDto), authController.refresh);
/**
 * @route   POST /api/auth/logout
 * @desc    User logout
 * @access  Protected
 */
router.post('/logout', middlewares_1.authenticateToken, authController.logout);
exports.default = router;
