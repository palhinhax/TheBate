import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { sendMagicLinkEmail } from "@/lib/email";

// Validate environment variables
if (!process.env.AUTH_SECRET) {
  throw new Error(
    "❌ AUTH_SECRET is not configured. Please set it in your environment variables."
  );
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn(
    "⚠️ Google OAuth is not fully configured. GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing."
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, ...message) {
      console.error("❌ [Auth Error]", code, ...message);
    },
    warn(code, ...message) {
      console.warn("⚠️ [Auth Warning]", code, ...message);
    },
    debug(code, ...message) {
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 [Auth Debug]", code, ...message);
      }
    },
  },
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
      try {
        console.log("🔐 SignIn callback triggered", {
          provider: account?.provider,
          userEmail: user.email,
          userId: user.id,
        });

        // For OAuth providers, ensure user has required fields
        if (account?.provider === "google") {
          console.log("🔍 Processing Google sign-in for:", user.email);

          const existingUser = await prisma.user
            .findUnique({
              where: { email: user.email! },
            })
            .catch((error) => {
              console.error("❌ Database error finding user:", error);
              throw new Error(`Database connection failed: ${error.message}`);
            });

          if (existingUser && !existingUser.username) {
            console.log(
              "👤 Generating username for existing user:",
              existingUser.id
            );

            // Generate username from email if not set
            const baseUsername = user.email!.split("@")[0];
            let username = baseUsername;
            let counter = 1;

            // Ensure username is unique
            while (await prisma.user.findUnique({ where: { username } })) {
              username = `${baseUsername}${counter}`;
              counter++;
            }

            await prisma.user
              .update({
                where: { id: existingUser.id },
                data: {
                  username,
                  emailVerified: new Date(),
                },
              })
              .catch((error) => {
                console.error("❌ Failed to update user:", error);
                throw new Error(`Failed to update user: ${error.message}`);
              });

            console.log("✅ Username created:", username);
          }
        }

        // For email magic link, mark email as verified
        if (account?.provider === "resend" || account?.provider === "email") {
          console.log("📧 Processing email sign-in for:", user.email);

          const existingUser = await prisma.user
            .findUnique({
              where: { email: user.email! },
            })
            .catch((error) => {
              console.error("❌ Database error finding user:", error);
              throw new Error(`Database connection failed: ${error.message}`);
            });

          if (existingUser) {
            // Generate username if not set
            if (!existingUser.username) {
              const baseUsername = user.email!.split("@")[0];
              let username = baseUsername;
              let counter = 1;

              while (await prisma.user.findUnique({ where: { username } })) {
                username = `${baseUsername}${counter}`;
                counter++;
              }

              await prisma.user
                .update({
                  where: { id: existingUser.id },
                  data: {
                    username,
                    emailVerified: new Date(),
                  },
                })
                .catch((error) => {
                  console.error("❌ Failed to update user:", error);
                  throw new Error(`Failed to update user: ${error.message}`);
                });
            } else if (!existingUser.emailVerified) {
              await prisma.user
                .update({
                  where: { id: existingUser.id },
                  data: { emailVerified: new Date() },
                })
                .catch((error) => {
                  console.error("❌ Failed to verify email:", error);
                  throw new Error(`Failed to verify email: ${error.message}`);
                });
            }
          }
        }

        console.log("✅ SignIn successful for:", user.email);
        return true;
      } catch (error) {
        console.error("❌ SignIn callback error:", error);
        // Return false to show error page with details
        return false;
      }
    },
    async jwt({ token, user, trigger }) {
      try {
        if (user) {
          console.log("🔑 JWT callback - Adding user to token:", user.email);
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
          console.log("🔄 Refreshing token data from database for:", token.id);

          const dbUser = await prisma.user
            .findUnique({
              where: { id: token.id as string },
              select: {
                username: true,
                name: true,
                role: true,
                isOwner: true,
                preferredLanguage: true,
                preferredContentLanguages: true,
              },
            })
            .catch((error) => {
              console.error("❌ Database error in JWT callback:", error);
              throw new Error(`Failed to fetch user data: ${error.message}`);
            });

          if (dbUser) {
            token.username = dbUser.username;
            token.name = dbUser.name;
            token.role = dbUser.role;
            token.isOwner = dbUser.isOwner;
            token.preferredLanguage = dbUser.preferredLanguage;
            token.preferredContentLanguages = dbUser.preferredContentLanguages;
            console.log("✅ Token refreshed successfully");
          } else {
            console.warn("⚠️ User not found in database:", token.id);
          }
        }

        return token;
      } catch (error) {
        console.error("❌ JWT callback error:", error);
        throw error;
      }
    },
    async session({ session, token }) {
      try {
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
      } catch (error) {
        console.error("❌ Session callback error:", error);
        throw error;
      }
    },
  },
});
