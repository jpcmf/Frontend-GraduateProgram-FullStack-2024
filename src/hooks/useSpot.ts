import { useQuery } from "@tanstack/react-query";

import { getSpotById } from "@/services/getSpotById";
import type { SpotResponse } from "@/types/spots";

export function useSpot(id: string | number | undefined) {
  return useQuery<SpotResponse, Error>({
    queryKey: ["spots", id],
    queryFn: () => getSpotById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  });
}
