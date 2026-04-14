import { RiAlertLine } from "react-icons/ri";
import Head from "next/head";
import { useRouter } from "next/router";

import { Flex, Spinner, Text } from "@chakra-ui/react";

import { TitleSection } from "@/components/TitleSection";
import { Toast } from "@/components/Toast";
import { SpotForm } from "@/features/spots/SpotForm";
import { useAuth } from "@/hooks/useAuth";
import { useColors } from "@/hooks/useColors";
import { useSpot } from "@/hooks/useSpot";
import { useUpdateSpot } from "@/hooks/useUpdateSpot";
import type { CreateSpotPayload } from "@/types/spots";

export default function EditSpotPage() {
  const router = useRouter();
  const { bgColor } = useColors();
  const { id } = router.query;
  const { user } = useAuth();
  const { addToast } = Toast();
  const { data, isLoading, isError } = useSpot(id as string);
  const { mutateAsync: updateSpot, isPending } = useUpdateSpot(id as string);

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
        <Text color="red.400" display="flex" alignItems="center" gap="1">
          <RiAlertLine size={16} />
          Spot não encontrado.
        </Text>
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
        <Text color="red.400" display="flex" alignItems="center" gap="1">
          <RiAlertLine size={16} />
          Você não tem permissão para editar este spot.
        </Text>
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
    try {
      await updateSpot(payload);
      addToast({
        title: "Spot atualizado com sucesso.",
        message: "As alterações foram salvas.",
        type: "success"
      });
      router.push(`/spots/${spot.id}`);
    } catch {
      addToast({
        title: "Erro ao atualizar spot.",
        message: "Houve um erro ao salvar as alterações. Por favor, tente novamente.",
        type: "error"
      });
    }
  }

  return (
    <>
      <Head>
        <title>Editar Spot - SkateHub</title>
      </Head>
      <TitleSection title="Editar Spot" />
      <Flex alignItems="center" flexDirection="column" height="100%" justifyContent="start" mb={8} width="100%">
        <Flex w="100%" bg={bgColor} p="8" borderRadius={8} flexDir="column">
          <SpotForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="Salvar alterações"
          />
        </Flex>
      </Flex>
    </>
  );
}
