import { FaGlobe, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";

import { Avatar, Box, Button, HStack, Icon, Text, useColorModeValue, VStack } from "@chakra-ui/react";

import type { UserBasics } from "@/types/usersBasics.type";

export function UserCard({ user }: { user: UserBasics }) {
  const bgColor = useColorModeValue("gray.800", "gray.800");
  const borderColor = useColorModeValue("gray.800", "gray.600");
  const textColor = useColorModeValue("gray.300", "gray.300");
  const iconColor = useColorModeValue("gray.400", "gray.400");

  // Sample user data - replace with your actual data
  // const userData = {
  //   name: "Sarah Johnson",
  //   city: "San Francisco, CA",
  //   avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
  //   instagram: "@sarahjohnson",
  //   website: "www.sarahjohnson.com"
  // };

  const handleContact = () => {
    // Add your contact logic here
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
        <Avatar
          size="xl"
          src={user?.avatar ? user.avatar.formats.thumbnail.url : "https://placehold.co/96x96/png"}
          name={user.name}
        />

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
              boxSize={6}
              color="pink.500"
              _hover={{ color: "pink.600", transform: "scale(1.1)" }}
              transition="all 0.2s"
            />
          </VStack>

          {/* Website */}
          <VStack spacing={1} cursor="pointer" onClick={openWebsite}>
            <Icon
              as={FaGlobe}
              boxSize={6}
              color="blue.500"
              _hover={{ color: "blue.600", transform: "scale(1.1)" }}
              transition="all 0.2s"
            />
          </VStack>
        </HStack>

        <Button
          // colorScheme="green"
          bg="green.700"
          color="green.100"
          size="sm"
          width="full"
          borderRadius="md"
          onClick={handleContact}
          _hover={{
            transform: "translateY(-2px)",
            shadow: "lg"
          }}
          transition="all 0.2s"
        >
          Get In Touch
        </Button>
      </VStack>
    </Box>
  );
}
