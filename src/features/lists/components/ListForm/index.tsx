import { useEffect,useState } from "react";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";

import type { List, ListType } from "../../types/lists";

interface ListFormProps {
  initialData?: List;
  onSubmit: (data: { title: string; type: ListType }) => Promise<void>;
  isLoading: boolean;
}

export function ListForm({ initialData, onSubmit, isLoading }: ListFormProps) {
  const [title, setTitle] = useState(initialData?.attributes?.title ?? "");
  const [type, setType] = useState<ListType | "">(initialData?.attributes?.type ?? "");
  const [errors, setErrors] = useState<{ title?: string; type?: string }>({});

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line
      setTitle(initialData.attributes.title);
      setType(initialData.attributes.type);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { title?: string; type?: string } = {};
    if (!title.trim()) newErrors.title = "Título é obrigatório";
    if (!type) newErrors.type = "Tipo é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ title: title.trim(), type: type as ListType });
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
      <FormControl isInvalid={!!errors.title}>
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
      <Button type="submit" colorScheme="green" isLoading={isLoading} alignSelf="flex-start">
        Salvar
      </Button>
    </VStack>
  );
}
