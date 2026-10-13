import { describe, expect, it } from "vitest";

import { theme } from "@/shared/lib/theme";

type TokenValue = string | { default?: string; _light?: string };

const tokens = theme.semanticTokens.colors as Record<string, TokenValue>;

// Exact dark (`default`) and light (`_light`) values for every new-UI token.
// Dark values must never change; light values are the reviewed design.
const expected: Record<string, { default: string; _light: string }> = {
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
  "accent.onSolid": { default: "#000000", _light: "#000000" },
  "accent.deep": { default: "brand.900", _light: "hubLight.raised" },
  "accent.strong": { default: "brand.500", _light: "brand.800" },
  "danger.base": { default: "red.600", _light: "red.600" },
  "danger.hover": { default: "red.700", _light: "red.700" }
};

// A token value must point at a real palette entry or a literal color.
const RESOLVABLE = /^(hub|hubLight|brand|gray|red)\.|^#[0-9a-f]{3,8}$|^rgba?\(|^white$|^black$/i;

describe("theme semantic tokens", () => {
  it.each(Object.entries(expected))("%s has the reviewed dark and light values", (token, exp) => {
    expect(tokens[token]).toEqual(exp);
  });

  it("every new-UI token resolves to a palette entry or literal color", () => {
    for (const token of Object.keys(expected)) {
      const value = tokens[token];
      if (typeof value === "string") {
        expect(value, token).toMatch(RESOLVABLE);
      } else {
        expect(value.default, `${token}.default`).toMatch(RESOLVABLE);
        expect(value._light, `${token}._light`).toMatch(RESOLVABLE);
      }
    }
  });
});

describe("theme component styles react to color mode", () => {
  it("beta badge uses mode-aware accent tokens", () => {
    const beta = (theme.components?.Badge as { variants?: Record<string, { bg?: string; color?: string }> })?.variants
      ?.beta;
    expect(beta?.bg).toBe("accent.deep");
    expect(beta?.color).toBe("accent.strong");
  });

  it("light scrollbar overrides use valid top-level selectors (not nested under a pseudo-element)", () => {
    const global = (theme.styles as { global?: Record<string, unknown> })?.global ?? {};
    expect(global["[data-theme=light] ::-webkit-scrollbar-track"]).toBeTruthy();
    expect(global["[data-theme=light] ::-webkit-scrollbar-thumb"]).toBeTruthy();
    // Nesting `_light` under a pseudo-element generates invalid CSS, so it must NOT be used there.
    const track = global["::-webkit-scrollbar-track"] as Record<string, unknown> | undefined;
    expect(track?._light).toBeUndefined();
  });
});
