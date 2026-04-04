import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // PrismaClient di v7 tanpa adapter menggunakan datasourceUrl di constructor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  };
  if (process.env.DATABASE_URL) {
    options.datasourceUrl = process.env.DATABASE_URL;
  }
  return new PrismaClient(options);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
