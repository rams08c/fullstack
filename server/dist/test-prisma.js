"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./config/prisma"));
async function main() {
    console.log('Checking prisma.transaction...');
    // @ts-ignore
    if (prisma_1.default.transaction) {
        console.log('prisma.transaction exists!');
    }
    else {
        console.log('prisma.transaction DOES NOT exist!');
        // @ts-ignore
        console.log('Keys:', Object.keys(prisma_1.default));
    }
}
main();
