import type { Metadata } from "next";

import { Box, Grid, Text } from "@chakra-ui/react";

import { getSpotsServer, SpotsCreateButton, SpotCard } from "@/features/spots";
import { TitleSection } from "@/shared/ui/TitleSection";

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
      <TitleSection title="Spots" />
      <Box width="100%">
        <Box position="absolute" top={0} right={0}>
          <SpotsCreateButton />
        </Box>

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