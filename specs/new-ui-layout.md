# Feature: New UI Layout — App Shell & Skatistas Pagination

**Status:** draft
**Priority:** high
**Affects:** `src/shared/ui/Layout/LayoutWrapper.tsx`, `src/shared/ui/index.ts`, `src/shared/ui/New/*`, `src/features/skatistas/*`, `src/features/user/services/getUsers.ts`, `src/features/user/services/getUsersCount.ts`, `src/features/user/hooks/useUsers.ts`, `src/app/(public)/new/page.tsx`

## Problem Statement

The redesign introduced a new design system under `src/shared/ui/New/` (semantic theme tokens plus `Panel`, `Header`, `Sidebar`, `Footer`, `Pagination`, and the `Skaters/` and `User/` components). It is currently a work-in-progress:

- `LayoutWrapper` renders the **old layout and the new layout at the same time**, so `{children}` renders twice on every page, alongside two headers, two sidebars, and two footers.
- `Pagination` is **static** — it takes only `current`/`pages`, renders `1..N` with no page-number windowing, and its "Anterior"/"Próxima" buttons have no `onClick` or disabled states. This is the specific defect the requester called out.
- `SkatersHeader` and `SkaterGrid` are wired to **mock data** and cannot reflect real counts, page size, or users.
- `/new` is a **mock-only preview** page.

This spec covers the first production slice: adopt the new shell as **the** layout, and make the skatistas list and its pagination work against real data.

## UI / UX Description

**App shell (all routes).** One shell: new sticky `Header`, a 220px `LeftSidebar` on `lg`+ (stacks above content below `lg`), a main content column, and the new `Footer`. The footer stays hidden on `/ai` (existing `isAIRoute` behaviour). Content renders exactly once.

**Skatistas list (`/skatistas`, and the `/new` preview).**

- `SkatersHeader` panel: title "Skatistas em Destaque", the real total ("Skatistas encontrados: N" or a loading label), and a page-size select with options `5 / 10 / 20 / 50`.
- `SkaterGrid`: a responsive grid of `SkaterCard`s — 2 columns on `base`, 3 on `md`, 4 on `xl`.
- `Pagination` panel (rendered only when `totalPages > 1`): "Anterior" and "Próxima" buttons, numbered page buttons with ellipsis windowing when there are many pages, the active page highlighted (`accent` variant, `aria-current="page"`), and all controls disabled at the first/last page and while a fetch is in flight.
- Changing page size resets to page 1.

## Data Requirements

Consumes the existing frontend pagination flow, backed by:

- `GET /api/custom-users?pagination[page]=<page>&pagination[pageSize]=<pageSize>` — public (`auth: false`), returns:
  ```json
  {
    "data": [
      /* sanitized UserBasics */
    ],
    "meta": { "pagination": { "page": 1, "pageSize": 10, "pageCount": 3, "total": 23 } }
  }
  ```
  Sensitive fields (`password`, `role`, `email`, confirmation tokens) are stripped server-side.

**Source of truth:** `skatehub-strapi/src/api/custom-user/controllers/custom-user.js`. There is **no formal Strapi spec file** for this endpoint (the Strapi repo's `specs/` covers spots, lists, leaderboard, etc.), so the controller source above is the contract.

The total count is read from `meta.pagination.total`. The separate `GET /api/users/count` request (`getUsersCount`) is dropped in favour of this value.

## Component & File Plan

**Rewrite / modify**

| File                                             | Change                                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `src/shared/ui/Layout/LayoutWrapper.tsx`         | Replace with the single new shell; remove old Header/Sidebar/Footer usage and the SVG backdrop.  |
| `src/shared/ui/index.ts`                         | Remove `export * from "./Layout";`.                                                              |
| `src/shared/ui/New/Pagination/index.tsx`         | Controlled component: `currentPage`, `totalPages`, `onPageChange`, `isLoading`.                  |
| `src/shared/ui/New/Pagination/getPageNumbers.ts` | New — pure page-number windowing helper.                                                         |
| `src/shared/ui/New/Skaters/Header.tsx`           | Controlled page-size select + real total.                                                        |
| `src/shared/ui/New/Skaters/Grid.tsx`             | Presentational — takes `users` prop, no mock import.                                             |
| `src/shared/ui/New/User/Card.tsx`                | Remove `console.log` and unused `AuthContext`; gate social links.                                |
| `src/features/skatistas/index.tsx`               | Use `SkatersHeader` + `SkaterGrid` + `Pagination`; delete inline pagination/duplicate header.    |
| `src/features/user/services/getUsers.ts`         | Migrate to `apiClient`; fix `getUsers2` offset.                                                  |
| `src/features/user/services/getUsersCount.ts`    | Migrate to `apiClient`.                                                                          |
| `src/features/user/hooks/useUsers.ts`            | Total from `meta.pagination.total`; drop parallel count call; lowercase query key.               |
| `src/app/(public)/new/page.tsx`                  | Repurpose to render the live `SkatistasHome` instead of mock components.                         |
| `src/shared/ui/New/IconLabel/index.tsx`          | Remove the `as any` cast.                                                                        |
| `"use client"` hardening                         | `CardUser`, `LogoSkateHub`, `TitleSection`, `Toast`, `ErrorBoundary`, `ReusableModal`, `form/*`. |

**Delete**

- `src/shared/ui/Layout/Header/*`, `src/shared/ui/Layout/Sidebar/*`, `src/shared/ui/Layout/Footer.tsx`, `src/shared/ui/Layout/index.ts` (superseded by `New/`).
- `src/shared/ui/Pagination.tsx` (empty, 0-byte dead file).

## Acceptance Criteria

- [ ] Every route renders the new shell exactly once (one header, one sidebar, one footer, children once).
- [ ] Old `Layout/Header`, `Layout/Sidebar`, `Layout/Footer`, and `Layout/index.ts` are removed; no dangling imports remain.
- [ ] `getPageNumbers(currentPage, totalPages, siblingCount?)` is unit-tested for small totals, middle pages, first/last pages, clamping, and a single page.
- [ ] `Pagination` calls `onPageChange` for number, previous, and next buttons; disables prev/next at bounds and all buttons while `isLoading`; marks the active page with `aria-current="page"`.
- [ ] `SkatersHeader` page-size select is controlled and calls `onPageSizeChange`; options are `5/10/20/50`; the total shown is real.
- [ ] `SkaterGrid` renders the provided `users` (no mock import) with `key={user.id}`.
- [ ] `/skatistas` shows the live total, a responsive grid, and working pagination; changing page size resets to page 1.
- [ ] All user data services use `apiClient` (no bare `axios`).
- [ ] No `console.log`/`console.warn`/`console.error` added; no new `any` types.
- [ ] Every hook/Chakra-rendering shared component carries `"use client"`.
- [ ] README and CHANGELOG updated.

## Out of Scope

- Wiring the new `Header`, `LeftSidebar`, and `Footer` to real data (auth state, live session count, modalities endpoint, communities list) — follow-up plan.
- Mobile navigation/drawer for the new shell.
- `Communities` data wiring.
- Re-theming legacy pages/components; removing the now-unused legacy `UserCard`, `getUsersCount`, `getUsers2`.
- `CacheProvider` (`@chakra-ui/next-js`) SSR style extraction.
- Full test infrastructure (Vitest/RTL/MSW/E2E) beyond the single pure pagination helper test — tracked in `specs/AUTOMATED_TESTING.md`.
