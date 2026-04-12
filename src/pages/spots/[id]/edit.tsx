import { useRouter } from "next/router";

import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";

import { SpotForm } from "@/features/spots/SpotForm";
import { useAuth } from "@/hooks/useAuth";
import { useSpot } from "@/hooks/useSpot";
import { useUpdateSpot } from "@/hooks/useUpdateSpot";
import type { CreateSpotPayload } from "@/types/spots";

export default function EditSpotPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { data, isLoading, isError } = useSpot(id as string);
  const { mutateAsync: updateSpot, isPending, error } = useUpdateSpot(id as string);

  if (isLoading || !id) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  if (isError || !data?.data) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Text color="red.400">Spot não encontrado.</Text>
      </Flex>
    );
  }

  const spot = data.data;
  const isOwner =
    !!user &&
    !!spot.attributes.created_by_user?.data &&
    String(user.id) === String(spot.attributes.created_by_user.data.id);

  if (!isOwner) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Text color="red.400">Você não tem permissão para editar este spot.</Text>
      </Flex>
    );
  }

  const { name, description, type, address, photos } = spot.attributes;

  const initialValues: Partial<CreateSpotPayload> = {
    name,
    description: description ?? undefined,
    type,
    address: address ?? undefined,
    photos: photos?.data?.map(p => p.id) ?? []
  };

  async function handleSubmit(payload: CreateSpotPayload) {
    await updateSpot(payload);
    router.push(`/spots/${spot.id}`);
  }

  return (
    <Box maxW="640px" mx="auto" px={4} py={8}>
      <Heading size="lg" mb={8}>
        Editar Spot
      </Heading>
      {error && (
        <Text color="red.400" mb={4}>
          Erro ao atualizar spot. Tente novamente.
        </Text>
      )}
      <SpotForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitLabel="Salvar alterações"
      />
    </Box>
  );
}
