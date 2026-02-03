import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

const devBypassEnabled = process.env.DEV_BYPASS_AUTH === "true";

function getDevRole() {
  const role = (process.env.DEV_BYPASS_ROLE || "SUPER_ADMIN").toUpperCase();
  if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "USER") return role as
    | "SUPER_ADMIN"
    | "ADMIN"
    | "USER";
  return "SUPER_ADMIN";
}

export const authOptions: NextAuthOptions = {
  // Only use Prisma adapter + email provider in normal mode
  ...(devBypassEnabled
    ? {}
    : {
        adapter: PrismaAdapter(prisma),
      }),

  providers: devBypassEnabled
    ? [
        CredentialsProvider({
          name: "Dev Login",
          credentials: {
            email: { label: "Email", type: "email" },
          },
          async authorize(credentials) {
            const email =
              (credentials?.email || process.env.DEV_BYPASS_EMAIL || "").trim();

            if (!email) return null;

            const role = getDevRole();
            const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

            // NextAuth "user" object
            return {
              id: `dev_${email}`,
              email,
              name: email.split("@")[0],
              role,
              isAdmin,
            } as any;
          },
        }),
      ]
    : [
        EmailProvider({
          server: process.env.EMAIL_SERVER,
          from: process.env.EMAIL_FROM,
        }),
      ],

  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify",
  },

  // Use JWT in dev bypass so it doesn't require DB tables or email verification
  session: {
    strategy: devBypassEnabled ? "jwt" : "database",
  },

  callbacks: {
    async jwt({ token, user }) {
      // When signing in, persist role/admin info to token
      if (user) {
        (token as any).role = (user as any).role ?? "USER";
        (token as any).isAdmin = !!(user as any).isAdmin;
      }
      return token;
    },

    async session({ session, token, user }) {
      // In database session mode, "user" may be present. In JWT mode, use token.
      const role =
        (user as any)?.role ?? (token as any)?.role ?? "USER";
      const isAdmin =
        (user as any)?.isAdmin ?? (token as any)?.isAdmin ?? false;

      session.user = {
        ...(session.user || {}),
        role,
        isAdmin,
      } as any;

      return session;
    },
  },
};
