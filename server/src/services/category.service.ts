import prisma from '../config/prisma';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models';

export class CategoryService {
    async createCategory(dto: CreateCategoryDto): Promise<Category> {
        const category = await prisma.category.create({
            data: {
                name: dto.name,
                categoryType: dto.categoryType || 'EXPENSE', // Default to EXPENSE if not provided
            },
        });
        return category as unknown as Category;
    }

    async getCategoryById(id: string): Promise<Category | null> {
        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) {
            throw new Error(`Invalid ID: ${id}`);
        }
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });
        return category as unknown as Category;
    }

    async getAllCategories(): Promise<Category[]> {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
        return categories as unknown as Category[];
    }

    async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) {
            throw new Error(`Invalid ID: ${id}`);
        }

        // Check if category exists
        const existingCategory = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!existingCategory) {
            throw new Error(`Category with ID ${id} not found`);
        }

        const category = await prisma.category.update({
            where: { id: categoryId },
            data: {
                ...dto,
            },
        });
        return category as unknown as Category;
    }

    async deleteCategory(id: string): Promise<Category> {
        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) {
            throw new Error(`Invalid ID: ${id}`);
        }

        // Check if category exists
        const existingCategory = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!existingCategory) {
            throw new Error(`Category with ID ${id} not found`);
        }

        const category = await prisma.category.delete({
            where: { id: categoryId },
        });
        return category as unknown as Category;
    }
}
