import Router from "next/router";
import { createContext, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";

import { signInRequest, userMe } from "../services/auth";

type SignInData = {
  email: string;
  password: string;
  recaptcha?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  about: string;
  username: string;
  avatar_url: string;
  website_url: string;
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

    async function loadUserData() {
      if (token) {
        try {
          setToken(token);
          userMe(token)
            .then(response => {
              const userData = response.user || response;
              setUser({
                id: userData.id,
                name: userData.name || userData.username || "User",
                email: userData.email,
                about: userData.about || "",
                username: userData.username,
                avatar_url: userData.avatar_url || "",
                website_url: userData.website_url || ""
              });
            })
            .catch(() => {
              signOut();
            });
        } catch (error) {
          signOut();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []);

  async function signIn({ email, password }: SignInData) {
    const { user, jwt } = await signInRequest({ email, password });

    setCookie(undefined, "nextauth.token", jwt, {
      maxAge: 60 * 60 * 1 // 1 hour
      // maxAge: 60 * 60 * 24 * 1 // 1 day
    });

    setUser(user);
    setToken(jwt);
    Router.push("/dashboard");
  }

  function signOut() {
    setUser(null);
    destroyCookie(undefined, "nextauth.token");
    Router.push("/auth/signin");
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>{children}</AuthContext.Provider>;
}
