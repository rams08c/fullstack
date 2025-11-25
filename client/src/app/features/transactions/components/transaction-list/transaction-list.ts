import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../../../core/models/transaction.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList {
  @Input() transactions: Transaction[] = [];
  @Input() isLoading: boolean = false;

  @Output() edit = new EventEmitter<Transaction>();
  @Output() delete = new EventEmitter<Transaction>();

  displayedColumns: string[] = ['title', 'amount', 'category', 'date', 'actions'];

  editTransaction(transaction: Transaction): void {
    this.edit.emit(transaction);
  }

  deleteTransaction(transaction: Transaction): void {
    this.delete.emit(transaction);
  }

  getAmountClass(transaction: Transaction): string {
    return transaction.category?.categoryType === 'INCOME' ? 'income' : 'expense';
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
