import { Router } from 'express';
import { TransactionController } from '../controllers';
import { validationMiddleware, authenticateToken } from '../middlewares';
import { CreateTransactionDto, UpdateTransactionDto } from '../models';

const router = Router();
const transactionController = new TransactionController();

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Protected
 */
router.post(
    '/',
    authenticateToken,
    validationMiddleware(CreateTransactionDto),
    transactionController.createTransaction
);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by ID
 * @access  Protected
 */
router.get('/:id', authenticateToken, transactionController.getTransactionById);

/**
 * @route   GET /api/transactions/user/:userId
 * @desc    Get transactions by user ID with optional filters
 * @query   skip, take, categoryId, dateFrom, dateTo
 * @access  Protected
 */
router.get('/user/:userId', authenticateToken, transactionController.getTransactionsByUser);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction
 * @access  Protected
 */
router.put(
    '/:id',
    authenticateToken,
    validationMiddleware(UpdateTransactionDto),
    transactionController.updateTransaction
);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction
 * @access  Protected
 */
router.delete('/:id', authenticateToken, transactionController.deleteTransaction);

export default router;
