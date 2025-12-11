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
    enabled: !!userId, // only fetch when userId is defined
    staleTime: 1000 * 60 * 5, // consider data fresh for 5 minutes
    refetchOnWindowFocus: false
  });
}
