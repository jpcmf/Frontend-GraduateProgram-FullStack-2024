import { describe, expect, it } from "vitest";

import { theme } from "@/shared/lib/theme";

type TokenValue = string | { default?: string; _light?: string };

const tokens = theme.semanticTokens.colors as Record<string, TokenValue>;

// Dark mode must keep these exact values (no regression).
const darkDefaults: Record<string, string> = {
  "surface.canvas": "hub.canvas",
  "surface.header": "rgba(18, 20, 21, 0.9)",
  "surface.panel": "rgba(24, 26, 27, 0.7)",
  "surface.solid": "hub.dark",
  "surface.raised": "hub.surface",
  "surface.hover": "hub.hover",
  "line.subtle": "hub.border",
  "line.faint": "rgba(44, 48, 51, 0.5)",
  "content.primary": "white",
  "content.secondary": "gray.300",
  "content.body": "gray.200",
  "content.muted": "hub.muted",
  "accent.base": "brand.500",
  "accent.hover": "brand.600",
  "accent.subtle": "rgba(34, 197, 94, 0.1)",
  "accent.line": "rgba(34, 197, 94, 0.2)",
  "accent.onSolid": "#000000",
  "danger.base": "red.600",
  "danger.hover": "red.700"
};

describe("theme semantic tokens", () => {
  it.each(Object.entries(darkDefaults))("%s keeps its dark default", (token, dark) => {
    const value = tokens[token];
    const resolvedDefault = typeof value === "string" ? value : value?.default;
    expect(resolvedDefault).toBe(dark);
  });

  it.each(Object.keys(darkDefaults))("%s defines a light variant", token => {
    const value = tokens[token];
    expect(typeof value).toBe("object");
    expect(value).toHaveProperty("_light");
    const light = (value as { _light?: string })._light;
    expect(typeof light).toBe("string");
    expect(light).not.toBe("");
  });
});
