"use client";

import { RiDeleteBinLine, RiEditLine } from "react-icons/ri";
import NextLink from "next/link";

import { Box, Button, Flex, Grid, Icon, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";

import { CreateListModal, ListCard, useDeleteList, useListsByUser } from "@/features/lists";
import { useAuth } from "@/shared/hooks/useAuth";
import { useColors } from "@/shared/hooks/useColors";
import { TitleSection } from "@/shared/ui/TitleSection";

export default function ListsPage() {
  const { user } = useAuth();
  const { textMuted } = useColors();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading } = useListsByUser(user?.id);
  const deleteList = useDeleteList();

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta lista?")) return;
    try {
      await deleteList.mutateAsync(id);
      toast({ title: "Lista excluída", status: "success" });
    } catch {
      toast({ title: "Erro ao excluir lista", status: "error" });
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <TitleSection title="Minhas Listas" size="md" />
        <Button as={NextLink} href="/lists/new" colorScheme="green" size="sm">
          Criar Coleção
        </Button>
      </Flex>

      {data?.data && data.data.length > 0 ? (
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
          {data.data.map(list => (
            <Box key={list.id} position="relative">
              <ListCard list={list} />
              <Flex position="absolute" top={2} right={2} gap={1}>
                <Button
                  as={NextLink}
                  href={`/lists/${list.id}/edit`}
                  size="xs"
                  variant="solid"
                  colorScheme="whiteAlpha"
                >
                  <Icon as={RiEditLine} />
                </Button>
                <Button size="xs" variant="solid" colorScheme="red" onClick={() => handleDelete(list.id)}>
                  <Icon as={RiDeleteBinLine} />
                </Button>
              </Flex>
            </Box>
          ))}
        </Grid>
      ) : (
        <Text color={textMuted} textAlign="center" py={12}>
          Você ainda não criou nenhuma lista.
        </Text>
      )}

      <CreateListModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
