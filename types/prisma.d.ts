import type { PrismaClient } from '@prisma/client';

declare module '@prisma/client' {
  interface PrismaClient {
    trustedSource: any;
    suggestedResource: any;
  }
}
