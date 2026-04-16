import { RiLogoutCircleLine } from "react-icons/ri";
import { TbMoon, TbSun } from "react-icons/tb";
import { useRouter } from "next/router";

import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";

import { useAuth } from "@/hooks/useAuth";

interface ProfileProps {
  showProfileData: boolean | undefined;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, signOut } = useAuth();
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("blackAlpha.200", "gray.700");
  const menuItemBgHoverColor = useColorModeValue("gray.100", "white");
  const menuItemTextColor = useColorModeValue("gray.600", "gray.500");
  const dividerBorderColor = useColorModeValue("blackAlpha.200", "gray.700");

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.name}</Text>
          <Text color="gray.600" fontSize="small">
            {user?.email}
          </Text>
        </Box>
      )}
      <Menu>
        <MenuButton
          border={"2px solid"}
          borderColor="transparent"
          _hover={{ cursor: "pointer", border: "2px solid", borderColor: "green.400" }}
          borderRadius="full"
        >
          <Avatar
            size="md"
            bgColor="green.300"
            src={user?.avatar ? user?.avatar.url : "https://robohash.org/" + user?.email}
            m={0.5}
          />
        </MenuButton>

        <MenuList bg={bgColor} borderColor={borderColor}>
          <MenuGroup title="Minha conta">
            <MenuItem
              color={menuItemTextColor}
              bg={bgColor}
              _hover={{ color: menuItemBgHoverColor }}
              onClick={() => router.push("/user/edit")}
              px={4}
            >
              Editar perfil
            </MenuItem>
            <MenuDivider borderColor={dividerBorderColor} />
            <MenuItem
              color={menuItemTextColor}
              bg={bgColor}
              _hover={{ color: menuItemBgHoverColor }}
              onClick={() => router.push("/dashboard")}
              px={4}
            >
              Aréa do skatista
            </MenuItem>
            <MenuDivider borderColor={dividerBorderColor} />
            <MenuItem
              icon={colorMode === "light" ? <TbMoon size={16} /> : <TbSun size={16} />}
              onClick={toggleColorMode}
              color={menuItemTextColor}
              bg={bgColor}
              _hover={{ color: menuItemBgHoverColor }}
              py={0}
            >
              {colorMode === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            </MenuItem>
            <MenuDivider borderColor={dividerBorderColor} />
            <MenuItem
              icon={<RiLogoutCircleLine size={16} />}
              onClick={signOut}
              color={menuItemTextColor}
              bg={bgColor}
              _hover={{ color: menuItemBgHoverColor }}
              py={0}
            >
              Logout
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Flex>
  );
}
