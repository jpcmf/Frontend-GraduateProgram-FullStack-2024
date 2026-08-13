# Feature: SEO — Full Server-Side Rendering & Metadata

**Status:** ready
**Priority:** high
**Affects:** `app/layout.tsx`, `app/page.tsx`, `app/(public)/spots/page.tsx`, `app/(public)/spots/[id]/page.tsx`, `app/(public)/skatistas/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `next.config.ts`, `src/app/api/sitemap/`, `src/features/spots/services/`, `src/features/user/services/`, `src/features/stories/services/`, `src/features/skatistas/services/`

---

## Problem Statement

Google currently indexes SkateHub as a blank page with only the generic title "SkateHub" and description "Social platform for the skateboarding community." All public pages (`/`, `/spots`, `/spots/[id]`, `/skatistas`) are `"use client"` components that render entirely in the browser via React Query. Google's crawler receives empty HTML shells with no meaningful content. The result is poor discoverability — spots and skatistas are invisible to search engines.

---

## Architecture

All pages in the `(public)` route group will be converted from client components to **Server Components**. The `"use client"` directive will be removed from page files. Interactive sub-components (auth-gated buttons, pagination controls) will be extracted into separate `"use client"` leaf components that receive server-fetched data as props.

Each affected feature will gain a parallel set of **server-safe service functions** — plain `async fetch()` wrappers callable from Server Components. The existing React Query hooks remain unchanged and continue to be used inside protected/authenticated routes.

**Pattern:**

```
// page.tsx (Server Component)
//   → fetches data via server-safe service
//   → renders static HTML for Google
//   → passes data as props to "use client" leaf components for interactivity
```

---

## Metadata

Each public page exports a `generateMetadata()` function. Language is set to `pt-BR` in `layout.tsx`.

| Page                        | `<title>`                | `<description>`                                            |
| --------------------------- | ------------------------ | ---------------------------------------------------------- |
| Home (`/`)                  | `SkateHub`               | `"Plataforma social para a comunidade do skate"`           |
| Spots (`/spots`)            | `Spots — SkateHub`       | `"Descubra spots de skate compartilhados pela comunidade"` |
| Spot detail (`/spots/[id]`) | `{spot.name} — SkateHub` | `{spot.description}` from Strapi, truncated to 160 chars   |
| Skatistas (`/skatistas`)    | `Skatistas — SkateHub`   | `"Conheça os skatistas da comunidade SkateHub"`            |

**Tags added to every page via Next.js `metadata` object:**

- `og:title`, `og:description`, `og:url`, `og:type`
- `twitter:card`, `twitter:title`, `twitter:description`
- `canonical` URL

**`layout.tsx` changes:**

- `<html lang="en">` → `<html lang="pt-BR">`
- Root `metadata` export updated to Portuguese description

---

## Sitemap & robots.txt

**Sitemap:**

- Old: static API route at `src/app/api/sitemap/route.ts` (3 hardcoded URLs)
- New: dynamic `app/sitemap.ts` using Next.js native sitemap convention
  - Includes static routes: `/`, `/spots`, `/skatistas`
  - Fetches all spots from Strapi and includes `/spots/{id}` for each
  - Excludes authenticated routes: `/dashboard`, `/auth/*`
- The `next.config.ts` rewrite rule `"/sitemap.xml" → "/api/sitemap"` will be removed
- The old `src/app/api/sitemap/` route file will be deleted

**robots.txt:**

- New file: `app/robots.ts` (Next.js native convention)

```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /auth/
Sitemap: https://skatehub.vercel.app/sitemap.xml
```

---

## Server-Safe Service Functions

New files — plain `async fetch()` functions, no React, no hooks:

```
src/features/spots/services/getSpots.server.ts
src/features/spots/services/getSpot.server.ts
src/features/user/services/getUsers.server.ts
src/features/stories/services/getStories.server.ts
src/features/skatistas/services/getSkatistas.server.ts
```

**Caching strategy (Next.js `fetch` options):**

- All listing pages (`/spots`, `/skatistas`, home): `{ next: { revalidate: 60 } }` — cached for 60 seconds (ISR)
- Spot detail (`/spots/[id]`): `{ next: { revalidate: 60 } }`

These functions will be exported from each feature's `index.ts` barrel.

---

## Client Component Extraction

Interactive UI extracted into `"use client"` leaf components:

| Page         | Extracted Component            | Reason                                                                                            |
| ------------ | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `/spots`     | `SpotsCreateButton`            | Uses `useAuth` to conditionally render "Criar Spot" button                                        |
| `/skatistas` | `SkatistaPagination`           | Uses `useState` for page and page size                                                            |
| Home (`/`)   | `StoriesHome`, `SkatistasHome` | Audit required — if they use hooks internally, they stay `"use client"` and receive data as props |

Components that have no interactivity and no hooks can remain as plain (server) components receiving props.

---

## Data Requirements

All server-safe service functions call the existing Strapi REST API using the same base URL already configured in `apiClient.ts`. They use `fetch()` directly (not Axios) since Axios is not available in Server Components without extra setup.

API endpoints used:

- `GET /api/spots` — list of spots
- `GET /api/spots/:id` — single spot
- `GET /api/users` — list of users (skatistas)
- `GET /api/stories` — stories for home page (audit needed)

---

## Component & File Plan

**New files:**

- `app/sitemap.ts`
- `app/robots.ts`
- `src/features/spots/services/getSpots.server.ts`
- `src/features/spots/services/getSpot.server.ts`
- `src/features/user/services/getUsers.server.ts`
- `src/features/stories/services/getStories.server.ts`
- `src/features/skatistas/services/getSkatistas.server.ts`
- `src/features/spots/components/SpotsCreateButton.tsx` (extracted client component)
- `src/features/skatistas/components/SkatistaPagination.tsx` (extracted client component)

**Modified files:**

- `app/layout.tsx` — `lang="pt-BR"`, updated metadata description
- `app/page.tsx` — remove `"use client"`, convert to server component, add `generateMetadata`
- `app/(public)/spots/page.tsx` — remove `"use client"`, server fetch, add `generateMetadata`
- `app/(public)/spots/[id]/page.tsx` — remove `"use client"`, server fetch, add `generateMetadata`
- `app/(public)/skatistas/page.tsx` — remove `"use client"`, server fetch, add `generateMetadata`
- `next.config.ts` — remove sitemap rewrite rule

**Deleted files:**

- `src/app/api/sitemap/route.ts`

---

## Acceptance Criteria

- [ ] `curl https://skatehub.vercel.app/spots/[id]` returns HTML with the spot name in `<title>`
- [ ] `curl https://skatehub.vercel.app/skatistas` returns HTML with skatista names visible in the body
- [ ] `curl https://skatehub.vercel.app/sitemap.xml` returns XML listing all spot URLs
- [ ] `curl https://skatehub.vercel.app/robots.txt` returns the correct disallow rules
- [ ] Each public page has unique `og:title` and `og:description` tags
- [ ] `<html lang="pt-BR">` is set in the root layout
- [ ] Existing React Query hooks are not modified and still work in protected routes
- [ ] "Criar Spot" button still only appears to authenticated users
- [ ] Skatistas pagination still works correctly

---

## Out of Scope (Future Work)

1. **Dynamic OG images** — Per-page Open Graph images using Next.js `ImageResponse`. Implement at `app/(public)/spots/[id]/opengraph-image.tsx` using the spot's cover photo, falling back to `public/skatehub.png`.

2. **Structured data (JSON-LD)** — Add `<script type="application/ld+json">` to spot detail pages with `Place` schema markup (name, address, geo coordinates). Helps Google show rich results in SERPs.

3. **Google Search Console** — Submit the sitemap at `https://skatehub.vercel.app/sitemap.xml` via Search Console after deploy. Monitor coverage and indexing errors.

4. **Core Web Vitals audit** — After conversion, run Lighthouse on all public pages. Verify LCP, CLS, and INP scores. Vercel Speed Insights already captures real-user data.

5. **i18n / hreflang** — Site is in Portuguese but has no `hreflang` tags. If a multi-language version is added in the future, `hreflang` annotations will be required.
