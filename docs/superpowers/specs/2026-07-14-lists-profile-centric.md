# Lists — Profile-Centric Redesign

**Status:** draft
**Priority:** high
**Affects:** Remove `/lists` page and sidebar link; enhance profile Lists section; update dashboard management access

## Problem Statement

The global `/lists` discovery page doesn't serve a clear purpose — lists are personal collections that make sense in context of a user's profile, not as a standalone feed. The sidebar "Listas" link adds navigation clutter when lists are naturally accessed from profiles or dashboard management.

## Changes

### Remove

| File                                          | Reason                                     |
| --------------------------------------------- | ------------------------------------------ |
| `src/app/(public)/lists/page.tsx`             | Global discovery page — no standalone need |
| `src/app/(public)/lists/layout.tsx` if exists | Remove with route folder                   |

### Keep as-is

| File                                                     | Reason                                                                    |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/app/(public)/lists/[id]/page.tsx`                   | Detail page — accessible only from profile links (direct URL or bookmark) |
| `src/app/(protected)/dashboard/lists/page.tsx`           | Dashboard management — remains for creating/editing/deleting own lists    |
| `src/app/(protected)/dashboard/lists/[id]/edit/page.tsx` | Edit page with item CRUD — remains                                        |

### Modify

| File                                             | Change                                                                                                                                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/shared/ui/Layout/Sidebar/SidebarNav.tsx`    | Remove "Listas" navigation link entirely                                                                                                                                                |
| `src/features/user/components/Profile/index.tsx` | Enhance Lists section: show list title + type badge + item count; click navigates to `/lists/[id]`; add "Gerenciar" button visible only to profile owner, linking to `/dashboard/lists` |
| `src/app/(public)/lists/[id]/page.tsx`           | Fix delete redirect from `router.push("/lists")` to `router.back()`                                                                                                                     |
| `src/features/user/types/User.type.ts`           | Ensure `user_lists` type includes item count                                                                                                                                            |
| `src/features/user/types/usersBasics.type.ts`    | Same as above                                                                                                                                                                           |

### Docs

| File             | Change                                                                       |
| ---------------- | ---------------------------------------------------------------------------- |
| `specs/lists.md` | Update status and remove `/lists` references; mark discovery page as removed |
| `CHANGELOG.md`   | Add entry for the redesign                                                   |

## Data Requirements

No new endpoints needed. Existing endpoints:

- `GET /api/user-lists?filters[owner][$eq]=$USER_ID&populate[items]=true` — Dashboard management (unchanged)
- `GET /api/user-lists/:id` — Detail page (unchanged)
- Profile `user_lists` field — already provided by user endpoint

## Acceptance Criteria

- [ ] `/lists` returns 404 (route removed)
- [ ] `/lists/[id]` still works when accessed directly
- [ ] Sidebar no longer shows "Listas"
- [ ] Profile Lists section shows list title, type badge, and item count
- [ ] Clicking a list card on profile navigates to `/lists/[id]`
- [ ] "Gerenciar" button appears on own profile Lists section, linking to `/dashboard/lists`
- [ ] "Gerenciar" button does not appear when viewing other users' profiles
- [ ] Delete redirect on `/lists/[id]` does not reference the removed `/lists` page
- [ ] Dashboard `/dashboard/lists` and `/dashboard/lists/[id]/edit` work unchanged
- [ ] TypeScript — no errors
- [ ] Lint — no new errors

## Out of Scope

- Changing the list creation flow (remains via dashboard modal)
- Changing the list item management UI
- Adding new API fields or endpoints
