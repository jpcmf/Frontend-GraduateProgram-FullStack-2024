"use client";

import { useContext } from "react";
import { FiSearch } from "react-icons/fi";
import { RiMenuLine } from "react-icons/ri";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";

import { useSidebarDrawer } from "@/app/SidebarDrawerContext";
import { AuthContext, LoginModal } from "@/features/auth";

import { LogoSkateHub } from "../../LogoSkateHub";
import { ReusableModal } from "../../ReusableModal";
import { LiveDot } from "../index";

import { Profile } from "./Profile";

export function Header() {
  const { onOpen } = useSidebarDrawer();
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isVisible = useBreakpointValue({
    base: false,
    lg: true
  });

  const isLoginModalOpen = searchParams.get("modal") === "login";

  const handleLoginClick = () => {
    router.push(`${pathname}?modal=login`);
  };

  const handleCloseModal = () => {
    router.push(pathname);
  };

  const handleSignupClick = () => {
    router.push("/auth/signup");
  };

  return (
    <>
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
            <Link
              href="/"
              display={{ base: "none", lg: "flex" }}
              alignItems="center"
              gap={2.5}
              _hover={{ textDecoration: "none" }}
            >
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
              <LogoSkateHub />
            </Link>
            {!isVisible && (
              <IconButton
                aria-label="Open navigation"
                icon={<Icon as={RiMenuLine} />}
                fontSize="28"
                variant="ghost"
                onClick={onOpen}
                mr="2"
              ></IconButton>
            )}
            <InputGroup display={{ base: "none", md: "flex" }} w={{ md: 80, lg: 96 }} size="sm">
              <InputLeftElement pointerEvents="none" h="full" color="content.muted">
                <FiSearch />
              </InputLeftElement>
              {/* <Input variant="pill" placeholder="Buscar skatistas, picos, manobras..." /> */}
              <Input size="md" placeholder="Buscar skatistas, picos, manobras..." />
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
            {!isAuthenticated ? (
              <>
                <Button onClick={handleLoginClick} variant="quiet" size="sm" color="content.secondary">
                  Entrar
                </Button>
                <Button onClick={handleSignupClick} variant="accent" size="sm">
                  Criar conta
                </Button>
              </>
            ) : (
              <Profile showProfileData={isVisible} />
            )}
          </HStack>
        </Flex>
      </Box>

      <ReusableModal isOpen={isLoginModalOpen} onClose={handleCloseModal} size="6xl">
        <LoginModal />
      </ReusableModal>
    </>
  );
}
