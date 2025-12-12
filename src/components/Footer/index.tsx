import { FaHeart, FaReact } from "react-icons/fa";
import { SiChakraui, SiNextdotjs } from "react-icons/si";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";

import { LogoSkateHub } from "../LogoSkateHub";

export function Footer() {
  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");
  const bgButtonColor = useColorModeValue("red.500", "red.600");
  const textButtonColor = useColorModeValue("white", "gray.100");
  return (
    <Box as="footer" bg={bgColor} pt={12} pb={6}>
      <Container maxW="max-content" px={6}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={8}>
          <VStack align="flex-start" spacing={3}>
            <HStack spacing={2}>
              <LogoSkateHub width={150} color="gray" />
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Conectando skatistas de todo o mundo.
            </Text>
          </VStack>

          <VStack align="flex-start" spacing={3}>
            <Heading as="h4" size="sm" fontWeight="bold" mb={1}>
              Navegação
            </Heading>
            <Link href="/" fontSize="sm" color="gray.600" _hover={{ color: "green.600" }}>
              Dashboard
            </Link>
            <Link href="/skatistas" fontSize="sm" color="gray.600" _hover={{ color: "green.600" }}>
              Skatistas
            </Link>
            <Link href="/spots" fontSize="sm" color="gray.600" _hover={{ color: "green.600" }}>
              Spots
            </Link>
            <Link href="/auth/signup" fontSize="sm" color="gray.600" _hover={{ color: "green.600" }}>
              Cadastro
            </Link>
            <Link href="/auth/signin" fontSize="sm" color="gray.600" _hover={{ color: "green.600" }}>
              Login
            </Link>
          </VStack>

          <VStack align="flex-start" spacing={3}>
            <Heading as="h4" size="sm" fontWeight="bold" mb={1}>
              Legal
            </Heading>
            <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: "green.600" }}>
              Termos de Serviço
            </Link>
            <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: "green.600" }}>
              Política de Privacidade
            </Link>
            <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: "green.600" }}>
              Sobre Nós
            </Link>
          </VStack>

          <VStack align="flex-start" spacing={3}>
            <Heading as="h4" size="sm" fontWeight="bold" mb={1}>
              Contribua
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Esse projeto foi criado e é mantido por{" "}
              <Link href="https://jpcmf.dev" color="gray.500" fontWeight="semibold" isExternal>
                jpcmf.dev
              </Link>
              .
            </Text>
            <Button leftIcon={<FaHeart />} bg={bgButtonColor} color={textButtonColor} size="sm" fontWeight="semibold">
              Quero contribuir
            </Button>
          </VStack>
        </SimpleGrid>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          pt={6}
          borderTop="1px"
          borderColor="gray.700"
          gap={4}
        >
          <Text fontSize="sm" color="gray.600" display="flex" alignItems="center" gap={1}>
            © {new Date().getFullYear()} SkateHub. Todos os direitos reservados.
          </Text>

          <HStack spacing={2}>
            <Icon as={FaReact} boxSize={5} color="gray.600" />
            <Text color="gray.500">+</Text>
            <Icon as={SiNextdotjs} boxSize={5} color="gray.600" />
            <Text color="gray.500">+</Text>
            <Icon as={SiChakraui} boxSize={5} color="gray.600" />
          </HStack>
          {/* <HStack spacing={4}>
            <Image src="/skatehub.png" alt="Skatehub" width={20} height={20} />
            <Link href="#" _hover={{ opacity: 0.7 }}>
              <Icon as={FaGlobe} boxSize={5} color="gray.500" />
            </Link>
            <Link href="#" _hover={{ opacity: 0.7 }}>
              <Icon as={FaInstagram} boxSize={5} color="gray.500" />
            </Link>
            <Link href="#" _hover={{ opacity: 0.7 }}>
              <Icon as={FaGithub} boxSize={5} color="gray.500" />
            </Link>
          </HStack> */}
        </Flex>
      </Container>
    </Box>
  );
}
