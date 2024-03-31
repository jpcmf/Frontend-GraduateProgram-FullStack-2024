import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";

import { signInRequest, userMe } from "../services/auth";

type SignInData = {
  email: string;
  password: string;
};

type User = {
  name: string;
  email: string;
  about: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      userMe(token)
        .then(response => {
          setUser(response);
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInData) {
    const { user, jwt } = await signInRequest({ email, password });

    setCookie(undefined, "nextauth.token", jwt, {
      // maxAge: 60 * 60 * 1 // 1 hour
      maxAge: 180 // 3 minutes
    });

    setUser(user);

    Router.push("/dashboard");
  }

  function signOut() {
    destroyCookie(undefined, "nextauth.token");
    Router.push("/auth/signin");
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>{children}</AuthContext.Provider>;
}
