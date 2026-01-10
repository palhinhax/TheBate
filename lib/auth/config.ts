import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { sendMagicLinkEmail } from "@/lib/email";
import type { Adapter } from "@auth/core/adapters";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Allow linking accounts with same email
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "noreply@thebate.com",
      async sendVerificationRequest({ identifier: email, url }) {
        // Use our custom email template with multi-language support
        // Default to Portuguese, can be enhanced to detect user preference
        await sendMagicLinkEmail(email, url, "pt");
      },
    }),
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
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, ensure user has required fields
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser && !existingUser.username) {
          // Generate username from email if not set
          const baseUsername = user.email!.split("@")[0];
          let username = baseUsername;
          let counter = 1;

          // Ensure username is unique
          while (
            await prisma.user.findUnique({ where: { username } })
          ) {
            username = `${baseUsername}${counter}`;
            counter++;
          }

          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              username,
              emailVerified: new Date(),
            },
          });
        }
      }

      // For email magic link, mark email as verified
      if (account?.provider === "resend" || account?.provider === "email") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          // Generate username if not set
          if (!existingUser.username) {
            const baseUsername = user.email!.split("@")[0];
            let username = baseUsername;
            let counter = 1;

            while (
              await prisma.user.findUnique({ where: { username } })
            ) {
              username = `${baseUsername}${counter}`;
              counter++;
            }

            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                username,
                emailVerified: new Date(),
              },
            });
          } else if (!existingUser.emailVerified) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { emailVerified: new Date() },
            });
          }
        }
      }

      return true;
    },
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
      if ((trigger === "update" || !token.username) && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            username: true,
            name: true,
            role: true,
            isOwner: true,
            preferredLanguage: true,
            preferredContentLanguages: true,
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
