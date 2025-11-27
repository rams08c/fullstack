import { IsDateString, IsDecimal, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { CategoryType } from './category';
import type { Category } from './category';
import type { User } from './user';

export interface Transaction {
    id: number;
    title: string;
    description?: string | null;
    amount: number; // Decimal in Prisma is mapped to number or string in JS/TS, usually string to preserve precision, but for DTOs we might use number or string. Prisma Client returns Decimal.
    date: Date;
    categoryType: CategoryType;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    categoryId: number;
    category?: Category;
    user?: User;
}

export class CreateTransactionDto {
    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDecimal() // Validates if the string is a valid decimal number
    amount!: string; // Using string for Decimal to avoid precision loss

    @IsDateString()
    date!: string;

    @IsEnum(CategoryType)
    @IsOptional()
    categoryType?: CategoryType;

    @IsInt()
    userId!: number;

    @IsInt()
    categoryId!: number;
}

export class UpdateTransactionDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDecimal()
    amount?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsEnum(CategoryType)
    categoryType?: CategoryType;

    @IsOptional()
    @IsInt()
    categoryId?: number;
}
