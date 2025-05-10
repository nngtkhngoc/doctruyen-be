import { PrismaClient } from "@prisma/client";

export const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV === "development") globalThis.prisma = prisma;
// globalThis.prisma = prisma;

// export const prisma = new PrismaClient();
