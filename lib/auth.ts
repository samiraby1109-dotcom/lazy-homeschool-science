// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const EMAIL_SERVER = process.env.EMAIL_SERVER;
const EMAIL_FROM = process.env.EMAIL_FROM;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      server: EMAIL_SERVER,
      from: EMAIL_FROM,
    }),
  ],

  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
  },

  // IMPORTANT: keep this as a literal so TS doesn't widen to `string`
  session: {
    strategy: "database",
  },

  callbacks: {
    async session({ session, user }) {
      const email = session?.user?.email ?? (user as any)?.email ?? null;

      const isAdmin =
        !!ADMIN_EMAIL &&
        !!email &&
        email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      return {
        ...session,
        user: {
          ...(session.user ?? {}),
          isAdmin,
        },
      };
    },
  },
};

// Optional sanity check (runs at import time on server)
if (!EMAIL_SERVER) {
  console.warn(
    "[auth] Missing EMAIL_SERVER env var. Magic link sign-in will fail."
  );
}
if (!EMAIL_FROM) {
  console.warn("[auth] Missing EMAIL_FROM env var. Magic link sign-in will fail.");
}
