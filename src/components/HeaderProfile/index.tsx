import { useContext } from "react";
import { FaGlobe, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { TbEdit, TbEye, TbPhoto } from "react-icons/tb";
import router from "next/router";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue
} from "@chakra-ui/react";

import { AuthContext } from "@/contexts/AuthContext";
import type { UserBasics } from "@/types/usersBasics.type";
import { openInstagram, openWebsite } from "@/utils/socialMedia";

interface ProfileHeaderProps {
  user: UserBasics;
  variant?: "profile" | "edit";
}

export function ProfileHeader({ user, variant }: ProfileHeaderProps) {
  const { isAuthenticated } = useContext(AuthContext);
  const cardBg = useColorModeValue("blackAlpha.100", "gray.800");
  const textSecondary = useColorModeValue("slate.500", "zinc.400");
  const avatarBorder = useColorModeValue("surface.light", "surface.dark");
  const handleEditProfileClick = () => {
    if (isAuthenticated) {
      router.push("/user/edit");
    } else {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, modal: "login" }
        },
        undefined,
        { shallow: true }
      );
    }
  };
  const handleViewProfileClick = () => {
    router.push(`/user/${user.id}`);
  };
  return (
    <Box position="relative" mb="6" bg={cardBg} borderRadius="xl" overflow="hidden" shadow="sm">
      <Box h="48" w="full" bgGradient="linear(to-r, zinc.800, zinc.900)" overflow="hidden">
        <Image
          alt="Cover background"
          w="full"
          h="full"
          objectFit="cover"
          opacity="0.4"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAraVEKLoGCYtR7Kib5PJkEDfuwJ2U6BekW_vycS6UpuykghmJlhh8840iG644X6aIuy7ec3xtQp1a2sxxv9eZFQB_8mn_CyncjTTz_C7YNnkIhJtnyBJCDk2I_9Isukql9I80BuLZ2kxiy70ms3-f_vc6F5Yh5p26Fart9N68RU12eGWrt0KbPq56PY-Cv5YeYO83Mu0XR4vvQHsnfC7cp3w9PtYUtGrM8QV6VXbxVcKpFBs-ITj9EUg9voifLTRHT0vZ53Xx4K0k"
        />
      </Box>

      <Flex
        p="6"
        direction={{ base: "column", md: "row" }}
        align={{ base: "center", md: "flex-end" }}
        mt={{ base: "-16", md: "-20" }}
        gap="6"
      >
        <Box
          position="relative"
          role="group"
          bgGradient="linear(to-tr, green.100, purple.600)"
          borderRadius="full"
          p={0.5}
        >
          <Avatar
            size="2xl"
            name={user?.name}
            src={user?.avatar?.formats?.thumbnail?.url}
            w={{ base: "32", md: "40" }}
            h={{ base: "32", md: "40" }}
            border="4px"
            borderColor={avatarBorder}
            shadow="xl"
          />
          {variant === "edit" && (
            <Flex
              position="absolute"
              inset="0"
              borderRadius="full"
              bg="blackAlpha.600"
              opacity="0"
              _groupHover={{ opacity: 1 }}
              align="center"
              justify="center"
              transition="opacity 0.2s"
              cursor="pointer"
            >
              <Box as="span" className="material-icons-outlined" color="white" fontSize="3xl">
                <TbPhoto />
              </Box>
            </Flex>
          )}
        </Box>

        <Box flex="1" textAlign={{ base: "center", md: "left" }}>
          <HStack>
            <Heading as="h3" size="md" mb="1">
              {user?.name}
            </Heading>
            {user?.category && (
              <Badge colorScheme="green" px={2} py={0} borderRadius="full">
                {user?.category?.name}
              </Badge>
            )}
          </HStack>

          <HStack mt="1" mb="4">
            <Icon as={FaMapMarkerAlt} />
            <Text as="small" color={textSecondary}>
              {user?.address?.city}, {user?.address?.uf}, {user?.address?.country}
            </Text>
          </HStack>
          {variant === "profile" && (
            <Text fontSize="sm" color={textSecondary} mb={{ base: "2", md: "0" }}>
              Personalize como os outros veem você na plataforma.
            </Text>
          )}
        </Box>

        <Box
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          alignItems={{ base: "center", md: "end" }}
          gap={4}
        >
          {variant === "profile" && (
            <>
              <HStack spacing={4}>
                {user?.instagram_url && (
                  <Link as="button" onClick={() => openInstagram(user.instagram_url)} _hover={{ opacity: 0.8 }}>
                    <Icon as={FaInstagram} w={6} h={6} />
                  </Link>
                )}
                {user?.website_url && (
                  <Link as="button" onClick={() => openWebsite(user.website_url)} _hover={{ opacity: 0.8 }}>
                    <Icon as={FaGlobe} w={6} h={6} />
                  </Link>
                )}
              </HStack>
              <Button
                variant="ghost"
                onClick={handleEditProfileClick}
                color="white"
                bg="blackAlpha.300"
                size={["sm", "md"]}
                gap={2}
              >
                <Icon as={TbEdit} />
                Editar perfil
              </Button>
            </>
          )}

          {variant === "edit" && (
            <Button
              variant="ghost"
              onClick={handleViewProfileClick}
              color="white"
              bg="blackAlpha.300"
              size={["sm", "md"]}
              gap={2}
            >
              <Icon as={TbEye} />
              Visualizar perfil
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
