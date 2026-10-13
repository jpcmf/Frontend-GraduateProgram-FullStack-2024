# Dark/Light Mode (New UI) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the new UI semantic tokens mode-aware so the existing color-mode toggle flips the entire new UI between the current dark theme and a new light theme — without touching any component or the legacy `useColorModeValue` code.

**Architecture:** Two raw foundation palettes (`hub` for dark, new `hubLight` for light) feed Chakra semantic tokens expressed as `{ default, _light }` objects. Global styles (page background, dotted texture, scrollbars) gain mode-aware values, and `ColorModeScript` + `suppressHydrationWarning` apply the stored mode before first paint. Every consumer of `surface.*` / `line.*` / `content.*` / `accent.*` flips automatically; dark output stays byte-for-byte identical.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Chakra UI 2.10, Vitest (node environment, pure-data tests only).

**Spec:** `specs/dark-light-mode.md`

## Global Constraints

- Do **not** touch the 88 legacy `useColorModeValue` call sites (~21 files).
- Dark values must remain **identical** to the current `theme.ts` (no visual regression).
- Keep `config = { initialColorMode: "dark", useSystemColorMode: false }` unchanged.
- No new UI/components — the existing toggle in `New/Header/Profile.tsx` is the only control.
- Vitest config only includes `src/**/*.test.ts` in a `node` environment; tests are for the pure token data, not rendering.
- Before committing: `npx tsc --noEmit` and `npx prettier --check` must pass on changed files.

---

## Task 1: Lock the semantic-token contract with a failing test (red)

**Files:**

- Create: `src/shared/lib/__tests__/theme.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `pnpm test src/shared/lib/__tests__/theme.test.ts`
Expected: the "keeps its dark default" cases pass (tokens are still strings), but every "defines a light variant" case **fails** (`typeof value` is `"string"`, not `"object"`).

---

## Task 2: Add `hubLight` and make every semantic token mode-aware (green)

**Files:**

- Modify: `src/shared/lib/theme.ts` (the `colors` foundation object and the `semanticTokens.colors` map)

- [ ] **Step 1: Add the `hubLight` palette**

In the `colors` object, after the `hub` entry, add:

```ts
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
```

- [ ] **Step 2: Convert the semantic tokens to `{ default, _light }`**

Replace the `semanticTokens.colors` map with the following (dark `default` values are unchanged):

```ts
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
```

- [ ] **Step 3: Run the test and confirm it passes**

Run: `pnpm test src/shared/lib/__tests__/theme.test.ts`
Expected: all cases pass.

- [ ] **Step 4: Commit**

```bash
git add src/shared/lib/theme.ts src/shared/lib/__tests__/theme.test.ts
git commit -m "feat(theme): make new UI semantic tokens mode-aware"
```

---

## Task 3: Mode-aware global styles

**Files:**

- Modify: `src/shared/lib/theme.ts` (the `styles` object)

- [ ] **Step 1: Add `_light`/`_dark` values to globals**

```ts
const styles = {
  global: {
    body: {
      bg: "surface.canvas",
      color: "content.body",
      backgroundImage: {
        default: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        _light: "radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)"
      },
      backgroundSize: "24px 24px",
      WebkitFontSmoothing: "antialiased"
    },
    "::selection": { bg: "brand.500", color: "white" },
    "::-webkit-scrollbar": { width: "6px", height: "6px" },
    "::-webkit-scrollbar-track": { bg: { default: "hub.dark", _light: "hubLight.raised" } },
    "::-webkit-scrollbar-thumb": {
      bg: { default: "#2a2e30", _light: "#c7ccce" },
      borderRadius: "9999px"
    },
    "::-webkit-scrollbar-thumb:hover": { bg: { default: "#393e42", _light: "#aeb5b8" } }
  }
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors (the one pre-existing error in the gitignored `_OLD_REFERENCE` file may remain).

- [ ] **Step 3: Commit**

```bash
git add src/shared/lib/theme.ts
git commit -m "feat(theme): mode-aware page background and scrollbars"
```

---

## Task 4: Apply the stored mode before first paint

**Files:**

- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Import `ColorModeScript` and the theme config**

Add to the imports:

```ts
import { ColorModeScript } from "@chakra-ui/react";

import { theme } from "@/shared/lib/theme";
```

- [ ] **Step 2: Add `suppressHydrationWarning` to `<html>`**

```tsx
<html lang="en" suppressHydrationWarning>
```

- [ ] **Step 3: Render `ColorModeScript` inside `<body>`**

Place it as the first child of `<body>`:

```tsx
<body>
  <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
  <Providers>{children}</Providers>
  {/* …existing Analytics / SpeedInsights… */}
</body>
```

- [ ] **Step 4: Type-check + lint**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(theme): apply stored color mode on first paint"
```

---

## Task 5: Verify the feature end-to-end

**Files:** none (verification only)

- [ ] **Step 1: Unit + type + format**

```bash
pnpm test
npx tsc --noEmit
npx prettier --check src/shared/lib/theme.ts src/app/layout.tsx src/shared/lib/__tests__/theme.test.ts
```

Expected: all pass.

- [ ] **Step 2: Manual toggle check (dev server on :3000)**

Using Playwright against the running dev server:

- Load `/` and `/skatistas`; screenshot dark mode (baseline).
- Toggle via the profile menu ("Ativar modo claro"); screenshot again.
- Confirm `Panel`, all `Button` variants (`accent`, `subtle`, `quiet`, `link`), `Badge` (`count`, `beta`, `role`, `roleLegend`), `Input pill`, and `Tag` (`chip`, `chipActive`) all change.
- Reload with light selected → still light, no flash (check the `<html>` class is applied before paint).
- Confirm no hydration warning in the console.
- Confirm dark screenshots are unchanged vs. baseline.

- [ ] **Step 3: Clean up Playwright artifacts**

```bash
rm -rf .playwright-mcp/*
```

---

## Task 6: Documentation (definition of done)

**Files:**

- Modify: `README.md` (Features section)
- Modify: `CHANGELOG.md` (top of `## [Unreleased]`)

- [ ] **Step 1: README** — add a user-facing bullet, e.g. "Light/dark theme toggle for the new UI."

- [ ] **Step 2: CHANGELOG** — prepend:

```
- YYYY-MM-DD - Add light/dark mode to the new UI [#PR](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/<number>) _(vX.Y.Z)_
```

(replace `YYYY-MM-DD`, PR number, and version to match `package.json` when the PR exists)

- [ ] **Step 3: Commit**

```bash
git add README.md CHANGELOG.md
git commit -m "docs: document dark/light mode"
```
