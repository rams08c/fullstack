import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { CreateTransactionDto, Transaction, UpdateTransactionDto } from '../models';

export class TransactionService {
    private mapToModel(prismaTransaction: any): Transaction {
        return {
            ...prismaTransaction,
            amount: prismaTransaction.amount.toNumber(),
        };
    }

    async createTransaction(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
        const uId = parseInt(userId, 10);

        // Ensure category exists
        const categoryExists = await prisma.category.findUnique({ where: { id: dto.categoryId } });
        if (!categoryExists) {
            throw new Error(`Category with ID ${dto.categoryId} not found`);
        }

        const transaction = await prisma.transaction.create({
            data: {
                title: dto.title,
                description: dto.description,
                amount: dto.amount,
                date: new Date(dto.date),
                userId: uId,
                categoryId: dto.categoryId,
            },
        });

        return this.mapToModel(transaction);
    }

    async getTransactionById(id: string): Promise<Transaction | null> {
        const transactionId = parseInt(id, 10);
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                category: true,
            },
        });

        if (!transaction) return null;
        return this.mapToModel(transaction);
    }

    async getTransactionsByUser(
        userId: string,
        options?: { skip?: number; take?: number; categoryId?: string; dateFrom?: Date; dateTo?: Date }
    ): Promise<Transaction[]> {
        const uId = parseInt(userId, 10);
        const { skip, take, categoryId, dateFrom, dateTo } = options || {};

        const where: Prisma.TransactionWhereInput = {
            userId: uId,
        };

        if (categoryId) {
            where.categoryId = parseInt(categoryId, 10);
        }

        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom) where.date.gte = dateFrom;
            if (dateTo) where.date.lte = dateTo;
        }

        const transactions = await prisma.transaction.findMany({
            where,
            skip,
            take,
            orderBy: { date: 'desc' },
            include: {
                category: true,
            },
        });

        return transactions.map(t => this.mapToModel(t));
    }

    async updateTransaction(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
        const transactionId = parseInt(id, 10);

        // Check if transaction exists
        const existingTransaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
        if (!existingTransaction) {
            throw new Error(`Transaction with ID ${id} not found`);
        }

        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                title: dto.title,
                description: dto.description,
                amount: dto.amount,
                date: dto.date ? new Date(dto.date) : undefined,
                categoryId: dto.categoryId,
            },
        });
        return this.mapToModel(transaction);
    }

    async deleteTransaction(id: string): Promise<Transaction> {
        const transactionId = parseInt(id, 10);

        // Check if transaction exists
        const existingTransaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
        if (!existingTransaction) {
            throw new Error(`Transaction with ID ${id} not found`);
        }

        const transaction = await prisma.transaction.delete({
            where: { id: transactionId },
        });
        return this.mapToModel(transaction);
    }
}
