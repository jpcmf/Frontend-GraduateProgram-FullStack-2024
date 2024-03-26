import { useRouter } from 'next/router'
import { LogoSkateHub } from '@/components/LogoSkateHub'
import { Button, Flex, Grid, GridItem, Stack, Text } from '@chakra-ui/react'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Grid templateColumns={['1fr', 'repeat(5, 1fr)']} gap="0">
        <GridItem
          hideBelow={'md'}
          colSpan={{ md: 2, lg: 2, xl: 3 }}
          h="100dvh"
          bg="gray.800"
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          backgroundBlendMode="luminosity"
          backgroundPosition="center bottom"
          backgroundImage="./alexander-londono-unsplash.jpeg"
          // backgroundPosition="center 15%"
          // backgroundImage="./tom-morbey-unsplash-2.jpeg"
        >
          <Flex marginLeft="8" marginTop="5">
            <LogoSkateHub />
          </Flex>
        </GridItem>
        <GridItem
          colStart={{ base: 1, md: 3, lg: 3, xl: 4 }}
          colEnd={6}
          h="100dvh"
        >
          <Stack spacing="4" py={['4', '8']} px={['4', '12']} h="100dvh">
            <Flex
              flexDir="column"
              flexGrow="1"
              alignItems="center"
              justifyContent="center"
            >
              <Flex flexDir="column" w="100%" alignItems="center">
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  letterSpacing="tighter"
                  align="center"
                  display="flex"
                >
                  Seja bem-vindo ao SkateHub
                </Text>
                <Text
                  as="span"
                  fontWeight="normal"
                  align="center"
                  color="gray.300"
                >
                  Junte-se à comunidade e faça parte da evolução do esporte.
                </Text>
                <Text
                  as="small"
                  fontWeight="normal"
                  align="center"
                  color="gray.500"
                >
                  Faça login ou cadastre-se para começar a explorar todas as
                  funcionalidades!
                </Text>
              </Flex>
              <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="row"
                gap="3"
                w="100%"
              >
                <Button
                  type="button"
                  mt="3"
                  colorScheme="green"
                  size="lg"
                  w="100%"
                  onClick={() => router.push('/auth/signin')}
                >
                  Entrar
                </Button>
                <Button
                  type="button"
                  mt="3"
                  colorScheme="pink"
                  size="lg"
                  w="100%"
                  onClick={() => router.push('/auth/signup')}
                >
                  Cadastro
                </Button>
              </Flex>
            </Flex>
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
            >
              <Text
                as="a"
                href="#"
                color="gray.600"
                align="center"
                textDecoration="underline"
                fontSize="smaller"
              >
                Termos de uso
              </Text>
              <Text
                as="span"
                color="gray.600"
                paddingLeft="4"
                paddingRight="4"
                fontSize="smaller"
              >
                |
              </Text>
              <Text
                as="a"
                href="#"
                color="gray.600"
                align={'center'}
                textDecoration="underline"
                fontSize="smaller"
              >
                Política de privacidade
              </Text>
            </Flex>
          </Stack>
        </GridItem>
      </Grid>
    </>
  )
}
