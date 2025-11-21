import prisma from './config/prisma';

async function main() {
    console.log('Checking prisma.transaction...');
    // @ts-ignore
    if (prisma.transaction) {
        console.log('prisma.transaction exists!');
    } else {
        console.log('prisma.transaction DOES NOT exist!');
        // @ts-ignore
        console.log('Keys:', Object.keys(prisma));
    }
}

main();
