# Implementation Checklist: New UI Layout & Skatistas Pagination

**Status:** Complete — all tasks implemented on `feature/new-ui-layout`; see the SDD ledger (`.superpowers/sdd/2026-10-09-new-ui-layout-pagination/progress.md`) for per-task rulings and deltas  
**Plan:** `superpowers/plans/2026-10-09-new-ui-layout-pagination.md`  
**Spec:** `../specs/new-ui-layout.md`  
**Branch:** `feature/new-ui-layout` (create from `develop`)

---

## Pre-Implementation

- [x] Confirm on `feature/new-ui-layout` branch
- [x] Latest code pulled from `develop`
- [x] No uncommitted changes in working directory
- [x] `pnpm install` run (lock file up to date)

---

## Task 1: Replace App Shell

**Goal:** Single new layout (no more duplicate rendering)

- [x] Step 1: Rewrite `LayoutWrapper.tsx`
- [x] Step 2: Remove old Layout export and delete old files
- [x] Step 3: Verify no dangling references (`rg` commands pass)
- [x] Step 4: Type-check and lint (`pnpm exec tsc --noEmit && pnpm lint`)
- [x] Step 5: Manual check (run `pnpm dev`, verify single shell, `/ai` shows no footer)
- [x] Step 6: Commit
  ```bash
  git commit -m "refactor(layout): replace dual old+new layout with single new shell"
  ```

---

## Task 2: Repurpose Preview Route

**Goal:** `/new` page points to live skatistas feature

- [x] Step 1: Update `/new` page to render `SkatistasHome`
- [x] Step 2: Type-check
- [x] Step 3: Commit
  ```bash
  git commit -m "chore(preview): point /new at the live skatistas feature"
  ```

---

## Task 3: Working Pagination (Vitest + Helper)

**Goal:** Unit-tested page-number windowing + controlled Pagination component

- [x] Step 1: Add Vitest to `package.json` and create `vitest.config.ts`
- [x] Step 2: Write failing test in `src/shared/hooks/__tests__/getPageNumbers.test.ts`
- [x] Step 3: Run test and confirm FAIL
- [x] Step 4: Implement `src/shared/hooks/usePagination.ts` (revives the empty VSA-migration stub; export `getPageNumbers` from `src/shared/hooks/index.ts`)
- [x] Step 5: Run test and confirm all PASS
- [x] Step 6: Rewrite `Pagination` component with `onPageChange`, `isLoading`, disabled states
- [x] Step 7: Type-check (`pnpm exec tsc --noEmit`)
- [x] Step 8: Commit
  ```bash
  git commit -m "feat(pagination): controlled pagination with page-number windowing and unit tests"
  ```

---

## Task 4: Controlled `SkatersHeader`

**Goal:** Real total + page-size select with `onPageSizeChange` callback

- [x] Step 1: Rewrite `SkatersHeader` with props (`totalUsers`, `pageSize`, `onPageSizeChange`, `isLoading`)
- [x] Step 2: Type-check
- [x] Step 3: Commit
  ```bash
  git commit -m "feat(skaters): controlled page-size select and real total in header"
  ```

---

## Task 5: `SkaterGrid` + Cleaned `SkaterCard`

**Goal:** Presentational grid + social helpers + remove console/auth leaks

- [x] Step 1: Create `src/shared/lib/socialMedia.ts` (social link helpers)
- [x] Step 2: Rewrite `SkaterGrid` (prop-driven, no mock data)
- [x] Step 3: Clean `SkaterCard` (remove `console.log`, `AuthContext`, add social link helpers)
- [x] Step 4: Type-check and lint
- [x] Step 5: Commit
  ```bash
  git commit -m "feat(skaters): presentational grid, social helpers, and console/auth cleanup in skater card"
  ```

---

## Task 6: Wire Skatistas Feature

**Goal:** Compose `SkatersHeader` + `SkaterGrid` + `Pagination` over real data

- [x] Step 1: Rewrite `src/features/skatistas/index.tsx`
  - Remove inline pagination logic
  - Remove duplicate header
  - Use new composed components
- [x] Step 2: Type-check and lint
- [x] Step 3: Manual check
  - Run `pnpm dev`
  - Open `/skatistas`
  - Verify: header shows real total, grid shows real users, pagination works, changing page size resets to page 1
- [x] Step 4: Commit
  ```bash
  git commit -m "feat(skatistas): compose new header, grid, and pagination over the user query"
  ```

---

## Task 7: Modernize Users Data Layer

**Goal:** Migrate to `apiClient`, drop parallel count call, read total from pagination meta

- [x] Step 1: Migrate `getUsers.ts` and `getUsersCount.ts` to `apiClient`
  - Replace `import axios` with `import { apiClient }`
  - Verify base URL is the same (both use `process.env.NEXT_PUBLIC_STRAPI_URL`)
  - Convert `axios.get(\`${API}/...\`)`to`apiClient.get("/api/...")`
  - Note: Leave `getUsers2` unchanged (legacy, out of scope)
- [x] Step 2: Rewrite `useUsers.ts`
  - Drop parallel `getUsersCount` call
  - Add defaults: `const page = currentPage ?? 1; const size = pageSize ?? 10;`
  - Read total from `users.meta.pagination.total`
- [x] Step 3: Verify no bare `axios` in user services (`rg "import axios" src/features/user/services`)
- [x] Step 4: Type-check
- [x] Step 5: Manual check
  - Run `pnpm dev`
  - Open `/skatistas`
  - Verify: loads, total matches, network shows single `/api/custom-users` request per page (no parallel count)
- [x] Step 6: Commit
  ```bash
  git commit -m "refactor(users): apiClient migration and derive total from pagination meta"
  ```

---

## Task 8: RSC Boundary Hardening

**Goal:** Mark all hook/Chakra components as `"use client"`, remove `any` casts

- [x] Mark these files with `"use client"` as first line:
  - [x] `src/shared/ui/CardUser.tsx`
  - [x] `src/shared/ui/LogoSkateHub.tsx`
  - [x] `src/shared/ui/TitleSection.tsx`
  - [x] `src/shared/ui/Toast.tsx`
  - [x] `src/shared/ui/ErrorBoundary.tsx`
  - [x] `src/shared/ui/ReusableModal.tsx`
  - [x] `src/shared/ui/form/Input.tsx`
  - [x] `src/shared/ui/form/Select.tsx`
  - [x] `src/shared/ui/form/Textarea.tsx`
- [x] Remove `as any` cast in `src/shared/ui/New/IconLabel/index.tsx`
- [x] Delete the empty dead file `src/shared/ui/Pagination.tsx`
- [x] Type-check, lint, and build: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
- [x] Commit
  ```bash
  git commit -m "fix(rsc): mark hook-rendering shared components as client; drop any cast"
  ```

---

## Task 9: Documentation

**Goal:** Update README, CHANGELOG, mark spec criteria done

- [x] Update `README.md` Features section
  - Add: "Redesigned app shell (header, sidebar, footer) built on a new theme, with a paginated skatistas directory"
- [x] Update `CHANGELOG.md` under `## [Unreleased]`
  - Add: `- 2026-10-09 - Adopt the new app shell (header, sidebar, footer) as the single layout and wire the skatistas directory to real data with working pagination _(v2.1.0)_`
- [x] Mark all acceptance criteria in `specs/new-ui-layout.md` with `[x]` where complete
- [x] Commit
  ```bash
  git commit -m "docs: update README and CHANGELOG for the new UI layout"
  ```

---

## Final Verification

- [x] `pnpm test` — all tests pass (pagination helper)
- [x] `pnpm exec tsc --noEmit` — no TypeScript errors
- [x] `pnpm lint` — no linting errors
- [x] `pnpm build` — build succeeds
- [x] Manual checks pass:
  - [x] Every route renders the new shell exactly once
  - [x] `/skatistas` shows real data with working pagination
  - [x] `/new` shows the live skatistas feature
  - [x] Changing page size resets to page 1
  - [x] Pagination disabled at bounds and while loading
  - [x] No `console.log` in production code
  - [x] No bare `axios` calls
  - [x] `/ai` hides the footer

---

## Push & PR

- [x] Run: `git log --oneline` — verify all 9 commits are present and sequenced correctly
- [x] Run: `git diff develop..HEAD --stat` — review all changed files
- [x] Push: `git push origin feature/new-ui-layout`
- [x] Open PR from `feature/new-ui-layout` → `develop`
- [x] Verify CI/CD passes on PR
- [x] Request code review
- [x] After approval: merge PR

---

## Notes

- **Start with Task 1** — if the shell render works, the rest is straightforward.
- **Test after each task** — run type-check and lint before committing.
- **Manual checks are important** — especially Tasks 1, 5, 6, 7 (verify in browser).
- **No console.log, no bare axios, no `any`** — catch these during type-check/lint steps.
- **Documentation is part of "done"** — Task 9 is required before PR.

---

Generated: 2026-10-09  
Plan: `superpowers/plans/2026-10-09-new-ui-layout-pagination.md`  
Review: `PLAN_REVIEW_FIXES_2026-10-09.md`
