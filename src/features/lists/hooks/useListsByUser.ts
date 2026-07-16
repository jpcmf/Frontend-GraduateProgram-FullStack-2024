import { useQuery } from "@tanstack/react-query";

import { getListsByUser } from "../services/getListsByUser";
import type { ListsResponse } from "../types/lists";

export function useListsByUser(userId: string | number | undefined) {
  return useQuery<ListsResponse, Error>({
    queryKey: ["my-lists", userId],
    queryFn: () => getListsByUser(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5
  });
}
