import { useContext } from "react";
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
  useColorMode
} from "@chakra-ui/react";

import { AuthContext } from "@/contexts/AuthContext";

interface ProfileProps {
  showProfileData: boolean | undefined;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, signOut } = useContext(AuthContext);

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

        <MenuList bg="gray.900" borderColor="gray.800">
          <MenuGroup title="Minha conta">
            <MenuItem
              color="gray.600"
              bg="gray.900"
              _hover={{ color: "white" }}
              onClick={() => router.push("/user/edit")}
              px={4}
            >
              Editar
            </MenuItem>
            <MenuDivider borderColor="gray.700" />
            <MenuItem
              icon={colorMode === "light" ? <TbMoon size={16} /> : <TbSun size={16} />}
              onClick={toggleColorMode}
              color="gray.600"
              bg="gray.900"
              _hover={{ color: "white" }}
              py={0}
            >
              {colorMode === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            </MenuItem>
            <MenuDivider borderColor="gray.700" />
            <MenuItem
              icon={<RiLogoutCircleLine size={16} />}
              onClick={signOut}
              color="gray.600"
              bg="gray.900"
              _hover={{ color: "white" }}
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
