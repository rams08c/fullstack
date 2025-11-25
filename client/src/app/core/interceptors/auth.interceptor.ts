import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    // Get the auth token from localStorage
    const authToken = localStorage.getItem('accessToken');

    // Clone the request and add the authorization header if token exists
    let authReq = req;
    if (authToken) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        });
    }

    // Handle the request and catch any HTTP errors
    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Unauthorized - clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                router.navigate(['/login']);
            } else if (error.status === 403) {
                // Forbidden - redirect to no access page
                router.navigate(['/no-access']);
            }

            return throwError(() => error);
        })
    );
};
