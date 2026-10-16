# New UI Layout & Skatistas Pagination — Start Here

**Status:** ✅ Plan reviewed, 5 issues fixed, ready to implement  
**Timeline:** ~3.5–4.5 hours (one focused session)  
**Complexity:** Medium (shell replacement + data layer + component composition)

---

## What's Happening

This is a production slice that:
1. **Replaces the app shell** with the new design system (header, sidebar, footer)
2. **Wires real data** to the skatistas list with a paginated interface
3. **Implements pagination logic** with page-number windowing and unit tests
4. **Modernizes the data layer** to use the centralized API client

The spec is solid, the plan is detailed, and all issues have been fixed.

---

## Your Starting Point

### 📋 Read These First (in order)

1. **`PLAN_REVIEW_SUMMARY_2026-10-09.md`** (5 min read)
   - Overall assessment: plan + spec alignment, 5 issues found & fixed

2. **`PLAN_REVIEW_FIXES_2026-10-09.md`** (10 min read)
   - Details of each fix, why it matters, what changed

3. **`superpowers/plans/2026-10-09-new-ui-layout-pagination.md`** (skim)
   - The full implementation plan with all 9 tasks and step-by-step instructions

### ✅ Use During Implementation

4. **`IMPLEMENTATION_CHECKLIST_2026-10-09.md`** (keep open while coding)
   - Task-by-task checklist with git commit messages and verification steps

---

## Quick Facts

| Metric | Value |
|--------|-------|
| **Number of tasks** | 9 (shell → pagination → data layer → docs) |
| **New files to create** | 3 (`socialMedia.ts`, `getPageNumbers.ts`, test file) |
| **Files to modify** | ~15 (listed in spec) |
| **Files to delete** | 5 old layout components |
| **Commits** | 9 named commits, one per task |
| **Tests to write** | 7 pagination helper tests (Vitest) |
| **Manual checks** | Tasks 1, 5, 6, 7 (run `pnpm dev` in browser) |

---

## Key Decisions Already Made

✅ **Test path:** Co-located in `src/shared/ui/New/Pagination/__tests__/`  
✅ **Social helpers:** Created as `src/shared/lib/socialMedia.ts`  
✅ **API client:** Migrating from bare `axios` to `apiClient`  
✅ **Total count:** Read from `pagination.meta.total` (not parallel call)  
✅ **Defaults:** Added for optional `currentPage` / `pageSize`  
✅ **Legacy code:** `getUsers2` left unchanged (out of scope)  

---

## The 5 Issues That Were Fixed

| # | What | Impact | Status |
|---|------|--------|--------|
| 1 | Test path didn't match directory structure | Low | ✅ Fixed (co-located path) |
| 2 | Confusing wording about `getUsers2` | Low | ✅ Fixed (clarified it's legacy) |
| 3 | Base URL assumption unverified | Low | ✅ Fixed (added verification) |
| 4 | Missing defaults for optional params | **Medium** | ✅ Fixed (added `?? 1` and `?? 10`) |
| 5 | Social helper module didn't exist | **Medium** | ✅ Fixed (created `socialMedia.ts`) |

**None are blockers. All are incorporated into the plan.**

---

## Start Implementing

### Step 1: Create the branch

```bash
git checkout develop
git pull
git checkout -b feature/new-ui-layout
```

### Step 2: Start with Task 1

Open `docs/superpowers/plans/2026-10-09-new-ui-layout-pagination.md` and begin Task 1: "Replace the app shell with a single new layout."

This is the riskiest piece; if it works, the rest is straightforward.

### Step 3: Follow the checklist

Use `IMPLEMENTATION_CHECKLIST.md` to track progress through all 9 tasks.

### Step 4: Verify often

After each task, run:
```bash
pnpm exec tsc --noEmit  # Type-check
pnpm lint              # Lint (catches console.log, any, imports)
pnpm test              # Run tests (Task 3 adds these)
```

---

## How to Get Help

If you get stuck:

1. **Check the plan step-by-step** — each step has verification commands
2. **Check git history** — see what was changed (`git log --oneline`)
3. **Run type-check/lint** — they catch 90% of issues
4. **Manual browser test** — open `http://localhost:3000` and verify rendering

---

## Success Criteria

When you're done, you'll have:

✅ A single app shell (no duplicate renders)  
✅ Real data flowing through the skatistas list  
✅ Working pagination (previous/next buttons, page numbers, page-size select)  
✅ Unit tests for pagination logic  
✅ All user services using `apiClient` (no bare axios)  
✅ README and CHANGELOG updated  
✅ Spec acceptance criteria all checked  

---

## Estimated Time

- **Task 1 (Shell):** 30–45 min
- **Task 2 (Preview):** 5 min
- **Task 3 (Pagination):** 1–1.5 hrs
- **Task 4–6 (Components):** 1 hr total
- **Task 7 (Data layer):** 45–60 min
- **Task 8 (RSC):** 15 min
- **Task 9 (Docs):** 10 min

**Total: 3.5–4.5 hours**

---

## Files in This Review

```
frontend/
├── docs/
│   ├── START_HERE_2026-10-09.md         ← You are here
│   ├── PLAN_REVIEW_SUMMARY_2026-10-09.md   ← Read after this
│   ├── PLAN_REVIEW_FIXES_2026-10-09.md  ← Details of fixes
│   ├── IMPLEMENTATION_CHECKLIST_2026-10-09.md  ← Use while coding
│   ├── superpowers/plans/
│   │   └── 2026-10-09-new-ui-layout-pagination.md  ← Full plan (fixed)
│   └── ...
├── specs/
│   └── new-ui-layout.md                ← Spec (unchanged)
└── ...
```

---

## Ready?

👉 **Next:** Read `PLAN_REVIEW_SUMMARY_2026-10-09.md` → then `PLAN_REVIEW_FIXES_2026-10-09.md` → then start Task 1

Good luck! 🛹

---

Generated: 2026-10-09  
Plan by: Claude Haiku 4.5  
Status: ✅ Ready to implement  
Location: `docs/`
