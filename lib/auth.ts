// lib/auth.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "next-auth/adapters";
import { prisma } from "@/lib/db";

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@lazyhomeschoolscience.local";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // attach user id + admin flag
        (session.user as any).id = user.id;
        (session.user as any).isAdmin = user.email === adminEmail;
      }
      return session;
    },
  },
};

export const authHandler = NextAuth(authOptions);
