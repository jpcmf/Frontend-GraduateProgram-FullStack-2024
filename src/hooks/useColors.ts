import { useColorModeValue } from "@chakra-ui/react";

export function useColors() {
  return {
    bgColor: useColorModeValue("blackAlpha.100", "gray.800"),
    cardBg: useColorModeValue("white", "gray.700"),
    textSecondary: useColorModeValue("gray.500", "zinc.400"),
    border: useColorModeValue("gray.200", "gray.600"),
    textPrimary: useColorModeValue("gray.900", "whiteAlpha.900")
  };
}
