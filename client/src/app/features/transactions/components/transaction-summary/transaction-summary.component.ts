import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TransactionSummary } from '../../../../core/models/transaction.model';

@Component({
    selector: 'app-transaction-summary',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule],
    templateUrl: './transaction-summary.component.html',
    styleUrl: './transaction-summary.component.css'
})
export class TransactionSummaryComponent {
    @Input() summary: TransactionSummary = {
        totalSpending: 0,
        totalIncome: 0,
        pendingAmount: 0,
        transactionCount: 0
    };
}
