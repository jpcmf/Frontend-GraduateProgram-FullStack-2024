import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateComment } from "../services/updateComment";
import type { Comment, UpdateCommentInput } from "../types/comments";

type UpdateCommentMutationInput = {
  commentId: string | number;
  input: UpdateCommentInput;
};

export function useUpdateComment(spotId: string | number) {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, UpdateCommentMutationInput>({
    mutationFn: ({ commentId, input }) => updateComment(commentId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", spotId] });
      queryClient.invalidateQueries({ queryKey: ["recent-comments"] });
    }
  });
}
