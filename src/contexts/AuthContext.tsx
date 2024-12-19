import Router from "next/router";
import { createContext, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";

import { signInRequest, updateUserProfile, userMe } from "../services/auth";

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
  website_url: string;
  avatar: Avatar;
};

type Avatar = {
  url: string;
};

type UpdateUserData = Pick<User, "id" | "name" | "username" | "email" | "about" | "website_url">;

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
  updateUser: (data: UpdateUserData) => Promise<void>;
  token: string | null;
  isLoading: boolean;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "auth.token": token } = parseCookies();

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
                website_url: userData.website_url || "",
                avatar: userData.avatar
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

    setCookie(undefined, "auth.token", jwt, {
      maxAge: 60 * 10 // 10 minutes
      // maxAge: 60 * 60 * 1, // 1 hour
      // maxAge: 60 * 60 * 24 * 1 // 1 day
    });

    setUser(user);
    setToken(jwt);
    Router.push("/dashboard");
  }

  async function updateUser(data: UpdateUserData) {
    if (!user || !token) {
      throw new Error("No authenticated user.");
    }

    const updatedUser = await updateUserProfile(token, data);
    setUser(prevUser => (prevUser ? { ...prevUser, ...updatedUser } : null));
  }

  function signOut() {
    setUser(null);
    setToken("");
    destroyCookie(undefined, "auth.token");
    Router.push("/auth/signin");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, token, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
