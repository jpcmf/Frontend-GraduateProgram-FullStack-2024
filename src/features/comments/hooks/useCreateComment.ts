import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createComment } from "../services/createComment";
import type { Comment, CreateCommentInput } from "../types/comments";

export function useCreateComment(spotId: string | number) {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, CreateCommentInput>({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", spotId] });
      queryClient.invalidateQueries({ queryKey: ["recent-comments"] });
    }
  });
}
