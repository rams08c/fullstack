export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: number;
            username: string;
            email: string;
        };
        accessToken: string;
        refreshToken: string;
    };
}

export interface ApiError {
    success: false;
    message: string;
    errors?: any[];
}

export interface DecodedToken {
    userId: number;
    email: string;
    role?: string;
    exp: number;  // Expiration timestamp
    iat: number;  // Issued at timestamp
}

export interface CurrentUser {
    userId: number;
    email: string;
    role?: string;
}
