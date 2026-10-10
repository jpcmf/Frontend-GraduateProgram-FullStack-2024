import { RiHeartLine } from "react-icons/ri";
import { TbMapPin } from "react-icons/tb";
import NextImage from "next/image";
import NextLink from "next/link";

import { Avatar, Badge, Box, Flex, Grid, HStack, Text, useColorModeValue } from "@chakra-ui/react";

import { useColors } from "@/shared/hooks/useColors";
import { formatTimeAgo } from "@/shared/lib/date";

import type { Comment } from "../../types/comments";

type FeedCommentCardProps = {
  comment: Comment;
};

export function FeedCommentCard({ comment }: FeedCommentCardProps) {
  const { textSecondary, textPrimary, border } = useColors();
  const cardBg = useColorModeValue("blackAlpha.100", "gray.800");
  const badgeBg = useColorModeValue("gray.100", "gray.700");
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
    <Flex
      flexDir="column"
      gap={3}
      bg={cardBg}
      // border="1px solid"
      // borderColor={border}
      borderRadius="lg"
      p={4}
      shadow="sm"
    >
      <HStack align="center" spacing={3}>
        <Avatar size="md" name={authorName} src={authorAvatar} />
        <Box>
          <HStack spacing={2} align="center">
            <Text fontSize="sm" fontWeight="bold" color={textPrimary} noOfLines={1}>
              {authorName}
            </Text>
            {categoryName && (
              <Badge
                variant="subtle"
                bg={badgeBg}
                color="green.400"
                fontSize="10px"
                fontWeight="medium"
                px={1.5}
                py={0.5}
                borderRadius="md"
                border="1px solid"
                borderColor={border}
              >
                {categoryName}
              </Badge>
            )}
          </HStack>
          <Text fontSize="xs" color={mutedColor}>
            {formatTimeAgo(createdAt)}
          </Text>
        </Box>
      </HStack>

      <Text fontSize="sm" color={textPrimary} wordBreak="break-word" noOfLines={3}>
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
            bg={badgeBg}
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
        borderTopColor="gray.700"
        align="center"
        justifyContent="space-between"
        fontSize="xs"
        color={mutedColor}
      >
        <Flex align="center" gap={1.5}>
          <RiHeartLine />
          <Text as="span">{reactionCount}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
