"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if already authenticated
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return null;
  }

  // Only show auth pages if not authenticated
  if (!user) {
    return <>{children}</>;
  }

  // If authenticated, redirect is already in progress
  return null;
}
