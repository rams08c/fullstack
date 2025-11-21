import { IsOptional, IsString } from 'class-validator';

export interface Category {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export class CreateCategoryDto {
    @IsString()
    name!: string;
}

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    name?: string;
}
