# New UI Layout (Shell & Skatistas Pagination) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the new `src/shared/ui/New/` design system the single production app shell and wire the skatistas list plus its pagination to real data.

**Architecture:** `LayoutWrapper` becomes the only shell (new `Header` + `LeftSidebar` + main column + new `Footer`), replacing the old layout entirely so `children` render once. The `New/` presentational components become prop-driven, and the `Skatistas` feature composes `SkatersHeader` + `SkaterGrid` + `Pagination` over the existing TanStack Query user flow.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Chakra UI 2.10, TanStack Query 5, Axios (`apiClient`), Vitest (pure-logic only).

**Spec:** `specs/new-ui-layout.md`

## Global Constraints

- Work on a feature branch — never commit to `develop` or `main` (currently on `feature/spot-comments-and-reactions-frontend`; create `feature/new-ui-layout` off `develop`).
- Cross-feature imports are forbidden; feature code imports other features only through their barrel (`@/features/<x>`). Shared UI imports from `@/shared/**`.
- All API calls go through `@/shared/api/apiClient` — never bare `axios`.
- No `console.log`/`console.warn`/`console.error` in production files.
- No `any` types without a documented reason.
- Every component that renders Chakra or calls a hook must carry `"use client"`; route files stay server components that compose client trees.
- Import order is enforced by `eslint-plugin-simple-import-sort` (`pnpm format:imports`).
- README **Features** section and `CHANGELOG.md` `[Unreleased]` must be updated before the PR.

## Review Focus

- **Empty / single page:** `totalPages` of 0 or 1 must not render (or crash) the pagination; an empty user list must not crash the grid.
- **Page-size change from a non-first page:** must reset to page 1 and refetch (existing handlers in `skatistas/page.tsx` and `SkatistasHome` already do this — verify, don't duplicate).
- **Rapid clicking while fetching:** all pagination controls must be disabled during `isLoading`; no duplicate page changes.
- **Out-of-range current page:** helper must clamp when `currentPage` is below 1 or beyond `totalPages`; prev/next disabled at the bounds.
- **Client boundary:** a hook/Chakra file missing `"use client"` that is imported by a server page crashes the build; the shell must render `children` exactly once.

---

### Task 1: Replace the app shell with a single new layout

**Files:**
- Modify: `src/shared/ui/Layout/LayoutWrapper.tsx`
- Modify: `src/shared/ui/index.ts:11` (remove `export * from "./Layout";`)
- Delete: `src/shared/ui/Layout/Header/` (index, Notification, Profile, Search)
- Delete: `src/shared/ui/Layout/Sidebar/` (index, SidebarNav, NavSection, NavLink)
- Delete: `src/shared/ui/Layout/Footer.tsx`
- Delete: `src/shared/ui/Layout/index.ts`

**Interfaces:**
- Produces: `Layout({ children }: { children: React.ReactNode })` — renders the new shell once; hides `Footer` when `pathname === "/ai"`.

- [ ] **Step 1: Rewrite `LayoutWrapper.tsx`**

```tsx
"use client";

import { usePathname } from "next/navigation";

import { Box, Grid, Stack } from "@chakra-ui/react";

import { Footer } from "@/shared/ui/New/Footer";
import { Header } from "@/shared/ui/New/Header";
import { LeftSidebar } from "@/shared/ui/New/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isAIRoute = pathname === "/ai";

  return (
    <Box minH="100dvh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" w="full" maxW="1780px" mx="auto" px={{ base: 4, lg: 8 }} py={6}>
        <Grid alignItems="start" gap={6} templateColumns={{ base: "1fr", lg: "220px minmax(0, 1fr)" }}>
          <LeftSidebar />
          <Stack spacing={5} as="main">
            {children}
          </Stack>
        </Grid>
      </Box>
      {!isAIRoute && <Footer />}
    </Box>
  );
}
```

- [ ] **Step 2: Remove the old Layout export and delete old files**

In `src/shared/ui/index.ts`, delete the line `export * from "./Layout";`. Then delete the four directories/files listed above. `LayoutWrapper.tsx` stays (it lives under `Layout/`).

- [ ] **Step 3: Verify no dangling references**

Run: `rg "ui/Layout/(Header|Sidebar|Footer)|export \* from \"./Layout\"" src`
Expected: no matches.
Run: `rg "useSidebarDrawer" src`
Expected: only `src/app/SidebarDrawerContext.tsx` (definition + provider). The context provider stays; it is harmless and removing it is out of scope.

- [ ] **Step 4: Type-check and lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: no errors.

- [ ] **Step 5: Manual check**

Run: `pnpm dev`, open `http://localhost:3000`. Expected: exactly one header, one sidebar, one footer; page content appears once (not duplicated). `/ai` shows no footer.

- [ ] **Step 6: Commit**

```bash
git add -A src/shared/ui/Layout src/shared/ui/index.ts
git commit -m "refactor(layout): replace dual old+new layout with single new shell"
```

---

### Task 2: Repurpose the scratch preview route

The mock composition in `/new` directly imports `SkatersHeader`, `SkaterGrid`, and `Pagination`, whose signatures change in Tasks 3–5. Repoint it at the live feature so it stays a working preview and nothing breaks.

**Files:**
- Modify: `src/app/(public)/new/page.tsx`

**Interfaces:**
- Consumes: `SkatistasHome` from `@/features/skatistas/Home` (client component).

- [ ] **Step 1: Replace the page body**

```tsx
import { SkatistasHome } from "@/features/skatistas/Home";

export default function NewPage() {
  return <SkatistasHome />;
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/new/page.tsx"
git commit -m "chore(preview): point /new at the live skatistas feature"
```

---

### Task 3: Working Pagination (pure helper + Vitest + controlled component)

**Files:**
- Create: `vitest.config.ts`
- Create: `src/shared/ui/New/Pagination/getPageNumbers.ts`
- Create: `src/shared/ui/New/Pagination/__tests__/getPageNumbers.test.ts` (co-located with implementation)
- Modify: `src/shared/ui/New/Pagination/index.tsx`
- Modify: `package.json` (add `vitest` devDependency + `test` scripts)

**Interfaces:**
- Produces: `type PageItem = number | "…"` and `getPageNumbers(currentPage: number, totalPages: number, siblingCount?: number): PageItem[]` from `./getPageNumbers`.
- Produces: `Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps)` where `onPageChange: (page: number) => void`.

- [ ] **Step 1: Add the Vitest harness**

```bash
pnpm add -D vitest
```

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"]
  }
});
```

Add to `package.json` `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest watch"
```

- [ ] **Step 2: Write the failing test**

`src/shared/ui/New/Pagination/__tests__/getPageNumbers.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { getPageNumbers } from "@/shared/ui/New/Pagination/getPageNumbers";

describe("getPageNumbers", () => {
  it("returns every page when the total fits", () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
    expect(getPageNumbers(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("windows a middle page with ellipses on both sides", () => {
    expect(getPageNumbers(10, 20)).toEqual([1, "…", 9, 10, 11, "…", 20]);
  });

  it("omits the leading ellipsis near the start", () => {
    expect(getPageNumbers(2, 20)).toEqual([1, 2, 3, "…", 20]);
    expect(getPageNumbers(1, 20)).toEqual([1, 2, "…", 20]);
  });

  it("omits the trailing ellipsis near the end", () => {
    expect(getPageNumbers(19, 20)).toEqual([1, "…", 18, 19, 20]);
    expect(getPageNumbers(20, 20)).toEqual([1, "…", 19, 20]);
  });

  it("clamps out-of-range pages", () => {
    expect(getPageNumbers(0, 10)).toEqual([1, 2, "…", 10]);
    expect(getPageNumbers(99, 10)).toEqual([1, "…", 9, 10]);
  });

  it("handles a single page", () => {
    expect(getPageNumbers(1, 1)).toEqual([1]);
  });
});
```

- [ ] **Step 3: Run the test and watch it fail**

Run: `pnpm test src/shared/ui/New/Pagination/__tests__/getPageNumbers.test.ts`
Expected: FAIL — cannot resolve `@/shared/ui/New/Pagination/getPageNumbers`.

- [ ] **Step 4: Implement the helper**

`src/shared/ui/New/Pagination/getPageNumbers.ts`:

```ts
export type PageItem = number | "…";

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * Build the page list for a paginated control, inserting ellipses when the
 * number of pages exceeds the visible window. Values are clamped to
 * [1, max(totalPages, 1)] so a stale current page never renders blank.
 */
export function getPageNumbers(currentPage: number, totalPages: number, siblingCount = 1): PageItem[] {
  const total = Math.max(totalPages, 1);
  const current = Math.min(Math.max(currentPage, 1), total);
  const totalPageNumbers = siblingCount * 2 + 5; // first + last + current + 2×siblings + ellipsis room

  if (total <= totalPageNumbers) return range(1, total);

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 2;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, rightSibling), "…", total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "…", ...range(leftSibling, total)];
  }

  return [1, "…", ...range(leftSibling, rightSibling), "…", total];
}
```

- [ ] **Step 5: Run the test and watch it pass**

Run: `pnpm test`
Expected: all `getPageNumbers` tests PASS.

- [ ] **Step 6: Rewrite the `Pagination` component**

`src/shared/ui/New/Pagination/index.tsx`:

```tsx
"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { Button, HStack, Text } from "@chakra-ui/react";

import { Panel } from "../Panel";
import { getPageNumbers } from "./getPageNumbers";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination = ({ currentPage, totalPages, onPageChange, isLoading = false }: PaginationProps) => {
  const items = getPageNumbers(currentPage, totalPages);
  const atStart = currentPage <= 1;
  const atEnd = currentPage >= totalPages;

  return (
    <Panel size="sm">
      <HStack justify="center" spacing={3} fontSize="xs">
        <Button
          variant="quiet"
          size="sm"
          leftIcon={<FiChevronLeft />}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={isLoading || atStart}
        >
          Anterior
        </Button>

        {items.map((item, index) =>
          item === "…" ? (
            <Text key={`ellipsis-${index}`} color="content.muted" aria-hidden="true">
              …
            </Text>
          ) : (
            <Button
              key={item}
              size="sm"
              minW={6}
              h={6}
              p={0}
              variant={item === currentPage ? "accent" : "quiet"}
              onClick={() => onPageChange(item)}
              isDisabled={isLoading}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </Button>
          )
        )}

        <Button
          variant="quiet"
          size="sm"
          color="accent.base"
          rightIcon={<FiChevronRight />}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={isLoading || atEnd}
        >
          Próxima
        </Button>
      </HStack>
    </Panel>
  );
};
```

- [ ] **Step 7: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts package.json pnpm-lock.yaml src/shared/ui/New/Pagination src/__tests__
git commit -m "feat(pagination): controlled pagination with page-number windowing and unit tests"
```

---

### Task 4: Controlled `SkatersHeader`

**Files:**
- Modify: `src/shared/ui/New/Skaters/Header.tsx`

**Interfaces:**
- Produces: `SkatersHeader({ totalUsers, pageSize, onPageSizeChange, isLoading }: SkatersHeaderProps)` with `onPageSizeChange: (pageSize: number) => void`; page-size options `[5, 10, 20, 50]`.

- [ ] **Step 1: Rewrite the component**

```tsx
"use client";

import { Box, Flex, HStack, Select, Text } from "@chakra-ui/react";

import { Muted } from "../index";
import { Panel } from "../Panel";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

interface SkatersHeaderProps {
  totalUsers: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

export const SkatersHeader = ({ totalUsers, pageSize, onPageSizeChange, isLoading = false }: SkatersHeaderProps) => (
  <Panel size="lg">
    <Flex justify="space-between" align="center" gap={4} wrap="wrap">
      <Box>
        <Text fontSize="md" fontWeight="bold" color="white">
          Skatistas em Destaque
        </Text>
        <Muted fontSize="sm">
          {isLoading ? (
            "Carregando…"
          ) : (
            <>
              Skatistas encontrados: <b style={{ color: "white" }}>{totalUsers}</b>
            </>
          )}
        </Muted>
      </Box>
      <HStack spacing={2}>
        <Muted fontSize="sm">Itens por página:</Muted>
        <Select
          size="sm"
          w={16}
          variant="outline"
          bg="surface.solid"
          borderColor="line.subtle"
          borderRadius="md"
          aria-label="Itens por página"
          value={pageSize}
          onChange={event => onPageSizeChange(Number(event.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </HStack>
    </Flex>
  </Panel>
);
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors. (`/new` no longer calls this component without props — see Task 2.)

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/New/Skaters/Header.tsx
git commit -m "feat(skaters): controlled page-size select and real total in header"
```

---

### Task 5: Presentational `SkaterGrid` and cleaned `SkaterCard`

**Files:**
- Create: `src/shared/lib/socialMedia.ts` (social link helpers)
- Modify: `src/shared/ui/New/Skaters/Grid.tsx`
- Modify: `src/shared/ui/New/User/Card.tsx`

**Interfaces:**
- Produces: `SkaterGrid({ users }: { users: UserBasics[] })`.
- Consumes: `UserBasics` type from `@/features/user` (type-only import — the existing `Card.tsx` already follows this pattern).

- [ ] **Step 1: Create the social media helpers**

`src/shared/lib/socialMedia.ts`:

```tsx
/**
 * Open a URL in a new tab with security flags.
 */
function openLink(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openInstagram(url: string) {
  openLink(url);
}

export function openWebsite(url: string) {
  openLink(url);
}
```

- [ ] **Step 2: Rewrite `Grid.tsx`**

```tsx
"use client";

import { Grid } from "@chakra-ui/react";

import type { UserBasics } from "@/features/user";

import { SkaterCard } from "../User/Card";

export const SkaterGrid = ({ users }: { users: UserBasics[] }) => (
  <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={4}>
    {users.map(user => (
      <SkaterCard key={user.id} s={user} />
    ))}
  </Grid>
);
```

- [ ] **Step 2: Rewrite `Grid.tsx`**

```tsx
"use client";

import { Grid } from "@chakra-ui/react";

import type { UserBasics } from "@/features/user";

import { SkaterCard } from "../User/Card";

export const SkaterGrid = ({ users }: { users: UserBasics[] }) => (
  <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={4}>
    {users.map(user => (
      <SkaterCard key={user.id} s={user} />
    ))}
  </Grid>
);
```

- [ ] **Step 3: Clean `Card.tsx`**

Apply these edits to `src/shared/ui/New/User/Card.tsx`:
- Delete `import { useContext } from "react";` and `import { AuthContext } from "@/features/auth";`.
- Delete the `console.log(s);` line and the unused `const { isAuthenticated } = useContext(AuthContext);` line.
- Replace the unconditional Instagram/Globe `ChakraLink href="#"` pair with conditional links using the social helpers:

```tsx
import { openInstagram, openWebsite } from "@/shared/lib/socialMedia";
// ...
<HStack
  spacing={3}
  mt={2}
  pt={2}
  w="full"
  justify="center"
  borderTop="1px solid"
  borderColor="line.faint"
  color="content.muted"
>
  {s.instagram_url && (
    <Box as="button" aria-label={`Instagram de ${s.name}`} onClick={() => openInstagram(s.instagram_url)} _hover={{ color: "pink.400" }}>
      <FiInstagram size={14} />
    </Box>
  )}
  {s.website_url && (
    <Box as="button" aria-label={`Site de ${s.name}`} onClick={() => openWebsite(s.website_url)} _hover={{ color: "blue.400" }}>
      <FiGlobe size={14} />
    </Box>
  )}
</HStack>
```

Remove the now-unused `ChakraLink` import. Keep the `ChakraAvatar`, `Box`, `HStack`, `Stack`, `Text` imports.

- [ ] **Step 4: Type-check and lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: no errors; no unused imports in the two files.

- [ ] **Step 5: Commit**

```bash
git add src/shared/lib/socialMedia.ts src/shared/ui/New/Skaters/Grid.tsx src/shared/ui/New/User/Card.tsx
git commit -m "feat(skaters): presentational grid, social helpers, and console/auth cleanup in skater card"
```

---

### Task 6: Wire the Skatistas feature to the new components

**Files:**
- Modify: `src/features/skatistas/index.tsx`

**Interfaces:**
- Consumes: `SkatersHeader`, `SkaterGrid` (from `@/shared/ui/New/Skaters`) and `Pagination` (from `@/shared/ui/New/Pagination`).
- Keeps: `SkatistasProps` unchanged (`users: UserBasicsWithPagination`, `currentPage`, `pageSize`, `totalUsers`, `isLoading`, `onPageChange`, `onPageSizeChange`) — callers in `src/app/(public)/skatistas/page.tsx` and `src/features/skatistas/Home/index.tsx` do not change.

- [ ] **Step 1: Replace the component body**

```tsx
import { Box } from "@chakra-ui/react";

import type { UserBasicsWithPagination } from "@/features/user";
import { Pagination } from "@/shared/ui/New/Pagination";
import { SkaterGrid, SkatersHeader } from "@/shared/ui/New/Skaters";

interface SkatistasProps {
  users: UserBasicsWithPagination;
  currentPage: number;
  pageSize: number;
  totalUsers: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Skatistas({
  users,
  currentPage,
  pageSize,
  totalUsers,
  isLoading,
  onPageChange,
  onPageSizeChange
}: SkatistasProps) {
  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <Box width="100%">
      <SkatersHeader
        totalUsers={totalUsers}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
      />
      <Box mt={4}>
        <SkaterGrid users={users.data} />
      </Box>
      {totalPages > 1 && (
        <Box mt={4}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </Box>
      )}
    </Box>
  );
}
```

This deletes the old inline header (including the duplicate page-size `Select`), the local `handlePreviousPage`/`handleNextPage`/`generatePageNumbers`, the `useColors` usage, and the now-unused `react-icons/tb`, `Button`, `Flex`, `HStack`, `Select`, `SimpleGrid`, `Spinner`, `Text` imports.

- [ ] **Step 2: Type-check and lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: no errors; no unused imports.

- [ ] **Step 3: Manual check**

Run: `pnpm dev`, open `/skatistas`. Expected:
- Header shows the real total; changing page size refetches and resets to page 1.
- Grid shows real skaters (2/3/4 columns by breakpoint).
- Pagination appears only with more than one page; clicking a number, "Anterior", and "Próxima" fetches the correct page; controls are disabled while fetching and at the bounds.

- [ ] **Step 4: Commit**

```bash
git add src/features/skatistas/index.tsx
git commit -m "feat(skatistas): compose new header, grid, and pagination over the user query"
```

---

### Task 7: Modernize the users data layer

**Files:**
- Modify: `src/features/user/services/getUsers.ts`
- Modify: `src/features/user/services/getUsersCount.ts`
- Modify: `src/features/user/hooks/useUsers.ts`

**Interfaces:**
- Keeps: `useUsers(currentPage?, pageSize?, filter?)` returning `{ users: UserBasicsWithPagination; totalFetchedUsers: number }` — consumers unchanged.

- [ ] **Step 1: Migrate services to `apiClient`**

In `getUsers.ts`: replace `import axios from "axios";` and the `API` constant usage with `import { apiClient } from "@/shared/api/apiClient";`, then convert each `axios.get(`${API}/...`)` to a relative `apiClient.get("/api/...")`.

**Verification:** Both `apiClient.baseURL` (from `src/shared/api/apiClient.ts` line 7) and the `API` constant (from `src/shared/config/constants.ts` line 7) equal `process.env.NEXT_PUBLIC_STRAPI_URL`, so relative paths are safe.

Note: The legacy `getUsers2` function is not wired to any active feature; leave it unchanged (out of scope per the spec).

In `getUsersCount.ts`: same import swap; convert `axios.get(`${API}/api/users/count`)` to `apiClient.get("/api/users/count")`.

- [ ] **Step 2: Read the total from the paginated response**

`useUsers.ts` — drop the parallel `getUsersCount` call and the unused `filter` plumbing in the fetcher; use `meta.pagination.total`. Add defaults to prevent `undefined` from reaching the API:

```ts
import { useQuery } from "@tanstack/react-query";

import { getCustomUsersWithPagination } from "../services/getUsers";
import type { UserBasicsWithPagination } from "../types/UserBasicsWithPagination.type";

const fetchUsers = async (
  currentPage?: number,
  pageSize?: number,
  filter?: string
): Promise<{ users: UserBasicsWithPagination; totalFetchedUsers: number }> => {
  const page = currentPage ?? 1;
  const size = pageSize ?? 10;
  const users = await getCustomUsersWithPagination(page, size);

  if (!users) {
    throw new Error("Network response was not ok.");
  }

  return { users, totalFetchedUsers: users.meta.pagination.total };
};

const useUsers = (currentPage?: number, pageSize?: number, filter?: string) => {
  return useQuery({
    queryKey: ["users", { currentPage, pageSize, filter }],
    queryFn: () => fetchUsers(currentPage, pageSize, filter),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  });
};

export { fetchUsers, useUsers };
```

- [ ] **Step 3: Verify no bare axios remains in these services**

Run: `rg "import axios" src/features/user/services`
Expected: also check `getUser.ts`, `signUpRequest.ts`, `uploadAvatar.ts`, `linkAvatar.ts`; only migrate the two named in this task, but confirm none of the files you touched import `axios`.

- [ ] **Step 4: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual check**

Run: `pnpm dev`, open `/skatistas`. Expected: still loads, total unchanged, network tab shows a single `/api/custom-users` request per page change (no parallel `/api/users/count`).

- [ ] **Step 6: Commit**

```bash
git add src/features/user/services/getUsers.ts src/features/user/services/getUsersCount.ts src/features/user/hooks/useUsers.ts
git commit -m "refactor(users): apiClient migration and derive total from pagination meta"
```

---

### Task 8: Server/client boundary hardening

**Files:**
- Modify (add `"use client"` as the first line): `src/shared/ui/CardUser.tsx`, `src/shared/ui/LogoSkateHub.tsx`, `src/shared/ui/TitleSection.tsx`, `src/shared/ui/Toast.tsx`, `src/shared/ui/ErrorBoundary.tsx`, `src/shared/ui/ReusableModal.tsx`, `src/shared/ui/form/Input.tsx`, `src/shared/ui/form/Select.tsx`, `src/shared/ui/form/Textarea.tsx`
- Modify: `src/shared/ui/New/IconLabel/index.tsx` (remove `as any`)
- Delete: `src/shared/ui/Pagination.tsx` (empty 0-byte dead file, superseded by `New/Pagination`)

**Interfaces:** no API change.

- [ ] **Step 1: Add the directive**

For each file listed, add `"use client";` (plus a blank line) as the very first line, above any comment/import. These files use hooks or render Chakra and are currently server-classified only because a client parent happens to import them; any future server import would crash the build.

- [ ] **Step 2: Delete the empty legacy file**

Run: `rg "shared/ui/Pagination" src`
Expected: no matches (only `New/Pagination` is referenced). Then delete `src/shared/ui/Pagination.tsx`.

- [ ] **Step 3: Fix the `any` cast in `IconLabel`**

`src/shared/ui/New/IconLabel/index.tsx` — remove the cast. Both props are Chakra props, so the spread types cleanly:

```tsx
"use client";

import { BoxProps, Flex } from "@chakra-ui/react";

export const IconLabel = ({ icon, children, ...rest }: { icon: React.ReactNode } & BoxProps) => (
  <Flex align="center" gap={1.5} {...rest}>
    {icon}
    {children}
  </Flex>
);
```

- [ ] **Step 4: Type-check, lint, and build**

Run: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: `next build` succeeds (this is the check that a client boundary is not broken).

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui
git commit -m "fix(rsc): mark hook-rendering shared components as client; drop any cast"
```

---

### Task 9: Documentation + spec acceptance criteria

**Files:**
- Modify: `README.md` (Features section)
- Modify: `CHANGELOG.md` (`[Unreleased]`)
- Modify: `specs/new-ui-layout.md` (mark acceptance criteria `[x]`)

- [ ] **Step 1: README**

Under `### General` (or a new `### Interface` heading), add one user-facing bullet:

```markdown
- Redesigned app shell (header, sidebar, footer) built on a new theme, with a paginated skatistas directory
```

- [ ] **Step 2: CHANGELOG**

Prepend under `## [Unreleased]`:

```markdown
- 2026-10-09 - Adopt the new app shell (header, sidebar, footer) as the single layout and wire the skatistas directory to real data with working pagination _(v2.1.0)_
```

- [ ] **Step 3: Mark the spec**

Tick every `[ ]` in `specs/new-ui-layout.md` that the implementation satisfies. Leave anything not done unticked.

- [ ] **Step 4: Print the final diff for review**

Run: `git diff --stat`
Expected: only the files listed across Tasks 1–9 (plus `pnpm-lock.yaml`, `vitest.config.ts`, the new test, and `specs/new-ui-layout.md`).

- [ ] **Step 5: Commit**

```bash
git add README.md CHANGELOG.md specs/new-ui-layout.md
git commit -m "docs: update README and CHANGELOG for the new UI layout"
```

---

## Verification

- [ ] `pnpm test` passes (pagination helper).
- [ ] `pnpm exec tsc --noEmit` is clean.
- [ ] `pnpm lint` is clean.
- [ ] `pnpm build` succeeds.
- [ ] One shell renders per route; children appear once.
- [ ] `/skatistas` and `/new` show real data with working pagination.
- [ ] No `console.*`, no bare `axios` in touched services, no new `any`.
- [ ] README + CHANGELOG updated; spec criteria ticked.
