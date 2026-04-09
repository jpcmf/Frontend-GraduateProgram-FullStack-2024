// components/QueryProvider.js
"use client"; // Mark this as a Client Component

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: (failureCount, error: any) => {
              if (error?.response?.status === 401) return false;
              return failureCount < 2;
            }
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
