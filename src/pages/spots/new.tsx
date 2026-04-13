import Head from "next/dist/shared/lib/head";
import { useRouter } from "next/router";

import { Box, Flex, Text } from "@chakra-ui/react";

import { TitleSection } from "@/components/TitleSection";
import { SpotForm } from "@/features/spots/SpotForm";
import { useColors } from "@/hooks/useColors";
import { useCreateSpot } from "@/hooks/useCreateSpot";
import type { CreateSpotPayload } from "@/types/spots";

export default function NewSpotPage() {
  const router = useRouter();
  const { mutateAsync: createSpot, isPending, error } = useCreateSpot();
  const { bgColor } = useColors();

  async function handleSubmit(payload: CreateSpotPayload) {
    const res = await createSpot(payload);
    router.push(`/spots/${res.data.id}`);
  }

  return (
    <>
      <Head>
        <title>Novo Spot - SkateHub</title>
      </Head>
      <TitleSection title="Novo Spot" />
      <Flex alignItems="center" flexDirection="column" height="100%" justifyContent="start" mb={8} width="100%">
        <Box w={"100%"} p={8} borderRadius={8} bg={bgColor}>
          {error && (
            <Text color="red.400" mb={4}>
              Erro ao criar spot. Tente novamente.
            </Text>
          )}
          <SpotForm onSubmit={handleSubmit} isSubmitting={isPending} submitLabel="Criar Spot" />
        </Box>
      </Flex>
    </>
  );
}
