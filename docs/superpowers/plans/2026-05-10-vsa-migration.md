# Vertical Slice Architecture Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the SkateHub frontend from its current layered architecture (`components/`, `hooks/`, `services/`, `types/`) to Vertical Slice Architecture (VSA), where each feature owns its components, hooks, services, and types, with only truly shared code in `shared/`.

**Architecture:** Three top-level buckets — `app/` (Next.js routing shell, providers), `features/` (domain slices, self-contained), `shared/` (used by 2+ features: UI primitives, api client, lib utilities). Features never import from sibling features. Code is promoted to `shared/` only when two or more features need it.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Chakra UI 2, TanStack Query v5, Zod, pnpm.

---

## Decisions Made Before This Plan

| Question                      | Answer                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `ai-writer` feature scope     | `ImproveTextButton` + `useAIWriter` + `isSupported` stay inside `features/spots/` (spots-only for now) |
| `Header`, `Sidebar`, `Footer` | Move to `shared/ui/` — layout chrome, no domain logic                                                  |

---

## Target File Structure

```
src/
├── app/                                   ← Next.js routing + providers (unchanged routing)
│   ├── (protected)/
│   ├── (public)/
│   ├── api/
│   ├── layout.tsx
│   ├── providers.tsx
│   └── ...
│
├── features/
│   ├── ai/
│   │   ├── components/
│   │   │   ├── Chat.tsx                   ← was features/ai/Chat/index.tsx
│   │   │   └── Message.tsx                ← was features/ai/Message/index.tsx
│   │   ├── hooks/
│   │   │   └── useAIChat.ts               ← was hooks/useAIChat.ts
│   │   ├── types.ts                        ← was types/ai.ts
│   │   └── index.ts
│   │
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginModal.tsx             ← was features/login/modal/login.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts                 ← was hooks/useAuth.ts
│   │   ├── services/
│   │   │   └── auth.ts                    ← was services/auth.ts
│   │   ├── schemas.ts                      ← was features/user/signInFormSchema.ts
│   │   └── index.ts
│   │
│   ├── dashboard/
│   │   ├── Dashboard.tsx                  ← was features/dashboard/index.tsx
│   │   └── index.ts
│   │
│   ├── skatistas/
│   │   ├── components/
│   │   │   └── SkatistasHome.tsx          ← was features/skatistas/home/index.tsx
│   │   ├── Skatistas.tsx                  ← was features/skatistas/index.tsx
│   │   └── index.ts
│   │
│   ├── spots/
│   │   ├── components/
│   │   │   ├── SpotCard.tsx               ← was features/spots/SpotCard/index.tsx
│   │   │   ├── SpotDetail.tsx             ← was features/spots/SpotDetail/index.tsx
│   │   │   ├── SpotForm.tsx               ← was features/spots/SpotForm/index.tsx
│   │   │   └── ImproveTextButton.tsx      ← was shared/components/ImproveTextButton.tsx
│   │   ├── hooks/
│   │   │   ├── useAIWriter.ts             ← was hooks/useAIWriter.ts
│   │   │   ├── useCreateSpot.ts           ← was hooks/useCreateSpot.ts
│   │   │   ├── useDeleteSpot.ts           ← was hooks/useDeleteSpot.ts
│   │   │   ├── useSpot.ts                 ← was hooks/useSpot.ts
│   │   │   ├── useSpots.ts                ← was hooks/useSpots.ts
│   │   │   └── useUpdateSpot.ts           ← was hooks/useUpdateSpot.ts
│   │   ├── services/
│   │   │   ├── createSpot.ts              ← was services/createSpot.ts
│   │   │   ├── deleteSpot.ts              ← was services/deleteSpot.ts
│   │   │   ├── getSpotById.ts             ← was services/getSpotById.ts
│   │   │   ├── getSpots.ts                ← was services/getSpots.ts
│   │   │   └── updateSpot.ts              ← was services/updateSpot.ts
│   │   ├── utils/
│   │   │   └── isSupported.ts             ← was utils/ai/isSupported.ts
│   │   ├── constants.ts                   ← was lib/const/spotValidation.ts + parts of lib/const/validation.ts
│   │   ├── types.ts                       ← was types/spots.ts
│   │   └── index.ts
│   │
│   ├── stories/
│   │   ├── components/
│   │   │   ├── StoriesHome.tsx            ← was features/stories/home/index.tsx
│   │   │   └── StoriesModal.tsx           ← was features/stories/modal/index.tsx
│   │   ├── hooks/
│   │   │   ├── useStories.ts              ← was hooks/useStories.ts
│   │   │   └── useStoriesByUserId.ts      ← was hooks/useStoriesByUserId.ts
│   │   ├── services/
│   │   │   └── getStories.ts              ← was services/getStories.ts
│   │   ├── types.ts                       ← was types/stories.ts
│   │   └── index.ts
│   │
│   └── user/
│       ├── components/
│       │   ├── UserEdit.tsx               ← was features/user/edit/index.tsx
│       │   └── UserProfile.tsx            ← was features/user/profile/index.tsx
│       ├── hooks/
│       │   ├── useAvatarUpload.ts         ← was hooks/useAvatarUpload.ts
│       │   ├── useUser.ts                 ← was hooks/useUser.ts
│       │   └── useUsers.ts                ← was hooks/useUsers.ts
│       ├── services/
│       │   ├── getUser.ts                 ← was services/getUser.ts
│       │   ├── getUsers.ts                ← was services/getUsers.ts
│       │   ├── getUsersCount.ts           ← was services/getUsersCount.ts
│       │   ├── linkAvatar.ts              ← was services/linkAvatar.ts
│       │   ├── signUpRequest.ts           ← was services/signUpRequest.ts
│       │   └── uploadAvatar.ts            ← was services/uploadAvatar.ts
│       ├── types.ts                       ← was types/User.type.ts + UserBasicsWithPagination + usersBasics
│       └── index.ts
│
└── shared/
    ├── ui/                                ← merge of src/components/ + src/shared/components/Form/
    │   ├── ActiveLink.tsx                 ← was components/ActiveLink/index.tsx
    │   ├── CardUser.tsx                   ← was components/CardUser/index.tsx (shared: used in user + skatistas)
    │   ├── ErrorBoundary.tsx              ← was components/ErrorBoundary/index.tsx
    │   ├── Footer.tsx                     ← was components/Footer/index.tsx
    │   ├── HeaderProfile.tsx              ← was components/HeaderProfile/index.tsx
    │   ├── LogoSkateHub.tsx               ← was components/LogoSkateHub/index.tsx
    │   ├── MapBox.tsx                     ← was components/Map/MapBox.tsx
    │   ├── Pagination.tsx                 ← was components/Pagination/index.tsx
    │   ├── ReusableModal.tsx              ← was components/ReusableModal/index.tsx
    │   ├── TitleSection.tsx               ← was components/TitleSection/index.tsx
    │   ├── Toast.tsx                      ← was components/Toast/index.tsx
    │   ├── form/
    │   │   ├── Input.tsx                  ← merge components/Form/Input.tsx + shared/components/Form/Input.tsx
    │   │   ├── Select.tsx                 ← was shared/components/Form/Select.tsx
    │   │   └── Textarea.tsx               ← was shared/components/Form/Textarea.tsx
    │   ├── layout/
    │   │   └── index.tsx                  ← was shared/components/Layout/index.tsx
    │   ├── Header/
    │   │   ├── index.tsx                  ← was components/Header/index.tsx
    │   │   ├── Notification.tsx
    │   │   ├── Profile.tsx
    │   │   └── Search.tsx
    │   └── Sidebar/
    │       ├── index.tsx                  ← was components/Sidebar/index.tsx
    │       ├── NavLink.tsx
    │       ├── NavSection.tsx
    │       └── SidebarNav.tsx
    │
    ├── api/
    │   ├── apiClient.ts                   ← was lib/apiClient.ts
    │   └── streamClient.ts               ← was lib/streamClient.ts
    │
    ├── hooks/
    │   ├── useColors.ts                   ← was hooks/useColors.ts (used in many features)
    │   └── usePagination.ts               ← was hooks/usePagination.ts (used in spots + users)
    │
    ├── lib/
    │   ├── fonts.ts                       ← was lib/fonts.ts
    │   ├── queryClient.ts                 ← was lib/queryClient.ts
    │   ├── theme.ts                       ← merge lib/theme.ts + styles/theme.ts (resolve duplication)
    │   ├── date.ts                        ← was utils/date.ts
    │   ├── mapbox.ts                      ← was utils/mapbox.ts
    │   ├── socialMedia.ts                 ← was utils/socialMedia.ts
    │   ├── authUtils.ts                   ← was utils/auth.ts (renamed to avoid clash with features/auth)
    │   ├── modal.ts                       ← was styles/modal.ts
    │   └── observability/                 ← was lib/observability/ (moved as-is)
    │       ├── index.ts
    │       ├── composite.ts
    │       ├── noop.ts
    │       ├── types.ts
    │       └── providers/
    │           ├── posthog.ts
    │           └── sentry.ts
    │
    ├── config/
    │   ├── constants.ts                   ← merge lib/const/index.ts + utils/constant.ts + lib/const/categories.ts
    │   └── validation.ts                  ← was lib/const/validation.ts (generic validation rules only)
    │
    └── server/
        └── lib/
            ├── gemini.ts                  ← was server/lib/gemini.ts
            └── openrouter.ts             ← was server/lib/openrouter.ts
```

---

## Phase Overview

| Phase | Scope                                                         | Risk   |
| ----- | ------------------------------------------------------------- | ------ |
| 1     | Move `shared/` — api, lib, config, server, hooks, theme dedup | Low    |
| 2     | Merge `src/components/` → `shared/ui/`                        | Low    |
| 3     | Co-locate hooks into features                                 | Medium |
| 4     | Co-locate services into features                              | Medium |
| 5     | Co-locate types into features                                 | Medium |
| 6     | Reorganize features internal structure + add index.ts barrels | Low    |
| 7     | Update all imports across the codebase                        | Medium |
| 8     | Clean up empty directories                                    | Low    |

---

## Task 1: Resolve Theme Duplication

**Files:**

- Read: `src/lib/theme.ts`, `src/styles/theme.ts`, `src/styles/modal.ts`
- Create: `src/shared/lib/theme.ts`
- Create: `src/shared/lib/modal.ts`
- Delete: `src/lib/theme.ts`, `src/styles/theme.ts`, `src/styles/modal.ts`

- [ ] **Step 1: Read both theme files to identify overlaps**

```bash
cat src/lib/theme.ts
cat src/styles/theme.ts
```

Find which exports exist in both. The one in `src/styles/theme.ts` is the canonical one (used in `app/providers.tsx`).

- [ ] **Step 2: Create `src/shared/lib/theme.ts`**

Copy the content of `src/styles/theme.ts` verbatim. Add any unique exports from `src/lib/theme.ts` that are not already present.

- [ ] **Step 3: Create `src/shared/lib/modal.ts`**

Copy the content of `src/styles/modal.ts` verbatim.

- [ ] **Step 4: Update all imports pointing to the old paths**

Search and replace:

- `from "@/lib/theme"` → `from "@/shared/lib/theme"`
- `from "@/styles/theme"` → `from "@/shared/lib/theme"`
- `from "@/styles/modal"` → `from "@/shared/lib/modal"`

- [ ] **Step 5: Delete old files**

```bash
rm src/lib/theme.ts src/styles/theme.ts src/styles/modal.ts
```

- [ ] **Step 6: Verify build**

```bash
pnpm build 2>&1 | head -60
```

Expected: no errors related to theme imports.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "refactor: consolidate theme files into shared/lib/theme"
```

---

## Task 2: Move Shared Infrastructure (api, lib, config, server)

**Files:**

- Move: `src/lib/apiClient.ts` → `src/shared/api/apiClient.ts`
- Move: `src/lib/streamClient.ts` → `src/shared/api/streamClient.ts`
- Move: `src/lib/fonts.ts` → `src/shared/lib/fonts.ts`
- Move: `src/lib/queryClient.ts` → `src/shared/lib/queryClient.ts`
- Move: `src/lib/observability/` → `src/shared/lib/observability/`
- Move: `src/server/lib/gemini.ts` → `src/shared/server/lib/gemini.ts`
- Move: `src/server/lib/openrouter.ts` → `src/shared/server/lib/openrouter.ts`
- Merge: `src/lib/const/` + `src/utils/constant.ts` → `src/shared/config/`
- Move: `src/utils/auth.ts` → `src/shared/lib/authUtils.ts`
- Move: `src/utils/date.ts` → `src/shared/lib/date.ts`
- Move: `src/utils/mapbox.ts` → `src/shared/lib/mapbox.ts`
- Move: `src/utils/socialMedia.ts` → `src/shared/lib/socialMedia.ts`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p src/shared/api src/shared/lib/observability src/shared/lib/observability/providers src/shared/config src/shared/server/lib
```

- [ ] **Step 2: Move api client files**

```bash
mv src/lib/apiClient.ts src/shared/api/apiClient.ts
mv src/lib/streamClient.ts src/shared/api/streamClient.ts
```

- [ ] **Step 3: Move lib files**

```bash
mv src/lib/fonts.ts src/shared/lib/fonts.ts
mv src/lib/queryClient.ts src/shared/lib/queryClient.ts
```

- [ ] **Step 4: Move observability folder**

```bash
mv src/lib/observability/* src/shared/lib/observability/
mv src/lib/observability/providers/* src/shared/lib/observability/providers/
```

- [ ] **Step 5: Move server lib**

```bash
mv src/server/lib/gemini.ts src/shared/server/lib/gemini.ts
mv src/server/lib/openrouter.ts src/shared/server/lib/openrouter.ts
```

- [ ] **Step 6: Merge config constants**

Read `src/lib/const/index.ts`, `src/lib/const/categories.ts`, `src/utils/constant.ts`. Create `src/shared/config/constants.ts` that re-exports everything from all three. Move `src/lib/const/validation.ts` → `src/shared/config/validation.ts`.

- [ ] **Step 7: Move util files**

```bash
mv src/utils/auth.ts src/shared/lib/authUtils.ts
mv src/utils/date.ts src/shared/lib/date.ts
mv src/utils/mapbox.ts src/shared/lib/mapbox.ts
mv src/utils/socialMedia.ts src/shared/lib/socialMedia.ts
```

- [ ] **Step 8: Update all imports**

Run a global search-replace for each old path:

| Old                          | New                                              |
| ---------------------------- | ------------------------------------------------ |
| `@/lib/apiClient`            | `@/shared/api/apiClient`                         |
| `@/lib/streamClient`         | `@/shared/api/streamClient`                      |
| `@/lib/fonts`                | `@/shared/lib/fonts`                             |
| `@/lib/queryClient`          | `@/shared/lib/queryClient`                       |
| `@/lib/observability`        | `@/shared/lib/observability`                     |
| `@/server/lib/gemini`        | `@/shared/server/lib/gemini`                     |
| `@/server/lib/openrouter`    | `@/shared/server/lib/openrouter`                 |
| `@/lib/const`                | `@/shared/config/constants`                      |
| `@/utils/constant`           | `@/shared/config/constants`                      |
| `@/lib/const/spotValidation` | `@/features/spots/constants` (handled in Task 5) |
| `@/lib/const/validation`     | `@/shared/config/validation`                     |
| `@/utils/auth`               | `@/shared/lib/authUtils`                         |
| `@/utils/date`               | `@/shared/lib/date`                              |
| `@/utils/mapbox`             | `@/shared/lib/mapbox`                            |
| `@/utils/socialMedia`        | `@/shared/lib/socialMedia`                       |

- [ ] **Step 9: Verify build**

```bash
pnpm build 2>&1 | head -60
```

Expected: no import errors for moved files.

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "refactor: move shared infrastructure to shared/api, shared/lib, shared/config"
```

---

## Task 3: Merge Components into `shared/ui/`

**Files:**

- Source: `src/components/` (all subdirs) + `src/shared/components/Form/` + `src/shared/components/Layout/`
- Destination: `src/shared/ui/`
- Resolve duplicate: `src/components/Form/Input.tsx` vs `src/shared/components/Form/Input.tsx`

- [ ] **Step 1: Create `src/shared/ui/` subdirectory**

```bash
mkdir -p src/shared/ui/form src/shared/ui/layout src/shared/ui/Header src/shared/ui/Sidebar
```

- [ ] **Step 2: Compare the two `Form/Input.tsx` files**

```bash
diff src/components/Form/Input.tsx src/shared/components/Form/Input.tsx
```

Keep the more complete version. If they differ, merge manually into `src/shared/ui/form/Input.tsx`.

- [ ] **Step 3: Move form components**

```bash
cp src/shared/components/Form/Select.tsx src/shared/ui/form/Select.tsx
cp src/shared/components/Form/Textarea.tsx src/shared/ui/form/Textarea.tsx
# Input.tsx handled manually in Step 2
```

- [ ] **Step 4: Move layout**

```bash
cp src/shared/components/Layout/index.tsx src/shared/ui/layout/index.tsx
```

- [ ] **Step 5: Move flat components from `src/components/`**

```bash
cp src/components/ActiveLink/index.tsx src/shared/ui/ActiveLink.tsx
cp src/components/CardUser/index.tsx src/shared/ui/CardUser.tsx
cp src/components/ErrorBoundary/index.tsx src/shared/ui/ErrorBoundary.tsx
cp src/components/Footer/index.tsx src/shared/ui/Footer.tsx
cp src/components/HeaderProfile/index.tsx src/shared/ui/HeaderProfile.tsx
cp src/components/LogoSkateHub/index.tsx src/shared/ui/LogoSkateHub.tsx
cp src/components/Map/MapBox.tsx src/shared/ui/MapBox.tsx
cp src/components/Pagination/index.tsx src/shared/ui/Pagination.tsx
cp src/components/ReusableModal/index.tsx src/shared/ui/ReusableModal.tsx
cp src/components/TitleSection/index.tsx src/shared/ui/TitleSection.tsx
cp src/components/Toast/index.tsx src/shared/ui/Toast.tsx
```

- [ ] **Step 6: Move Header and Sidebar (multi-file)**

```bash
cp src/components/Header/index.tsx src/shared/ui/Header/index.tsx
cp src/components/Header/Notification.tsx src/shared/ui/Header/Notification.tsx
cp src/components/Header/Profile.tsx src/shared/ui/Header/Profile.tsx
cp src/components/Header/Search.tsx src/shared/ui/Header/Search.tsx
cp src/components/Sidebar/index.tsx src/shared/ui/Sidebar/index.tsx
cp src/components/Sidebar/NavLink.tsx src/shared/ui/Sidebar/NavLink.tsx
cp src/components/Sidebar/NavSection.tsx src/shared/ui/Sidebar/NavSection.tsx
cp src/components/Sidebar/SidebarNav.tsx src/shared/ui/Sidebar/SidebarNav.tsx
```

- [ ] **Step 7: Move `QueryProvider` to `app/providers.tsx` area**

`src/components/QueryProvider/index.tsx` is a provider, not a UI component. Read it and inline its content into `src/app/providers.tsx` if not already there, or move it to `src/app/QueryProvider.tsx`.

- [ ] **Step 8: Update all imports**

| Old                                 | New                                                            |
| ----------------------------------- | -------------------------------------------------------------- |
| `@/components/ActiveLink`           | `@/shared/ui/ActiveLink`                                       |
| `@/components/CardUser`             | `@/shared/ui/CardUser`                                         |
| `@/components/ErrorBoundary`        | `@/shared/ui/ErrorBoundary`                                    |
| `@/components/Footer`               | `@/shared/ui/Footer`                                           |
| `@/components/Header`               | `@/shared/ui/Header`                                           |
| `@/components/HeaderProfile`        | `@/shared/ui/HeaderProfile`                                    |
| `@/components/LogoSkateHub`         | `@/shared/ui/LogoSkateHub`                                     |
| `@/components/Map/MapBox`           | `@/shared/ui/MapBox`                                           |
| `@/components/Pagination`           | `@/shared/ui/Pagination`                                       |
| `@/components/QueryProvider`        | `@/app/QueryProvider` (or inline)                              |
| `@/components/ReusableModal`        | `@/shared/ui/ReusableModal`                                    |
| `@/components/Sidebar`              | `@/shared/ui/Sidebar`                                          |
| `@/components/StoriesSwiper`        | `@/features/stories/components/StoriesSwiper` (move in Task 6) |
| `@/components/TitleSection`         | `@/shared/ui/TitleSection`                                     |
| `@/components/Toast`                | `@/shared/ui/Toast`                                            |
| `@/components/Form/Input`           | `@/shared/ui/form/Input`                                       |
| `@/shared/components/Form/Input`    | `@/shared/ui/form/Input`                                       |
| `@/shared/components/Form/Select`   | `@/shared/ui/form/Select`                                      |
| `@/shared/components/Form/Textarea` | `@/shared/ui/form/Textarea`                                    |
| `@/shared/components/Layout`        | `@/shared/ui/layout`                                           |

> Note: `StoriesSwiper` is in `src/components/` but is domain-specific (stories). It will be moved to `features/stories/components/` in Task 6.

- [ ] **Step 9: Verify build**

```bash
pnpm build 2>&1 | head -60
```

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "refactor: merge components into shared/ui"
```

---

## Task 4: Move Shared Hooks

**Files:**

- Move: `src/hooks/useColors.ts` → `src/shared/hooks/useColors.ts`
- Move: `src/hooks/usePagination.ts` → `src/shared/hooks/usePagination.ts`

These two are used across multiple features and carry no domain logic.

- [ ] **Step 1: Create directory and move files**

```bash
mkdir -p src/shared/hooks
mv src/hooks/useColors.ts src/shared/hooks/useColors.ts
mv src/hooks/usePagination.ts src/shared/hooks/usePagination.ts
```

- [ ] **Step 2: Update imports**

| Old                     | New                            |
| ----------------------- | ------------------------------ |
| `@/hooks/useColors`     | `@/shared/hooks/useColors`     |
| `@/hooks/usePagination` | `@/shared/hooks/usePagination` |

- [ ] **Step 3: Verify build**

```bash
pnpm build 2>&1 | head -60
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor: move shared hooks (useColors, usePagination) to shared/hooks"
```

---

## Task 5: Co-locate Spots Feature (hooks, services, types, utils, constants)

**Files:**

- Create: `src/features/spots/hooks/` (6 hooks)
- Create: `src/features/spots/services/` (5 services)
- Create: `src/features/spots/utils/isSupported.ts`
- Create: `src/features/spots/types.ts`
- Create: `src/features/spots/constants.ts`
- Create: `src/features/spots/index.ts`

- [ ] **Step 1: Create subdirectories**

```bash
mkdir -p src/features/spots/hooks src/features/spots/services src/features/spots/utils
```

- [ ] **Step 2: Move hooks**

```bash
mv src/hooks/useAIWriter.ts src/features/spots/hooks/useAIWriter.ts
mv src/hooks/useCreateSpot.ts src/features/spots/hooks/useCreateSpot.ts
mv src/hooks/useDeleteSpot.ts src/features/spots/hooks/useDeleteSpot.ts
mv src/hooks/useSpot.ts src/features/spots/hooks/useSpot.ts
mv src/hooks/useSpots.ts src/features/spots/hooks/useSpots.ts
mv src/hooks/useUpdateSpot.ts src/features/spots/hooks/useUpdateSpot.ts
```

- [ ] **Step 3: Move services**

```bash
mv src/services/createSpot.ts src/features/spots/services/createSpot.ts
mv src/services/deleteSpot.ts src/features/spots/services/deleteSpot.ts
mv src/services/getSpotById.ts src/features/spots/services/getSpotById.ts
mv src/services/getSpots.ts src/features/spots/services/getSpots.ts
mv src/services/updateSpot.ts src/features/spots/services/updateSpot.ts
```

- [ ] **Step 4: Move types**

```bash
mv src/types/spots.ts src/features/spots/types.ts
```

- [ ] **Step 5: Move AI writer utils**

```bash
mv src/utils/ai/isSupported.ts src/features/spots/utils/isSupported.ts
```

- [ ] **Step 6: Create spots constants**

Read `src/lib/const/spotValidation.ts` and create `src/features/spots/constants.ts` with its content. This file stays in spots — it is spot-specific.

- [ ] **Step 7: Move `ImproveTextButton` into spots components**

```bash
mv src/shared/components/ImproveTextButton.tsx src/features/spots/components/ImproveTextButton.tsx
```

Update the import inside `src/features/spots/SpotForm/index.tsx` (or its new location after Task 6).

- [ ] **Step 8: Create `src/features/spots/index.ts` barrel**

```typescript
// src/features/spots/index.ts
export { default as SpotCard } from "./SpotCard/index";
export { default as SpotDetail } from "./SpotDetail/index";
export { default as SpotForm } from "./SpotForm/index";
```

Adjust paths after Task 6 flattens the subdirectories if needed.

- [ ] **Step 9: Update all imports**

| Old                                     | New                                             |
| --------------------------------------- | ----------------------------------------------- |
| `@/hooks/useAIWriter`                   | `@/features/spots/hooks/useAIWriter`            |
| `@/hooks/useCreateSpot`                 | `@/features/spots/hooks/useCreateSpot`          |
| `@/hooks/useDeleteSpot`                 | `@/features/spots/hooks/useDeleteSpot`          |
| `@/hooks/useSpot`                       | `@/features/spots/hooks/useSpot`                |
| `@/hooks/useSpots`                      | `@/features/spots/hooks/useSpots`               |
| `@/hooks/useUpdateSpot`                 | `@/features/spots/hooks/useUpdateSpot`          |
| `@/services/createSpot`                 | `@/features/spots/services/createSpot`          |
| `@/services/deleteSpot`                 | `@/features/spots/services/deleteSpot`          |
| `@/services/getSpotById`                | `@/features/spots/services/getSpotById`         |
| `@/services/getSpots`                   | `@/features/spots/services/getSpots`            |
| `@/services/updateSpot`                 | `@/features/spots/services/updateSpot`          |
| `@/types/spots`                         | `@/features/spots/types`                        |
| `@/utils/ai/isSupported`                | `@/features/spots/utils/isSupported`            |
| `@/lib/const/spotValidation`            | `@/features/spots/constants`                    |
| `@/shared/components/ImproveTextButton` | `@/features/spots/components/ImproveTextButton` |

- [ ] **Step 10: Verify build**

```bash
pnpm build 2>&1 | head -60
```

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "refactor: co-locate spots hooks, services, types, utils into features/spots"
```

---

## Task 6: Co-locate Auth Feature

**Files:**

- Move: `src/hooks/useAuth.ts` → `src/features/auth/hooks/useAuth.ts`
- Move: `src/services/auth.ts` → `src/features/auth/services/auth.ts`
- Move: `src/features/login/modal/login.tsx` → `src/features/auth/components/LoginModal.tsx`
- Move: `src/features/user/signInFormSchema.ts` → `src/features/auth/schemas.ts`
- Move: `src/contexts/AuthContext.tsx` → `src/features/auth/context/AuthContext.tsx`
- Move: `src/contexts/SidebarDrawerContext.tsx` → `src/app/SidebarDrawerContext.tsx`
- Create: `src/features/auth/index.ts`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p src/features/auth/hooks src/features/auth/services src/features/auth/components src/features/auth/context
```

- [ ] **Step 2: Move files**

```bash
mv src/hooks/useAuth.ts src/features/auth/hooks/useAuth.ts
mv src/services/auth.ts src/features/auth/services/auth.ts
mv src/features/login/modal/login.tsx src/features/auth/components/LoginModal.tsx
mv src/features/user/signInFormSchema.ts src/features/auth/schemas.ts
mv src/contexts/AuthContext.tsx src/features/auth/context/AuthContext.tsx
mv src/contexts/SidebarDrawerContext.tsx src/app/SidebarDrawerContext.tsx
```

- [ ] **Step 3: Create barrel**

```typescript
// src/features/auth/index.ts
export { AuthContext, AuthProvider } from "./context/AuthContext";
export { useAuth } from "./hooks/useAuth";
export { default as LoginModal } from "./components/LoginModal";
export * from "./schemas";
```

Adjust named exports to match actual exports in each file.

- [ ] **Step 4: Update all imports**

| Old                                | New                                   |
| ---------------------------------- | ------------------------------------- |
| `@/hooks/useAuth`                  | `@/features/auth/hooks/useAuth`       |
| `@/services/auth`                  | `@/features/auth/services/auth`       |
| `@/contexts/AuthContext`           | `@/features/auth/context/AuthContext` |
| `@/contexts/SidebarDrawerContext`  | `@/app/SidebarDrawerContext`          |
| `@/features/user/signInFormSchema` | `@/features/auth/schemas`             |

- [ ] **Step 5: Verify build**

```bash
pnpm build 2>&1 | head -60
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "refactor: co-locate auth feature (hooks, services, context, schemas)"
```

---

## Task 7: Co-locate User Feature

**Files:**

- Move: `src/hooks/useAvatarUpload.ts` → `src/features/user/hooks/useAvatarUpload.ts`
- Move: `src/hooks/useUser.ts` → `src/features/user/hooks/useUser.ts`
- Move: `src/hooks/useUsers.ts` → `src/features/user/hooks/useUsers.ts`
- Move: `src/services/getUser.ts` → `src/features/user/services/getUser.ts`
- Move: `src/services/getUsers.ts` → `src/features/user/services/getUsers.ts`
- Move: `src/services/getUsersCount.ts` → `src/features/user/services/getUsersCount.ts`
- Move: `src/services/linkAvatar.ts` → `src/features/user/services/linkAvatar.ts`
- Move: `src/services/signUpRequest.ts` → `src/features/user/services/signUpRequest.ts`
- Move: `src/services/uploadAvatar.ts` → `src/features/user/services/uploadAvatar.ts`
- Merge: `src/types/User.type.ts` + `src/types/UserBasicsWithPagination.type.ts` + `src/types/usersBasics.type.ts` → `src/features/user/types.ts`
- Create: `src/features/user/index.ts`

- [ ] **Step 1: Create directories**

```bash
mkdir -p src/features/user/hooks src/features/user/services
```

- [ ] **Step 2: Move hooks**

```bash
mv src/hooks/useAvatarUpload.ts src/features/user/hooks/useAvatarUpload.ts
mv src/hooks/useUser.ts src/features/user/hooks/useUser.ts
mv src/hooks/useUsers.ts src/features/user/hooks/useUsers.ts
```

- [ ] **Step 3: Move services**

```bash
mv src/services/getUser.ts src/features/user/services/getUser.ts
mv src/services/getUsers.ts src/features/user/services/getUsers.ts
mv src/services/getUsersCount.ts src/features/user/services/getUsersCount.ts
mv src/services/linkAvatar.ts src/features/user/services/linkAvatar.ts
mv src/services/signUpRequest.ts src/features/user/services/signUpRequest.ts
mv src/services/uploadAvatar.ts src/features/user/services/uploadAvatar.ts
```

- [ ] **Step 4: Merge type files**

Create `src/features/user/types.ts` by concatenating and de-duplicating the content of:

- `src/types/User.type.ts`
- `src/types/UserBasicsWithPagination.type.ts`
- `src/types/usersBasics.type.ts`

Then delete the originals.

- [ ] **Step 5: Create barrel**

```typescript
// src/features/user/index.ts
export * from "./types";
export { default as UserEdit } from "./edit/index";
export { default as UserProfile } from "./profile/index";
```

- [ ] **Step 6: Update all imports**

| Old                                     | New                                      |
| --------------------------------------- | ---------------------------------------- |
| `@/hooks/useAvatarUpload`               | `@/features/user/hooks/useAvatarUpload`  |
| `@/hooks/useUser`                       | `@/features/user/hooks/useUser`          |
| `@/hooks/useUsers`                      | `@/features/user/hooks/useUsers`         |
| `@/services/getUser`                    | `@/features/user/services/getUser`       |
| `@/services/getUsers`                   | `@/features/user/services/getUsers`      |
| `@/services/getUsersCount`              | `@/features/user/services/getUsersCount` |
| `@/services/linkAvatar`                 | `@/features/user/services/linkAvatar`    |
| `@/services/signUpRequest`              | `@/features/user/services/signUpRequest` |
| `@/services/uploadAvatar`               | `@/features/user/services/uploadAvatar`  |
| `@/types/User.type`                     | `@/features/user/types`                  |
| `@/types/UserBasicsWithPagination.type` | `@/features/user/types`                  |
| `@/types/usersBasics.type`              | `@/features/user/types`                  |

- [ ] **Step 7: Verify build**

```bash
pnpm build 2>&1 | head -60
```

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "refactor: co-locate user feature (hooks, services, types)"
```

---

## Task 8: Co-locate Stories Feature

**Files:**

- Move: `src/hooks/useStories.ts` → `src/features/stories/hooks/useStories.ts`
- Move: `src/hooks/useStoriesByUserId.ts` → `src/features/stories/hooks/useStoriesByUserId.ts`
- Move: `src/services/getStories.ts` → `src/features/stories/services/getStories.ts`
- Move: `src/types/stories.ts` → `src/features/stories/types.ts`
- Move: `src/components/StoriesSwiper/index.tsx` → `src/features/stories/components/StoriesSwiper.tsx`
- Create: `src/features/stories/index.ts`

- [ ] **Step 1: Create directories**

```bash
mkdir -p src/features/stories/hooks src/features/stories/services src/features/stories/components
```

- [ ] **Step 2: Move files**

```bash
mv src/hooks/useStories.ts src/features/stories/hooks/useStories.ts
mv src/hooks/useStoriesByUserId.ts src/features/stories/hooks/useStoriesByUserId.ts
mv src/services/getStories.ts src/features/stories/services/getStories.ts
mv src/types/stories.ts src/features/stories/types.ts
mv src/components/StoriesSwiper/index.tsx src/features/stories/components/StoriesSwiper.tsx
```

- [ ] **Step 3: Create barrel**

```typescript
// src/features/stories/index.ts
export { default as StoriesSwiper } from "./components/StoriesSwiper";
export { default as StoriesHome } from "./home/index";
export { default as StoriesModal } from "./modal/index";
```

- [ ] **Step 4: Update all imports**

| Old                          | New                                           |
| ---------------------------- | --------------------------------------------- |
| `@/hooks/useStories`         | `@/features/stories/hooks/useStories`         |
| `@/hooks/useStoriesByUserId` | `@/features/stories/hooks/useStoriesByUserId` |
| `@/services/getStories`      | `@/features/stories/services/getStories`      |
| `@/types/stories`            | `@/features/stories/types`                    |
| `@/components/StoriesSwiper` | `@/features/stories/components/StoriesSwiper` |

- [ ] **Step 5: Verify build**

```bash
pnpm build 2>&1 | head -60
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "refactor: co-locate stories feature (hooks, services, types, StoriesSwiper)"
```

---

## Task 9: Co-locate AI Feature

**Files:**

- Move: `src/hooks/useAIChat.ts` → `src/features/ai/hooks/useAIChat.ts`
- Move: `src/types/ai.ts` → `src/features/ai/types.ts`
- Create: `src/features/ai/index.ts`

- [ ] **Step 1: Create directory**

```bash
mkdir -p src/features/ai/hooks
```

- [ ] **Step 2: Move files**

```bash
mv src/hooks/useAIChat.ts src/features/ai/hooks/useAIChat.ts
mv src/types/ai.ts src/features/ai/types.ts
```

- [ ] **Step 3: Create barrel**

```typescript
// src/features/ai/index.ts
export { default as Chat } from "./Chat/index";
export { default as Message } from "./Message/index";
```

- [ ] **Step 4: Update imports**

| Old                 | New                             |
| ------------------- | ------------------------------- |
| `@/hooks/useAIChat` | `@/features/ai/hooks/useAIChat` |
| `@/types/ai`        | `@/features/ai/types`           |

- [ ] **Step 5: Verify build**

```bash
pnpm build 2>&1 | head -60
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "refactor: co-locate ai feature hooks and types"
```

---

## Task 10: Clean Up Empty Directories and Verify Final State

- [ ] **Step 1: Remove now-empty directories**

```bash
rmdir src/hooks 2>/dev/null || echo "hooks not empty — check remaining files"
rmdir src/services 2>/dev/null || echo "services not empty — check remaining files"
rmdir src/types 2>/dev/null || echo "types not empty — check remaining files"
rmdir src/utils/ai 2>/dev/null
rmdir src/utils 2>/dev/null || echo "utils not empty — check remaining files"
rmdir src/lib/const 2>/dev/null
rmdir src/lib/observability/providers 2>/dev/null
rmdir src/lib/observability 2>/dev/null
rmdir src/lib 2>/dev/null || echo "lib not empty — check remaining files"
rmdir src/contexts 2>/dev/null
rmdir src/server/lib 2>/dev/null
rmdir src/server 2>/dev/null
rmdir src/styles 2>/dev/null
rmdir src/components/AvatarEditProfile 2>/dev/null  # was already empty
rmdir src/components/StoriesSwiper 2>/dev/null
rmdir src/components 2>/dev/null || echo "components not empty — check remaining files"
rmdir src/shared/components/Form 2>/dev/null
rmdir src/shared/components/Layout 2>/dev/null
rmdir src/shared/components 2>/dev/null
rm -rf src/features/login  # folder now empty after auth migration
```

- [ ] **Step 2: Confirm no orphaned imports**

```bash
pnpm build 2>&1 | grep -E "error|Cannot find|Module not found"
```

Expected: no errors.

- [ ] **Step 3: Confirm no cross-feature imports**

```bash
# Check that no feature imports from a sibling feature
grep -r "from \"@/features/" src/features/ | grep -v "from \"@/features/$(dirname $0)" | head -20
```

Manual review: any result here is a cross-feature import violation and needs to be resolved by promoting the shared piece to `shared/`.

- [ ] **Step 4: Final build**

```bash
pnpm build
```

Expected: clean build, no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "refactor: remove empty directories after VSA migration"
```

---

## Task 11: Update Documentation

**Files:**

- Modify: `docs/TECHNICAL_ANALYSIS.md` — add Section 14 on VSA architecture decision
- Modify: `AGENTS.md` — update architecture conventions to reflect new paths

- [ ] **Step 1: Add Section 14 to `docs/TECHNICAL_ANALYSIS.md`**

Append at end of file:

```markdown
## 14. Architecture Migration — Vertical Slice Architecture (May 2026)

### Decision

Migrated from a layered architecture (`components/`, `hooks/`, `services/`, `types/`) to
**Vertical Slice Architecture (VSA)**.

### Rationale

FSD (Feature-Sliced Design) was evaluated but rejected as overly complex for this project's
scale (single developer, ~7 feature domains). VSA provides the same feature cohesion guarantees
with far less ceremony: 3 layers instead of 7, no mandatory taxonomy, no linter enforcement needed.

### Rule

> A file belongs in `features/<domain>/` if only one feature uses it.
> A file belongs in `shared/` when two or more features use it.
> Features must never import from sibling features.

### New Structure

| Old Path                      | New Path                                |
| ----------------------------- | --------------------------------------- |
| `src/components/`             | `src/shared/ui/`                        |
| `src/hooks/use<Domain>*`      | `src/features/<domain>/hooks/`          |
| `src/services/<verb><Entity>` | `src/features/<domain>/services/`       |
| `src/types/<domain>.ts`       | `src/features/<domain>/types.ts`        |
| `src/lib/apiClient`           | `src/shared/api/apiClient`              |
| `src/lib/queryClient`         | `src/shared/lib/queryClient`            |
| `src/lib/observability/`      | `src/shared/lib/observability/`         |
| `src/utils/`                  | `src/shared/lib/`                       |
| `src/server/lib/`             | `src/shared/server/lib/`                |
| `src/contexts/AuthContext`    | `src/features/auth/context/AuthContext` |
| `src/styles/`                 | `src/shared/lib/`                       |
```

- [ ] **Step 2: Update `AGENTS.md` architecture conventions section**

Update the "Architecture Conventions" bullet list to replace old paths with new VSA paths. Key changes:

- `src/components/` → `src/shared/ui/`
- `src/hooks/use<Entity>.ts` → `src/features/<domain>/hooks/use<Entity>.ts`
- `src/services/<verb><Entity>.ts` → `src/features/<domain>/services/<verb><Entity>.ts`
- `src/types/<feature>.ts` → `src/features/<domain>/types.ts`
- `src/lib/apiClient.ts` → `src/shared/api/apiClient.ts`

- [ ] **Step 3: Commit docs**

```bash
git add docs/TECHNICAL_ANALYSIS.md AGENTS.md
git commit -m "docs: document VSA migration decision and update architecture conventions"
```

---

## Self-Review Checklist

- [x] All 14 hooks accounted for: `useAIChat`, `useAIWriter`, `useAuth`, `useAvatarUpload`, `useColors`, `useCreateSpot`, `useDeleteSpot`, `usePagination`, `useSpot`, `useSpots`, `useStories`, `useStoriesByUserId`, `useUpdateSpot`, `useUser`, `useUsers` — mapped to correct feature or shared
- [x] All 13 services accounted for and mapped to correct feature
- [x] All 6 type files mapped
- [x] Theme duplication resolved
- [x] `ImproveTextButton` + `useAIWriter` + `isSupported` co-located into `features/spots/`
- [x] `StoriesSwiper` moved from `components/` to `features/stories/components/`
- [x] `QueryProvider` disposition addressed (inline into app or move to `src/app/`)
- [x] `signInFormSchema.ts` moved from `features/user/` to `features/auth/`
- [x] No cross-feature import rule documented
- [x] AGENTS.md update included
- [x] Every task ends with `pnpm build` verification
- [x] Every task ends with a commit
