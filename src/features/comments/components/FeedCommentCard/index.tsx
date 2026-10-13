import { RiHeartLine } from "react-icons/ri";
import { TbMapPin } from "react-icons/tb";
import NextImage from "next/image";
import NextLink from "next/link";

import { Avatar, Badge, Box, Flex, Grid, HStack, Text, useColorModeValue } from "@chakra-ui/react";

import { formatTimeAgo } from "@/shared/lib/date";
import { Muted } from "@/shared/ui/New/Muted";
import { Panel } from "@/shared/ui/New/Panel";

import type { Comment } from "../../types/comments";

type FeedCommentCardProps = {
  comment: Comment;
};

export function FeedCommentCard({ comment }: FeedCommentCardProps) {
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const { text, author, images, spot, createdAt } = comment.attributes;

  const authorName = author?.data?.attributes.name || author?.data?.attributes.username || "Desconhecido";
  const categoryName = author?.data?.attributes.category?.data?.attributes.name;
  const authorAvatar =
    author?.data?.attributes.avatar?.data?.attributes.formats?.thumbnail?.url ??
    author?.data?.attributes.avatar?.data?.attributes.url ??
    undefined;
  const spotName = spot?.data?.attributes.name;
  const spotId = spot?.data?.id;
  const commentImages = images?.data ?? [];
  const reactionCount = comment.attributes.reactions?.data?.length ?? 0;

  return (
    <Panel>
      <Flex flexDir="column" gap={3}>
        <HStack align="center" spacing={3}>
          <Avatar size="md" name={authorName} src={authorAvatar} />
          <Box>
            <HStack spacing={2} align="center">
              <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                {authorName}
              </Text>
              {categoryName && (
                <Badge
                  variant="role"
                  color="green.400"
                  fontSize="10px"
                  fontWeight="medium"
                  px={1.5}
                  py={0.5}
                  borderRadius="md"
                >
                  {categoryName}
                </Badge>
              )}
            </HStack>
            <Muted fontSize="xs">{formatTimeAgo(createdAt)}</Muted>
          </Box>
        </HStack>

        <Text fontSize="sm" wordBreak="break-word" noOfLines={3}>
          {text}
        </Text>

        {commentImages.length > 0 && (
          <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={2}>
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

        {spotName && spotId && (
          <NextLink href={`/spots/${spotId}#comment-${comment.id}`} passHref>
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              gap={1.5}
              px={2.5}
              py={1}
              borderRadius="md"
              // bg={badgeBg}
              fontSize="sm"
              fontWeight="medium"
              color="green.400"
              cursor="pointer"
              _hover={{ color: "green.300" }}
            >
              <TbMapPin />
              <Text as="span">{spotName}</Text>
            </Box>
          </NextLink>
        )}

        <Flex
          pt={2.5}
          borderTop="1px solid"
          borderTopColor="gray.800"
          align="center"
          justifyContent="space-between"
          fontSize="xs"
        >
          <Flex align="center" gap={1.5}>
            <RiHeartLine color="content.muted" />
            <Muted>{reactionCount}</Muted>
          </Flex>
        </Flex>
      </Flex>
    </Panel>
  );
}
