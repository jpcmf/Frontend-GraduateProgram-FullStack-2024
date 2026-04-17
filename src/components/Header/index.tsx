"use client";

import { useContext } from "react";
import { RiMenuLine } from "react-icons/ri";
// import Link from 'next/link';
import { useRouter, useSearchParams } from "next/navigation";

import { Button, Flex, Icon, IconButton, Link, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";

import { AuthContext } from "@/contexts/AuthContext";
import { useSidebarDrawer } from "@/contexts/SidebarDrawerContext";
import LoginModal from "@/features/login/modal/login";
import { useColors } from "@/hooks/useColors";

import { LogoSkateHub } from "../LogoSkateHub";
import { ReusableModal } from "../ReusableModal";

import { Notification } from "./Notification";
import { Profile } from "./Profile";

export function Header() {
  const { bgColorNoOpacity, borderColor } = useColors();
  const { onOpen } = useSidebarDrawer();
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const textSecondaryButton = useColorModeValue("gray.800", "green.400");

  const isVisible = useBreakpointValue({
    base: false,
    lg: true
  });

  const isLoginModalOpen = (searchParams?.get("modal") || "") === "login";

  const handleClose = () => {
    router.push("/");
  };

  const handleLoginClick = () => {
    router.push("/?modal=login");
  };

  const handleSignupClick = () => {
    router.push("/auth/signup");
  };

  return (
    <>
      <Flex
        as="header"
        w="100%"
        backgroundColor={bgColorNoOpacity}
        mx="auto"
        alignItems="center"
        px="6"
        py="2"
        borderBottom="1px solid"
        borderColor={borderColor}
        position="sticky"
        top={0}
        zIndex={20}
      >
        <Link href="/" display={{ base: "none", lg: "flex" }} alignItems="center">
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

        {/* {isAuthenticated && isVisible && <Search />} */}

        <Flex alignItems="center" ml="auto">
          {isAuthenticated && <Notification />}

          {!isAuthenticated ? (
            <Flex gap={2} py="3">
              <Button
                onClick={handleLoginClick}
                color="white"
                bg="green.400"
                size={["sm", "sm"]}
                _hover={{ bg: "green.600" }}
              >
                Login
              </Button>

              <Button variant="ghost" color={textSecondaryButton} size={["sm", "sm"]} onClick={handleSignupClick}>
                Criar uma conta
              </Button>
            </Flex>
          ) : (
            <Profile showProfileData={isVisible} />
          )}
        </Flex>
      </Flex>
      <ReusableModal isOpen={isLoginModalOpen} onClose={handleClose} size="6xl">
        <LoginModal />
      </ReusableModal>
    </>
  );
}
