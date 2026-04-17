"use client";

import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RiAlertLine } from "react-icons/ri";

import { Box, Button, Flex, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { apiClient } from "@/lib/apiClient";
import { SPOT_VALIDATION_MESSAGES as MSG, SPOT_VALIDATION_RULES as RULES } from "@/lib/const/spotValidation";
import { Input } from "@/shared/components/Form/Input";
import { Select } from "@/shared/components/Form/Select";
import { Textarea } from "@/shared/components/Form/Textarea";
import type { CreateSpotPayload, SpotType } from "@/types/spots";

const spotSchema = z.object({
  name: z
    .string()
    .nonempty(MSG.REQUIRED)
    .min(RULES.NAME.MIN_LENGTH, { message: MSG.NAME_TOO_SHORT })
    .max(RULES.NAME.MAX_LENGTH, { message: MSG.NAME_TOO_LONG }),
  type: z.enum(["street", "skatepark", "diy", "plaza", "other"], {
    errorMap: () => ({ message: MSG.INVALID_TYPE })
  }),
  address: z
    .string()
    .nonempty(MSG.REQUIRED)
    .max(RULES.ADDRESS.MAX_LENGTH, { message: MSG.ADDRESS_TOO_LONG })
    .optional(),
  description: z
    .string()
    .nonempty(MSG.REQUIRED)
    .max(RULES.DESCRIPTION.MAX_LENGTH, { message: MSG.DESCRIPTION_TOO_LONG })
    .optional()
});

type SpotSchema = z.infer<typeof spotSchema>;

interface SpotFormProps {
  initialValues?: Partial<CreateSpotPayload>;
  onSubmit: (payload: CreateSpotPayload) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

export function SpotForm({ initialValues, onSubmit, isSubmitting, submitLabel }: SpotFormProps) {
  const [photoIds, setPhotoIds] = useState<number[]>(initialValues?.photos ?? []);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<SpotSchema>({
    resolver: zodResolver(spotSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      type: initialValues?.type ?? "street",
      address: initialValues?.address ?? "",
      description: initialValues?.description ?? ""
    },
    mode: "onChange"
  });

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

  const handleSpotSubmit: SubmitHandler<SpotSchema> = async values => {
    await onSubmit({
      name: values.name,
      description: values.description?.trim() || undefined,
      type: values.type as SpotType,
      address: values.address?.trim() || undefined,
      photos: photoIds.length > 0 ? photoIds : undefined
    });
  };

  return (
    <Flex as="form" w="100%" flexDir="column" onSubmit={handleSubmit(handleSpotSubmit)}>
      <Stack spacing={4}>
        {/* Name + Type */}
        <Flex flexDir={["column", null, "row"]} gap="4">
          <Input
            id="name"
            type="text"
            label="Nome"
            placeholder="Ex: Praça da Sé"
            {...register("name")}
            error={errors.name}
          />
          <Select label="Tipo" placeholder="Selecione o tipo" error={errors.type} {...register("type")}>
            <option value="street">Street</option>
            <option value="skatepark">Skatepark</option>
            <option value="diy">DIY</option>
            <option value="plaza">Plaza</option>
            <option value="other">Outro</option>
          </Select>
        </Flex>

        {/* Address */}
        <Flex flexDir={["column", null, "row"]} gap="4">
          <Input
            id="address"
            type="text"
            label="Endereço"
            placeholder="Ex: Av. Paulista, 1578 - São Paulo"
            {...register("address")}
            error={errors.address}
          />
        </Flex>

        {/* Description */}
        <Flex flexDir={["column", null, "row"]} gap="4">
          <Textarea
            id="description"
            label="Descrição"
            placeholder="Descreva o spot..."
            rows={4}
            {...register("description")}
            error={errors.description}
          />
        </Flex>

        {/* Photos */}
        <Flex flexDir="column" gap="2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Box>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUploading}
              loadingText="Enviando..."
            >
              Adicionar fotos
            </Button>
          </Box>
          {uploadError && (
            <Text color="red.400" fontSize="sm" display="flex" alignItems="center" gap="1">
              <RiAlertLine size={14} />
              {uploadError}
            </Text>
          )}
          {photoPreviews.length > 0 && (
            <HStack mt={1} spacing={2} flexWrap="wrap">
              {photoPreviews.map((src, i) => (
                <Image key={i} src={src} alt={`preview-${i}`} boxSize="80px" objectFit="cover" borderRadius="md" />
              ))}
            </HStack>
          )}
        </Flex>
      </Stack>

      {/* Footer */}
      <Flex flexDir={["column", null, "row"]} alignItems="end" mt={6}>
        <Button
          type="submit"
          color="white"
          bg="green.400"
          _hover={{ bg: "green.600" }}
          size={["sm", "md"]}
          isLoading={isSubmitting}
          loadingText="Salvando..."
          w={["100%", null, "3xs"]}
          mr="auto"
        >
          {submitLabel}
        </Button>
      </Flex>
    </Flex>
  );
}
