import React from "react";
import { FaHeart, FaReact } from "react-icons/fa";
import { SiChakraui, SiNextdotjs } from "react-icons/si";
import Image from "next/image";

import { Box, Container, Divider, Flex, HStack, Icon, Link, Text } from "@chakra-ui/react";

export function Footer() {
  return (
    <Box as="footer">
      <Container maxW="container" bg="blackAlpha.300" py={8}>
        <Flex direction={{ base: "column" }} justify="center" align="center" gap={4}>
          <Box>
            <Image src="/skatehub.png" alt="Skatehub" width={60} height={60} />
          </Box>
          <Box textAlign="center" mt={2}>
            <Text fontSize="sm" color="gray.700">
              <Text as="span" fontWeight="bold">
                2025 - skatehub.app
              </Text>
            </Text>
            <HStack justify="center" align="center" spacing={2} mt={3}>
              <Icon as={FaReact} boxSize={4} color="gray.600" />
              <Text color="gray.400">+</Text>
              <Icon as={SiNextdotjs} boxSize={4} color="gray.600" />
              <Text color="gray.400">+</Text>
              <Icon as={SiChakraui} boxSize={4} color="gray.600" />
            </HStack>
          </Box>
        </Flex>
      </Container>
      <Container maxW="container" bg="blackAlpha.400" py={8}>
        <Flex direction={{ base: "column", md: "column-reverse" }} justify="center" align="center" gap={4}>
          <Text fontSize="xs" color="gray.600">
            Esse projeto foi criado e é mantido unicamente por{" "}
            <Link href="https://jpcmf.dev" color="gray.500" fontWeight="semibold" isExternal>
              jpcmf
            </Link>{" "}
            - sem fins lucrativos.
          </Text>
          <Box>
            <Link
              href="#"
              display="inline-flex"
              alignItems="center"
              gap={2}
              px={4}
              py={2}
              bg="gray.900"
              color="red.500"
              border="1px"
              borderColor="red.500"
              borderRadius="md"
              fontWeight="semibold"
              fontSize="xs"
              _hover={{
                bg: "red.50",
                textDecoration: "none"
              }}
              transition="all 0.2s"
            >
              <Icon as={FaHeart} />
              Quero contribuir
            </Link>
          </Box>
        </Flex>
      </Container>
      <Container maxW="container" bg="blackAlpha.400" pb={2}>
        <Flex alignItems="center" justifyContent="center" flexDirection="row">
          <Text
            _hover={{ textDecoration: "underline" }}
            align="center"
            as="a"
            color="gray.600"
            fontSize="xs"
            fontWeight="medium"
            href="#"
            px={1}
            textAlign="right"
          >
            Termos de uso
          </Text>
          <Divider borderColor="gray.700" orientation="vertical" height="8px" mx="1" />
          <Text
            _hover={{ textDecoration: "underline" }}
            align="center"
            as="a"
            color="gray.600"
            fontSize="xs"
            fontWeight="medium"
            href="#"
            px={1}
            textAlign="left"
          >
            Política de privacidade
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
