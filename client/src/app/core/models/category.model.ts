export interface Category {
    id: number;
    name: string;
    categoryType: 'INCOME' | 'EXPENSE';
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface CategoryResponse {
    success: boolean;
    data: Category;
}

export interface CategoriesListResponse {
    success: boolean;
    data: Category[];
    count: number;
}
