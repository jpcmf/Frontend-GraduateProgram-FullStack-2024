# Plan Review & Fixes Applied

**Date:** 2026-10-09  
**Document:** `superpowers/plans/2026-10-09-new-ui-layout-pagination.md`  
**Spec:** `../specs/new-ui-layout.md`

---

## Summary

Both the plan and spec are **well-aligned and make strong sense together**. The plan is a detailed, step-by-step implementation roadmap that correctly maps every spec acceptance criterion to concrete tasks.

**5 issues were identified and fixed** (all low-to-medium severity, none are architectural showstoppers).

---

## Issues Fixed

### ✅ Issue 1: Test File Path Structure (Task 3)

**Problem:**  
Plan specified `src/__tests__/shared/ui/New/Pagination/getPageNumbers.test.ts`, but the repo doesn't have an `src/__tests__/` directory; it's not part of the established pattern.

**Fix Applied:**  
Changed to co-located test path: `src/shared/ui/New/Pagination/__tests__/getPageNumbers.test.ts`

**Why:**

- Matches modern Vitest conventions (tests co-located with code).
- Lighter than creating a parallel `src/__tests__/` structure.
- All references in Task 3 updated (Step 1 header, Step 2 path, Step 3 run command).

**Lines changed:** Task 3, all steps (153, 169, 176).

---

### ✅ Issue 2: Clarification on `getUsers2` Legacy Function (Task 7)

**Problem:**  
Step 1 said "Fix the `getUsers2` offset bug" but `getUsers2` is legacy and out of scope per the spec. Confusing wording.

**Fix Applied:**  
Added explicit note: "Note: The legacy `getUsers2` function is not wired to any active feature; leave it unchanged (out of scope per the spec)."

**Why:**

- Clarifies that `getUsers2` should NOT be touched in this task.
- Prevents accidental scope creep.
- Aligns with the spec's "Out of Scope" section.

**Lines changed:** Task 7, Step 1 (line 675).

---

### ✅ Issue 3: Base URL Assumption Verification (Task 7)

**Problem:**  
Plan assumes `apiClient.baseURL` and the `API` constant both equal `process.env.NEXT_PUBLIC_STRAPI_URL`, making relative paths safe. This assumption wasn't verified in the plan itself.

**Fix Applied:**  
Added a **Verification** subsection to Step 1:

> "Verification: Both `apiClient.baseURL` (from `src/shared/api/apiClient.ts` line 7) and the `API` constant (from `src/shared/config/constants.ts` line 7) equal `process.env.NEXT_PUBLIC_STRAPI_URL`, so relative paths are safe."

**Why:**

- Provides explicit verification before migration.
- Reduces risk of breaking the API client during refactoring.
- Gives the implementer confidence.

**Lines changed:** Task 7, Step 1 (line 673).

---

### ✅ Issue 4: Missing Defaults for Optional Params (Task 7)

**Problem:**  
The plan's new `useUsers` code didn't set defaults for optional `currentPage` and `pageSize`. If called without params, the API call would include `pagination[page]=undefined`, which is invalid.

**Fix Applied:**  
Added two lines to the `fetchUsers` function:

```typescript
const page = currentPage ?? 1;
const size = pageSize ?? 10;
const users = await getCustomUsersWithPagination(page, size);
```

**Why:**

- Prevents invalid API calls.
- Ensures the service always receives valid params.
- Matches the hook's optional signature (`currentPage?: number`, `pageSize?: number`).

**Lines changed:** Task 7, Step 2 (lines 694-695 in the code block).

---

### ✅ Issue 5: Missing `socialMedia` Helper Module (Task 5)

**Problem:**  
Task 5 Step 2 referenced `import { openInstagram, openWebsite } from "@/shared/lib/socialMedia"`, but this module doesn't exist in the codebase. The plan assumed it would be created or already exist.

**Fix Applied:**  
Added a new **Step 1** to Task 5 that creates the module:

```typescript
// src/shared/lib/socialMedia.ts
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

Then updated all subsequent steps (Grid, Card, Type-check/lint, Commit).

**Why:**

- Creates the missing helper that Task 5 depends on.
- Provides reusable social link logic (no hardcoded calls in Card).
- Follows security best practices (`noopener,noreferrer`).

**Lines changed:** Task 5, entire section restructured (lines 450–569).

---

## Verification Checklist

- [x] Test path now matches repo structure (co-located)
- [x] `getUsers2` correctly marked as legacy/out-of-scope
- [x] Base URL verification explicitly documented
- [x] Defaults added to optional params in `fetchUsers`
- [x] Social media helpers module created in Task 5
- [x] All task step numbers sequential and correct
- [x] No duplicate steps or broken references
- [x] Git commits still align with task boundaries

---

## Ready to Implement

✅ **The plan is now complete and ready to implement.**

**Next steps for implementer:**

1. Create a new feature branch:

   ```bash
   git checkout develop && git pull
   git checkout -b feature/new-ui-layout
   ```

2. Start with **Task 1** (replace the app shell) — if this works, the rest flows smoothly.

3. Follow each task's steps in order, running type-check/lint/manual checks before every commit.

4. When all tasks complete, verify with `pnpm test && pnpm build` and update README + CHANGELOG.

---

## Files Modified

- ✅ `superpowers/plans/2026-10-09-new-ui-layout-pagination.md` — All 5 issues fixed inline.

## Files to Create (During Implementation)

- `src/shared/lib/socialMedia.ts` — Social link helpers (Task 5)
- `src/shared/ui/New/Pagination/getPageNumbers.ts` — Pagination logic (Task 3)
- `src/shared/ui/New/Pagination/__tests__/getPageNumbers.test.ts` — Unit tests (Task 3)
- `vitest.config.ts` — Test configuration (Task 3)
