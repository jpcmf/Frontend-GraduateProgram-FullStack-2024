"use client";

import { Box, Center, Text, TextProps } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

/* Muted text helper */
export const Muted = (props: TextProps) => <Text color="content.muted" fontSize="xs" {...props} />;

/* Live status dot with pulse */
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.4}`;
export const LiveDot = ({ size = 2 }: { size?: number }) => (
  <Box
    w={size}
    h={size}
    borderRadius="full"
    bg="accent.base"
    animation={`${pulse} 2s ease-in-out infinite`}
    sx={{ "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}
  />
);

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
      color="white"
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
