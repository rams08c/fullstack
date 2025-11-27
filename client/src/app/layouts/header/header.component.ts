import { Component, inject, computed, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink
  ],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Use signal-based auth state directly for reactive updates
  isLoggedIn = this.authService.isAuthenticated;

  /**
   * Logout user with production-ready implementation
   */
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.snackBar.open('Logged out successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Tokens are already cleared by AuthService even on error
        this.snackBar.open('Logged out (session cleared)', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['info-snackbar']
        });
        this.router.navigate(['/login']);
      }
    });
  }
}
