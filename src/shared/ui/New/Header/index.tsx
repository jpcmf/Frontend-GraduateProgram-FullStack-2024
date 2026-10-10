"use client";

import { FiSearch } from "react-icons/fi";

import { Box, Button, Center, Flex, HStack, Input, InputGroup, InputLeftElement, Link, Text } from "@chakra-ui/react";

import { LogoSkateHub } from "../../LogoSkateHub";
import { LiveDot } from "../index";

/* ---------------------------- Brand ---------------------------- */
// export const Brand = ({ size = '2xl' }: { size?: string }) => (
//   <Text fontSize={size} fontWeight="900" letterSpacing="-0.02em" color="white">
//     Skate<Text as="span" color="accent.base">Hub</Text>
//   </Text>
// )

/* ---------------------------- Header ---------------------------- */
export const Header = () => (
  <Box
    as="header"
    position="sticky"
    top={0}
    zIndex={40}
    bg="surface.header"
    backdropFilter="blur(12px)"
    borderBottom="1px solid"
    borderColor="line.subtle"
    px={{ base: 4, lg: 8 }}
    py={3.5}
  >
    <Flex maxW="1780px" mx="auto" align="center" justify="space-between" gap={4}>
      <HStack spacing={8}>
        <Link href="#" display="flex" alignItems="center" gap={2.5} _hover={{ textDecoration: "none" }}>
          <Center
            w={7}
            h={7}
            borderRadius="lg"
            bg="accent.base"
            color="black"
            fontWeight="900"
            fontSize="lg"
            boxShadow="0 4px 10px rgba(34,197,94,0.25)"
          >
            S
          </Center>
          {/* <Brand /> */}
          <LogoSkateHub />
        </Link>
        <InputGroup display={{ base: "none", md: "flex" }} w={{ md: 80, lg: 96 }} size="sm">
          <InputLeftElement pointerEvents="none" h="full" color="content.muted">
            <FiSearch />
          </InputLeftElement>
          <Input variant="pill" placeholder="Buscar skatistas, picos, manobras..." />
        </InputGroup>
      </HStack>

      <HStack spacing={3}>
        <HStack
          display={{ base: "none", sm: "flex" }}
          spacing={2}
          px={3}
          py={1}
          borderRadius="full"
          bg="surface.raised"
          border="1px solid"
          borderColor="line.subtle"
          fontSize="xs"
          color="content.secondary"
        >
          <LiveDot />
          <Text>
            <b>184</b> skatistas na sessão
          </Text>
        </HStack>
        <Button variant="quiet" size="sm" color="content.secondary">
          Entrar
        </Button>
        <Button variant="accent" size="sm">
          Criar conta
        </Button>
      </HStack>
    </Flex>
  </Box>
);
