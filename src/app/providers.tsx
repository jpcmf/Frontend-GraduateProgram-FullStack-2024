"use client";

import { ChakraProvider } from "@chakra-ui/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import QueryProvider from '@/shared/ui/QueryProvider';
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarDrawerProvider } from "@/contexts/SidebarDrawerContext";
import { Layout } from '@/shared/ui/layout/Layout';
import { theme } from "@/shared/lib/theme";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === "true" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    // Capture page views automatically on every Next.js route change.
    capture_pageview: true,
    // Capture page leave events — improves session replay accuracy.
    capture_pageleave: true,
    // Respect the browser's Do Not Track setting.
    respect_dnt: true
  });
}

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PostHogProvider client={posthog}>
      <ErrorBoundary>
        <AuthProvider>
          <ChakraProvider theme={theme}>
            <SidebarDrawerProvider>
              <QueryProvider>
                <Layout>{children}</Layout>
              </QueryProvider>
            </SidebarDrawerProvider>
          </ChakraProvider>
        </AuthProvider>
      </ErrorBoundary>
    </PostHogProvider>
  );
}
