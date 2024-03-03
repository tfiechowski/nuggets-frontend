import type { JestPrisma } from '@quramy/jest-prisma-core';
import type { prisma } from '@/lib/db';

declare global {
  var jestPrisma: JestPrisma<typeof prisma>;
}
