"use client";

import { useRouter } from "next/navigation";

import { Box, useColorModeValue } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TitleSection } from "@/components/TitleSection";
import { Toast } from "@/components/Toast";
import { SpotForm } from "@/features/spots/SpotForm";
import { createSpot } from "@/services/createSpot";
import type { CreateSpotPayload } from "@/types/spots";

export default function NewSpotPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = Toast();
  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");

  const createMutation = useMutation({
    mutationFn: async (payload: CreateSpotPayload) => {
      return await createSpot(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spots"] });
      addToast({
        title: "Spot criado com sucesso!",
        message: "Seu novo spot foi adicionado à comunidade.",
        type: "success"
      });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      addToast({
        title: "Erro ao criar spot.",
        message: error?.response?.data?.error?.message || "Tente novamente.",
        type: "error"
      });
    }
  });

  return (
    <>
      <TitleSection title="Criar Novo Spot" />
      <Box flex="1" borderRadius={8} bg={bgColor} p={["4", "8"]} mb={8}>
        <SpotForm
          onSubmit={payload => createMutation.mutateAsync(payload) as any}
          isSubmitting={createMutation.isPending}
          submitLabel="Criar Spot"
        />
      </Box>
    </>
  );
}
