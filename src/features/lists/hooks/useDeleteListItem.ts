import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteListItem } from "../services/deleteListItem";

export function useDeleteListItem(listId: string | number) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string | number>({
    mutationFn: deleteListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
    }
  });
}
