import NextAuth from "next-auth";
import { signInRequest } from "../../../services/auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Sign in with e-mail",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (credentials == null) return null;

        try {
          const { user, jwt } = await signInRequest({
            email: credentials.email,
            password: credentials.password
          });
          return { ...user, jwt };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    session: async ({ session, token, user }) => {
      if (token) {
        session.id = token.id;
        session.jwt = token.jwt;
        session.user = token.user as {
          name?: string | null | undefined;
          email?: string | null | undefined;
          image?: string | null | undefined;
        };
      }

      return Promise.resolve(session);
    },
    jwt: async ({ token, user }) => {
      const isSignIn = user ? true : false;

      if (isSignIn) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.user = user;
      }

      return Promise.resolve(token);
    }
  }
});
