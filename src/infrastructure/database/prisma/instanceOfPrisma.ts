import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL_PRISMA 

export const prisma = new PrismaClient({
    // log: ['info', 'query'],
    // log: ['query'],
    // log: ['query', 'info'],
    // log: ['query', 'info', 'warn'],
    // log: ['query', 'info', 'warn', 'error'],
    // log: ['query', 'info', 'warn', 'error', 'pool'],
    datasources: {
        db: {
            url: connectionString,
        }
    }
})



