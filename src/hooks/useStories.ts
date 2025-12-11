import { useQuery } from "@tanstack/react-query";

import { getStories } from "@/services/getStories";
import type { StoriesResponse } from "@/types/stories";

export function useStories() {
  return useQuery<StoriesResponse, Error>({
    queryKey: ["stories"],
    queryFn: () => {
      return getStories();
    },
    staleTime: 1000 * 60 * 5, // consider data fresh for 5 minutes
    refetchOnWindowFocus: false
  });
}
