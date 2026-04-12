import { useRouter } from "next/router";

import { Box, Heading, Text } from "@chakra-ui/react";

import { SpotForm } from "@/features/spots/SpotForm";
import { useCreateSpot } from "@/hooks/useCreateSpot";
import type { CreateSpotPayload } from "@/types/spots";

export default function NewSpotPage() {
  const router = useRouter();
  const { mutateAsync: createSpot, isPending, error } = useCreateSpot();

  async function handleSubmit(payload: CreateSpotPayload) {
    const res = await createSpot(payload);
    router.push(`/spots/${res.data.id}`);
  }

  return (
    <Box w={"100%"}>
      <Heading size="lg" mb={8}>
        Novo Spot
      </Heading>
      {error && (
        <Text color="red.400" mb={4}>
          Erro ao criar spot. Tente novamente.
        </Text>
      )}
      <SpotForm onSubmit={handleSubmit} isSubmitting={isPending} submitLabel="Criar Spot" />
    </Box>
  );
}
