import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guest Guard - Prevents authenticated users from accessing login/register pages
 * Redirects logged-in users to /transactions
 */
export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        // User is not logged in, allow access to login/register
        return true;
    }

    // User is already logged in, redirect to transactions
    router.navigate(['/transactions']);
    return false;
};
