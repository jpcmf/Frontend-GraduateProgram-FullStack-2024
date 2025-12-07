import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  overlay: {
    bg: "blackAlpha.200"
  },
  dialog: {
    borderRadius: 0,
    bg: "transparent",
    padding: 0,
    margin: 0,
    shadow: "none"
  },
  body: {
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle
});
