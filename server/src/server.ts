import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './config/prisma';

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

main();
