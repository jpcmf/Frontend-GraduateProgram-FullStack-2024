import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSpot } from "@/services/updateSpot";
import type { SpotResponse, UpdateSpotPayload } from "@/types/spots";

export function useUpdateSpot(id: string | number) {
  const queryClient = useQueryClient();

  return useMutation<SpotResponse, Error, UpdateSpotPayload>({
    mutationFn: payload => updateSpot(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spots"] });
      queryClient.invalidateQueries({ queryKey: ["spots", id] });
    }
  });
}
