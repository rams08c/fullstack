import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionModel } from '../../../../shared/models/transaction.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList {
  @Input() transactions: TransactionModel[] = [];
  @Output() edit = new EventEmitter<TransactionModel>();

  displayedColumns: string[] = ['description', 'amount', 'category', 'date', 'actions'];

  editTransaction(transaction: TransactionModel): void {
    this.edit.emit(transaction);
  }

  get totalAmount(): number {
    return this.transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }
}
