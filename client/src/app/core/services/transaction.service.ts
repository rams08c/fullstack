import { Injectable, signal, computed } from '@angular/core';
import { TransactionModel } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // Private signal to hold the list of transactions
  private transactionsSignal = signal<TransactionModel[]>([]);

  // Public read-only signal for components to consume
  readonly transactions = this.transactionsSignal.asReadonly();

  // Computed signal for total amount
  readonly totalAmount = computed(() => 
    this.transactionsSignal().reduce((total, t) => total + Number(t.amount), 0)
  );

  constructor() {
    // Initialize with some dummy data or load from local storage if needed
    this.loadInitialData();
  }

  private loadInitialData() {
    // Example initial data
    const initialData: TransactionModel[] = [
      { id: 1, description: 'Grocery', amount: 50, category: 'Food', date: new Date() },
      { id: 2, description: 'Salary', amount: 5000, category: 'Income', date: new Date() }
    ];
    this.transactionsSignal.set(initialData);
  }

  addTransaction(transaction: TransactionModel) {
    const newTransaction = { ...transaction, id: Date.now() };
    this.transactionsSignal.update(transactions => [...transactions, newTransaction]);
  }

  updateTransaction(updatedTransaction: TransactionModel) {
    this.transactionsSignal.update(transactions => 
      transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
  }

  deleteTransaction(id: number) {
    this.transactionsSignal.update(transactions => 
      transactions.filter(t => t.id !== id)
    );
  }
}
