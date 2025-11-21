import prisma from './src/config/prisma';

// This test file checks if prisma.category is available
async function testPrismaCategory() {
    try {
        // This should work if the Prisma Client was generated correctly
        const categories = await prisma.category.findMany();
        console.log('✅ prisma.category is available!');
        console.log('Categories:', categories);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPrismaCategory();
