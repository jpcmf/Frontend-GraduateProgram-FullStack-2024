import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
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
    heading: "var(--font-roboto)",
    body: "var(--font-roboto)"
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "gray.50"
      }
    }
  }
});
