import Link from "next/link";
import { useContext } from "react";
import { RiMenuLine } from "react-icons/ri";

import { Button, Flex, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";

import { AuthContext } from "@/contexts/AuthContext";
import { useSidebarDrawer } from "@/contexts/SidebarDrawerContext";

import { LogoSkateHub } from "../LogoSkateHub";

import { Notification } from "./Notification";
import { Profile } from "./Profile";

export function Header() {
  const { onOpen } = useSidebarDrawer();
  const { isAuthenticated, user } = useContext(AuthContext);

  const isVisible = useBreakpointValue({
    base: false,
    lg: true
  });

  return (
    <Flex as="header" w="100%" maxWidth={1480} h="20" mx="auto" mt="4" align="center" px="6">
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

      <LogoSkateHub showLogoData={isVisible} />

      {/* Show Search for authenticated users on larger screens */}
      {/* {isAuthenticated && isVisible && <Search />} */}

      <Flex align="center" ml="auto">
        {/* Show Notification only for authenticated users */}
        {isAuthenticated && <Notification />}

        {/* Show login button for non-authenticated users */}
        {!isAuthenticated ? (
          <Button color="white" bg="green.400" as={Link} href="/login" variant='solid'>
            Faça seu login
          </Button>
        ) : (
          /* Show Profile for authenticated users */
          <Profile showProfileData={isVisible} />
        )}
      </Flex>
    </Flex>
  );
}
