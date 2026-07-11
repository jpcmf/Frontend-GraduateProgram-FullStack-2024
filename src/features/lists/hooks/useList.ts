import { useQuery } from "@tanstack/react-query";

import { getListById } from "../services/getListById";
import type { ListResponse } from "../types/lists";

export function useList(id: string | number | undefined) {
  return useQuery<ListResponse, Error>({
    queryKey: ["lists", id],
    queryFn: () => getListById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
