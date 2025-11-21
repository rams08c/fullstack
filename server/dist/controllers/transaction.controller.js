"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const services_1 = require("../services");
class TransactionController {
    constructor() {
        /**
         * Create a new transaction
         * POST /api/transactions
         */
        this.createTransaction = async (req, res, next) => {
            try {
                const dto = req.body;
                const transaction = await this.transactionService.createTransaction(dto.userId.toString(), dto);
                res.status(201).json({
                    success: true,
                    message: 'Transaction created successfully',
                    data: transaction,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get transaction by ID
         * GET /api/transactions/:id
         */
        this.getTransactionById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const transaction = await this.transactionService.getTransactionById(id);
                if (!transaction) {
                    res.status(404).json({
                        success: false,
                        message: `Transaction with ID ${id} not found`,
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: transaction,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get transactions by user ID with optional filters
         * GET /api/transactions/user/:userId
         * Query params: skip, take, categoryId, dateFrom, dateTo
         */
        this.getTransactionsByUser = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const { skip, take, categoryId, dateFrom, dateTo } = req.query;
                const options = {
                    skip: skip ? parseInt(skip, 10) : undefined,
                    take: take ? parseInt(take, 10) : undefined,
                    categoryId: categoryId,
                    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
                    dateTo: dateTo ? new Date(dateTo) : undefined,
                };
                const transactions = await this.transactionService.getTransactionsByUser(userId, options);
                res.status(200).json({
                    success: true,
                    data: transactions,
                    count: transactions.length,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update transaction
         * PUT /api/transactions/:id
         */
        this.updateTransaction = async (req, res, next) => {
            try {
                const { id } = req.params;
                const dto = req.body;
                const transaction = await this.transactionService.updateTransaction(id, dto);
                res.status(200).json({
                    success: true,
                    message: 'Transaction updated successfully',
                    data: transaction,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete transaction
         * DELETE /api/transactions/:id
         */
        this.deleteTransaction = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.transactionService.deleteTransaction(id);
                res.status(200).json({
                    success: true,
                    message: 'Transaction deleted successfully',
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.transactionService = new services_1.TransactionService();
    }
}
exports.TransactionController = TransactionController;
