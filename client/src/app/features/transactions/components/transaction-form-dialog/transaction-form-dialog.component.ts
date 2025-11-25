import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Transaction, CreateTransactionRequest, UpdateTransactionRequest } from '../../../../core/models/transaction.model';
import { Category } from '../../../../core/models/category.model';
import { CategoryService } from '../../../../core/services/category.service';

export interface TransactionDialogData {
    transaction?: Transaction;
    userId: number;
}

@Component({
    selector: 'app-transaction-form-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './transaction-form-dialog.component.html',
    styleUrl: './transaction-form-dialog.component.css'
})
export class TransactionFormDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private categoryService = inject(CategoryService);
    private dialogRef = inject(MatDialogRef<TransactionFormDialogComponent>);

    transactionForm!: FormGroup;
    categories = signal<Category[]>([]);
    isLoading = signal<boolean>(false);
    isEditMode: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: TransactionDialogData) {
        this.isEditMode = !!data.transaction;
    }

    ngOnInit(): void {
        this.initForm();
        this.loadCategories();
    }

    private initForm(): void {
        this.transactionForm = this.fb.group({
            title: [this.data.transaction?.title || '', [Validators.required, Validators.minLength(3)]],
            description: [this.data.transaction?.description || ''],
            amount: [this.data.transaction?.amount || '', [Validators.required, Validators.min(0.01)]],
            date: [this.data.transaction?.date ? new Date(this.data.transaction.date) : new Date(), Validators.required],
            categoryId: [this.data.transaction?.categoryId || '', Validators.required]
        });
    }

    private loadCategories(): void {
        this.isLoading.set(true);
        this.categoryService.getCategories().subscribe({
            next: (response) => {
                // Filter to show only EXPENSE categories (income not yet implemented)
                // Using case-insensitive check to be safe
                const expenseCategories = response.data.filter(cat =>
                    cat.categoryType && cat.categoryType.toUpperCase() === 'EXPENSE'
                );
                this.categories.set(expenseCategories);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading categories:', error);
                this.isLoading.set(false);
            }
        });
    }

    onSubmit(): void {
        if (this.transactionForm.valid) {
            const formValue = this.transactionForm.value;

            if (this.isEditMode && this.data.transaction) {
                const updateData: UpdateTransactionRequest = {
                    title: formValue.title,
                    description: formValue.description,
                    amount: formValue.amount.toString(),
                    date: new Date(formValue.date).toISOString(),
                    categoryId: formValue.categoryId
                };
                this.dialogRef.close({ action: 'update', data: updateData, id: this.data.transaction.id });
            } else {
                const createData: CreateTransactionRequest = {
                    title: formValue.title,
                    description: formValue.description,
                    amount: formValue.amount.toString(),
                    date: new Date(formValue.date).toISOString(),
                    userId: this.data.userId,
                    categoryId: formValue.categoryId
                };
                this.dialogRef.close({ action: 'create', data: createData });
            }
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
