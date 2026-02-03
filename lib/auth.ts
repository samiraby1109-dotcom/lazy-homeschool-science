import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    })
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify"
  },
  session: {
    strategy: "database"
  },
  callbacks: {
    async session({ session, user }) {
      // `user` comes from Prisma adapter
      // Add isAdmin into the session object for UI + gating
      return {
        ...session,
        user: {
          ...session.user,
          isAdmin: (user as any).isAdmin ?? false
        }
      };
    }
  }
};
