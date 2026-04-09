import { useContext } from "react";

import { AuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx.signIn) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
