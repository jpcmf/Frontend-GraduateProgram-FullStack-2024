import { useInfiniteQuery } from "@tanstack/react-query";

import { getRecentComments } from "../services/getRecentComments";
import type { CommentsResponse } from "../types/comments";

export const RECENT_COMMENTS_PAGE_SIZE = 10;

export function useRecentComments() {
  return useInfiniteQuery<CommentsResponse, Error>({
    queryKey: ["recent-comments"],
    queryFn: ({ pageParam }) => getRecentComments(Number(pageParam), RECENT_COMMENTS_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const loadedCount = allPages.reduce((sum, page) => sum + page.data.length, 0);
      const total = lastPage.meta.pagination.total;
      if (loadedCount >= total) return undefined;
      return Number(lastPageParam) + 1;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
}
