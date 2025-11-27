import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';
import { Category } from '../../core/models/category.model';
import { CreateTransactionRequest } from '../../core/models/transaction.model';

@Component({
    selector: 'app-income',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.css']
})
export class IncomeComponent {
    private fb = inject(FormBuilder);
    private categoryService = inject(CategoryService);
    private transactionService = inject(TransactionService);
    private authService = inject(AuthService);
    private snackBar = inject(MatSnackBar);

    // Signals for reactive state
    categories = signal<Category[]>([]);
    isLoading = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);

    // Reactive form
    incomeForm: FormGroup;

    constructor() {
        this.incomeForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            amount: ['', [Validators.required, Validators.min(0.01)]],
            categoryId: ['', Validators.required],
            date: [new Date(), Validators.required]
        });

        this.loadCategories();
    }

    /**
     * Load INCOME categories from the backend
     */
    loadCategories(): void {
        this.isLoading.set(true);
        this.categoryService.getCategories().subscribe({
            next: (response) => {
                // Filter to show only INCOME categories
                const incomeCategories = response.data.filter(
                    cat => cat.categoryType && cat.categoryType.toUpperCase() === 'INCOME'
                );
                this.categories.set(incomeCategories);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading categories:', error);
                this.snackBar.open('Failed to load categories', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                    panelClass: ['error-snackbar']
                });
                this.isLoading.set(false);
            }
        });
    }

    /**
     * Handle form submission
     */
    onSubmit(): void {
        if (this.incomeForm.valid) {
            const currentUser = this.authService.getCurrentUser();
            if (!currentUser) {
                this.snackBar.open('User not authenticated', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                    panelClass: ['error-snackbar']
                });
                return;
            }

            const formValue = this.incomeForm.value;
            const incomeData: CreateTransactionRequest = {
                title: formValue.title,
                description: '', // Optional field, can be empty
                amount: formValue.amount.toString(),
                date: new Date(formValue.date).toISOString(),
                categoryType: 'INCOME',
                userId: currentUser.userId,
                categoryId: formValue.categoryId
            };

            this.isSubmitting.set(true);
            this.transactionService.createTransaction(incomeData).subscribe({
                next: (response) => {
                    this.snackBar.open('Income recorded successfully!', 'Close', {
                        duration: 3000,
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        panelClass: ['success-snackbar']
                    });

                    // Reset form but keep today's date
                    this.incomeForm.reset({
                        title: '',
                        amount: '',
                        categoryId: '',
                        date: new Date()
                    });
                    this.isSubmitting.set(false);
                },
                error: (error) => {
                    console.error('Error creating income:', error);
                    this.snackBar.open('Failed to record income. Please try again.', 'Close', {
                        duration: 5000,
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        panelClass: ['error-snackbar']
                    });
                    this.isSubmitting.set(false);
                }
            });
        }
    }

    /**
     * Reset the form
     */
    onReset(): void {
        this.incomeForm.reset({
            title: '',
            amount: '',
            categoryId: '',
            date: new Date()
        });
    }
}
