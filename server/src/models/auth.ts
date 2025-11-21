import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for user login
 */
export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}

/**
 * DTO for refresh token request
 */
export class RefreshTokenDto {
    @IsString()
    refreshToken!: string;
}

/**
 * Interface for authentication response
 */
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
