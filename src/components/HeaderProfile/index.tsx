import { useContext, useRef, useState } from "react";
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
  Spinner,
  Text,
  useColorModeValue
} from "@chakra-ui/react";

import { AuthContext } from "@/contexts/AuthContext";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import type { UserBasics } from "@/types/usersBasics.type";
import { openInstagram, openWebsite } from "@/utils/socialMedia";

import { Toast } from "../Toast";

interface ProfileHeaderProps {
  user: UserBasics;
  variant?: "profile" | "edit";
}

export function ProfileHeader({ user, variant }: ProfileHeaderProps) {
  const { isAuthenticated, user: authUser } = useContext(AuthContext);
  const { handleUploadAvatar, isUploading } = useAvatarUpload();
  const { addToast } = Toast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const cardBg = useColorModeValue("blackAlpha.100", "gray.800");
  const textSecondary = useColorModeValue("slate.500", "zinc.400");

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
  const handleAvatarClick = () => {
    if (variant === "edit") {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !authUser?.id) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    try {
      await handleUploadAvatar(file, authUser.id);
      addToast({
        title: "Avatar atualizado.",
        message: "Sua foto de perfil foi salva com sucesso.",
        type: "success"
      });
    } catch {
      URL.revokeObjectURL(previewUrl);
      setAvatarPreview(null);
      addToast({
        title: "Erro ao enviar avatar.",
        message: "Não foi possível atualizar sua foto. Tente novamente.",
        type: "error"
      });
    } finally {
      event.target.value = "";
    }
  };

  const avatarSrc = avatarPreview ?? user?.avatar?.formats?.thumbnail?.url;

  return (
    <Box position="relative" mb="6" bg={cardBg} borderRadius="lg" overflow="hidden">
      <Box h="48" w="full" bgGradient="linear(to-r, zinc.800, zinc.900)" overflow="hidden">
        <Image
          alt="Cover background"
          w="full"
          h="full"
          objectFit="cover"
          opacity=".5"
          src="https://placehold.net/default.svg"
        />
      </Box>

      <Flex
        p={{ base: 4, md: 8 }}
        direction={{ base: "column", md: "row" }}
        align={{ base: "center", md: "flex-end" }}
        mt={{ base: "-16", md: "-20" }}
        gap="6"
      >
        <Box
          position="relative"
          role="group"
          border={`3px solid`}
          borderColor="green.400"
          borderRadius="full"
          cursor={variant === "edit" ? "pointer" : "default"}
          onClick={handleAvatarClick}
        >
          <Avatar
            size="2xl"
            name={user?.name}
            src={avatarSrc}
            w={{ base: "32", md: "40" }}
            h={{ base: "32", md: "40" }}
            m={1}
          />
          {variant === "edit" && (
            <>
              <Flex
                position="absolute"
                inset="0"
                borderRadius="full"
                bg="blackAlpha.600"
                opacity={isUploading ? 1 : 0}
                _groupHover={{ opacity: 1 }}
                align="center"
                justify="center"
                transition="opacity 0.2s"
                cursor="pointer"
                m={1}
              >
                {isUploading ? <Spinner color="white" size="md" /> : <Icon as={TbPhoto} color="white" boxSize={6} />}
              </Flex>

              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </>
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

          <HStack mt="1" mb={{ base: 0, md: 9 }} justify={{ base: "center", md: "flex-start" }}>
            <Icon as={FaMapMarkerAlt} />
            <Text fontSize="sm" color={textSecondary}>
              {user?.address?.city}, {user?.address?.uf}, {user?.address?.country}
            </Text>
          </HStack>
          {variant === "edit" && authUser?.id === user?.id && (
            <Text position={"absolute"} top={4} left={4} fontSize="sm" color={textSecondary} mb={{ base: "2", md: "0" }}>
              Personalize como os outros veem você na plataforma.
            </Text>
          )}
        </Box>

        <Box
          display="flex"
          flexDirection="column"
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
              {authUser?.id === user?.id && (
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
              )}
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
