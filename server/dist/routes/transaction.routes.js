"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
const router = (0, express_1.Router)();
const transactionController = new controllers_1.TransactionController();
/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Protected
 */
router.post('/', middlewares_1.authenticateToken, (0, middlewares_1.validationMiddleware)(models_1.CreateTransactionDto), transactionController.createTransaction);
/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by ID
 * @access  Protected
 */
router.get('/:id', middlewares_1.authenticateToken, transactionController.getTransactionById);
/**
 * @route   GET /api/transactions/user/:userId
 * @desc    Get transactions by user ID with optional filters
 * @query   skip, take, categoryId, dateFrom, dateTo
 * @access  Protected
 */
router.get('/user/:userId', middlewares_1.authenticateToken, transactionController.getTransactionsByUser);
/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction
 * @access  Protected
 */
router.put('/:id', middlewares_1.authenticateToken, (0, middlewares_1.validationMiddleware)(models_1.UpdateTransactionDto), transactionController.updateTransaction);
/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction
 * @access  Protected
 */
router.delete('/:id', middlewares_1.authenticateToken, transactionController.deleteTransaction);
exports.default = router;
