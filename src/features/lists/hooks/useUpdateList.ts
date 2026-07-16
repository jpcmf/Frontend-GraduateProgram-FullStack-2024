import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateList } from "../services/updateList";
import type { ListResponse, UpdateListPayload } from "../types/lists";

export function useUpdateList(id: string | number) {
  const queryClient = useQueryClient();
  return useMutation<ListResponse, Error, UpdateListPayload>({
    mutationFn: payload => updateList(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["my-lists"] });
      queryClient.invalidateQueries({ queryKey: ["lists", id] });
    }
  });
}
