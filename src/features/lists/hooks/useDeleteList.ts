import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteList } from "../services/deleteList";

export function useDeleteList() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string | number>({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["my-lists"] });
    }
  });
}
