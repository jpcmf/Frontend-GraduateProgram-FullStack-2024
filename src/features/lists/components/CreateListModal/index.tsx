import { useState } from "react";
import { useRouter } from "next/navigation";

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
  Select,
  useToast,
} from "@chakra-ui/react";

import { useCreateList } from "../../hooks/useCreateList";
import type { ListType } from "../../types/lists";

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateListModal({ isOpen, onClose }: CreateListModalProps) {
  const router = useRouter();
  const toast = useToast();
  const createList = useCreateList();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ListType | "">("");
  const [errors, setErrors] = useState<{ title?: string; type?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; type?: string } = {};
    if (!title.trim()) newErrors.title = "Título é obrigatório";
    if (!type) newErrors.type = "Tipo é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const result = await createList.mutateAsync({ title: title.trim(), type: type as ListType });
      toast({ title: "Lista criada!", status: "success" });
      onClose();
      router.push(`/dashboard/lists/${result.data.id}/edit`);
    } catch {
      toast({ title: "Erro ao criar lista", status: "error" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar Lista</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!errors.title} mb={4}>
            <FormLabel>Título</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Melhores marcas de shape" />
            <FormErrorMessage>{errors.title}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.type}>
            <FormLabel>Tipo</FormLabel>
            <Select value={type} onChange={(e) => setType(e.target.value as ListType)} placeholder="Selecione o tipo">
              <option value="wish">Desejo</option>
              <option value="like">Curti</option>
              <option value="want">Quero</option>
              <option value="recommend">Recomendo</option>
            </Select>
            <FormErrorMessage>{errors.type}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="green" onClick={handleSubmit} isLoading={createList.isPending}>
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
