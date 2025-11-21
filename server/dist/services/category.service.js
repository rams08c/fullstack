"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class CategoryService {
    async createCategory(dto) {
        const category = await prisma_1.default.category.create({
            data: {
                name: dto.name,
            },
        });
        return category;
    }
    async getCategoryById(id) {
        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) {
            throw new Error(`Invalid ID: ${id}`);
        }
        const category = await prisma_1.default.category.findUnique({
            where: { id: categoryId },
        });
        return category;
    }
    async getAllCategories() {
        const categories = await prisma_1.default.category.findMany({
            orderBy: { name: 'asc' },
        });
        return categories;
    }
    async updateCategory(id, dto) {
        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) {
            throw new Error(`Invalid ID: ${id}`);
        }
        // Check if category exists
        const existingCategory = await prisma_1.default.category.findUnique({ where: { id: categoryId } });
        if (!existingCategory) {
            throw new Error(`Category with ID ${id} not found`);
        }
        const category = await prisma_1.default.category.update({
            where: { id: categoryId },
            data: {
                ...dto,
            },
        });
        return category;
    }
    async deleteCategory(id) {
        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) {
            throw new Error(`Invalid ID: ${id}`);
        }
        // Check if category exists
        const existingCategory = await prisma_1.default.category.findUnique({ where: { id: categoryId } });
        if (!existingCategory) {
            throw new Error(`Category with ID ${id} not found`);
        }
        const category = await prisma_1.default.category.delete({
            where: { id: categoryId },
        });
        return category;
    }
}
exports.CategoryService = CategoryService;
