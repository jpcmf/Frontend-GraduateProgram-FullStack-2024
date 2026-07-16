import { RiDeleteBinLine, RiEditLine, RiExternalLinkLine } from "react-icons/ri";
import NextImage from "next/image";

import { Box, Button, Flex, Icon, Text, VStack } from "@chakra-ui/react";

import { useColors } from "@/shared/hooks/useColors";

import type { ListItem } from "../../types/lists";

interface ListItemListProps {
  items: ListItem[];
  onEdit: (item: ListItem) => void;
  onDelete: (item: ListItem) => void;
}

export function ListItemList({ items, onEdit, onDelete }: ListItemListProps) {
  const { cardBg } = useColors();

  return (
    <VStack spacing={3} align="stretch">
      {items.map(item => {
        const imageUrl =
          item.attributes.image?.data?.attributes?.formats?.thumbnail?.url ??
          item.attributes.image?.data?.attributes?.url ??
          null;
        return (
          <Flex key={item.id} bg={cardBg} borderRadius="lg" p={4} align="center" gap={4}>
            {imageUrl && (
              <Box position="relative" w="60px" h="60px" flexShrink={0} borderRadius="md" overflow="hidden">
                <NextImage src={imageUrl} alt={item.attributes.name} fill style={{ objectFit: "cover" }} sizes="60px" />
              </Box>
            )}
            <Box flex={1}>
              <Text fontWeight="semibold">{item.attributes.name}</Text>
              {item.attributes.external_url && (
                <Flex
                  as="a"
                  href={item.attributes.external_url}
                  target="_blank"
                  align="center"
                  gap={1}
                  color="green.400"
                  fontSize="sm"
                  mt={1}
                >
                  <Icon as={RiExternalLinkLine} />
                  <Text textDecoration="underline">Link</Text>
                </Flex>
              )}
            </Box>
            <Flex gap={2}>
              <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>
                <Icon as={RiEditLine} />
              </Button>
              <Button size="sm" variant="ghost" colorScheme="red" onClick={() => onDelete(item)}>
                <Icon as={RiDeleteBinLine} />
              </Button>
            </Flex>
          </Flex>
        );
      })}
    </VStack>
  );
}
