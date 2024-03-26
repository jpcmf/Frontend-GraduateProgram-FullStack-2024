import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    id?: any & DefaultSession["session"];
    jwt?: any & DefaultSession["session"];
    user: DefaultSession["user"] & {
      id?: string;
      username?: string;
      about?: string;
    };
  }

  interface User {
    id?: string;
    jwt?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    jwt?: string;
  }
}
