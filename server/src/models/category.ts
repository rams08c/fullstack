import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum CategoryType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE'
}

export interface Category {
    id: number;
    name: string;
    categoryType: CategoryType;
    createdAt: Date;
    updatedAt: Date;
}

export class CreateCategoryDto {
    @IsString()
    name!: string;

    @IsEnum(CategoryType)
    @IsOptional()
    categoryType?: CategoryType;
}

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEnum(CategoryType)
    categoryType?: CategoryType;
}
