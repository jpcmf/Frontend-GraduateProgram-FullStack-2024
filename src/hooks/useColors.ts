import { useColorModeValue } from "@chakra-ui/react";

export function useColors() {
  return {
    logoFillColor: useColorModeValue("#323238", "#ededed"),
    bgColor: useColorModeValue("blackAlpha.100", "gray.800"),
    bgColorNoOpacity: useColorModeValue("#f0f0f0", "gray.800"),
    borderColor: useColorModeValue("blackAlpha.50", "whiteAlpha.50"),
    cardBg: useColorModeValue("blackAlpha.100", "gray.800"),
    textSecondary: useColorModeValue("gray.500", "zinc.400"),
    border: useColorModeValue("gray.200", "gray.600"),
    textPrimary: useColorModeValue("gray.900", "whiteAlpha.900"),
    footerBgButtonColor: useColorModeValue("red.500", "red.600"),
    footerTextButtonColor: useColorModeValue("white", "gray.100"),
    footerBorderColor: useColorModeValue("blackAlpha.100", "gray.800")
  };
}
