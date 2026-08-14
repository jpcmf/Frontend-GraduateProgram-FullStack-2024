# SEO — Full Server-Side Rendering & Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all public pages (`/`, `/spots`, `/spots/[id]`, `/skatistas`) from client components to Server Components so Google receives meaningful HTML, and add per-page metadata, a dynamic sitemap, and robots.txt.

**Architecture:** Public pages become async Server Components that fetch data via new plain-`fetch()` "server-safe" service functions. Interactive sub-components (auth-gated button, pagination) are extracted into `"use client"` leaf components that receive server-fetched data as props. Existing React Query hooks and client services are NOT modified. Pages render SSR HTML on every request (root layout `force-dynamic` stays) while `fetch` opts into the Data Cache via `next: { revalidate: 60 }`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Chakra UI, TanStack Query v5 (untouched), Strapi REST API, `pnpm` 9.

## Corrections to `specs/2026-07-31-seo-design.md`

The spec was written before the codebase audit. These corrections apply:

| Spec says                                                  | Actual                                                                                                                                                                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`        | All app files live under `src/app/` — use `src/app/...`                                                                                                                                                            |
| `GET /api/users` for skatistas                             | `GET /api/custom-users` (paginated, sanitized) + `GET /api/users/count`, mirroring the `useUsers` hook                                                                                                             |
| `src/features/skatistas/services/getSkatistas.server.ts`   | Skatistas data == users data; this file re-exports `getUsersServer` from the `user` feature barrel (DRY)                                                                                                           |
| `src/features/skatistas/components/SkatistaPagination.tsx` | Requires refactoring `src/features/skatistas/index.tsx` (currently the `Skatistas` component) into `components/Skatistas.tsx` + a real `index.ts` barrel                                                           |
| ISR via removing `force-dynamic`                           | Root layout `export const dynamic = "force-dynamic"` is **kept** to avoid build-time Strapi dependency. `fetch({ next: { revalidate: 60 } })` still caches data for 60s and pages SSR for Google. See "Decisions". |
| Unit tests per task                                        | No test runner exists in this repo (package.json has no `test` script). Verification is `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, and manual `curl`.                                                    |

## Decisions

1. **Keep `dynamic = "force-dynamic"`** in `src/app/layout.tsx`. Removing it would make Next.js statically prerender the converted pages at build time and fetch from Strapi during `next build` (fails if Strapi is briefly down). With it kept, every request server-renders full HTML for crawlers — satisfying all acceptance criteria — while per-`fetch` `revalidate: 60` still uses the Data Cache. Full static ISR (HTML cache) is possible later by removing the flag.
2. **Skatistas feature barrel refactor** — required because `src/features/skatistas/index.tsx` is a component file, not a barrel, and the spec's new files (`SkatistaPagination`, `getSkatistas.server.ts`) must be exported from a barrel per AGENTS.md import rules.
3. **Base URL** — hardcoded `https://skatehub.vercel.app` (same as the existing sitemap route). Used for canonical URLs, og:url, sitemap, and robots.

## File Structure

```
src/features/spots/
├── services/
│   ├── getSpots.server.ts              # NEW — fetch() wrapper, revalidate 60
│   ├── getSpot.server.ts               # NEW — fetch() wrapper, revalidate 60
│   ├── getSpots.ts                     # DELETE — client service dead after page conversion
│   └── getSpotById.ts                  # KEEP — protected edit page still uses it
├── hooks/
│   ├── useSpots.ts                     # DELETE — dead after /spots conversion
│   └── useSpot.ts                      # DELETE — dead after /spots/[id] conversion
├── components/
│   ├── SpotCard/index.tsx              # MODIFY — add "use client"
│   └── SpotsCreateButton.tsx           # NEW — client, useAuth-gated
└── index.ts                            # MODIFY — export new services + component; drop dead exports

src/features/user/
├── services/
│   └── getUsers.server.ts              # NEW — fetch() wrapper, revalidate 60
└── index.ts                            # MODIFY — export getUsersServer

src/features/stories/
├── services/
│   └── getStories.server.ts            # NEW — fetch() wrapper, revalidate 60
├── components/Home/index.tsx           # MODIFY — accept initialStories prop
└── index.ts                            # MODIFY — export getStoriesServer

src/features/skatistas/
├── components/
│   ├── Skatistas.tsx                   # NEW — moved from index.tsx + "use client"
│   └── SkatistaPagination.tsx          # NEW — client, useState + useUsers
├── Home/index.tsx                      # MODIFY — accept initialUsers props; import Skatistas from ../components/Skatistas
├── services/
│   └── getSkatistas.server.ts          # NEW — re-export getUsersServer
└── index.ts                            # NEW — barrel (replaces index.tsx component file)

src/app/
├── layout.tsx                          # MODIFY — lang="pt-BR", PT description
├── page.tsx                            # MODIFY — server component + metadata
├── sitemap.ts                          # NEW — dynamic sitemap
├── robots.ts                           # NEW — robots.txt
├── (public)/spots/page.tsx             # MODIFY — server component + metadata
├── (public)/spots/[id]/page.tsx        # MODIFY — server component + generateMetadata
├── (public)/skatistas/page.tsx         # MODIFY — server component + metadata
└── api/sitemap/route.ts                # DELETE (folder removed)

next.config.ts                          # MODIFY — remove /sitemap.xml rewrite

README.md, CHANGELOG.md                 # MODIFY — feature bullet + changelog entry
docs/superpowers/specs/2026-07-31-seo-design.md  # MODIFY — mark acceptance criteria [x]
```

---

## Task 0: Create Feature Branch

**Files:** none

- [x] **Step 1: Ensure `develop` is current and create a feature branch**

```bash
git checkout develop
git pull
git checkout -b feature/seo-ssr-metadata
```

- [x] **Step 2: Verify branch**

Run: `git branch --show-current`
Expected: `feature/seo-ssr-metadata`

---

## Task 1: Server-Safe Service — Spots

**Files:**

- Create: `src/features/spots/services/getSpots.server.ts`
- Create: `src/features/spots/services/getSpot.server.ts`
- Modify: `src/features/spots/index.ts`

- [x] **Step 1: Write `getSpots.server.ts`**

```ts
import type { SpotsResponse } from "../types/spots";

const POPULATE =
  "?populate[photos]=true" +
  "&populate[created_by_user][fields][0]=username" +
  "&populate[created_by_user][fields][1]=name";

const API = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getSpotsServer(): Promise<SpotsResponse> {
  const res = await fetch(`${API}/api/spots${POPULATE}`, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch spots: ${res.status}`);
  }

  return res.json();
}
```

- [x] **Step 2: Write `getSpot.server.ts`**

```ts
import type { SpotResponse } from "../types/spots";

const POPULATE =
  "?populate[photos]=true" +
  "&populate[created_by_user][fields][0]=username" +
  "&populate[created_by_user][fields][1]=name";

const API = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getSpotServer(id: string | number): Promise<SpotResponse> {
  const res = await fetch(`${API}/api/spots/${id}${POPULATE}`, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch spot ${id}: ${res.status}`);
  }

  return res.json();
}
```

- [x] **Step 3: Export both from the spots barrel**

Edit `src/features/spots/index.ts` — add after the existing `// Services` block:

```ts
// Server Services
export { getSpotsServer } from "./services/getSpots.server";
export { getSpotServer } from "./services/getSpot.server";
```

- [x] **Step 4: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS, no new errors.

- [x] **Step 5: Commit**

```bash
git add src/features/spots/services/getSpots.server.ts src/features/spots/services/getSpot.server.ts src/features/spots/index.ts
git commit -m "feat(seo): add server-safe spot services with revalidate caching"
```

---

## Task 2: Server-Safe Service — Users & Skatistas

**Files:**

- Create: `src/features/user/services/getUsers.server.ts`
- Create: `src/features/skatistas/services/getSkatistas.server.ts`
- Create: `src/features/skatistas/services/` (directory)
- Modify: `src/features/user/index.ts`

- [x] **Step 1: Write `getUsers.server.ts`**

Mirrors the `useUsers` hook (`getCustomUsersWithPagination` + `getUsersCount`), returning the identical `{ users, totalFetchedUsers }` shape.

```ts
import type { UserBasicsWithPagination } from "../types/UserBasicsWithPagination.type";

const API = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getUsersServer(
  currentPage = 1,
  pageSize = 50
): Promise<{ users: UserBasicsWithPagination; totalFetchedUsers: number }> {
  const usersUrl =
    `${API}/api/custom-users` +
    "?populate[0]=address&populate[1]=avatar&populate[2]=category" +
    `&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`;
  const countUrl = `${API}/api/users/count`;

  const [usersRes, countRes] = await Promise.all([
    fetch(usersUrl, { next: { revalidate: 60 } }),
    fetch(countUrl, { next: { revalidate: 60 } })
  ]);

  if (!usersRes.ok || !countRes.ok) {
    throw new Error("Failed to fetch users");
  }

  const users: UserBasicsWithPagination = await usersRes.json();
  const totalFetchedUsers: number = await countRes.json();

  return { users, totalFetchedUsers };
}
```

- [x] **Step 2: Export from the user barrel**

Edit `src/features/user/index.ts` — add after the existing `// Services` block:

```ts
// Server Services
export { getUsersServer } from "./services/getUsers.server";
```

- [x] **Step 3: Write `getSkatistas.server.ts` (re-export)**

```ts
import { getUsersServer } from "@/features/user";

export const getSkatistasServer = getUsersServer;
```

- [x] **Step 4: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS, no new errors.

- [x] **Step 5: Commit**

```bash
git add src/features/user/services/getUsers.server.ts src/features/user/index.ts src/features/skatistas/services/getSkatistas.server.ts
git commit -m "feat(seo): add server-safe users service and skatistas alias"
```

---

## Task 3: Server-Safe Service — Stories

**Files:**

- Create: `src/features/stories/services/getStories.server.ts`
- Modify: `src/features/stories/index.ts`

- [x] **Step 1: Write `getStories.server.ts`**

Mirrors `getStories.ts` exactly (same populate, no 24h filter — matching current behavior).

```ts
import type { StoriesResponse } from "../types/stories";

const API = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getStoriesServer(): Promise<StoriesResponse> {
  const res = await fetch(
    `${API}/api/stories` +
      "?populate[author][fields][0]=username" +
      "&populate[author][fields][1]=name" +
      "&populate[author][populate][avatar][fields][0]=url" +
      "&populate[author][populate][avatar][fields][1]=formats",
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch stories: ${res.status}`);
  }

  return res.json();
}
```

- [x] **Step 2: Export from the stories barrel**

Edit `src/features/stories/index.ts` — add after the existing `// Services` block:

```ts
// Server Services
export { getStoriesServer } from "./services/getStories.server";
```

- [x] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS, no new errors.

- [x] **Step 4: Commit**

```bash
git add src/features/stories/services/getStories.server.ts src/features/stories/index.ts
git commit -m "feat(seo): add server-safe stories service"
```

---

## Task 4: Extract `SpotsCreateButton` + Mark `SpotCard` as Client

**Files:**

- Create: `src/features/spots/components/SpotsCreateButton.tsx`
- Modify: `src/features/spots/components/SpotCard/index.tsx` (add `"use client"`)
- Modify: `src/features/spots/index.ts` (export SpotsCreateButton)

- [x] **Step 1: Write `SpotsCreateButton.tsx`**

Preserves the auth-gated "Criar Spot" button exactly as it appears on the current `/spots` page.

```tsx
"use client";

import { RiPinDistanceLine } from "react-icons/ri";
import NextLink from "next/link";

import { Button } from "@chakra-ui/react";

import { useAuth } from "@/shared/hooks/useAuth";

export function SpotsCreateButton() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Button leftIcon={<RiPinDistanceLine />} as={NextLink} href="/spots/new" colorScheme="green" size="sm">
      Criar Spot
    </Button>
  );
}
```

- [x] **Step 2: Add `"use client"` to `SpotCard`**

At the very top of `src/features/spots/components/SpotCard/index.tsx`, above the imports, add:

```tsx
"use client";
```

Rationale: `SpotCard` calls `useColors()` (→ `useColorModeValue`), so it cannot be a Server Component once rendered from the server-rendered `/spots` page.

- [x] **Step 3: Export `SpotsCreateButton` from the spots barrel**

Edit `src/features/spots/index.ts` — add to the `// Components` block:

```ts
export { SpotsCreateButton } from "./components/SpotsCreateButton";
```

- [x] **Step 4: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS, no new errors.

- [x] **Step 5: Commit**

```bash
git add src/features/spots/components/SpotsCreateButton.tsx src/features/spots/components/SpotCard/index.tsx src/features/spots/index.ts
git commit -m "feat(seo): extract auth-gated SpotsCreateButton and mark SpotCard as client"
```

---

## Task 5: Refactor Skatistas Feature (Barrel + Client Components)

**Files:**

- Create: `src/features/skatistas/components/Skatistas.tsx` (moved from `index.tsx`, add `"use client"`)
- Delete: `src/features/skatistas/index.tsx`
- Create: `src/features/skatistas/index.ts` (new barrel)
- Create: `src/features/skatistas/components/SkatistaPagination.tsx`
- Modify: `src/features/skatistas/Home/index.tsx` (import path + new props in Task 6)

> Note: Task 6 changes `Home/index.tsx` props; do not edit its body here. This task only moves the component, adds `"use client"`, creates the barrel, and creates `SkatistaPagination`.

- [x] **Step 1: Create `components/Skatistas.tsx`**

Copy the entire contents of `src/features/skatistas/index.tsx` verbatim into `src/features/skatistas/components/Skatistas.tsx`, then prepend `"use client";` as the first line.

The file must start exactly with:

```tsx
"use client";

import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
// ... (all remaining lines identical to the original index.tsx)
```

Change nothing else in the component body.

- [x] **Step 2: Delete the old component file**

```bash
rm src/features/skatistas/index.tsx
```

- [x] **Step 3: Create `SkatistaPagination.tsx`**

```tsx
"use client";

import { useState } from "react";

import type { UserBasicsWithPagination } from "@/features/user";
import { useUsers } from "@/features/user";

import { Skatistas } from "./Skatistas";

interface SkatistaPaginationProps {
  initialUsers: UserBasicsWithPagination;
  initialTotalUsers: number;
  initialPageSize?: number;
}

export function SkatistaPagination({ initialUsers, initialTotalUsers, initialPageSize = 50 }: SkatistaPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const { data: paginatedUsers, isPending, isFetching, isError } = useUsers(currentPage, pageSize);

  const users = paginatedUsers?.users ?? initialUsers;
  const totalUsers = paginatedUsers?.totalFetchedUsers ?? initialTotalUsers;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  if (!users) {
    if (isError) return <div>Error loading users</div>;
    return null;
  }

  return (
    <Skatistas
      users={users}
      currentPage={currentPage}
      pageSize={pageSize}
      totalUsers={totalUsers}
      isLoading={isFetching || isPending}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
```

Rationale: during SSR, `useUsers` returns `data: undefined` (React Query does not fetch on the server), so `users` falls back to `initialUsers` — putting skatista names in the HTML. After hydration, the hook re-fetches and replaces the data, and pagination works as before.

- [x] **Step 4: Create the new barrel `index.ts`**

```ts
// Components
export { Skatistas } from "./components/Skatistas";
export { SkatistaPagination } from "./components/SkatistaPagination";
export { SkatistasHome } from "./Home";
// Services
export { getSkatistasServer } from "./services/getSkatistas.server";
```

- [x] **Step 5: Fix the circular import in `Home/index.tsx`**

Edit `src/features/skatistas/Home/index.tsx`:

```tsx
// old:
import { Skatistas } from "../index";
// new:
import { Skatistas } from "../components/Skatistas";
```

Do not touch anything else in this file here (props change comes in Task 6).

- [x] **Step 6: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS, no new errors. (The `SkatistasHome`/`Skatistas` prop mismatch is expected to still compile — it receives props from `Skatistas` unchanged.)

- [x] **Step 7: Commit**

```bash
git add src/features/skatistas/
git commit -m "refactor(seo): split skatistas feature into barrel and client components"
```

---

## Task 6: Home Components Accept Server Data as Props

**Files:**

- Modify: `src/features/stories/components/Home/index.tsx`
- Modify: `src/features/skatistas/Home/index.tsx`

- [x] **Step 1: Rewrite `StoriesHome`**

Replace the entire contents of `src/features/stories/components/Home/index.tsx` with:

```tsx
"use client";

import { Flex, Spinner, Text } from "@chakra-ui/react";

import type { StoriesResponse } from "../../types/stories";
import { StoriesSwiper } from "@/shared/ui/StoriesSwiper";

import { useStories } from "../../hooks/useStories";

interface StoriesHomeProps {
  initialStories?: StoriesResponse;
}

export function StoriesHome({ initialStories }: StoriesHomeProps) {
  const { data, isLoading, isError } = useStories();

  const storiesResponse = data ?? initialStories;

  const stories = (storiesResponse?.data ?? [])
    .filter(
      (
        story
      ): story is typeof story & {
        attributes: { author: { data: NonNullable<typeof story.attributes.author.data> } };
      } => story.attributes.author?.data != null
    )
    .map(story => ({
      id: story.id,
      storyAuthorId: story.attributes.author.data.id,
      name: story.attributes.author.data.attributes.name,
      image:
        story.attributes.author.data.attributes.avatar?.data?.attributes?.formats?.thumbnail?.url ??
        story.attributes.author.data.attributes.avatar?.data?.attributes?.url ??
        "",
      isUserOffline: false //TODO: implement logic to determine if the user is offline
    }));

  if (stories.length === 0) {
    if (isLoading && !initialStories) {
      return (
        <Flex justify="center" align="center" minH="139px">
          <Spinner size="lg" color="green.400" />
        </Flex>
      );
    }
    if (isError && !initialStories) {
      return (
        <Flex justify="center" align="center" minH="139px">
          <Text color="red.500">Erro ao carregar stories.</Text>
        </Flex>
      );
    }
    return (
      <Flex justify="center" align="center" minH="139px">
        <Text color="gray.500">Nenhum story nas últimas 24 horas.</Text>
      </Flex>
    );
  }

  return <StoriesSwiper stories={stories} />;
}
```

Rationale: during SSR `data` is undefined, so `initialStories` (server-fetched) renders into the HTML. On the client the hook re-fetches and `data` replaces it. The `isLoading`/`isError` branches only show when there is no initial data (i.e., when rendered on a client-only route).

- [x] **Step 2: Rewrite `SkatistasHome`**

Replace the entire contents of `src/features/skatistas/Home/index.tsx` with:

```tsx
"use client";

import { useState } from "react";

import { Flex, Spinner } from "@chakra-ui/react";

import type { UserBasicsWithPagination } from "@/features/user";
import { useUsers } from "@/features/user";

import { Skatistas } from "../components/Skatistas";

interface SkatistasHomeProps {
  initialUsers?: UserBasicsWithPagination;
  initialTotalUsers?: number;
}

export function SkatistasHome({ initialUsers, initialTotalUsers }: SkatistasHomeProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: paginatedUsers, isPending, isFetching, isError } = useUsers(currentPage, pageSize);

  const users = paginatedUsers?.users ?? initialUsers;
  const totalUsers = paginatedUsers?.totalFetchedUsers ?? initialTotalUsers ?? 0;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  if (!users) {
    if (isError) return <div>Error loading users</div>;
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  return (
    <Skatistas
      users={users}
      currentPage={currentPage}
      pageSize={pageSize}
      totalUsers={totalUsers}
      isLoading={isFetching || isPending}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
```

- [x] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS. If `Skatistas` props warn about `users` type, the fallback `users` variable is already narrowed to `UserBasicsWithPagination` by the `!users` guard.

- [x] **Step 4: Commit**

```bash
git add src/features/stories/components/Home/index.tsx src/features/skatistas/Home/index.tsx
git commit -m "feat(seo): home components accept server-fetched data as props"
```

---

## Task 7: Convert `/spots` Page to Server Component

**Files:**

- Modify: `src/app/(public)/spots/page.tsx`

- [x] **Step 1: Replace the page**

Replace the entire contents of `src/app/(public)/spots/page.tsx` with:

```tsx
import type { Metadata } from "next";

import { Box, Grid, Text } from "@chakra-ui/react";

import { getSpotsServer, SpotsCreateButton, SpotCard } from "@/features/spots";
import { TitleSection } from "@/shared/ui/TitleSection";

export const metadata: Metadata = {
  title: "Spots — SkateHub",
  description: "Descubra spots de skate compartilhados pela comunidade",
  alternates: { canonical: "https://skatehub.vercel.app/spots" },
  openGraph: {
    title: "Spots — SkateHub",
    description: "Descubra spots de skate compartilhados pela comunidade",
    url: "https://skatehub.vercel.app/spots",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Spots — SkateHub",
    description: "Descubra spots de skate compartilhados pela comunidade"
  }
};

export default async function SpotsPage() {
  const response = await getSpotsServer();
  const spots = response.data;

  return (
    <Box position="relative">
      <TitleSection title="Spots" />
      <Box width="100%">
        <Box position="absolute" top={0} right={0}>
          <SpotsCreateButton />
        </Box>

        {spots.length === 0 ? (
          <Text color="gray.400" textAlign="center" mt={12}>
            Nenhum spot encontrado. Seja o primeiro a adicionar!
          </Text>
        ) : (
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
            {spots.map(spot => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
```

Notes:

- No `"use client"` directive — this is now a Server Component.
- Loading/error spinners are gone (server does the loading; an error bubbles to `src/app/error.tsx`).
- `SpotsCreateButton` preserves the auth-gated button; `SpotCard` is a client component receiving serializable props.

- [x] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [x] **Step 3: Commit**

```bash
git add "src/app/(public)/spots/page.tsx"
git commit -m "feat(seo): convert /spots to server component with metadata"
```

---

## Task 8: Convert `/spots/[id]` Page to Server Component

**Files:**

- Modify: `src/app/(public)/spots/[id]/page.tsx`

- [x] **Step 1: Replace the page**

Replace the entire contents of `src/app/(public)/spots/[id]/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSpotServer, SpotDetail } from "@/features/spots";

type SpotDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: SpotDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await getSpotServer(id);
    const spot = response.data;
    const description = (spot.attributes.description ?? "").slice(0, 160);

    return {
      title: `${spot.attributes.name} — SkateHub`,
      description,
      alternates: { canonical: `https://skatehub.vercel.app/spots/${id}` },
      openGraph: {
        title: `${spot.attributes.name} — SkateHub`,
        description,
        url: `https://skatehub.vercel.app/spots/${id}`,
        type: "website"
      },
      twitter: {
        card: "summary",
        title: `${spot.attributes.name} — SkateHub`,
        description
      }
    };
  } catch {
    return {
      title: "Spot — SkateHub",
      description: "Spot de skate compartilhado pela comunidade SkateHub"
    };
  }
}

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { id } = await params;

  let spot;
  try {
    const response = await getSpotServer(id);
    spot = response.data;
  } catch {
    notFound();
  }

  return <SpotDetail spot={spot} />;
}
```

Notes:

- `SpotDetail` is already `"use client"` and receives `spot` as a serializable prop — no changes needed there.
- Missing/invalid spots return HTTP 404 via `notFound()` (good for SEO).
- `generateMetadata` fetches the spot independently; the shared `revalidate: 60` Data Cache dedupes the two fetches within 60s.

- [x] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [x] **Step 3: Commit**

```bash
git add "src/app/(public)/spots/[id]/page.tsx"
git commit -m "feat(seo): convert /spots/[id] to server component with generateMetadata"
```

---

## Task 9: Convert `/skatistas` Page to Server Component

**Files:**

- Modify: `src/app/(public)/skatistas/page.tsx`

- [x] **Step 1: Replace the page**

Replace the entire contents of `src/app/(public)/skatistas/page.tsx` with:

```tsx
import type { Metadata } from "next";

import { getSkatistasServer, SkatistaPagination } from "@/features/skatistas";
import { TitleSection } from "@/shared/ui/TitleSection";

export const metadata: Metadata = {
  title: "Skatistas — SkateHub",
  description: "Conheça os skatistas da comunidade SkateHub",
  alternates: { canonical: "https://skatehub.vercel.app/skatistas" },
  openGraph: {
    title: "Skatistas — SkateHub",
    description: "Conheça os skatistas da comunidade SkateHub",
    url: "https://skatehub.vercel.app/skatistas",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Skatistas — SkateHub",
    description: "Conheça os skatistas da comunidade SkateHub"
  }
};

export default async function SkatistasPage() {
  const { users, totalFetchedUsers } = await getSkatistasServer(1, 50);

  return (
    <>
      <TitleSection title="Skatistas" />
      <SkatistaPagination initialUsers={users} initialTotalUsers={totalFetchedUsers} initialPageSize={50} />
    </>
  );
}
```

- [x] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [x] **Step 3: Commit**

```bash
git add "src/app/(public)/skatistas/page.tsx"
git commit -m "feat(seo): convert /skatistas to server component with metadata"
```

---

## Task 10: Convert Home Page (`/`) to Server Component

**Files:**

- Modify: `src/app/page.tsx`

- [x] **Step 1: Replace the page**

Replace the entire contents of `src/app/page.tsx` with:

```tsx
import type { Metadata } from "next";

import { Box } from "@chakra-ui/react";

import { SkatistasHome } from "@/features/skatistas";
import { getStoriesServer, StoriesHome } from "@/features/stories";
import { getSkatistasServer } from "@/features/skatistas";

export const metadata: Metadata = {
  title: "SkateHub",
  description: "Plataforma social para a comunidade do skate",
  alternates: { canonical: "https://skatehub.vercel.app/" },
  openGraph: {
    title: "SkateHub",
    description: "Plataforma social para a comunidade do skate",
    url: "https://skatehub.vercel.app/",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "SkateHub",
    description: "Plataforma social para a comunidade do skate"
  }
};

export default async function HomePage() {
  const [stories, skatistas] = await Promise.all([getStoriesServer(), getSkatistasServer(1, 10)]);

  return (
    <Box>
      <StoriesHome initialStories={stories} />
      <SkatistasHome initialUsers={skatistas.users} initialTotalUsers={skatistas.totalFetchedUsers} />
    </Box>
  );
}
```

- [x] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [x] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(seo): convert home page to server component with metadata"
```

---

## Task 11: Root Layout — `lang="pt-BR"` + Portuguese Description

**Files:**

- Modify: `src/app/layout.tsx`

- [x] **Step 1: Update metadata and html lang**

Edit `src/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "SkateHub",
  description: "Plataforma social para a comunidade do skate"
};
```

And change the opening tag:

```tsx
<html lang="en">
```

to:

```tsx
<html lang="pt-BR">
```

Do NOT remove `export const dynamic = "force-dynamic";` (see Decisions).

- [x] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [x] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(seo): set pt-BR lang and Portuguese description in root layout"
```

---

## Task 12: Sitemap, robots.txt, Remove Old Route

**Files:**

- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `next.config.ts` (remove rewrite)
- Delete: `src/app/api/sitemap/route.ts` (and empty folder)

- [x] **Step 1: Write `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

import { getSpotsServer } from "@/features/spots";

const BASE_URL = "https://skatehub.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const spots = await getSpotsServer();

  const spotEntries: MetadataRoute.Sitemap = spots.data.map(spot => ({
    url: `${BASE_URL}/spots/${spot.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7
  }));

  return [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/spots`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/skatistas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...spotEntries
  ];
}
```

- [x] **Step 2: Write `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://skatehub.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/auth/"]
    },
    sitemap: `${BASE_URL}/sitemap.xml`
  };
}
```

- [x] **Step 3: Remove the `/sitemap.xml` rewrite from `next.config.ts`**

Edit `next.config.ts` — remove the `rewrites` block so it looks like:

```ts
const nextConfig: NextConfig = {
  // These OTel packages patch Node.js modules at runtime; Turbopack must not
  // try to bundle them — let Node.js resolve them from node_modules directly.
  serverExternalPackages: ["import-in-the-middle", "require-in-the-middle"],
  images: {
    remotePatterns: [
      { hostname: "127.0.0.1" },
      { hostname: "strapi-production-b6f4.up.railway.app" },
      { hostname: "res.cloudinary.com" }
    ]
  }
};
```

Keep `withSentryConfig(nextConfig, ...)` unchanged.

- [x] **Step 4: Delete the old sitemap API route**

```bash
rm src/app/api/sitemap/route.ts
rmdir src/app/api/sitemap
```

- [x] **Step 5: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [x] **Step 6: Verify in dev**

Start the dev server and curl the new routes:

```bash
pnpm dev
```

In a second terminal:

```bash
curl -s http://localhost:3000/sitemap.xml | head -20
curl -s http://localhost:3000/robots.txt
```

Expected: `/sitemap.xml` returns a URLset with the three static routes plus `/spots/{id}` entries; `/robots.txt` returns the disallow rules and sitemap URL. (May require Strapi to be running locally for the spot entries.)

- [x] **Step 7: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts next.config.ts
git rm -r src/app/api/sitemap
git commit -m "feat(seo): add dynamic sitemap and robots.txt, remove legacy sitemap route"
```

---

## Task 13: Remove Dead Code (Hooks + Client Services)

**Files:**

- Delete: `src/features/spots/hooks/useSpots.ts`
- Delete: `src/features/spots/hooks/useSpot.ts`
- Delete: `src/features/spots/services/getSpots.ts`
- Modify: `src/features/spots/index.ts` (remove dead exports)

> Why: after Tasks 7-8 converted the public pages to server components, `useSpots` (only used by `/spots`), `useSpot` (only used by `/spots/[id]`), and `getSpots.ts` (only used by `useSpots`) have zero consumers. **Keep** `getSpotById.ts` — the protected edit page still imports it directly. No hooks are _modified_; the two hooks and one service are _removed_ as dead code.

- [x] **Step 1: Delete the dead files**

```bash
rm src/features/spots/hooks/useSpots.ts
rm src/features/spots/hooks/useSpot.ts
rm src/features/spots/services/getSpots.ts
```

- [x] **Step 2: Update `src/features/spots/index.ts`**

Remove these lines (present in the current barrel):

```ts
export { getSpots } from "./services/getSpots";
export { useSpots } from "./hooks/useSpots";
export { useSpot } from "./hooks/useSpot";
```

Do **not** remove `getSpotById` export — the protected edit page depends on it.

- [x] **Step 3: Verify no dangling imports**

```bash
rg -n "useSpots|useSpot|services/getSpots" src/ || echo "no references"
```

Expected: no output (no references remain anywhere).

- [x] **Step 4: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS, no new errors.

- [x] **Step 5: Commit**

```bash
git add -A src/features/spots
git commit -m "refactor(seo): remove dead hooks and client service after SSR conversion"
```

---

## Task 14: Documentation (README, CHANGELOG, Spec Acceptance)

**Files:**

- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/superpowers/specs/2026-07-31-seo-design.md`

- [x] **Step 1: Update README Features section**

Add a bullet under the appropriate category in `README.md` (read it first to find the right section):

```markdown
- SEO: public pages are server-rendered with per-page titles, descriptions, and Open Graph tags for better search visibility
```

- [x] **Step 2: Update CHANGELOG**

Prepend a new entry at the top of the `## [Unreleased]` section in `CHANGELOG.md`:

```markdown
- 2026-08-07 - SEO: server-side rendering + metadata for all public pages, dynamic sitemap, robots.txt [#PR](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/<number>) _(v2.2.0)_
```

Replace `<number>` with the actual PR number when the PR is opened.

- [x] **Step 3: Mark spec acceptance criteria**

In `docs/superpowers/specs/2026-07-31-seo-design.md`, check every acceptance criterion that is now satisfied. All eight items are covered by this implementation (verify `lang="pt-BR"`, og tags, hook immutability, auth-gated button, and pagination before checking).

- [x] **Step 4: Commit**

```bash
git add README.md CHANGELOG.md docs/superpowers/specs/2026-07-31-seo-design.md
git commit -m "docs(seo): update README, changelog, and mark spec acceptance criteria"
```

---

## Task 15: Final Verification

**Files:** none

- [x] **Step 1: Lint + import sort**

```bash
pnpm lint
pnpm run format:imports
```

Expected: no errors. (`format:imports` fixes import ordering; lint-staged runs on commit too.)

- [x] **Step 2: Production build**

```bash
pnpm build
```

Expected: build succeeds. The four public pages are marked `ƒ` (Dynamic, server-rendered on demand) because of the root `force-dynamic`.

> **Build-fix deviations (discovered during Task 15):**
>
> 1. The home page's server graph pulls the `user` barrel (via `getSkatistasServer`) and the `stories` barrel, which re-export client components that lack a `"use client"` boundary. Next/Turbopack then evaluates their client-only module-scope code (React Query hooks, `react-insta-stories` `createContext`) in the server bundle and the build fails. Fixed by adding `"use client"` to the genuinely client components: `src/features/lists/components/ListItemForm`, `ListForm`, `CreateListModal`, `src/features/user/components/Profile`, `src/features/stories/components/Modal`.
> 2. `src/app/sitemap.ts` is a metadata route cached/prerendered at build time; the root layout's `force-dynamic` does not propagate to it, so `pnpm build` fetched Strapi and failed. Added `export const dynamic = "force-dynamic"` to `sitemap.ts` (consistent with the "keep force-dynamic to avoid build-time Strapi dependency" decision).

- [x] **Step 3: Manual curl checks (dev server)**

With Strapi running locally and `pnpm dev` up:

```bash
curl -s http://localhost:3000/spots | grep -o "<title>[^<]*</title>"
curl -s http://localhost:3000/skatistas | grep -c "<a href=\"/user/"
curl -s http://localhost:3000/sitemap.xml | grep -c "<loc>"
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/ | grep -o 'lang="pt-BR"'
```

Expected: `/spots` title is `Spots — SkateHub`; `/skatistas` body contains user links; sitemap has entries; robots.txt shows the rules; home html lang is `pt-BR`.

- [x] **Step 4: Verify remaining hooks were not modified**

```bash
git diff develop --stat -- src/features/spots/hooks src/features/user/hooks src/features/stories/hooks
```

Expected: only deletions of `useSpots.ts` and `useSpot.ts` (from Task 13). No other hook files changed. React Query hooks that remain are untouched.

- [x] **Step 5: Open PR**

```bash
git status
git log --oneline develop..HEAD
```

Review the branch, push it, and open a PR to `develop` per AGENTS.md. Never merge to `develop`/`main` directly.

---

## Self-Review Checklist

**Spec coverage:**

- Server Components for `/`, `/spots`, `/spots/[id]`, `/skatistas` → Tasks 7-10
- `generateMetadata` on each public page → Tasks 7-10
- Root layout `lang="pt-BR"` + PT description → Task 11
- Dynamic `sitemap.ts` with static + spot routes, no protected routes → Task 12
- `robots.ts` with disallow rules → Task 12
- Remove `next.config.ts` rewrite + delete `src/app/api/sitemap/route.ts` → Task 12
- Server-safe services (`getSpots/getSpot/getUsers/getStories/getSkatistas`) with `revalidate: 60` → Tasks 1-3
- Client component extraction (`SpotsCreateButton`, `SkatistaPagination`) → Tasks 4-5
- Home components (`StoriesHome`, `SkatistasHome`) receive data as props → Task 6
- Remaining React Query hooks untouched; dead `useSpots`/`useSpot`/`getSpots` removed → Tasks 13, 15
- og/twitter/canonical tags on every page → Tasks 7-10
- Docs (README/CHANGELOG) → Task 14

**Placeholder scan:** no TBD/TODO steps; all code is complete and copy-pasteable.

**Type consistency:** `getUsersServer`/`getSkatistasServer` return `{ users: UserBasicsWithPagination; totalFetchedUsers: number }` everywhere; `SkatistaPagination`/`SkatistasHome` consume `initialUsers`/`initialTotalUsers` of the same shape. `getStoriesServer` returns `StoriesResponse` consumed by `StoriesHome`'s `initialStories`.
