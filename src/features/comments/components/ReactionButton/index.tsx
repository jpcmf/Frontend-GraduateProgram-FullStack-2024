import { RiHeartFill, RiHeartLine } from "react-icons/ri";

import { Button, useColorModeValue } from "@chakra-ui/react";

import type { Comment } from "../../types/comments";

type ReactionButtonProps = {
  comment: Comment;
  currentUserId: string | number | null;
  isLoading?: boolean;
  onToggle: (commentId: number) => void;
};

export function ReactionButton({ comment, currentUserId, isLoading = false, onToggle }: ReactionButtonProps) {
  const reactions = comment.attributes.reactions?.data ?? [];
  const isAuthenticated = currentUserId != null;
  const hasReacted = reactions.some(
    reaction => reaction.attributes.user?.data && String(reaction.attributes.user.data.id) === String(currentUserId)
  );
  const count = reactions.length;
  const reactedColor = useColorModeValue("green.600", "green.400");

  return (
    <Button
      size="sm"
      variant="ghost"
      leftIcon={hasReacted ? <RiHeartFill color={reactedColor} /> : <RiHeartLine />}
      isDisabled={!isAuthenticated}
      isLoading={isLoading}
      onClick={() => onToggle(comment.id)}
      px={2}
    >
      {count}
    </Button>
  );
}
