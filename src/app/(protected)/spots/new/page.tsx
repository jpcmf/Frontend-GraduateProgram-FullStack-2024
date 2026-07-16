"use client";

import { useRouter } from "next/navigation";

import { Box, useColorModeValue } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateSpotPayload } from "@/features/spots";
import { createSpot, SpotForm } from "@/features/spots";
import { TitleSection } from "@/shared/ui/TitleSection";
import { Toast } from "@/shared/ui/Toast";

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
      <TitleSection title="Criar Spot" />
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
