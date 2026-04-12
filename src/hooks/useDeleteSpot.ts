import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSpot } from "@/services/deleteSpot";

export function useDeleteSpot() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string | number>({
    mutationFn: deleteSpot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spots"] });
    }
  });
}
