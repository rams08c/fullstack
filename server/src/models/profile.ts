import { IsOptional, IsString, IsInt } from 'class-validator';

export interface Profile {
    id: number;
    name: string;
    mobile?: string | null;
    avatar?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    pincode?: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
}

export class CreateProfileDto {
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    mobile?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    addressLine1?: string;

    @IsOptional()
    @IsString()
    addressLine2?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    pincode?: string;

    @IsInt()
    userId!: number;
}

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    mobile?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    addressLine1?: string;

    @IsOptional()
    @IsString()
    addressLine2?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    pincode?: string;
}
