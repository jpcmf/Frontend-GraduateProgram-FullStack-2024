import { useMutation, useQueryClient } from "@tanstack/react-query";

import { upsertReaction } from "../services/upsertReaction";
import type { CommentsResponse, Reaction } from "../types/comments";

export type UpsertReactionInput = {
  commentId: string | number;
  currentUserId: string | number;
};

function toggleReactionInCache(
  cache: CommentsResponse | undefined,
  commentId: string | number,
  currentUserId: string | number
): CommentsResponse | undefined {
  if (!cache) return cache;

  const data = cache.data.map(comment => {
    if (String(comment.id) !== String(commentId)) return comment;

    const reactions = comment.attributes.reactions?.data ?? [];
    const hasReacted = reactions.some(
      reaction => reaction.attributes.user?.data && String(reaction.attributes.user.data.id) === String(currentUserId)
    );

    const nextReactions: Reaction[] = hasReacted
      ? reactions.filter(
          reaction =>
            !(reaction.attributes.user?.data && String(reaction.attributes.user.data.id) === String(currentUserId))
        )
      : [
          ...reactions,
          {
            id: -1, // placeholder — replaced on refetch after invalidation
            attributes: {
              type: "heart",
              user: {
                data: {
                  id: Number(currentUserId),
                  attributes: { username: "", name: "" }
                }
              }
            }
          }
        ];

    return {
      ...comment,
      attributes: {
        ...comment.attributes,
        reactions: { data: nextReactions }
      }
    };
  });

  return { ...cache, data };
}

export function useUpsertReaction(spotId: string | number) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpsertReactionInput, { previous?: CommentsResponse }>({
    mutationFn: ({ commentId }) => upsertReaction(commentId),
    onMutate: async ({ commentId, currentUserId }) => {
      const queryKey = ["comments", spotId];
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<CommentsResponse>(queryKey);
      queryClient.setQueryData<CommentsResponse>(queryKey, cache =>
        toggleReactionInCache(cache, commentId, currentUserId)
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["comments", spotId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", spotId] });
      queryClient.invalidateQueries({ queryKey: ["recent-comments"] });
    }
  });
}
