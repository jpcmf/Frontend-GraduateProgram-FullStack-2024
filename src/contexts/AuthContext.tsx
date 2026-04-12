import { createContext, useEffect, useState } from "react";
import Router from "next/router";

import { destroyCookie, parseCookies, setCookie } from "nookies";

import { queryClient } from "@/lib/queryClient";
import type { User } from "@/types/User.type";

import { signInRequest, updateUserProfile, userMe } from "../services/auth";

type SignInData = {
  email: string;
  password: string;
  recaptcha?: string;
};

type UpdateUserData = Pick<
  User,
  "id" | "name" | "email" | "username" | "category" | "about" | "website_url" | "instagram_url"
>;

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
  updateUser: (data: UpdateUserData) => Promise<void>;
  token: string | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
  signIn: async () => {},
  signOut: () => {},
  updateUser: async () => {}
});

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
          const response = await userMe(token);
          const userData = response.user || response;
          setUser({
            id: userData.id,
            name: userData.name || userData.username || "User",
            email: userData.email,
            username: userData.username,
            category: userData.category,
            about: userData.about || "",
            website_url: userData.website_url || "",
            instagram_url: userData.instagram_url || "",
            avatar: userData.avatar,
            address: userData.address || {},
            updatedAt: userData.updatedAt,
            blocked: userData.blocked,
            confirmed: userData.confirmed
          });
        } catch {
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

  // Detect cookie removal in all cases:
  // - setInterval: catches expiry or manual deletion while the tab is active
  // - visibilitychange: catches expiry that happened while the tab was in background
  useEffect(() => {
    const checkCookie = () => {
      const { "auth.token": cookieToken } = parseCookies();
      if (!cookieToken && user) {
        setUser(null);
        setToken(null);
        destroyCookie(undefined, "auth.token", { path: "/" });
        Router.push("/auth/signin");
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkCookie();
      }
    };

    const intervalId = setInterval(checkCookie, 5000);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  async function signIn({ email, password }: SignInData) {
    const { user, jwt } = await signInRequest({ email, password });

    setCookie(undefined, "auth.token", jwt, {
      // maxAge: 60 * 10 // 10 minutes
      maxAge: 60 * 60 * 1, // 1 hour
      // maxAge: 60 * 60 * 24 * 1 // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    setUser(user);
    setToken(jwt);
    queryClient.invalidateQueries({ queryKey: ["stories"] });
    Router.push("/");
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
    setToken(null);
    destroyCookie(undefined, "auth.token", { path: "/" });
    queryClient.clear();
    Router.push("/auth/signin");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, token, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
