"use client";

import { useMemo } from "react";

import { Box, Button, Flex, Heading, HStack, Spinner, Text, useColorModeValue } from "@chakra-ui/react";

import { LiveDot } from "@/shared/ui/New";

import { useRecentComments } from "../../hooks/useRecentComments";
import type { Comment } from "../../types/comments";
import { FeedCommentCard } from "../FeedCommentCard";

export function RecentCommentsFeed() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError } = useRecentComments();
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const comments = useMemo(() => {
    const seen = new Set<number>();
    const list: Comment[] = [];
    for (const page of data?.pages ?? []) {
      for (const comment of page.data ?? []) {
        if (seen.has(comment.id)) continue;
        seen.add(comment.id);
        list.push(comment);
      }
    }
    return list;
  }, [data]);

  const header = (
    <Flex align="center" justify="space-between" mb={4}>
      <Flex align="center" gap={2}>
        <Heading size="sm">Atividades recentes</Heading>
      </Flex>
      <HStack
        display={{ base: "none", sm: "flex" }}
        spacing={2}
        px={3}
        py={1}
        borderRadius="full"
        bg="surface.raised"
        border="1px solid"
        borderColor="line.subtle"
        fontSize="xs"
        color="content.secondary"
      >
        <LiveDot />
        <Text fontSize="xs" color={mutedColor}>
          Tempo real
        </Text>
      </HStack>
    </Flex>
  );

  if (isLoading) {
    return (
      <Box>
        {header}
        <Flex justify="center" py={8}>
          <Spinner size="lg" color="green.400" />
        </Flex>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center">
        {header}
        <Text size="xs" color={mutedColor}>
          Não foi possível carregar as atividades recentes.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {header}
      {comments.length === 0 ? (
        <Text color={mutedColor}>Nenhuma atividade recente.</Text>
      ) : (
        <Flex flexDir="column" gap={4}>
          {comments.map(comment => (
            <FeedCommentCard key={comment.id} comment={comment} />
          ))}
        </Flex>
      )}

      {comments.length > 0 && hasNextPage && (
        <Button
          mt={6}
          w="full"
          variant="outline"
          colorScheme="gray"
          isLoading={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          Carregar mais atividades do feed
        </Button>
      )}
    </Box>
  );
}
