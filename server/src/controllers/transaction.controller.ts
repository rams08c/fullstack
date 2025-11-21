import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services';
import { CreateTransactionDto, UpdateTransactionDto } from '../models';

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        this.transactionService = new TransactionService();
    }

    /**
     * Create a new transaction
     * POST /api/transactions
     */
    createTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: CreateTransactionDto = req.body;
            const transaction = await this.transactionService.createTransaction(dto.userId.toString(), dto);

            res.status(201).json({
                success: true,
                message: 'Transaction created successfully',
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get transaction by ID
     * GET /api/transactions/:id
     */
    getTransactionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get transactions by user ID with optional filters
     * GET /api/transactions/user/:userId
     * Query params: skip, take, categoryId, dateFrom, dateTo
     */
    getTransactionsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.params;
            const { skip, take, categoryId, dateFrom, dateTo } = req.query;

            const options = {
                skip: skip ? parseInt(skip as string, 10) : undefined,
                take: take ? parseInt(take as string, 10) : undefined,
                categoryId: categoryId as string | undefined,
                dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
                dateTo: dateTo ? new Date(dateTo as string) : undefined,
            };

            const transactions = await this.transactionService.getTransactionsByUser(userId, options);

            res.status(200).json({
                success: true,
                data: transactions,
                count: transactions.length,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update transaction
     * PUT /api/transactions/:id
     */
    updateTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const dto: UpdateTransactionDto = req.body;
            const transaction = await this.transactionService.updateTransaction(id, dto);

            res.status(200).json({
                success: true,
                message: 'Transaction updated successfully',
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete transaction
     * DELETE /api/transactions/:id
     */
    deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.transactionService.deleteTransaction(id);

            res.status(200).json({
                success: true,
                message: 'Transaction deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    };
}
