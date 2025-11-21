import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionModel } from '../../../../shared/models/transaction.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-transaction',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './create-transaction.html',
  styleUrl: './create-transaction.css',
})
export class CreateTransaction implements OnInit, OnChanges {
  @Input() transaction: TransactionModel | null = null;
  @Output() save = new EventEmitter<TransactionModel>();

  transactionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      id: [null],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transaction'] && this.transaction) {
      this.transactionForm.patchValue(this.transaction);
    }
  }

  saveTransaction(): void {
    if (this.transactionForm.valid) {
      this.save.emit(this.transactionForm.value);
      this.transactionForm.reset();
    }
  }
}
