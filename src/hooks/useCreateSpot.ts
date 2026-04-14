import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSpot } from "@/services/createSpot";
import type { CreateSpotPayload, SpotResponse } from "@/types/spots";

export function useCreateSpot() {
  const queryClient = useQueryClient();

  return useMutation<SpotResponse, Error, CreateSpotPayload>({
    mutationFn: createSpot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spots"] });
    }
  });
}
