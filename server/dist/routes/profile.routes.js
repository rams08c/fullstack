"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
const router = (0, express_1.Router)();
const profileController = new controllers_1.ProfileController();
/**
 * @route   GET /api/profile/user/:userId
 * @desc    Get profile by user ID
 * @access  Protected
 */
router.get('/user/:userId', middlewares_1.authenticateToken, profileController.getProfileByUserId);
/**
 * @route   POST /api/profile/user/:userId
 * @desc    Create profile for user
 * @access  Protected
 */
router.post('/user/:userId', middlewares_1.authenticateToken, (0, middlewares_1.validationMiddleware)(models_1.CreateProfileDto), profileController.createProfile);
/**
 * @route   PUT /api/profile/user/:userId
 * @desc    Update profile
 * @access  Protected
 */
router.put('/user/:userId', middlewares_1.authenticateToken, (0, middlewares_1.validationMiddleware)(models_1.UpdateProfileDto), profileController.updateProfile);
exports.default = router;
