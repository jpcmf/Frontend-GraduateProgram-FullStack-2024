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

      {isVisible && <Search />}

      <Flex align="center" ml="auto">
        <Notification />
        <Profile showProfileData={isVisible} />
      </Flex>
    </Flex>
  );
}
