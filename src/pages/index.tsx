import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Flex, Grid, GridItem, Stack, Text } from "@chakra-ui/react";

import packageJson from "../../package.json";
import { LogoSkateHub } from "@/components/LogoSkateHub";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Home - SkateHub</title>
      </Head>
      <Grid templateColumns={["1fr", "repeat(5, 1fr)"]} gap="0">
        <GridItem
          hideBelow="md"
          colSpan={{ md: 2, lg: 2, xl: 3 }}
          h="100dvh"
          bg="gray.800"
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          backgroundBlendMode="overlay"
          backgroundPosition="center 15%"
          backgroundImage="./tom-morbey-unsplash-2.jpeg"
        >
          <Flex marginLeft="8" marginTop="5">
            <LogoSkateHub />
          </Flex>
        </GridItem>
        <GridItem colStart={{ base: 1, md: 3, lg: 3, xl: 4 }} colEnd={6} h="100dvh" position="relative">
          <Stack spacing="4" py={["4", "8"]} px={["4", "12"]} h="100dvh">
            <Flex flexDir="column" flexGrow="1" alignItems="center" justifyContent="center">
              <Flex flexDir="column" w="100%" alignItems="center" mb="10">
                <Flex hideFrom="md" marginBottom="10">
                  <LogoSkateHub />
                </Flex>
                <Text fontWeight="bold" fontSize="3xl" align="center" color="gray.300">
                  Junte-se à comunidade! Faça parte da evolução do esporte.
                </Text>
                <Text mt="4" fontSize="lg" fontWeight="medium" align="center" color="gray.500">
                  Faça login ou cadastre-se para começar a explorar todas as funcionalidades.
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="center" flexDirection="row" gap="3" w="100%">
                <Button
                  type="button"
                  mt="3"
                  colorScheme="green"
                  fontWeight="bold"
                  size={["md", "lg"]}
                  w="100%"
                  onClick={() => router.push("/auth/signin")}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  mt="3"
                  colorScheme="pink"
                  fontWeight="bold"
                  size={["md", "lg"]}
                  w="100%"
                  onClick={() => router.push("/auth/signup")}
                >
                  Criar uma conta
                </Button>
              </Flex>
            </Flex>
            <Flex alignItems="center" justifyContent="center" flexDirection="row">
              <Text
                as="a"
                href="#"
                color="gray.600"
                align="center"
                textDecoration="underline"
                fontSize="smaller"
                fontWeight="medium"
                maxWidth="200px"
                w="100%"
                textAlign="right"
              >
                Termos de uso
              </Text>
              <Text as="span" color="gray.600" paddingLeft="2" paddingRight="2" fontSize="smaller">
                |
              </Text>
              <Text
                as="a"
                href="#"
                color="gray.600"
                align="center"
                textDecoration="underline"
                fontSize="smaller"
                fontWeight="medium"
                maxWidth="200px"
                w="100%"
                textAlign="left"
              >
                Política de privacidade
              </Text>
            </Flex>
            <Flex position="absolute" bottom="2" right="3" hideBelow="sm">
              <Text as="small" fontSize="x-small" color="gray.700" align="center">
                versão {packageJson.version}
              </Text>
            </Flex>
          </Stack>
        </GridItem>
      </Grid>
    </>
  );
}
