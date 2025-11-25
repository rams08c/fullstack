import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { email, Field, form, minLength, required, validate } from '@angular/forms/signals';
import { UserModel } from '../../../core/models/user.model';
import { FormValidationService } from '../../../core/services/form-validation.service';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  imports: [
    Field,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  formValidationService = inject(FormValidationService);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  userFormModel = signal<UserModel>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: ''
  });

  registerForm = form(this.userFormModel, (schemaPath) => {
    required(schemaPath.name, { message: "Name is required" })
    minLength(schemaPath.name, 3, { message: "Minimum length of name should be 3 characters" })
    required(schemaPath.email, { message: "Email is required" })
    email(schemaPath.email, { message: "Please provide the valid email address" })
    required(schemaPath.password, { message: "Password is required" })
    minLength(schemaPath.password, 6, { message: "Minimum length of password should be 6 characters" })
    required(schemaPath.confirmPassword, { message: "Confirm password is required" })
    minLength(schemaPath.confirmPassword, 6, { message: "Minimum length of password should be 6 characters" })
    this.misMatchPassword(schemaPath)
  });


  onSubmit() {
    if (this.registerForm().valid()) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const formValue = this.registerForm().value();

      // Map form data to backend expected format
      const registerData: RegisterRequest = {
        username: formValue.name,
        email: formValue.email,
        password: formValue.password
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.snackBar.open('Registration successful! Welcome!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          // Navigate to transactions page
          this.router.navigate(['/transactions']);
        },
        error: (error) => {
          this.isLoading.set(false);
          const errorMsg = error.message || 'Registration failed. Please try again.';
          this.errorMessage.set(errorMsg);
          this.snackBar.open(errorMsg, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  passwordMatcher(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  misMatchPassword(schemaPath: any) {
    validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
      const confirmPassword = value();
      const password = valueOf(schemaPath.password);
      if (confirmPassword !== password) {
        return {
          kind: "passwordMisMatch",
          message: "Password and confirm password are not matching"
        }
      }
      return null;
    })
  }
}
