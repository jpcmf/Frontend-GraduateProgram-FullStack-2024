"use client";

import { Box, Center } from "@chakra-ui/react";

/* Avatar with initials — optional gradient ring (used on stories & profile) */
interface InitialsAvatarProps {
  initials?: string;
  bg?: string;
  size?: number | string;
  ring?: boolean;
  fontSize?: string;
}

export const InitialsAvatar = ({
  initials,
  bg = "surface.raised",
  size = 10,
  ring = false,
  fontSize = "sm"
}: InitialsAvatarProps) => {
  const circle = (
    <Center
      w={ring ? "100%" : size}
      h={ring ? "100%" : size}
      borderRadius="full"
      bg={bg}
      color="content.primary"
      fontWeight="bold"
      fontSize={fontSize}
      flexShrink={0}
    >
      {initials}
    </Center>
  );
  if (!ring) return circle;
  return (
    <Box w={size} h={size} p="2px" borderRadius="full" bgGradient="linear(to-tr, brand.500, cyan.400)" flexShrink={0}>
      <Box w="100%" h="100%" p="2px" borderRadius="full" bg="surface.canvas">
        {circle}
      </Box>
    </Box>
  );
};
