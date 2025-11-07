import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

import Modal from "./modal";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

export const theme = extendTheme({
  config,
  components: {
    Modal
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
        color: props.colorMode === "light" ? "gray.900" : "gray.50"
      }
    })
  }
});
