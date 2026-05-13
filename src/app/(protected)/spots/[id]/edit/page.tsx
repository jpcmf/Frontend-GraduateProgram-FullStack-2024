"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Box, Flex, Spinner, useColorModeValue } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UpdateSpotPayload } from "@/features/spots";
import { getSpotById , updateSpot } from "@/features/spots";
import { SpotForm } from "@/features/spots/SpotForm";
import { TitleSection } from "@/shared/ui/TitleSection";
import { Toast } from "@/shared/ui/Toast";

interface EditSpotPageProps {
  params: Promise<{ id: string }>;
}

export default function EditSpotPage({ params }: EditSpotPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = Toast();
  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");

  // Fetch current spot data
  const { data: spotData, isLoading: isLoadingSpot } = useQuery({
    queryKey: ["spot", id],
    queryFn: () => getSpotById(id),
    enabled: !!id
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateSpotPayload) => {
      return await updateSpot(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spot", id] });
      queryClient.invalidateQueries({ queryKey: ["spots"] });
      addToast({
        title: "Spot atualizado com sucesso!",
        message: "As alterações foram salvas.",
        type: "success"
      });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      addToast({
        title: "Erro ao atualizar spot.",
        message: error?.response?.data?.error?.message || "Tente novamente.",
        type: "error"
      });
    }
  });

  if (isLoadingSpot) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  if (!spotData?.data) {
    return (
      <Box>
        <TitleSection title="Editar Spot" />
        <Box flex="1" borderRadius={8} bg={bgColor} p={["4", "8"]} mb={8}>
          Spot não encontrado
        </Box>
      </Box>
    );
  }

  const spot = spotData.data;

  return (
    <>
      <TitleSection title="Editar Spot" />
      <Box flex="1" borderRadius={8} bg={bgColor} p={["4", "8"]} mb={8}>
        <SpotForm
          initialValues={{
            name: spot.attributes?.name || "",
            description: spot.attributes?.description || "",
            type: (spot.attributes?.type as any) || "street",
            address: spot.attributes?.address || "",
            photos: spot.attributes?.photos?.data?.map((p: any) => p.id) || []
          }}
          onSubmit={payload => updateMutation.mutateAsync(payload) as any}
          isSubmitting={updateMutation.isPending}
          submitLabel="Atualizar Spot"
        />
      </Box>
    </>
  );
}
