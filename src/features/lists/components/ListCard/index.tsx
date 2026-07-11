import NextLink from "next/link";

import { Badge, Box, Flex, Text, VStack } from "@chakra-ui/react";

import { useColors } from "@/shared/hooks/useColors";

import type { List, ListType } from "../../types/lists";

const TYPE_LABELS: Record<ListType, string> = {
  wish: "Desejo",
  like: "Curti",
  want: "Quero",
  recommend: "Recomendo",
};

const TYPE_COLORS: Record<ListType, string> = {
  wish: "purple",
  like: "green",
  want: "orange",
  recommend: "blue",
};

interface ListCardProps {
  list: List;
}

export function ListCard({ list }: ListCardProps) {
  const { bgColor, textMuted } = useColors();
  const { title, type, items, owner } = list.attributes;
  const itemCount = items?.data?.length ?? 0;
  const creatorName = owner?.data?.attributes?.username ?? "Desconhecido";

  return (
    <Box
      as={NextLink}
      href={`/lists/${list.id}`}
      display="block"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s" }}
      transition="transform 0.2s"
    >
      <VStack align="start" spacing={2} p={4}>
        <Badge colorScheme={TYPE_COLORS[type]} px={2} py={0} borderRadius="full">
          {TYPE_LABELS[type]}
        </Badge>
        <Text fontWeight="semibold" fontSize="md" noOfLines={1}>
          {title}
        </Text>
        <Flex align="center" gap={1}>
          <Text fontSize="sm" color={textMuted}>
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </Text>
          <Text fontSize="sm" color={textMuted}>
            · {creatorName}
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
}
