import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TransactionFilters } from '../../../../core/models/transaction.model';

@Component({
    selector: 'app-transaction-filters',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatCardModule
    ],
    templateUrl: './transaction-filters.component.html',
    styleUrl: './transaction-filters.component.css'
})
export class TransactionFiltersComponent {
    @Output() filterChange = new EventEmitter<TransactionFilters>();

    selectedPeriod = signal<'day' | 'week' | 'month' | 'year' | 'all'>('month');

    onPeriodChange(period: 'day' | 'week' | 'month' | 'year' | 'all'): void {
        this.selectedPeriod.set(period);
        this.emitFilter();
    }

    private emitFilter(): void {
        const filters: TransactionFilters = {
            period: this.selectedPeriod()
        };
        this.filterChange.emit(filters);
    }
}
