import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateListItem } from "../services/updateListItem";
import type { UpdateListItemPayload } from "../types/lists";

export function useUpdateListItem(listId: string | number) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string | number; data: UpdateListItemPayload }>({
    mutationFn: ({ id, data }) => updateListItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
    },
  });
}
