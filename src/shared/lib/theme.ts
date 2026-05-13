import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
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

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

export const theme = extendTheme({
  config,
  components: {
    Modal: modalTheme
  },
  colors: {
    gray: {
      "900": "#262829",
      "800": "#323238",
      "700": "#414a4d",
      "600": "#687173",
      "500": "#909799",
      "200": "#a8a8b3",
      "100": "#e1e1e1",
      "50": "#ffffff"
    }
  },
  fonts: {
    heading: "var(--font-raleway)",
    body: "var(--font-roboto)"
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === "light" ? "gray.50" : "gray.900",
        color: props.colorMode === "light" ? "gray.900" : "gray.50",
        height: "unset"
      },
      ".scroll-container": {
        height: "500px",
        overflow: "auto",
        background: [
          "linear-gradient(white 30%, rgba(255, 255, 255, 0)) center top",
          "radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center top"
        ].join(", "),
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 40px, 100% 14px",
        backgroundAttachment: "local, scroll"
      }
    })
  }
});
