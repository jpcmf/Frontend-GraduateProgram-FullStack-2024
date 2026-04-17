"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Flex, Spinner } from "@chakra-ui/react";

import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to signin if not authenticated and loading is complete
    if (!isLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, isLoading, router]);

  // Show spinner while loading
  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  // Only show content if user is authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
