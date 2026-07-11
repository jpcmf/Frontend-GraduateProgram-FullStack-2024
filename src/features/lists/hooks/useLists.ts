import { useQuery } from "@tanstack/react-query";

import { getLists } from "../services/getLists";
import type { ListsResponse } from "../types/lists";

export function useLists() {
  return useQuery<ListsResponse, Error>({
    queryKey: ["lists"],
    queryFn: getLists,
    staleTime: 1000 * 60 * 5,
  });
}
