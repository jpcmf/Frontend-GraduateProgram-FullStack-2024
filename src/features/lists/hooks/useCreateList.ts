import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createList } from "../services/createList";
import type { CreateListPayload, ListResponse } from "../types/lists";

export function useCreateList() {
  const queryClient = useQueryClient();
  return useMutation<ListResponse, Error, CreateListPayload>({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["my-lists"] });
    },
  });
}
