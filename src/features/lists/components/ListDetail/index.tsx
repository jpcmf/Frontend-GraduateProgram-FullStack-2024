import { RiDeleteBinLine, RiEditLine, RiExternalLinkLine } from "react-icons/ri";
import NextImage from "next/image";
import NextLink from "next/link";

import { Badge, Box, Button, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";

import { useAuth } from "@/shared/hooks/useAuth";
import { useColors } from "@/shared/hooks/useColors";

import { useDeleteList } from "../../hooks/useDeleteList";
import type { List, ListItem, ListType } from "../../types/lists";

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

interface ListDetailProps {
  list: List;
  onDelete?: () => void;
}

export function ListDetail({ list, onDelete }: ListDetailProps) {
  const { user } = useAuth();
  const { textMuted } = useColors();
  const deleteList = useDeleteList();
  const { title, type, items, owner } = list.attributes;
  const itemCount = items?.data?.length ?? 0;

  const isOwner = user && owner?.data?.id
    ? String(user.id) === String(owner.data.id)
    : false;

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta lista?")) {
      await deleteList.mutateAsync(list.id);
      onDelete?.();
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <Box>
          <Badge colorScheme={TYPE_COLORS[type]} px={3} py={1} borderRadius="full" mb={2}>
            {TYPE_LABELS[type]}
          </Badge>
          <Heading size="lg">{title}</Heading>
          <Flex align="center" gap={2} mt={1}>
            <Text fontSize="sm" color={textMuted}>
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </Text>
            {owner?.data && (
              <Text fontSize="sm" color={textMuted}>
                · por{" "}
                <Box as={NextLink} href={`/skatistas/${owner.data.attributes.username}`} color="green.400" _hover={{ textDecoration: "underline" }}>
                  {owner.data.attributes.username}
                </Box>
              </Text>
            )}
          </Flex>
        </Box>
        {isOwner && (
          <Flex gap={2}>
            <Button as={NextLink} href={`/dashboard/lists/${list.id}/edit`} leftIcon={<Icon as={RiEditLine} />} size="sm" colorScheme="green" variant="outline">
              Editar
            </Button>
            <Button leftIcon={<Icon as={RiDeleteBinLine} />} size="sm" colorScheme="red" variant="outline" onClick={handleDelete} isLoading={deleteList.isPending}>
              Excluir
            </Button>
          </Flex>
        )}
      </Flex>

      {items?.data && items.data.length > 0 ? (
        <VStack spacing={4} align="stretch">
          {items.data.map((item) => (
            <ListItemRow key={item.id} item={item} />
          ))}
        </VStack>
      ) : (
        <Text color={textMuted} textAlign="center" py={12}>
          Nenhum item nesta lista ainda.
        </Text>
      )}
    </Box>
  );
}

function ListItemRow({ item }: { item: ListItem }) {
  const { cardBg, textMuted } = useColors();
  const { name, description, external_url, image } = item.attributes;
  const imageUrl = image?.data?.attributes?.formats?.thumbnail?.url ?? image?.data?.attributes?.url ?? null;

  return (
    <Flex
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      gap={4}
      p={4}
      align="center"
    >
      {imageUrl && (
        <Box position="relative" w="80px" h="80px" flexShrink={0} borderRadius="md" overflow="hidden">
          <NextImage src={imageUrl} alt={name} fill style={{ objectFit: "cover" }} sizes="80px" />
        </Box>
      )}
      <Box flex={1}>
        <Text fontWeight="semibold">{name}</Text>
        {description && (
          <Text fontSize="sm" color={textMuted} noOfLines={2}>
            {description}
          </Text>
        )}
        {external_url && (
          <Flex as={NextLink} href={external_url} target="_blank" align="center" gap={1} mt={1} color="green.400" fontSize="sm">
            <Icon as={RiExternalLinkLine} />
            <Text textDecoration="underline">Ver original</Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
