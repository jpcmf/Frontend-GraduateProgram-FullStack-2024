import { useRef, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Input,
  Select,
  Text,
  Textarea,
  VStack
} from "@chakra-ui/react";

import { apiClient } from "@/lib/apiClient";
import type { CreateSpotPayload, SpotType } from "@/types/spots";

interface SpotFormProps {
  initialValues?: Partial<CreateSpotPayload>;
  onSubmit: (payload: CreateSpotPayload) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

type FormErrors = Partial<Record<keyof CreateSpotPayload, string>>;

export function SpotForm({ initialValues, onSubmit, isSubmitting, submitLabel }: SpotFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [type, setType] = useState<SpotType>(initialValues?.type ?? "street");
  const [address, setAddress] = useState(initialValues?.address ?? "");
  const [photoIds, setPhotoIds] = useState<number[]>(initialValues?.photos ?? []);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "Nome é obrigatório.";
    if (!type) next.type = "Tipo é obrigatório.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));
      const res = await apiClient.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const uploaded: Array<{ id: number; url: string }> = res.data;
      setPhotoIds(prev => [...prev, ...uploaded.map(u => u.id)]);
      setPhotoPreviews(prev => [...prev, ...uploaded.map(u => u.url)]);
    } catch {
      setUploadError("Falha no upload das fotos. Tente novamente.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      type,
      address: address.trim() || undefined,
      photos: photoIds.length > 0 ? photoIds : undefined
    });
  }

  return (
    <Box as="form" onSubmit={handleSubmit} w="100%">
      <VStack spacing={5} align="stretch">
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel>Nome</FormLabel>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Praça da Sé" />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.type} isRequired>
          <FormLabel>Tipo</FormLabel>
          <Select value={type} onChange={e => setType(e.target.value as SpotType)}>
            <option value="street">Street</option>
            <option value="skatepark">Skatepark</option>
            <option value="diy">DIY</option>
            <option value="plaza">Plaza</option>
            <option value="other">Other</option>
          </Select>
          <FormErrorMessage>{errors.type}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Endereço</FormLabel>
          <Input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Ex: Av. Paulista, 1578 - São Paulo"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Descrição</FormLabel>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descreva o spot..."
            rows={4}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Fotos</FormLabel>
          <Input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} display="none" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            loadingText="Enviando..."
          >
            Adicionar fotos
          </Button>
          {uploadError && (
            <Text color="red.400" fontSize="sm" mt={2}>
              {uploadError}
            </Text>
          )}
          {photoPreviews.length > 0 && (
            <HStack mt={3} spacing={2} flexWrap="wrap">
              {photoPreviews.map((src, i) => (
                <Image key={i} src={src} alt={`preview-${i}`} boxSize="80px" objectFit="cover" borderRadius="md" />
              ))}
            </HStack>
          )}
        </FormControl>

        <Button type="submit" colorScheme="green" isLoading={isSubmitting} loadingText="Salvando...">
          {submitLabel}
        </Button>
      </VStack>
    </Box>
  );
}
