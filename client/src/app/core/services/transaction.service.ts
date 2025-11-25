import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionResponse,
  TransactionsListResponse,
  TransactionFilters,
  TransactionSummary,
  PaginationParams
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transactions`;

  /**
   * Get transactions for a user with filters and pagination
   */
  getTransactions(
    userId: number,
    filters: TransactionFilters,
    pagination: PaginationParams
  ): Observable<TransactionsListResponse> {
    let params = new HttpParams()
      .set('skip', pagination.skip.toString())
      .set('take', pagination.take.toString());

    // Add date filters based on period
    if (filters.period !== 'all') {
      const { dateFrom, dateTo } = this.getDateRange(filters.period);
      params = params
        .set('dateFrom', dateFrom.toISOString())
        .set('dateTo', dateTo.toISOString());
    }

    // Add custom date filters if provided
    if (filters.dateFrom) {
      params = params.set('dateFrom', filters.dateFrom.toISOString());
    }
    if (filters.dateTo) {
      params = params.set('dateTo', filters.dateTo.toISOString());
    }

    // Add category filter
    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId.toString());
    }

    return this.http.get<TransactionsListResponse>(`${this.apiUrl}/user/${userId}`, { params });
  }

  /**
   * Get single transaction by ID
   */
  getTransactionById(id: number): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new transaction
   */
  createTransaction(data: CreateTransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(this.apiUrl, data);
  }

  /**
   * Update existing transaction
   */
  updateTransaction(id: number, data: UpdateTransactionRequest): Observable<TransactionResponse> {
    return this.http.put<TransactionResponse>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete transaction
   */
  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Calculate summary from transactions
   */
  calculateSummary(transactions: Transaction[]): TransactionSummary {
    const totalSpending = transactions
      .filter(t => t.category?.categoryType !== 'INCOME') // Treat everything not INCOME as EXPENSE
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalIncome = transactions
      .filter(t => t.category?.categoryType === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const pendingAmount = totalIncome - totalSpending;

    return {
      totalSpending,
      totalIncome,
      pendingAmount,
      transactionCount: transactions.length
    };
  }

  /**
   * Get date range for period filter
   */
  getDateRange(period: 'day' | 'week' | 'month' | 'year'): { dateFrom: Date; dateTo: Date } {
    const now = new Date();
    const dateTo = new Date(now);
    dateTo.setHours(23, 59, 59, 999);

    let dateFrom = new Date(now);
    dateFrom.setHours(0, 0, 0, 0);

    switch (period) {
      case 'day':
        // Already set to start of today
        break;
      case 'week':
        dateFrom.setDate(now.getDate() - 7);
        break;
      case 'month':
        dateFrom.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        dateFrom.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { dateFrom, dateTo };
  }
}
