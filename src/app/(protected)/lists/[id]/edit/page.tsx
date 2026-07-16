"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";

import { Box, Button, Flex, Heading, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";

import type { ListItem, ListType } from "@/features/lists";
import { ListForm, ListItemForm, ListItemList, useDeleteListItem, useList, useUpdateList } from "@/features/lists";
import { useAuth } from "@/shared/hooks/useAuth";
import { useColors } from "@/shared/hooks/useColors";
import { TitleSection } from "@/shared/ui/TitleSection";

type EditListPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditListPage(props: EditListPageProps) {
  const params = use(props.params);
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { id } = params;
  const { cardBg } = useColors();
  const { data, isLoading } = useList(id);
  const updateList = useUpdateList(id);
  const deleteListItem = useDeleteListItem(id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<ListItem | undefined>();

  const handleSaveList = async (formData: { title: string; type: ListType }) => {
    try {
      await updateList.mutateAsync(formData);
      toast({ title: "Lista atualizada!", status: "success" });
    } catch {
      toast({ title: "Erro ao atualizar lista", status: "error" });
    }
  };

  const handleEditItem = (item: ListItem) => {
    setEditingItem(item);
    onOpen();
  };

  const handleDeleteItem = async (item: ListItem) => {
    if (!window.confirm(`Excluir "${item.attributes.name}"?`)) return;
    try {
      await deleteListItem.mutateAsync(item.id);
      toast({ title: "Item excluído", status: "success" });
    } catch {
      toast({ title: "Erro ao excluir item", status: "error" });
    }
  };

  const handleAddNewItem = () => {
    setEditingItem(undefined);
    onOpen();
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  if (!data?.data) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Text color="red.400">Lista não encontrada.</Text>
      </Flex>
    );
  }

  const list = data.data;
  const ownerId = list.attributes.owner?.data?.id;
  const isOwner = user && ownerId ? String(user.id) === String(ownerId) : false;

  if (!isOwner) {
    router.push("/lists");
    return null;
  }
  const items = list.attributes.items?.data ?? [];

  return (
    <Box>
      <TitleSection title="Editar Lista" />

      <Box bg={cardBg} borderRadius="lg" p={6} mb={6}>
        <Heading size="sm" mb={4}>
          Informações da Lista
        </Heading>
        <ListForm initialData={list} onSubmit={handleSaveList} isLoading={updateList.isPending} />
      </Box>

      <Box bg={cardBg} borderRadius="lg" p={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="sm">Itens ({items.length})</Heading>
          <Button size="sm" colorScheme="green" onClick={handleAddNewItem}>
            Adicionar Item
          </Button>
        </Flex>

        {items.length > 0 ? (
          <ListItemList items={items} onEdit={handleEditItem} onDelete={handleDeleteItem} />
        ) : (
          <Text color="gray.400" textAlign="center" py={8}>
            Nenhum item ainda. Clique em "Adicionar Item" para começar.
          </Text>
        )}
      </Box>

      <ListItemForm isOpen={isOpen} onClose={onClose} listId={id} listItem={editingItem} />
    </Box>
  );
}
