"use client";

import { useRef, useState } from "react";
import { RiImageAddLine } from "react-icons/ri";

import { Box, Button, Flex, HStack, IconButton, Image, Text, Textarea } from "@chakra-ui/react";

import { apiClient } from "@/shared/api/apiClient";
import { Muted } from "@/shared/ui/New/Muted";

import type { CommentImage } from "../../types/comments";

export const COMMENT_TEXT_MAX_LENGTH = 500;
export const COMMENT_IMAGES_MAX = 5;

type UploadedImage = { id: number; url: string };

type CommentFormProps = {
  submitLabel: string;
  isSubmitting: boolean;
  initialImages?: CommentImage[];
  onCancel?: () => void;
  onSubmit: (payload: { text: string; images?: number[] }) => Promise<void>;
};

export function CommentForm({ submitLabel, isSubmitting, initialImages, onCancel, onSubmit }: CommentFormProps) {
  const [text, setText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    (initialImages ?? []).map(image => ({ id: image.id, url: image.attributes.url }))
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textError = text.length > COMMENT_TEXT_MAX_LENGTH;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remainingSlots = COMMENT_IMAGES_MAX - uploadedImages.length;
    if (remainingSlots <= 0) {
      setUploadError(`Limite de ${COMMENT_IMAGES_MAX} imagens por comentário.`);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      files.slice(0, remainingSlots).forEach(file => formData.append("files", file));
      const res = await apiClient.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const uploaded: UploadedImage[] = res.data;
      setUploadedImages(prev => [...prev, ...uploaded]);
    } catch {
      setUploadError("Falha no upload das imagens. Tente novamente.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(id: number) {
    setUploadedImages(prev => prev.filter(image => image.id !== id));
  }

  async function handleSubmit() {
    if (text.trim().length === 0 && uploadedImages.length === 0) return;
    await onSubmit({
      text: text.trim(),
      images: uploadedImages.length > 0 ? uploadedImages.map(image => image.id) : undefined
    });
    setText("");
    setUploadedImages([]);
  }

  return (
    <Flex
      as="form"
      w="100%"
      flexDir="column"
      gap={2}
      mb={6}
      pb={6}
      borderBottom="1px solid"
      borderColor="hub.border"
      onSubmit={e => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <Box>
        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Escreva um comentário..."
          resize="vertical"
          fontSize="sm"
        />
        <Muted fontSize="xs" textAlign="right" color={textError ? "red.500" : "content.muted"} mt={1}>
          {text.length}/{COMMENT_TEXT_MAX_LENGTH}
        </Muted>
      </Box>

      {uploadedImages.length > 0 && (
        <HStack spacing={2} flexWrap="wrap">
          {uploadedImages.map(image => (
            <Box key={image.id} position="relative">
              <Image src={image.url} alt="Imagem do comentário" boxSize="64px" objectFit="cover" borderRadius="md" />
              <IconButton
                aria-label="Remover imagem"
                icon={<Text fontSize="xs">x</Text>}
                size="xs"
                position="absolute"
                top={0}
                right={0}
                colorScheme="red"
                onClick={() => removeImage(image.id)}
              />
            </Box>
          ))}
        </HStack>
      )}

      <HStack justify="space-between" align="center">
        <HStack>
          <IconButton
            aria-label="Adicionar imagens"
            icon={<RiImageAddLine />}
            size="sm"
            variant="ghost"
            isDisabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          />
          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileChange} />
        </HStack>
        <HStack>
          {onCancel && (
            <Button size="sm" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button
            size="sm"
            colorScheme="green"
            isLoading={isSubmitting}
            isDisabled={(text.trim().length === 0 && uploadedImages.length === 0) || textError}
            onClick={() => void handleSubmit()}
          >
            {submitLabel}
          </Button>
        </HStack>
      </HStack>

      {uploadError && (
        <Text fontSize="sm" color="red.400">
          {uploadError}
        </Text>
      )}
    </Flex>
  );
}
