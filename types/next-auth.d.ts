import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      isOwner: boolean;
      preferredLanguage?: string;
      preferredContentLanguages?: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    role: string;
    isOwner: boolean;
    preferredLanguage?: string;
    preferredContentLanguages?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
    isOwner: boolean;
    preferredLanguage?: string;
    preferredContentLanguages?: string[];
  }
}
