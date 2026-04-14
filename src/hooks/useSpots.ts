import { useQuery } from "@tanstack/react-query";

import { getSpots } from "@/services/getSpots";
import type { SpotsResponse } from "@/types/spots";

export function useSpots() {
  return useQuery<SpotsResponse, Error>({
    queryKey: ["spots"],
    queryFn: getSpots,
    staleTime: 1000 * 60 * 5
  });
}
