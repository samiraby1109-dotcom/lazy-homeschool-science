import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    })
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/verify'
  },
  session: {
    strategy: 'database'
  }
} satisfies Parameters<typeof NextAuth>[0];

export const authHandler = NextAuth(authOptions);
