import NextAuth, { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Dev Login',
      credentials: {
        email: { label: 'Email', type: 'text' }
      },
      async authorize(credentials) {
        if (process.env.ALLOW_DEV_LOGIN !== 'true') {
          return null;
        }
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
          return null;
        }
        const email = credentials?.email || adminEmail;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return existing;
        }
        return prisma.user.create({
          data: {
            email,
            name: 'Admin'
          }
        });
      }
    }),
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
  },
  callbacks: {
    async session({ session, user }) {
      const adminEmail = process.env.ADMIN_EMAIL;
      session.user.isAdmin = Boolean(adminEmail && user.email === adminEmail);
      session.user.isPaid = session.user.isPaid ?? false;
      return session;
    }
  }
};

export const authHandler = NextAuth(authOptions);
