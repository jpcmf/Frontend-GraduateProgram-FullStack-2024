"use client";

import { useContext } from "react";
import { RiMenuLine } from "react-icons/ri";
// import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";

import { Button, Flex, Icon, IconButton, Link, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";

import { useSidebarDrawer } from "@/app/SidebarDrawerContext";
import { AuthContext } from "@/features/auth";
import { useColors } from "@/shared/hooks/useColors";
import { LogoSkateHub } from "@/shared/ui/LogoSkateHub";

import { Notification } from "./Notification";
import { Profile } from "./Profile";

export function Header() {
  const { bgColorNoOpacity, borderColor } = useColors();
  const { onOpen } = useSidebarDrawer();
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const textSecondaryButton = useColorModeValue("gray.800", "green.400");

  const isVisible = useBreakpointValue({
    base: false,
    lg: true
  });

  const handleLoginClick = () => {
    router.push("/auth/signin");
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
                Criar conta
              </Button>
            </Flex>
          ) : (
            <Profile showProfileData={isVisible} />
          )}
        </Flex>
      </Flex>
    </>
  );
}
