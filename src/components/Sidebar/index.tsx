import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link,
  useBreakpointValue
} from "@chakra-ui/react";

import { useSidebarDrawer } from "@/contexts/SidebarDrawerContext";
import { useColors } from "@/hooks/useColors";

import { LogoSkateHub } from "../LogoSkateHub";

import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  const { isOpen, onClose } = useSidebarDrawer();
  const { bgColor, borderColor } = useColors();

  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false
  });

  if (isDrawerSidebar) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay p={0}>
          <DrawerContent>
            <DrawerCloseButton mt={3} />
            <DrawerHeader p={6} bg={bgColor} borderBottom="1px" borderColor={borderColor}>
              <Link href="/" display={{ base: "flex", lg: "none" }} alignItems="center">
                <LogoSkateHub />
              </Link>
            </DrawerHeader>
            <DrawerBody p="0">
              <SidebarNav />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  }

  return (
    <Box as="aside" w="64" flexShrink={0}>
      <SidebarNav />
    </Box>
  );
}
