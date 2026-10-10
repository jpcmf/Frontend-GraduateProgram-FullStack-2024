import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteComment } from "../services/deleteComment";

export function useDeleteComment(spotId: string | number) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string | number>({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", spotId] });
      queryClient.invalidateQueries({ queryKey: ["recent-comments"] });
    }
  });
}
