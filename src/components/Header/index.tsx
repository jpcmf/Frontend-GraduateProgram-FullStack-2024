import { useContext } from "react";
import { RiMenuLine } from "react-icons/ri";
import { useRouter } from "next/router";

import { Button, Flex, Icon, IconButton, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";

import { AuthContext } from "@/contexts/AuthContext";
import { useSidebarDrawer } from "@/contexts/SidebarDrawerContext";
import LoginModal from "@/features/login/modal/login";

import { ReusableModal } from "../ReusableModal";

import { Notification } from "./Notification";
import { Profile } from "./Profile";

export function Header() {
  const { onOpen } = useSidebarDrawer();
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const textSecondaryButton = useColorModeValue("gray.800", "green.400");

  const isVisible = useBreakpointValue({
    base: false,
    lg: true
  });

  const isLoginModalOpen = router.query.modal === "login";

  const handleClose = () => {
    const { modal: _modal, ...restQuery } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: restQuery
      },
      undefined,
      { shallow: true }
    );
  };

  const handleLoginClick = () => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, modal: "login" }
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSignupClick = () => {
    router.push("/auth/signup");
  };

  return (
    <>
      <Flex as="header" w="100%" maxWidth={1144} mx="auto" mt="8" align="center" px="0">
        {!isVisible && (
          <IconButton
            aria-label="Open navigation"
            icon={<Icon as={RiMenuLine} />}
            fontSize="24"
            variant="unstyled"
            onClick={onOpen}
            mr="2"
          ></IconButton>
        )}

        {/* {isAuthenticated && isVisible && <Search />} */}

        <Flex alignItems="center" ml="auto">
          {isAuthenticated && <Notification />}

          {!isAuthenticated ? (
            <Flex gap={2}>
              <Button
                onClick={handleLoginClick}
                color="white"
                bg="green.400"
                size={["sm", "md"]}
                _hover={{ bg: "green.600" }}
              >
                Login
              </Button>

              <Button variant="ghost" color={textSecondaryButton} size={["sm", "md"]} onClick={handleSignupClick}>
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
