import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import type { Profile } from './profile';
import type { Transaction } from './transaction';

export interface User {
    id: number;
    username: string;
    email: string;
    password?: string; // Optional in response, required in DB
    refreshTokenKey?: string | null;
    createdAt: Date;
    updatedAt: Date;
    profile?: Profile | null;
    transactions?: Transaction[];
}

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    username!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsString()
    refreshTokenKey?: string;
}
