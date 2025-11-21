import { Component, inject } from '@angular/core';
import { TransactionModel } from '../../../../shared/models/transaction.model';
import { MatCardModule } from '@angular/material/card';
import { CreateTransaction } from '../../components/create-transaction/create-transaction';
import { TransactionList } from '../../components/transaction-list/transaction-list';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../../core/services/transaction.service';

@Component({
  selector: 'app-transaction-page',
  imports: [CreateTransaction, TransactionList, CommonModule, MatCardModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css',
  standalone: true,
})
export class TransactionPageComponent {
  private transactionService = inject(TransactionService);

  // Expose the signal from the service
  transactions = this.transactionService.transactions;

  selectedTransaction: TransactionModel | null = null;

  handleSave(transaction: TransactionModel): void {
    if (transaction.id) {
      this.transactionService.updateTransaction(transaction);
    } else {
      this.transactionService.addTransaction(transaction);
    }
    this.selectedTransaction = null;
  }

  handleEdit(transaction: TransactionModel): void {
    this.selectedTransaction = transaction;
  }
}
