import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TransactionService } from '../../../../core/services/transaction.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  Transaction,
  TransactionFilters,
  TransactionSummary,
  PaginationParams,
  CreateTransactionRequest,
  UpdateTransactionRequest
} from '../../../../core/models/transaction.model';
import { TransactionSummaryComponent } from '../../components/transaction-summary/transaction-summary.component';
import { TransactionFiltersComponent } from '../../components/transaction-filters/transaction-filters.component';
import { TransactionList } from '../../components/transaction-list/transaction-list';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { TransactionFormDialogComponent } from '../../components/transaction-form-dialog/transaction-form-dialog.component';

@Component({
  selector: 'app-transaction-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TransactionSummaryComponent,
    TransactionFiltersComponent,
    TransactionList,
    PaginationComponent
  ],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css',
})
export class TransactionPageComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // State
  transactions = signal<Transaction[]>([]);
  summary = signal<TransactionSummary>({
    totalSpending: 0,
    totalIncome: 0,
    pendingAmount: 0,
    transactionCount: 0
  });
  filters = signal<TransactionFilters>({ period: 'month' });
  pagination = signal<PaginationParams>({ skip: 0, take: 10 });
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(false);

  // Computed
  currentPage = computed(() => Math.floor(this.pagination().skip / this.pagination().take) + 1);
  totalPages = computed(() => Math.ceil(this.totalCount() / this.pagination().take));

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showError('User not authenticated');
      return;
    }

    this.isLoading.set(true);
    this.transactionService.getTransactions(
      currentUser.userId,
      this.filters(),
      this.pagination()
    ).subscribe({
      next: (response) => {
        this.transactions.set(response.data);
        this.totalCount.set(response.count);
        this.updateSummary(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.showError('Failed to load transactions');
        this.isLoading.set(false);
      }
    });
  }

  updateSummary(transactions: Transaction[]): void {
    const summary = this.transactionService.calculateSummary(transactions);
    this.summary.set(summary);
  }

  onFilterChange(filters: TransactionFilters): void {
    this.filters.set(filters);
    // Reset to first page when filters change
    this.pagination.set({ ...this.pagination(), skip: 0 });
    this.loadTransactions();
  }

  onPageChange(page: number): void {
    const skip = (page - 1) * this.pagination().take;
    this.pagination.set({ ...this.pagination(), skip });
    this.loadTransactions();
  }

  openCreateDialog(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showError('User not authenticated');
      return;
    }

    const dialogRef = this.dialog.open(TransactionFormDialogComponent, {
      width: '600px',
      data: { userId: currentUser.userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'create') {
        this.createTransaction(result.data);
      }
    });
  }

  openEditDialog(transaction: Transaction): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showError('User not authenticated');
      return;
    }

    const dialogRef = this.dialog.open(TransactionFormDialogComponent, {
      width: '600px',
      data: { transaction, userId: currentUser.userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'update') {
        this.updateTransaction(result.id, result.data);
      }
    });
  }

  createTransaction(data: CreateTransactionRequest): void {
    this.transactionService.createTransaction(data).subscribe({
      next: (response) => {
        this.showSuccess('Transaction created successfully');
        this.loadTransactions();
      },
      error: (error) => {
        console.error('Error creating transaction:', error);
        this.showError('Failed to create transaction');
      }
    });
  }

  updateTransaction(id: number, data: UpdateTransactionRequest): void {
    this.transactionService.updateTransaction(id, data).subscribe({
      next: (response) => {
        this.showSuccess('Transaction updated successfully');
        this.loadTransactions();
      },
      error: (error) => {
        console.error('Error updating transaction:', error);
        this.showError('Failed to update transaction');
      }
    });
  }

  confirmDelete(transaction: Transaction): void {
    const confirmed = confirm(`Are you sure you want to delete "${transaction.title}"?`);
    if (confirmed) {
      this.deleteTransaction(transaction.id);
    }
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id).subscribe({
      next: () => {
        this.showSuccess('Transaction deleted successfully');
        this.loadTransactions();
      },
      error: (error) => {
        console.error('Error deleting transaction:', error);
        this.showError('Failed to delete transaction');
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
