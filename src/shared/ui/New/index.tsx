"use client";

import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

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
