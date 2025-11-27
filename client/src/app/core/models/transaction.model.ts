export interface Transaction {
    id: number;
    title: string;
    description?: string | null;
    amount: number;
    date: Date | string;
    categoryType: 'INCOME' | 'EXPENSE';
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userId: number;
    categoryId: number;
    category?: Category;
}

export interface Category {
    id: number;
    name: string;
    categoryType: 'INCOME' | 'EXPENSE';
    description?: string | null;
}

export interface CreateTransactionRequest {
    title: string;
    description?: string;
    amount: string; // String for decimal precision
    date: string; // ISO date string
    categoryType?: 'INCOME' | 'EXPENSE';
    userId: number;
    categoryId: number;
}

export interface UpdateTransactionRequest {
    title?: string;
    description?: string;
    amount?: string;
    date?: string;
    categoryType?: 'INCOME' | 'EXPENSE';
    categoryId?: number;
}

export interface TransactionResponse {
    success: boolean;
    message?: string;
    data: Transaction;
}

export interface TransactionsListResponse {
    success: boolean;
    data: Transaction[];
    count: number;
}

export interface TransactionFilters {
    period: 'day' | 'week' | 'month' | 'year' | 'all';
    dateFrom?: Date;
    dateTo?: Date;
    categoryId?: number;
}

export interface TransactionSummary {
    totalSpending: number;
    totalIncome: number;
    pendingAmount: number;
    transactionCount: number;
}

export interface PaginationParams {
    skip: number;
    take: number;
}
