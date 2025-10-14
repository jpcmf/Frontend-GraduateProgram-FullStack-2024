import { useContext } from "react";
import { RiMenuLine } from "react-icons/ri";
import { TbSkateboard } from "react-icons/tb";
import Link from "next/link";
import { useRouter } from "next/router";

import { Button, Flex, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";

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

  return (
    <>
      <Flex as="header" w="100%" maxWidth={1144} mx="auto" my="8" align="center" px="0">
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

        <Flex align="center" ml="auto">
          {isAuthenticated && <Notification />}

          {!isAuthenticated ? (
            <Button
              as={Link}
              href={{
                pathname: router.pathname,
                query: { ...router.query, modal: "login" }
              }}
              variant="ghost"
              border="1px"
              borderColor="green.400"
              color="green.400"
              gap={2}
              px={4}
              py={2}
              fontWeight="semibold"
              fontSize="sm"
              _hover={{
                textDecoration: "none",
                transform: "translateY(-2px)",
                shadow: "lg"
              }}
              transition="all 0.2s"
            >
              <TbSkateboard size={18} />
              Faça seu login
            </Button>
          ) : (
            <Profile showProfileData={isVisible} />
          )}
        </Flex>
      </Flex>
      <ReusableModal isOpen={isLoginModalOpen} onClose={handleClose} title="Login" size="6xl">
        <LoginModal />
      </ReusableModal>
    </>
  );
}
