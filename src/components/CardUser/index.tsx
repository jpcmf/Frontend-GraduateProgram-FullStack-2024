import { useContext } from "react";
import { FaGlobe, FaInstagram } from "react-icons/fa";
import { TbMapPinHeart, TbMessage, TbUserPlus } from "react-icons/tb";

import {
  Avatar as ChakraAvatar,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import Avatar from "boring-avatars";

import { AuthContext } from "@/contexts/AuthContext";
import type { UserBasics } from "@/types/usersBasics.type";

export function UserCard({ user }: { user: UserBasics }) {
  const { isAuthenticated } = useContext(AuthContext);

  const bgColor = useColorModeValue("gray.800", "gray.800");
  const textColor = useColorModeValue("gray.300", "gray.300");
  const iconColor = useColorModeValue("gray.400", "gray.400");

  const handleContact = () => {
    alert("Contact functionality - implement your preferred method!");
  };

  const openInstagram = () => {
    if (!user.instagram_url) return;
    window.open(`https://instagram.com/${user.instagram_url.replace("@", "")}`, "_blank");
  };

  const openWebsite = () => {
    if (!user.website_url) return;
    window.open(`https://${user.website_url}`, "_blank");
  };

  return (
    <Box bg={bgColor} borderRadius="xl" p={4} maxW="sm" w="full" textAlign="center">
      <VStack spacing={4}>
        {user?.avatar ? (
          <ChakraAvatar size="xl" src={user.avatar.formats.thumbnail.url} name={user.name} />
        ) : (
          <Avatar name={user.name} size={96} />
        )}
        <VStack spacing={1}>
          <Text fontSize="xl" fontWeight="semibold" color="gray.100">
            {user.name}
          </Text>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <Text fontSize="md" color="gray.600">
              {user.category?.name ? user.category.name : "Skater"}
            </Text>
          </Box>
        </VStack>

        <HStack spacing={1} color={textColor}>
          <Icon as={TbMapPinHeart} size={16} color={iconColor} />
          <Text fontSize="sm" color="gray.500">
            {user?.address?.city ? user.address.city : "Unknown"}
          </Text>
          {/* TODO: add country flag */}
          {/* <Divider orientation="vertical" height="12px" borderColor={iconColor} /> */}
          {/* <img src="https://flagcdn.com/16x12/br.png" width="16" height="12" alt="Ukraine" /> */}
          {/* <Text fontSize="sm" color="gray.500">
            {user?.address?.country ? user.address.country : "Unknown"}
          </Text> */}
        </HStack>

        <HStack spacing={4} h="5">
          <VStack spacing={1} cursor="pointer" onClick={openInstagram}>
            {user.instagram_url && (
              <Icon
                as={FaInstagram}
                boxSize={5}
                color="pink.500"
                _hover={{ color: "pink.600", transform: "scale(1.1)" }}
                transition="all 0.2s"
              />
            )}
          </VStack>

          {user.website_url && (
            <VStack spacing={1} cursor="pointer" onClick={openWebsite}>
              <Icon
                as={FaGlobe}
                boxSize={5}
                color="blue.500"
                _hover={{ color: "blue.600", transform: "scale(1.1)" }}
                transition="all 0.2s"
              />
            </VStack>
          )}
        </HStack>

        {isAuthenticated && (
          <>
            <Divider height="1px" borderColor="gray.700" />
            <HStack justifyContent="space-between" w="full">
              <Button
                variant="ghost"
                color="gray.400"
                size="xs"
                width="full"
                borderRadius="md"
                onClick={handleContact}
                _hover={{
                  transform: "translateY(-2px)"
                }}
                transition="all 0.2s"
                fontSize="xs"
                gap={1}
              >
                <TbUserPlus size={20} />
              </Button>
              <Button
                variant="ghost"
                color="green.400"
                size="xs"
                width="full"
                borderRadius="md"
                onClick={handleContact}
                _hover={{
                  transform: "translateY(-2px)"
                }}
                transition="all 0.2s"
                fontSize="xs"
                gap={1}
              >
                <TbMessage size={20} />
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  );
}
