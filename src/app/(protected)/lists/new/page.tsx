"use client";

import { useRouter } from "next/navigation";

import { Box, useColorModeValue } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateListPayload } from "@/features/lists";
import { createList, ListForm } from "@/features/lists";
import { TitleSection } from "@/shared/ui/TitleSection";
import { Toast } from "@/shared/ui/Toast";

export default function NewListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = Toast();
  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");

  const createMutation = useMutation({
    mutationFn: async (payload: CreateListPayload) => {
      return await createList(payload);
    },
    onSuccess: result => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["my-lists"] });
      addToast({
        title: "Lista criada com sucesso!",
        message: "Agora adicione itens à sua lista.",
        type: "success"
      });
      router.push(`/lists/${result.data.id}/edit`);
    },
    onError: (error: any) => {
      addToast({
        title: "Erro ao criar lista.",
        message: error?.response?.data?.error?.message || "Tente novamente.",
        type: "error"
      });
    }
  });

  return (
    <>
      <TitleSection title="Criar Coleção" />
      <Box flex="1" borderRadius={8} bg={bgColor} p={["4", "8"]} mb={8}>
        <ListForm           onSubmit={async payload => { await createMutation.mutateAsync(payload); }} isLoading={createMutation.isPending} />
      </Box>
    </>
  );
}
