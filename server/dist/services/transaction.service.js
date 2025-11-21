"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class TransactionService {
    mapToModel(prismaTransaction) {
        return {
            ...prismaTransaction,
            amount: prismaTransaction.amount.toNumber(),
        };
    }
    async createTransaction(userId, dto) {
        const uId = parseInt(userId, 10);
        // Ensure category exists
        const categoryExists = await prisma_1.default.category.findUnique({ where: { id: dto.categoryId } });
        if (!categoryExists) {
            throw new Error(`Category with ID ${dto.categoryId} not found`);
        }
        const transaction = await prisma_1.default.transaction.create({
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
    async getTransactionById(id) {
        const transactionId = parseInt(id, 10);
        const transaction = await prisma_1.default.transaction.findUnique({
            where: { id: transactionId },
            include: {
                category: true,
            },
        });
        if (!transaction)
            return null;
        return this.mapToModel(transaction);
    }
    async getTransactionsByUser(userId, options) {
        const uId = parseInt(userId, 10);
        const { skip, take, categoryId, dateFrom, dateTo } = options || {};
        const where = {
            userId: uId,
        };
        if (categoryId) {
            where.categoryId = parseInt(categoryId, 10);
        }
        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom)
                where.date.gte = dateFrom;
            if (dateTo)
                where.date.lte = dateTo;
        }
        const transactions = await prisma_1.default.transaction.findMany({
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
    async updateTransaction(id, dto) {
        const transactionId = parseInt(id, 10);
        // Check if transaction exists
        const existingTransaction = await prisma_1.default.transaction.findUnique({ where: { id: transactionId } });
        if (!existingTransaction) {
            throw new Error(`Transaction with ID ${id} not found`);
        }
        const transaction = await prisma_1.default.transaction.update({
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
    async deleteTransaction(id) {
        const transactionId = parseInt(id, 10);
        // Check if transaction exists
        const existingTransaction = await prisma_1.default.transaction.findUnique({ where: { id: transactionId } });
        if (!existingTransaction) {
            throw new Error(`Transaction with ID ${id} not found`);
        }
        const transaction = await prisma_1.default.transaction.delete({
            where: { id: transactionId },
        });
        return this.mapToModel(transaction);
    }
}
exports.TransactionService = TransactionService;
