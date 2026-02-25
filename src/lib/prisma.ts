let prismaInstance: any;

export function getPrisma() {
  if (!prismaInstance) {
    // Lazy load to avoid build-time initialization when prisma generate was not executed yet.
    const { PrismaClient } = require("@prisma/client");
    prismaInstance = new PrismaClient();
  }

  return prismaInstance;
}
