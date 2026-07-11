"use client";

import { useMemo, useState } from "react";

import { Box, Button, Flex, Grid, HStack, Spinner, Tag, TagLabel, Text, useDisclosure } from "@chakra-ui/react";

import type { ListType } from "@/features/lists";
import { CreateListModal, ListCard, useLists } from "@/features/lists";
import { useAuth } from "@/shared/hooks/useAuth";
import { TitleSection } from "@/shared/ui/TitleSection";

const TYPE_FILTERS: Array<{ label: string; value: ListType | "all" }> = [
  { label: "Todas", value: "all" },
  { label: "Desejo", value: "wish" },
  { label: "Curti", value: "like" },
  { label: "Quero", value: "want" },
  { label: "Recomendo", value: "recommend" },
];

export default function ListsPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useLists();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeFilter, setActiveFilter] = useState<ListType | "all">("all");

  const filteredLists = useMemo(() => {
    if (!data?.data) return [];
    if (activeFilter === "all") return data.data;
    return data.data.filter((list) => list.attributes.type === activeFilter);
  }, [data, activeFilter]);

  return (
    <Box position="relative">
      <TitleSection title="Listas" />
      <Box width="100%">
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
          <HStack spacing={2}>
            {TYPE_FILTERS.map((filter) => (
              <Tag
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                cursor="pointer"
                colorScheme={activeFilter === filter.value ? "green" : "gray"}
                variant={activeFilter === filter.value ? "solid" : "outline"}
                borderRadius="full"
                px={3}
                py={1}
              >
                <TagLabel>{filter.label}</TagLabel>
              </Tag>
            ))}
          </HStack>
          {user && (
            <Button colorScheme="green" size="sm" onClick={onOpen}>
              Criar Lista
            </Button>
          )}
        </Flex>

        {isLoading && (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="lg" color="green.400" />
          </Flex>
        )}

        {isError && (
          <Flex justify="center" align="center" minH="300px">
            <Text color="red.400">Erro ao carregar listas. Tente novamente.</Text>
          </Flex>
        )}

        {!isLoading && !isError && (
          <>
            {filteredLists.length === 0 ? (
              <Text color="gray.400" textAlign="center" mt={12}>
                {activeFilter === "all"
                  ? "Nenhuma lista encontrada. Seja o primeiro a criar!"
                  : "Nenhuma lista com esse filtro."}
              </Text>
            ) : (
              <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                {filteredLists.map((list) => (
                  <ListCard key={list.id} list={list} />
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>

      <CreateListModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
