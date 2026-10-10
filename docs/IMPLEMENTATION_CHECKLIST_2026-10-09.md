# Implementation Checklist: New UI Layout & Skatistas Pagination

**Status:** Ready to start  
**Plan:** `superpowers/plans/2026-10-09-new-ui-layout-pagination.md`  
**Spec:** `../specs/new-ui-layout.md`  
**Branch:** `feature/new-ui-layout` (create from `develop`)

---

## Pre-Implementation

- [ ] Confirm on `feature/new-ui-layout` branch
- [ ] Latest code pulled from `develop`
- [ ] No uncommitted changes in working directory
- [ ] `pnpm install` run (lock file up to date)

---

## Task 1: Replace App Shell

**Goal:** Single new layout (no more duplicate rendering)

- [ ] Step 1: Rewrite `LayoutWrapper.tsx`
- [ ] Step 2: Remove old Layout export and delete old files
- [ ] Step 3: Verify no dangling references (`rg` commands pass)
- [ ] Step 4: Type-check and lint (`pnpm exec tsc --noEmit && pnpm lint`)
- [ ] Step 5: Manual check (run `pnpm dev`, verify single shell, `/ai` shows no footer)
- [ ] Step 6: Commit
  ```bash
  git commit -m "refactor(layout): replace dual old+new layout with single new shell"
  ```

---

## Task 2: Repurpose Preview Route

**Goal:** `/new` page points to live skatistas feature

- [ ] Step 1: Update `/new` page to render `SkatistasHome`
- [ ] Step 2: Type-check
- [ ] Step 3: Commit
  ```bash
  git commit -m "chore(preview): point /new at the live skatistas feature"
  ```

---

## Task 3: Working Pagination (Vitest + Helper)

**Goal:** Unit-tested page-number windowing + controlled Pagination component

- [ ] Step 1: Add Vitest to `package.json` and create `vitest.config.ts`
- [ ] Step 2: Write failing test in `src/shared/hooks/__tests__/getPageNumbers.test.ts`
- [ ] Step 3: Run test and confirm FAIL
- [ ] Step 4: Implement `src/shared/hooks/usePagination.ts` (revives the empty VSA-migration stub; export `getPageNumbers` from `src/shared/hooks/index.ts`)
- [ ] Step 5: Run test and confirm all PASS
- [ ] Step 6: Rewrite `Pagination` component with `onPageChange`, `isLoading`, disabled states
- [ ] Step 7: Type-check (`pnpm exec tsc --noEmit`)
- [ ] Step 8: Commit
  ```bash
  git commit -m "feat(pagination): controlled pagination with page-number windowing and unit tests"
  ```

---

## Task 4: Controlled `SkatersHeader`

**Goal:** Real total + page-size select with `onPageSizeChange` callback

- [ ] Step 1: Rewrite `SkatersHeader` with props (`totalUsers`, `pageSize`, `onPageSizeChange`, `isLoading`)
- [ ] Step 2: Type-check
- [ ] Step 3: Commit
  ```bash
  git commit -m "feat(skaters): controlled page-size select and real total in header"
  ```

---

## Task 5: `SkaterGrid` + Cleaned `SkaterCard`

**Goal:** Presentational grid + social helpers + remove console/auth leaks

- [ ] Step 1: Create `src/shared/lib/socialMedia.ts` (social link helpers)
- [ ] Step 2: Rewrite `SkaterGrid` (prop-driven, no mock data)
- [ ] Step 3: Clean `SkaterCard` (remove `console.log`, `AuthContext`, add social link helpers)
- [ ] Step 4: Type-check and lint
- [ ] Step 5: Commit
  ```bash
  git commit -m "feat(skaters): presentational grid, social helpers, and console/auth cleanup in skater card"
  ```

---

## Task 6: Wire Skatistas Feature

**Goal:** Compose `SkatersHeader` + `SkaterGrid` + `Pagination` over real data

- [ ] Step 1: Rewrite `src/features/skatistas/index.tsx`
  - Remove inline pagination logic
  - Remove duplicate header
  - Use new composed components
- [ ] Step 2: Type-check and lint
- [ ] Step 3: Manual check
  - Run `pnpm dev`
  - Open `/skatistas`
  - Verify: header shows real total, grid shows real users, pagination works, changing page size resets to page 1
- [ ] Step 4: Commit
  ```bash
  git commit -m "feat(skatistas): compose new header, grid, and pagination over the user query"
  ```

---

## Task 7: Modernize Users Data Layer

**Goal:** Migrate to `apiClient`, drop parallel count call, read total from pagination meta

- [ ] Step 1: Migrate `getUsers.ts` and `getUsersCount.ts` to `apiClient`
  - Replace `import axios` with `import { apiClient }`
  - Verify base URL is the same (both use `process.env.NEXT_PUBLIC_STRAPI_URL`)
  - Convert `axios.get(\`${API}/...\`)`to`apiClient.get("/api/...")`
  - Note: Leave `getUsers2` unchanged (legacy, out of scope)
- [ ] Step 2: Rewrite `useUsers.ts`
  - Drop parallel `getUsersCount` call
  - Add defaults: `const page = currentPage ?? 1; const size = pageSize ?? 10;`
  - Read total from `users.meta.pagination.total`
- [ ] Step 3: Verify no bare `axios` in user services (`rg "import axios" src/features/user/services`)
- [ ] Step 4: Type-check
- [ ] Step 5: Manual check
  - Run `pnpm dev`
  - Open `/skatistas`
  - Verify: loads, total matches, network shows single `/api/custom-users` request per page (no parallel count)
- [ ] Step 6: Commit
  ```bash
  git commit -m "refactor(users): apiClient migration and derive total from pagination meta"
  ```

---

## Task 8: RSC Boundary Hardening

**Goal:** Mark all hook/Chakra components as `"use client"`, remove `any` casts

- [ ] Mark these files with `"use client"` as first line:
  - [ ] `src/shared/ui/CardUser.tsx`
  - [ ] `src/shared/ui/LogoSkateHub.tsx`
  - [ ] `src/shared/ui/TitleSection.tsx`
  - [ ] `src/shared/ui/Toast.tsx`
  - [ ] `src/shared/ui/ErrorBoundary.tsx`
  - [ ] `src/shared/ui/ReusableModal.tsx`
  - [ ] `src/shared/ui/form/Input.tsx`
  - [ ] `src/shared/ui/form/Select.tsx`
  - [ ] `src/shared/ui/form/Textarea.tsx`
- [ ] Remove `as any` cast in `src/shared/ui/New/IconLabel/index.tsx`
- [ ] Delete the empty dead file `src/shared/ui/Pagination.tsx`
- [ ] Type-check, lint, and build: `pnpm exec tsc --noEmit && pnpm lint && pnpm build`
- [ ] Commit
  ```bash
  git commit -m "fix(rsc): mark hook-rendering shared components as client; drop any cast"
  ```

---

## Task 9: Documentation

**Goal:** Update README, CHANGELOG, mark spec criteria done

- [ ] Update `README.md` Features section
  - Add: "Redesigned app shell (header, sidebar, footer) built on a new theme, with a paginated skatistas directory"
- [ ] Update `CHANGELOG.md` under `## [Unreleased]`
  - Add: `- 2026-10-09 - Adopt the new app shell (header, sidebar, footer) as the single layout and wire the skatistas directory to real data with working pagination _(v2.1.0)_`
- [ ] Mark all acceptance criteria in `specs/new-ui-layout.md` with `[x]` where complete
- [ ] Commit
  ```bash
  git commit -m "docs: update README and CHANGELOG for the new UI layout"
  ```

---

## Final Verification

- [ ] `pnpm test` — all tests pass (pagination helper)
- [ ] `pnpm exec tsc --noEmit` — no TypeScript errors
- [ ] `pnpm lint` — no linting errors
- [ ] `pnpm build` — build succeeds
- [ ] Manual checks pass:
  - [ ] Every route renders the new shell exactly once
  - [ ] `/skatistas` shows real data with working pagination
  - [ ] `/new` shows the live skatistas feature
  - [ ] Changing page size resets to page 1
  - [ ] Pagination disabled at bounds and while loading
  - [ ] No `console.log` in production code
  - [ ] No bare `axios` calls
  - [ ] `/ai` hides the footer

---

## Push & PR

- [ ] Run: `git log --oneline` — verify all 9 commits are present and sequenced correctly
- [ ] Run: `git diff develop..HEAD --stat` — review all changed files
- [ ] Push: `git push origin feature/new-ui-layout`
- [ ] Open PR from `feature/new-ui-layout` → `develop`
- [ ] Verify CI/CD passes on PR
- [ ] Request code review
- [ ] After approval: merge PR

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
