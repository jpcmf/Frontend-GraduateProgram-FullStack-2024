import Head from "next/dist/shared/lib/head";
import NextLink from "next/link";

import { Box, Button, Flex, Grid, Spinner, Text } from "@chakra-ui/react";

import { TitleSection } from "@/components/TitleSection";
import { SpotCard } from "@/features/spots/SpotCard";
import { useAuth } from "@/hooks/useAuth";
import { useSpots } from "@/hooks/useSpots";

export default function SpotsPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useSpots();

  return (
    <>
      <Head>
        <title>Spots - SkateHub</title>
      </Head>
      <Box position="relative">
        <TitleSection title="Spots" />
        <Box width={"100%"}>
          <Box position="absolute" top={0} right={0}>
            {user && (
              <Button as={NextLink} href="/spots/new" colorScheme="green" size="sm">
                Adicionar Spot
              </Button>
            )}
          </Box>

          {isLoading && (
            <Flex justify="center" align="center" minH="300px">
              <Spinner size="lg" color="green.400" />
            </Flex>
          )}

          {isError && (
            <Flex justify="center" align="center" minH="300px">
              <Text color="red.400">Erro ao carregar spots. Tente novamente.</Text>
            </Flex>
          )}

          {!isLoading && !isError && data?.data && (
            <>
              {data.data.length === 0 ? (
                <Text color="gray.400" textAlign="center" mt={12}>
                  Nenhum spot encontrado. Seja o primeiro a adicionar!
                </Text>
              ) : (
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                  {data.data.map(spot => (
                    <SpotCard key={spot.id} spot={spot} />
                  ))}
                </Grid>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
