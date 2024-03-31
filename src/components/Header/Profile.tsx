import { useContext } from "react";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Box, Flex, Text, Menu, Avatar, MenuList, MenuItem, MenuButton } from "@chakra-ui/react";

import { AuthContext } from "@/contexts/AuthContext";

interface ProfileProps {
  showProfileData: boolean | undefined;
}

export function Profile({ showProfileData = true }: ProfileProps) {
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
        <MenuButton>
          <Avatar
            size="md"
            name={user?.name}
            bgColor="green.300"
            // src="https://github.com/jpcmf.png"
          />
        </MenuButton>

        <MenuList bg="gray.900" borderColor="gray.800">
          <>
            <MenuItem
              icon={<RiLogoutCircleLine size={16} />}
              onClick={signOut}
              color="gray.600"
              bg="gray.900"
              _hover={{ color: "white" }}
            >
              Logout
            </MenuItem>
            <MenuItem color="gray.600" bg="gray.900" _hover={{ color: "white" }}>
              {user?.about}
            </MenuItem>
          </>
        </MenuList>
      </Menu>
    </Flex>
  );
}
