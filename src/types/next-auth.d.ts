import { DefaultSession } from "next-auth";
import type { AppRole } from "@/lib/auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: AppRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: AppRole;
  }
}
