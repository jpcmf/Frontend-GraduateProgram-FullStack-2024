import NextImage from "next/image";
import NextLink from "next/link";

import { Avatar, Box, Button, Flex, Grid, HStack, Text } from "@chakra-ui/react";

import { useColors } from "@/shared/hooks/useColors";
import { formatTimeAgo } from "@/shared/lib/date";

import type { Comment } from "../../types/comments";
import { ReactionButton } from "../ReactionButton";

type CommentCardProps = {
  comment: Comment;
  currentUserId: string | number | null;
  isReacting: boolean;
  showSpotLink?: boolean;
  truncateText?: boolean;
  isHighlighted?: boolean;
  onToggleReaction: (commentId: number) => void;
  onEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
};

export function CommentCard({
  comment,
  currentUserId,
  isReacting,
  showSpotLink = false,
  truncateText = false,
  isHighlighted = false,
  onToggleReaction,
  onEdit,
  onDelete
}: CommentCardProps) {
  const { textSecondary } = useColors();
  const { text, author, images, spot, createdAt, updatedAt } = comment.attributes;

  const isOwn = !!author?.data && currentUserId != null && String(author.data.id) === String(currentUserId);
  const isEdited = createdAt !== updatedAt;
  const spotName = spot?.data?.attributes.name;

  const authorName = author?.data?.attributes.name || author?.data?.attributes.username || "Desconhecido";
  const authorAvatar =
    author?.data?.attributes.avatar?.data?.attributes.formats?.thumbnail?.url ??
    author?.data?.attributes.avatar?.data?.attributes.url ??
    undefined;
  const commentImages = images?.data ?? [];

  return (
    <Box
      id={`comment-${comment.id}`}
      bg={isHighlighted ? "green.50" : "transparent"}
      _dark={{ bg: isHighlighted ? "green.900" : "transparent" }}
      borderRadius="md"
      p={isHighlighted ? 3 : 2}
      w="full"
    >
      <HStack align="start" spacing={3} w="full">
        <Avatar size="sm" name={authorName} src={authorAvatar} />
        <Box flex="1" minW={0}>
          <HStack spacing={2} align="baseline">
            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
              {authorName}
            </Text>
            <Text fontSize="xs" color={textSecondary} noOfLines={1}>
              {formatTimeAgo(isEdited ? updatedAt : createdAt)}
              {isEdited && (
                <Text as="span" fontStyle="italic">
                  {" "}
                  · editado
                </Text>
              )}
            </Text>
          </HStack>

          {showSpotLink && spotName && spot?.data && (
            <NextLink href={`/spots/${spot.data.id}#comment-${comment.id}`} passHref>
              <Text fontSize="xs" color="green.500" _dark={{ color: "green.400" }} fontWeight="semibold" mt={0.5}>
                {spotName}
              </Text>
            </NextLink>
          )}

          <Text fontSize="sm" wordBreak="break-word" mt={1} noOfLines={truncateText ? 3 : undefined}>
            {text}
          </Text>

          {commentImages.length > 0 && (
            <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={2} mt={2}>
              {commentImages.map(image => (
                <Box key={image.id} position="relative" h="100px" borderRadius="md" overflow="hidden">
                  <NextImage
                    src={image.attributes.url}
                    alt={`${authorName} — comentário`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 120px, 160px"
                  />
                </Box>
              ))}
            </Grid>
          )}

          <Flex align="center" gap={1} mt={2}>
            <ReactionButton
              comment={comment}
              currentUserId={currentUserId}
              isLoading={isReacting}
              onToggle={onToggleReaction}
            />
            {isOwn && (
              <>
                <Button size="sm" variant="ghost" onClick={() => onEdit(comment.id)} px={2}>
                  Editar
                </Button>
                <Button size="sm" variant="ghost" colorScheme="red" onClick={() => onDelete(comment.id)} px={2}>
                  Excluir
                </Button>
              </>
            )}
          </Flex>
        </Box>
      </HStack>
    </Box>
  );
}
