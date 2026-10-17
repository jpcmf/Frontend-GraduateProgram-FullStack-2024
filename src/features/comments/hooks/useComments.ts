import { useQuery } from "@tanstack/react-query";

import { getComments } from "../services/getComments";
import type { CommentsResponse } from "../types/comments";

export function useComments(spotId: string | number) {
  return useQuery<CommentsResponse, Error>({
    queryKey: ["comments", spotId],
    queryFn: () => getComments(spotId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
}
