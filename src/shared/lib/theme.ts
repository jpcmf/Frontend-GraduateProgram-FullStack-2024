// import { modalAnatomy as parts } from "@chakra-ui/anatomy";
// import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
// import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

// const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

// const baseStyle = definePartsStyle({
//   overlay: {
//     bg: "blackAlpha.200"
//   },
//   dialog: {
//     borderRadius: 0,
//     bg: "transparent",
//     padding: 0,
//     margin: 0,
//     shadow: "none"
//   },
//   body: {
//     padding: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// });

// export const modalTheme = defineMultiStyleConfig({
//   baseStyle
// });

// const config: ThemeConfig = {
//   initialColorMode: "dark",
//   useSystemColorMode: false
// };

// export const theme = extendTheme({
//   config,
//   components: {
//     Modal: modalTheme
//   },
//   colors: {
//     gray: {
//       "900": "#262829",
//       "800": "#323238",
//       "700": "#414a4d",
//       "600": "#687173",
//       "500": "#909799",
//       "200": "#a8a8b3",
//       "100": "#e1e1e1",
//       "50": "#ffffff"
//     }
//   },
//   fonts: {
//     heading: "var(--font-raleway)",
//     body: "var(--font-roboto)"
//   },
//   styles: {
//     global: (props: { colorMode: string }) => ({
//       body: {
//         bg: props.colorMode === "light" ? "gray.50" : "gray.900",
//         color: props.colorMode === "light" ? "gray.900" : "gray.50",
//         height: "unset"
//       },
//       ".scroll-container": {
//         height: "500px",
//         overflow: "auto",
//         background: [
//           "linear-gradient(white 30%, rgba(255, 255, 255, 0)) center top",
//           "radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center top"
//         ].join(", "),
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "100% 40px, 100% 14px",
//         backgroundAttachment: "local, scroll"
//       }
//     })
//   }
// });

import { createMultiStyleConfigHelpers, defineStyleConfig, extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

/* ------------------------------------------------------------------
 * 1. FOUNDATION TOKENS  (raw values, never used directly in screens)
 * ---------------------------------------------------------------- */
const colors = {
  hub: {
    black: "#121415",
    canvas: "#131516",
    dark: "#181a1b",
    surface: "#202324",
    hover: "#282b2d",
    border: "#2c3033",
    muted: "#8e969b"
  },
  hubLight: {
    black: "#121415",
    canvas: "#f6f7f7",
    solid: "#ffffff",
    raised: "#f1f3f4",
    hover: "#e7eaeb",
    border: "#e2e6e7",
    header: "rgba(255, 255, 255, 0.85)",
    panel: "rgba(255, 255, 255, 0.85)",
    muted: "#697076"
  },
  brand: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // hub-green
    600: "#16a34a", // hub-green-dark
    700: "#15803d",
    800: "#166534",
    900: "#14532d"
  }
};

const fonts = {
  heading: `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
  body: `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`
};

const fontSizes = {
  "2xs": "0.625rem", // 10px
  xs: "0.75rem", // 12px
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem"
};

const radii = { md: "6px", lg: "8px", xl: "12px" };

/* ------------------------------------------------------------------
 * 2. SEMANTIC TOKENS  (what screens/components actually consume)
 * ---------------------------------------------------------------- */
const semanticTokens = {
  colors: {
    "surface.canvas": { default: "hub.canvas", _light: "hubLight.canvas" },
    "surface.header": { default: "rgba(18, 20, 21, 0.9)", _light: "hubLight.header" },
    "surface.panel": { default: "rgba(24, 26, 27, 0.7)", _light: "hubLight.panel" },
    "surface.solid": { default: "hub.dark", _light: "hubLight.solid" },
    "surface.raised": { default: "hub.surface", _light: "hubLight.raised" },
    "surface.hover": { default: "hub.hover", _light: "hubLight.hover" },

    "line.subtle": { default: "hub.border", _light: "hubLight.border" },
    "line.faint": { default: "rgba(44, 48, 51, 0.5)", _light: "rgba(18, 20, 21, 0.08)" },

    "content.primary": { default: "white", _light: "hubLight.black" },
    "content.secondary": { default: "gray.300", _light: "gray.600" },
    "content.body": { default: "gray.200", _light: "gray.700" },
    "content.muted": { default: "hub.muted", _light: "hubLight.muted" },

    "accent.base": { default: "brand.500", _light: "brand.600" },
    "accent.hover": { default: "brand.600", _light: "brand.700" },
    "accent.subtle": { default: "rgba(34, 197, 94, 0.1)", _light: "rgba(22, 163, 74, 0.12)" },
    "accent.line": { default: "rgba(34, 197, 94, 0.2)", _light: "rgba(22, 163, 74, 0.25)" },
    "accent.onSolid": { default: "#000000", _light: "#ffffff" },

    "danger.base": { default: "red.600", _light: "red.600" },
    "danger.hover": { default: "red.700", _light: "red.700" }
  }
};

/* ------------------------------------------------------------------
 * 3. COMPONENT STYLES
 * ---------------------------------------------------------------- */

// Panel: the base container for every card in the UI
const Panel = defineStyleConfig({
  baseStyle: {
    bg: "surface.panel",
    border: "1px solid",
    borderColor: "line.subtle",
    borderRadius: "xl",
    boxShadow: "sm",
    transition: "background 0.2s, border-color 0.2s"
  },
  variants: {
    base: {},
    interactive: { bg: "surface.panel", _hover: { bg: "surface.raised" } },
    flat: { boxShadow: "none", bg: "transparent" }
  },
  sizes: {
    sm: { p: 3 },
    md: { p: 4 },
    lg: { p: 5 }
  },
  defaultProps: { variant: "base", size: "md" }
});

const Button = defineStyleConfig({
  baseStyle: { fontWeight: 600, lineHeight: 1, borderRadius: "lg", transition: "all 0.2s" },
  sizes: {
    sm: { h: 8, px: 4, fontSize: "xs" },
    md: { h: 9, px: 4, fontSize: "sm" }
  },
  variants: {
    accent: {
      bg: "accent.base",
      color: "accent.onSolid",
      boxShadow: "0 1px 6px rgba(34,197,94,0.2)",
      _hover: { bg: "accent.hover", _disabled: { bg: "accent.base" } }
    },
    danger: {
      bg: "danger.base",
      color: "white",
      _hover: { bg: "danger.hover" }
    },
    subtle: {
      bg: "surface.raised",
      color: "content.body",
      border: "1px solid",
      borderColor: "line.subtle",
      _hover: { bg: "surface.hover", color: "content.primary" }
    },
    quiet: {
      bg: "transparent",
      color: "content.muted",
      _hover: { bg: "surface.raised", color: "content.primary" }
    },
    link: { color: "accent.base", h: "auto", p: 0, _hover: { textDecoration: "underline" } }
  },
  defaultProps: { variant: "subtle", size: "md" }
});

const tagHelpers = createMultiStyleConfigHelpers(["container", "label", "closeButton"]);

const Tag = tagHelpers.defineMultiStyleConfig({
  baseStyle: {
    container: { borderRadius: "full", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }
  },
  variants: {
    chip: {
      container: {
        bg: "surface.raised",
        color: "content.secondary",
        border: "1px solid",
        borderColor: "line.subtle",
        _hover: { bg: "surface.hover" }
      }
    },
    chipActive: {
      container: { bg: "accent.base", color: "accent.onSolid", fontWeight: 700 }
    }
  },
  defaultProps: { variant: "chip", size: "md" }
});

const Badge = defineStyleConfig({
  baseStyle: { borderRadius: "full", textTransform: "none", fontWeight: 700 },
  variants: {
    count: { bg: "accent.base", color: "accent.onSolid", px: 1.5, fontSize: "xs" },
    beta: {
      bg: "brand.900",
      color: "accent.base",
      border: "1px solid",
      borderColor: "accent.line",
      borderRadius: "md",
      fontFamily: "mono",
      fontSize: "2xs",
      px: 1.5
    },
    role: {
      bg: "surface.raised",
      color: "content.secondary",
      border: "1px solid",
      borderColor: "line.subtle",
      borderRadius: "md",
      fontWeight: 500,
      fontSize: "2xs",
      px: 1.5
    },
    roleLegend: {
      bg: "surface.raised",
      color: "accent.base",
      border: "1px solid",
      borderColor: "line.subtle",
      borderRadius: "md",
      fontWeight: 500,
      fontSize: "2xs",
      px: 1.5
    }
  }
});

const Input = defineStyleConfig({
  variants: {
    pill: {
      field: {
        bg: "surface.solid",
        border: "1px solid",
        borderColor: "line.subtle",
        borderRadius: "full",
        color: "content.body",
        _placeholder: { color: "content.muted" },
        _focusVisible: { borderColor: "accent.base", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }
      }
    }
  },
  defaultProps: { variant: "pill" }
});

const Modal = defineStyleConfig({
  baseStyle: {
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
  }
});

/* ------------------------------------------------------------------
 * 4. GLOBAL STYLES
 * ---------------------------------------------------------------- */
const styles = {
  global: {
    body: {
      bg: "surface.canvas",
      color: "content.body",
      backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
      WebkitFontSmoothing: "antialiased"
    },
    "::selection": { bg: "brand.500", color: "white" },
    "::-webkit-scrollbar": { width: "6px", height: "6px" },
    "::-webkit-scrollbar-track": { bg: "hub.dark" },
    "::-webkit-scrollbar-thumb": { bg: "#2a2e30", borderRadius: "9999px" },
    "::-webkit-scrollbar-thumb:hover": { bg: "#393e42" }
  }
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
  fontSizes,
  radii,
  semanticTokens,
  styles,
  components: { Panel, Button, Tag, Badge, Input, Modal }
});

export default theme;
