import { useRef } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";

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
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";

import { useAuth } from "@/hooks/useAuth";
import { useDeleteSpot } from "@/hooks/useDeleteSpot";
import type { Spot, SpotType } from "@/types/spots";

const TYPE_LABELS: Record<SpotType, string> = {
  street: "Street",
  skatepark: "Skatepark",
  diy: "DIY",
  plaza: "Plaza",
  other: "Other"
};

const TYPE_COLORS: Record<SpotType, string> = {
  street: "blue",
  skatepark: "green",
  diy: "orange",
  plaza: "purple",
  other: "gray"
};

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

interface SpotDetailProps {
  spot: Spot;
}

export function SpotDetail({ spot }: SpotDetailProps) {
  const { user } = useAuth();
  console.log(user);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { mutate: deleteSpot, isPending: isDeleting } = useDeleteSpot();

  const { name, description, type, address, photos, created_by_user } = spot.attributes;
  console.log(spot.attributes);


  const isOwner = !!user && !!created_by_user?.data && String(user.id) === String(created_by_user.data.id);

  console.log("isOwner", isOwner);


  function handleDelete() {
    deleteSpot(spot.id, {
      onSuccess: () => {
        router.push("/spots");
      }
    });
  }

  return (
    <VStack align="stretch" spacing={8}>
      {/* Header */}
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4}>
        <Box>
          <Badge colorScheme={TYPE_COLORS[type]} mb={2} textTransform="capitalize">
            {TYPE_LABELS[type]}
          </Badge>
          <Heading size="xl">{name}</Heading>
          {address && (
            <Text mt={1} color="gray.400">
              {address}
            </Text>
          )}
          {created_by_user?.data && (
            <Text mt={1} fontSize="sm" color="gray.500">
              Criado por{" "}
              <Box as="span" color="green.400">
                {created_by_user.data.attributes.name || created_by_user.data.attributes.username}
              </Box>
            </Text>
          )}
        </Box>

        {isOwner && (
          <HStack>
            <Button as={NextLink} href={`/spots/${spot.id}/edit`} size="sm" variant="outline" colorScheme="green">
              Editar
            </Button>
            <Button size="sm" colorScheme="red" variant="outline" onClick={onOpen}>
              Excluir
            </Button>
          </HStack>
        )}
      </Flex>

      {/* Description */}
      {description && <Text>{description}</Text>}

      {/* Photo gallery */}
      {photos?.data && photos.data.length > 0 && (
        <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4}>
          {photos.data.map(photo => (
            <Box key={photo.id} position="relative" h="240px" borderRadius="lg" overflow="hidden">
              <NextImage
                src={photo.attributes.url}
                alt={name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Box>
          ))}
        </Grid>
      )}

      {/* Google Maps embed */}
      {address && MAPS_KEY && (
        <Box borderRadius="lg" overflow="hidden" h="400px">
          <Box
            as="iframe"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(address)}`}
            allowFullScreen
          />
        </Box>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontWeight="bold">Excluir spot</AlertDialogHeader>
            <AlertDialogBody>
              Tem certeza que deseja excluir <strong>{name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="ghost">
                Cancelar
              </Button>
              <Button colorScheme="red" ml={3} onClick={handleDelete} isLoading={isDeleting} loadingText="Excluindo...">
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
}
