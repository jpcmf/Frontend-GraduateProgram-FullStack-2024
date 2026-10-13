# Feature: Dark/Light Mode (New UI)

**Status:** done
**Priority:** medium
**Affects:** `src/shared/lib/theme.ts`, `src/app/providers.tsx`, `src/app/layout.tsx`

## Problem Statement

The new UI theme (`src/shared/lib/theme.ts`) defines semantic tokens (`surface.*`, `line.*`, `content.*`, `accent.*`, `danger.*`) with **hardcoded dark values only**. The color-mode toggle already exists in `src/shared/ui/New/Header/Profile.tsx` and calls Chakra's `toggleColorMode()`, but the new-UI components (`Panel`, `Button`, `Badge`, `Input`, `Tag` — anything consuming those tokens) do **not** respond to it, because the tokens have no light variants. Today only legacy components that call `useColorModeValue` change with the toggle.

This feature makes the new UI fully mode-aware by giving every semantic token a light variant, so the existing toggle flips the entire new UI without changing any component.

## UI / UX Description

- **Control:** unchanged — the toggle in the profile menu (`Header/Profile.tsx`: "Ativar modo claro" / "Ativar modo escuro").
- **Behavior:** toggling flips the new UI between the existing dark theme and a new light theme: page canvas, panel surfaces, header, all `Button` variants, `Badge` variants, `Input`, `Tag`, borders, text, and the dotted page background.
- **Default:** dark (unchanged).
- **Persistence:** via Chakra's localStorage key (`chakra-ui-color-mode`); the choice survives reloads.
- **No flash:** the stored mode must be applied before first paint.
- **Light aesthetic:** near-white surfaces (`#f6f7f7` canvas, white panels), dark text, borders as light grays, and a slightly deeper brand green (`brand.600`) for contrast on white.

## Data Requirements

None. No API endpoints are involved. Color mode is client-side state owned by Chakra's `ColorModeProvider` and persisted in `localStorage`. No backend spec applies.

## Component & File Plan

### Modify

- **`src/shared/lib/theme.ts`**
  - Add a `hubLight` raw palette (light equivalents of `hub`).
  - Convert each semantic token from a string to `{ default: <current dark value>, _light: <light value> }` using the mapping below.
  - Make global styles mode-aware: the body dotted `backgroundImage` uses a nested `_light` pseudo-selector; the scrollbar rules use top-level selectors in **two forms** — `[data-theme=light] ::-webkit-scrollbar-*` (inner scroll containers) and `[data-theme=light]::-webkit-scrollbar-*` (the root viewport scroller, where the element carrying `data-theme` is itself the scroller). Nesting `_light` under a pseudo-element emits invalid CSS and is dropped. Note: `{ default, _light }` object _values_ are invalid for style values (the rule is dropped), and a `global: (props) => …` function bakes at first render and goes stale after hydration — so `_light` pseudo-selectors are required.
  - Keep `config = { initialColorMode: "dark", useSystemColorMode: false }` unchanged.

- **`src/app/providers.tsx`** (a client component)
  - Render `<ColorModeScript initialColorMode={theme.config.initialColorMode} />` so the stored mode is applied before first paint. It must live in a client module: importing `theme` into the server `layout.tsx` throws _"Attempted to call extendTheme() from the server but extendTheme is on the client"_.

- **`src/app/layout.tsx`**
  - Add `suppressHydrationWarning` to `<html>` **and `<body>`** — Chakra's `ColorModeScript` sets the mode class on `<body>` and `data-theme` on `<html>`, so both need it.

### New

- `specs/dark-light-mode.md` (this file).

### Not modified

- The 88 legacy `useColorModeValue` call sites (~21 files).
- Component structure/design — only hardcoded `color="white"` text was swapped for the `content.primary` token so light-mode text stays readable (dark mode is unchanged).
- The toggle in `Header/Profile.tsx`.

### `hubLight` raw palette (new)

| Token    | Value                       |
| -------- | --------------------------- |
| `canvas` | `#f6f7f7`                   |
| `header` | `rgba(255, 255, 255, 0.85)` |
| `panel`  | `rgba(255, 255, 255, 0.85)` |
| `solid`  | `#ffffff`                   |
| `raised` | `#f1f3f4`                   |
| `hover`  | `#e7eaeb`                   |
| `border` | `#e2e6e7`                   |
| `muted`  | `#697076`                   |

### Semantic token mapping

| Semantic token      | dark (`default`, unchanged) | light (`_light`)          |
| ------------------- | --------------------------- | ------------------------- |
| `surface.canvas`    | `hub.canvas`                | `hubLight.canvas`         |
| `surface.header`    | `rgba(18, 20, 21, 0.9)`     | `hubLight.header`         |
| `surface.panel`     | `rgba(24, 26, 27, 0.7)`     | `hubLight.panel`          |
| `surface.solid`     | `hub.dark`                  | `hubLight.solid`          |
| `surface.raised`    | `hub.surface`               | `hubLight.raised`         |
| `surface.hover`     | `hub.hover`                 | `hubLight.hover`          |
| `line.subtle`       | `hub.border`                | `hubLight.border`         |
| `line.faint`        | `rgba(44, 48, 51, 0.5)`     | `rgba(18, 20, 21, 0.08)`  |
| `content.primary`   | `white`                     | `hubLight.black`          |
| `content.secondary` | `gray.300`                  | `gray.600`                |
| `content.body`      | `gray.200`                  | `gray.700`                |
| `content.muted`     | `hub.muted`                 | `hubLight.muted`          |
| `accent.base`       | `brand.500`                 | `brand.600`               |
| `accent.hover`      | `brand.600`                 | `brand.700`               |
| `accent.subtle`     | `rgba(34, 197, 94, 0.1)`    | `rgba(22, 163, 74, 0.12)` |
| `accent.line`       | `rgba(34, 197, 94, 0.2)`    | `rgba(22, 163, 74, 0.25)` |
| `accent.onSolid`    | `#000000`                   | `#000000`                 |
| `accent.deep`       | `brand.900`                 | `hubLight.raised`         |
| `accent.strong`     | `brand.500`                 | `brand.800`               |
| `danger.base`       | `red.600`                   | `red.600`                 |
| `danger.hover`      | `red.700`                   | `red.700`                 |

## Acceptance Criteria

- [x] Toggling color mode flips the new UI (canvas, `Panel`, header, all `Button` variants, `Badge`, `Input`, `Tag`) between dark and light. _(Verified via the mechanism: switching the stored mode and reloading flips body bg/dots/text, header, and panels correctly. The header toggle is only rendered for signed-in users, so the click-through was not exercised in this environment.)_
- [x] Dark mode is visually identical to before this change (no regression). _(Dark `default` values are unchanged; locked by `src/shared/lib/__tests__/theme.test.ts`.)_
- [x] Light mode text on surfaces is readable (body / secondary / muted text over panel and canvas). _(e.g. `content.body` → `gray.700` on a `#f6f7f7`/white surface.)_
- [x] The selected mode persists across reloads, with no flash of the wrong theme on load. _(`ColorModeScript` applies the stored mode before paint.)_
- [x] No React hydration warnings related to color mode. _(`suppressHydrationWarning` on `<html>` and `<body>`; console errors 0.)_
- [x] The 88 legacy `useColorModeValue` call sites are unchanged and still work.
- [x] `npx tsc --noEmit` passes. _(Only the pre-existing `_OLD_REFERENCE` error remains.)_
- [x] `npx prettier --check` passes on the changed files.

## Out of Scope

- Migrating legacy `useColorModeValue` usages to semantic tokens.
- `useSystemColorMode` (following the OS preference).
- Per-component light-mode redesign beyond the token mapping above.
- Hardcoded colors that are _not_ light-mode defects, e.g. the black logo on a green tile (`New/Header`) and the footer link `_hover` in `New/Footer`.
- Adding a new toggle UI (the existing one is reused).
- Automated tests — test infrastructure is planned (see `specs/AUTOMATED_TESTING.md`); verification is manual.
