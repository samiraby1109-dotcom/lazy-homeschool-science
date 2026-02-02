// lib/auth.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "next-auth/adapters";
import { prisma } from "@/lib/db";

// Optional: keep admin email configurable
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
      // Attach user id
      if (session.user) {
        // @ts-expect-error - extending session user
        session.user.id = user.id;
        // @ts-expect-error - extending session user
        session.user.isAdmin = user.email === adminEmail;
      }
      return session;
    },
  },
};

// Export a handler that App Router route.ts can re-export
export const authHandler = NextAuth(authOptions);
