"use client";

import { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import NextImage from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";

import { MapBox } from "@/components/Map/MapBox";
import { TitleSection } from "@/components/TitleSection";
import { useAuth } from "@/hooks/useAuth";
import { useColors } from "@/hooks/useColors";
import { useDeleteSpot } from "@/hooks/useDeleteSpot";
import type { Spot, SpotType } from "@/types/spots";
import { fetchCoordinates } from "@/utils/mapbox";

const TYPE_LABELS: Record<SpotType, string> = {
  street: "Street",
  skatepark: "Skatepark",
  diy: "DIY",
  plaza: "Plaza",
  other: "Other"
};

const TYPE_COLORS: Record<SpotType, string> = {
  street: "green",
  skatepark: "green",
  diy: "orange",
  plaza: "purple",
  other: "gray"
};

interface SpotDetailProps {
  spot: Spot;
}

type Position = {
  longitude: number;
  latitude: number;
};

export function SpotDetail({ spot }: SpotDetailProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cardBg, textMuted, bgColorNoOpacity } = useColors();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { mutate: deleteSpot, isPending: isDeleting } = useDeleteSpot();

  const { name, description, type, address, photos, created_by_user } = spot.attributes;

  const isOwner = !!user && !!created_by_user?.data && String(user.id) === String(created_by_user.data.id);

  const heroPhoto = photos?.data?.[0]?.attributes?.url ?? null;
  const galleryPhotos = photos?.data?.slice(1) ?? [];

  const creatorName = created_by_user?.data?.attributes.name || created_by_user?.data?.attributes.username;

  function handleDelete() {
    deleteSpot(spot.id, {
      onSuccess: () => {
        router.push("/spots");
      }
    });
  }

  useEffect(() => {
    (async () => {
      const response = await fetchCoordinates(address as string);
      const [longitude, latitude] = response;
      setPosition({ longitude, latitude });
    })();
  }, [address]);

  return (
    <>
      <Box position="relative">
        <TitleSection title="Spot" />
        <Box width={"100%"}>
          <Box position="absolute" top={0} right={0}>
            {isOwner && (
              <Flex gap={2}>
                <Button as={NextLink} href={`/spots/${spot.id}/edit`} size="sm" colorScheme="green">
                  Editar
                </Button>
                <Button size="sm" colorScheme="red" onClick={onOpen}>
                  Excluir
                </Button>
              </Flex>
            )}
          </Box>
        </Box>
      </Box>
      <VStack align="stretch" spacing={6}>
        {/* Hero image */}
        <Box
          position="relative"
          w="100%"
          h={{ base: "220px", md: "340px" }}
          borderRadius="lg"
          overflow="hidden"
          bg={cardBg}
        >
          {heroPhoto ? (
            <Box position="relative" h="100%" w="100%">
              <NextImage
                src={heroPhoto}
                alt={name}
                fill
                priority
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              {/* Gradient overlay */}
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-b, transparent 40%, blackAlpha.800 100%)"
                zIndex={1}
              />
            </Box>
          ) : (
            <Flex w="100%" h="100%" align="center" justify="center">
              <Text color="gray.500" fontSize="sm">
                Sem foto
              </Text>
            </Flex>
          )}

          {/* Type badge overlaid on hero */}
          <Box position="absolute" bottom={0} left={0} zIndex={10} w="100%" p={4}>
            <Badge bg={TYPE_COLORS[type] + ".400"} color="white" px={2} py={0} borderRadius="full">
              {TYPE_LABELS[type]}
            </Badge>
            {/* Title + owner actions */}
            <Flex justify="space-between" align="flex-start" gap={4} w="full">
              <Flex gap={1} direction="column">
                <Heading size={{ base: "md", md: "lg" }} color="white">
                  {name}
                </Heading>
                {address && (
                  <HStack>
                    <Icon as={FaMapMarkerAlt} />
                    <Text color="white" fontSize={{ base: "sm", md: "md" }}>
                      {address}
                    </Text>
                  </HStack>
                )}
                {creatorName && (
                  <Text fontSize="sm" color="white">
                    Criado por{" "}
                    <Box as="span" color="green.400">
                      {creatorName}
                    </Box>
                  </Text>
                )}
              </Flex>
            </Flex>
          </Box>
        </Box>

        {/* Spot details card */}
        {description && (
          <Box bg={cardBg} borderRadius="lg" p={{ base: 4, md: 8 }} mb={6}>
            <Heading size="md" py={0} pr={4} mb={4}>
              Detalhes do Spot
            </Heading>
            <Text textAlign="left" lineHeight="tall">
              {description}
            </Text>
          </Box>
        )}

        {/* Extra gallery photos (2nd photo onwards) */}
        {galleryPhotos.length > 0 && (
          <Grid templateColumns="repeat(auto-fill, minmax(260px, 1fr))" gap={4}>
            {galleryPhotos.map(photo => (
              <Box key={photo.id} position="relative" h="200px" borderRadius="lg" overflow="hidden">
                <NextImage
                  src={photo.attributes.url}
                  alt={name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Box>
            ))}
          </Grid>
        )}

        {/* Map + Comments two-column layout */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          {/* Localização */}
          <Box>
            <TitleSection title="Localização" size="md" />
            {address ? (
              <Box bg={cardBg} borderRadius="lg" overflow="hidden" h="500px">
                <MapBox posix={[position?.longitude ?? 0, position?.latitude ?? 0]} zoom={16} />
              </Box>
            ) : (
              <Box bg={cardBg} borderRadius="lg" h="260px" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.500" fontSize="sm">
                  Endereço não disponível
                </Text>
              </Box>
            )}
          </Box>

          {/* Comentários — placeholder until backend is implemented */}
          <Box>
            <TitleSection title="Comentários" size="md" />
            <Flex align="center" justify="center" bg={cardBg} borderRadius="lg" h="180px" mb={4}>
              <Text color="gray.500" fontSize="sm">
                Nenhum comentário disponível
              </Text>
            </Flex>
            <Flex justify="flex-end">
              <Button size="sm" colorScheme="green" isDisabled>
                Escrever comentário
              </Button>
            </Flex>
          </Box>
        </Grid>

        {/* Delete confirmation dialog */}
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent bg={bgColorNoOpacity} borderRadius="lg" shadow="lg">
              <AlertDialogHeader fontWeight="bold">Excluir spot</AlertDialogHeader>
              <AlertDialogBody>
                <Flex gap={2} w="full" align="start" mb={4} px={{ base: 2, md: 6 }}>
                  <Text fontSize="sm" color={textMuted}>
                    Tem certeza que deseja excluir <strong>{name}</strong>? <br />
                    Esta ação não pode ser desfeita.
                  </Text>
                </Flex>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose} variant="ghost">
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  ml={3}
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  loadingText="Excluindo..."
                >
                  Excluir
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </>
  );
}
