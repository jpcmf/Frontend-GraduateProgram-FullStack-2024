import { useContext } from "react";
import { FaGlobe, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { TbMessage } from "react-icons/tb";

import { Avatar as ChakraAvatar, Box, Button, HStack, Icon, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import Avatar from "boring-avatars";

import { AuthContext } from "@/contexts/AuthContext";
import type { UserBasics } from "@/types/usersBasics.type";

export function UserCard({ user }: { user: UserBasics }) {
  const { isAuthenticated } = useContext(AuthContext);
  const bgColor = useColorModeValue("gray.800", "gray.800");
  const borderColor = useColorModeValue("gray.800", "gray.600");
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
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={4}
      shadow="lg"
      maxW="sm"
      w="full"
      textAlign="center"
    >
      <VStack spacing={4}>
        {user?.avatar ? (
          <ChakraAvatar size="xl" src={user.avatar.formats.thumbnail.url} name={user.name} />
        ) : (
          <Avatar name={user.name} variant="beam" size={96} />
        )}

        <Text fontSize="xl" fontWeight="semibold" color="gray.700">
          {user.name}
        </Text>

        <HStack spacing={2} color={textColor}>
          <Icon as={FaMapMarkerAlt} color={iconColor} />
          <Text fontSize="sm">{user?.address?.city ? user.address.city : "Unknown"}</Text>
        </HStack>

        <HStack spacing={4}>
          <VStack spacing={1} cursor="pointer" onClick={openInstagram}>
            <Icon
              as={FaInstagram}
              boxSize={5}
              color="pink.500"
              _hover={{ color: "pink.600", transform: "scale(1.1)" }}
              transition="all 0.2s"
            />
          </VStack>

          {/* Website */}
          <VStack spacing={1} cursor="pointer" onClick={openWebsite}>
            <Icon
              as={FaGlobe}
              boxSize={5}
              color="blue.500"
              _hover={{ color: "blue.600", transform: "scale(1.1)" }}
              transition="all 0.2s"
            />
          </VStack>
        </HStack>
        <Button
          variant="ghost"
          border="1px"
          borderColor="green.400"
          color="green.400"
          size="md"
          width="full"
          borderRadius="md"
          onClick={handleContact}
          _hover={{
            transform: "translateY(-2px)",
            shadow: "lg"
          }}
          transition="all 0.2s"
          fontSize="xs"
          gap={2}
          disabled={!isAuthenticated ? true : false}
        >
          <TbMessage size={18} />
          Enviar mensagem
        </Button>
      </VStack>
    </Box>
  );
}
