import { QueryClient } from "@tanstack/react-query";

/**
 * Singleton QueryClient instance shared across the app.
 *
 * Exporting it here lets modules outside the React tree (e.g. AuthContext,
 * which lives above QueryClientProvider in the provider hierarchy) call
 * queryClient.invalidateQueries() or queryClient.clear() directly.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: unknown) => {
        if ((error as { response?: { status?: number } })?.response?.status === 401) return false;
        return failureCount < 2;
      }
    }
  }
});
