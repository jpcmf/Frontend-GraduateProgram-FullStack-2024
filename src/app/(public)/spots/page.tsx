import type { Metadata } from "next";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";

import { getSpotsServer, SpotCard, SpotsCreateButton } from "@/features/spots";
import { Panel } from "@/shared/ui/New/Panel";

export const metadata: Metadata = {
  title: "Spots — SkateHub",
  description: "Descubra spots de skate compartilhados pela comunidade",
  alternates: { canonical: "https://skatehub.vercel.app/spots" },
  openGraph: {
    title: "Spots — SkateHub",
    description: "Descubra spots de skate compartilhados pela comunidade",
    url: "https://skatehub.vercel.app/spots",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Spots — SkateHub",
    description: "Descubra spots de skate compartilhados pela comunidade"
  }
};

export default async function SpotsPage() {
  const response = await getSpotsServer();
  const spots = response.data;

  return (
    <Box position="relative">
      <Panel size="md" mb={4}>
        <Flex justify="space-between" align="center" gap={4} wrap="wrap">
          <Text fontSize="sm" fontWeight="bold" color="content.primary" letterSpacing="tight">
            Spots
          </Text>
          <SpotsCreateButton />
        </Flex>
      </Panel>
      <Box width="100%">
        {spots.length === 0 ? (
          <Text color="gray.400" textAlign="center" mt={12}>
            Nenhum spot encontrado. Seja o primeiro a adicionar!
          </Text>
        ) : (
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
            {spots.map(spot => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
