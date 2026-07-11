import { useRef, useState } from "react";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import { useCreateListItem } from "../../hooks/useCreateListItem";
import { useUpdateListItem } from "../../hooks/useUpdateListItem";
import type { ListItem } from "../../types/lists";

interface ListItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string | number;
  listItem?: ListItem;
}

export function ListItemForm({ isOpen, onClose, listId, listItem }: ListItemFormProps) {
  const toast = useToast();
  const createItem = useCreateListItem(listId);
  const updateItem = useUpdateListItem(listId);
  const isEditing = !!listItem;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(listItem?.attributes?.name ?? "");
  const [description, setDescription] = useState(listItem?.attributes?.description ?? "");
  const [externalUrl, setExternalUrl] = useState(listItem?.attributes?.external_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const validate = () => {
    if (!name.trim()) {
      setErrors({ name: "Nome é obrigatório" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (isEditing) {
        await updateItem.mutateAsync({
          id: listItem.id,
          data: { name: name.trim(), description: description.trim() || undefined, external_url: externalUrl.trim() || undefined },
        });
      } else {
        await createItem.mutateAsync({
          name: name.trim(),
          description: description.trim() || undefined,
          external_url: externalUrl.trim() || undefined,
          list: Number(listId),
          image: imageFile ?? undefined,
        });
      }
      toast({ title: isEditing ? "Item atualizado!" : "Item adicionado!", status: "success" });
      onClose();
    } catch {
      toast({ title: "Erro ao salvar item", status: "error" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? "Editar Item" : "Adicionar Item"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!errors.name} mb={4}>
            <FormLabel>Nome</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Spitfire OG Classic 99A" />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          {!isEditing && (
            <FormControl mb={4}>
              <FormLabel>Imagem</FormLabel>
              <Input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              {imageFile && <Text fontSize="sm" color="gray.400" mt={1}>{imageFile.name}</Text>}
            </FormControl>
          )}
          <FormControl mb={4}>
            <FormLabel>Descrição</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição opcional" />
          </FormControl>
          <FormControl>
            <FormLabel>URL</FormLabel>
            <Input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://..." />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="green" onClick={handleSubmit} isLoading={createItem.isPending || updateItem.isPending}>
            {isEditing ? "Atualizar" : "Adicionar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
