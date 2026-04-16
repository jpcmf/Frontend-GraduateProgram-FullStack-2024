"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import QueryProvider from "@/components/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarDrawerProvider } from "@/contexts/SidebarDrawerContext";
import { Layout } from "@/shared/components/Layout";
import { theme } from "@/styles/theme";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
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
  );
}
