import NextImage from "next/image";
import NextLink from "next/link";

import { Badge, Box, Text, VStack } from "@chakra-ui/react";

import { useColors } from "@/hooks/useColors";
import type { Spot, SpotType } from "@/types/spots";

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

interface SpotCardProps {
  spot: Spot;
}

export function SpotCard({ spot }: SpotCardProps) {
  const { bgColor } = useColors();
  const { name, type, address, photos } = spot.attributes;
  const thumbnail = photos?.data?.[0]?.attributes?.url ?? null;

  return (
    <Box
      as={NextLink}
      href={`/spots/${spot.id}`}
      display="block"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s" }}
      transition="transform 0.2s"
    >
      <Box position="relative" w="100%" h="180px" bg="gray.700">
        {thumbnail ? (
          <NextImage
            src={thumbnail}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
            <Text color="gray.500" fontSize="sm">
              Sem foto
            </Text>
          </Box>
        )}
      </Box>

      <VStack align="start" spacing={1} p={4}>
        <Badge bg={TYPE_COLORS[type] + ".400"} fontSize="xs" color="white" px={2} py={0} borderRadius="full">
          {TYPE_LABELS[type]}
        </Badge>
        <Text fontWeight="semibold" fontSize="md" noOfLines={1}>
          {name}
        </Text>
        {address && (
          <Text fontSize="sm" color="gray.400" noOfLines={1}>
            {address}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
