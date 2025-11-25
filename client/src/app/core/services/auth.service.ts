import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, DecodedToken, CurrentUser } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    /**
     * Register a new user
     */
    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/users/register`, data)
            .pipe(
                tap(response => {
                    if (response.success && response.data) {
                        this.saveTokens(response.data.accessToken, response.data.refreshToken);
                    }
                }),
                catchError(this.handleError)
            );
    }

    /**
     * Login user
     */
    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data)
            .pipe(
                tap(response => {
                    if (response.success && response.data) {
                        this.saveTokens(response.data.accessToken, response.data.refreshToken);
                    }
                }),
                catchError(this.handleError)
            );
    }

    /**
     * Logout user
     */
    logout(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        return this.http.post(`${this.apiUrl}/auth/logout`, { refreshToken })
            .pipe(
                tap(() => this.clearTokens()),
                catchError((error) => {
                    // Clear tokens even if logout request fails
                    this.clearTokens();
                    return throwError(() => error);
                })
            );
    }

    /**
     * Save tokens to localStorage
     */
    private saveTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    /**
     * Get access token from localStorage
     */
    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    /**
     * Get access token (alias for backwards compatibility)
     */
    getAccessToken(): string | null {
        return this.getToken();
    }

    /**
     * Get refresh token from localStorage
     */
    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    /**
     * Clear tokens from localStorage
     */
    clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        // Check if token is expired
        return !this.isTokenExpired(token);
    }

    /**
     * Check if user is authenticated (alias for isLoggedIn)
     */
    isAuthenticated(): boolean {
        return this.isLoggedIn();
    }

    /**
     * Check if token is expired
     */
    isTokenExpired(token?: string): boolean {
        const tokenToCheck = token || this.getToken();
        if (!tokenToCheck) {
            return true;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(tokenToCheck);
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        } catch (error) {
            // If token can't be decoded, consider it expired
            return true;
        }
    }

    /**
     * Get current user information from JWT token
     */
    getCurrentUser(): CurrentUser | null {
        const token = this.getToken();
        if (!token) {
            return null;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    /**
     * Decode JWT token
     */
    decodeToken(token: string): DecodedToken | null {
        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    /**
     * Handle HTTP errors
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            if (error.error?.message) {
                errorMessage = error.error.message;
            } else if (error.status === 0) {
                errorMessage = 'Unable to connect to server. Please check your connection.';
            } else {
                errorMessage = `Error: ${error.status} - ${error.statusText}`;
            }
        }

        return throwError(() => new Error(errorMessage));
    }
}
