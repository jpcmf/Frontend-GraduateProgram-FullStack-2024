import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateListItemPayload } from "../services/createListItem";
import { createListItem } from "../services/createListItem";

export function useCreateListItem(listId: string | number) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, CreateListItemPayload>({
    mutationFn: createListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
    }
  });
}
