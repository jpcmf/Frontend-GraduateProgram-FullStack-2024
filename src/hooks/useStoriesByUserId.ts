import { useQuery } from "@tanstack/react-query";

import { getStoriesByUserId } from "@/services/getStories";
import type { StoriesResponse } from "@/types/stories";

export function useStoriesByUserId(userId: string) {
  return useQuery<StoriesResponse, Error>({
    queryKey: ["stories", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return getStoriesByUserId(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute — stories expire within 24h
    refetchOnWindowFocus: false
  });
}
