import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          isOwner: user.isOwner,
          image: user.image,
          preferredLanguage: user.preferredLanguage,
          preferredContentLanguages: user.preferredContentLanguages,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.isOwner = user.isOwner;
        token.preferredLanguage = user.preferredLanguage;
        token.preferredContentLanguages = user.preferredContentLanguages;
      }

      // On token refresh or update, fetch latest user data from database
      // This ensures language preferences are always up-to-date
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            preferredLanguage: true,
            preferredContentLanguages: true,
            username: true,
            name: true,
            role: true,
            isOwner: true,
          },
        });

        if (dbUser) {
          token.username = dbUser.username;
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.isOwner = dbUser.isOwner;
          token.preferredLanguage = dbUser.preferredLanguage;
          token.preferredContentLanguages = dbUser.preferredContentLanguages;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.isOwner = token.isOwner as boolean;
        session.user.preferredLanguage = token.preferredLanguage as string;
        session.user.preferredContentLanguages =
          token.preferredContentLanguages as string[];
      }
      return session;
    },
  },
});
