# Feature: Lists (Collections)

**Status:** done
**Priority:** high
**Affects:** Pages: `src/app/(protected)/dashboard/lists/index.tsx`, `src/app/(protected)/dashboard/lists/[id]/edit.tsx`, `src/app/(public)/lists/[id].tsx`; Feature components, services, hooks, types; Modified user profile component, sidebar nav

## Problem Statement

Users need a way to curate and organize collections of skate-world items (spots, skatistas, stories, etc.) into labeled lists. These lists can be public or private, shared with the community, and discovered by other users. The backend implementation is complete (see `specs/user-lists.md` in the Strapi repo — Status: ready). This spec covers the frontend UI layer only.

## UI / UX Description

### List detail page (`/lists/[id]`) — reachable only from profile links

- Public page
- Shows full list info: name, description, list type badge, item count, creator info (avatar, username)
- List of items in fixed order (by creation date, ascending)
- Each item shows: title, optional image thumbnail, optional description, and optional source URL
- Creator name/avatar is clickable and links to creator's profile
- Edit and Delete buttons shown only to the list owner
- No navigation to this page from sidebar or global routes — only from profile cards

- Public page
- Shows full list info: name, description, list type badge, item count, creator info (avatar, username)
- List of items in fixed order (by creation date, ascending)
- Each item shows: title, optional image thumbnail, optional description, and optional source URL
- Creator name/avatar is clickable and links to creator's profile
- Edit and Delete buttons shown only to the list owner

### Create/Edit list page (`/dashboard/lists/[id]/edit`) — auth + owner required

- Protected route ((protected) layout redirects unauthenticated users)
- Form fields:
  - Name (required, string)
  - Description (optional, string)
  - List Type (required, select: wish / like / want / recommend)
  - Public (checkbox, default: true)
- Item management:
  - "Add Item" button opens a modal
  - Modal form: title (required), description (optional), image (optional file upload), URL (optional)
  - List of items displayed with edit/delete buttons per item
  - Items are ordered by creation date (immutable order)
- On submit: `PUT /api/lists/:id` (create via dashboard card uses `POST /api/lists`)
- On success: redirect to `/dashboard/lists` (dashboard list)

### Dashboard lists management page (`/dashboard/lists`)

- Protected route (auth required)
- Shows all lists owned by the authenticated user in a grid or table
- Each card displays: list name, type badge, item count, public/private indicator, and edit/delete buttons
- "Criar lista" button (uses same behavior pattern as "Criar spot") navigates to create list flow
- Delete confirmation modal before deletion
- Edit button navigates to `/dashboard/lists/[id]/edit`

### Create list flow

- "Criar lista" button on dashboard (or sidebar) opens a modal with:
  - Name (required)
  - List Type (required, select: wish / like / want / recommend)
  - Description (optional)
  - Public (checkbox, default: true)
- On submit: `POST /api/lists` with these fields; on success, redirect to `/dashboard/lists/[id]/edit` to add items

### Profile integration

- Lists section in the user profile component (`/user/[id]`)
- Shows all public lists created by that user with: list name, type badge, and item count
- "Gerenciar" button visible only to the profile owner, linking to `/dashboard/lists`
- Clicking a list card navigates to `/lists/[id]`

## Data Requirements

All endpoint shapes are defined in the backend spec: `specs/user-lists.md` (Strapi repo) — `## API Contract` section.

Key endpoints consumed:

| Endpoint                                                                  | Auth               | Used on                       |
| ------------------------------------------------------------------------- | ------------------ | ----------------------------- |
| `GET /api/user-lists?populate=items`                                      | Public             | `/lists` discovery page       |
| `GET /api/user-lists/:id?populate=items`                                  | Public             | `/lists/[id]` detail page     |
| `GET /api/user-lists?filters[owner][$eq]=$USER_ID&populate=items`         | Public             | `/user/[id]` profile page     |
| `GET /api/user-lists?filters[owner][$eq]=$CURRENT_USER_ID&populate=items` | Bearer JWT         | `/dashboard/lists` (my lists) |
| `POST /api/user-lists`                                                    | Bearer JWT         | Create list modal             |
| `PUT /api/user-lists/:id`                                                 | Bearer JWT + owner | `/dashboard/lists/[id]/edit`  |
| `DELETE /api/user-lists/:id`                                              | Bearer JWT + owner | Dashboard delete button       |
| `POST /api/user-list-items`                                               | Bearer JWT         | Add item to list              |
| `PUT /api/user-list-items/:id`                                            | Bearer JWT         | Edit item in list             |
| `DELETE /api/user-list-items/:id`                                         | Bearer JWT         | Delete item from list         |

## Component & File Plan

### New files

| File                                                      | Purpose                                                                               |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/features/lists/types/index.ts`                       | `List`, `ListItem`, `ListType`, API response types                                    |
| `src/features/lists/services/getLists.ts`                 | `GET /api/lists` (public discovery)                                                   |
| `src/features/lists/services/getListsByUser.ts`           | `GET /api/lists?filters[created_by_user]` (my lists)                                  |
| `src/features/lists/services/getListById.ts`              | `GET /api/lists/:id`                                                                  |
| `src/features/lists/services/createList.ts`               | `POST /api/lists`                                                                     |
| `src/features/lists/services/updateList.ts`               | `PUT /api/lists/:id`                                                                  |
| `src/features/lists/services/deleteList.ts`               | `DELETE /api/lists/:id`                                                               |
| `src/features/lists/services/createListItem.ts`           | `POST /api/list-items`                                                                |
| `src/features/lists/services/updateListItem.ts`           | `PUT /api/list-items/:id`                                                             |
| `src/features/lists/services/deleteListItem.ts`           | `DELETE /api/list-items/:id`                                                          |
| `src/features/lists/hooks/useLists.ts`                    | TanStack Query hook — `queryKey: ["lists"]`                                           |
| `src/features/lists/hooks/useListsByUser.ts`              | TanStack Query hook — `queryKey: ["my-lists"]`                                        |
| `src/features/lists/hooks/useList.ts`                     | TanStack Query hook — `queryKey: ["lists", id]`                                       |
| `src/features/lists/hooks/useCreateList.ts`               | TanStack `useMutation` — invalidates `["lists"]` and `["my-lists"]` on success        |
| `src/features/lists/hooks/useUpdateList.ts`               | TanStack `useMutation` — invalidates `["lists"]`, `["my-lists"]`, and `["lists", id]` |
| `src/features/lists/hooks/useDeleteList.ts`               | TanStack `useMutation` — invalidates `["lists"]` and `["my-lists"]` on success        |
| `src/features/lists/hooks/useCreateListItem.ts`           | TanStack `useMutation` — invalidates `["lists", listId]` on success                   |
| `src/features/lists/hooks/useUpdateListItem.ts`           | TanStack `useMutation` — invalidates `["lists", listId]` on success                   |
| `src/features/lists/hooks/useDeleteListItem.ts`           | TanStack `useMutation` — invalidates `["lists", listId]` on success                   |
| `src/features/lists/components/ListCard/index.tsx`        | Card component for discovery and profile pages                                        |
| `src/features/lists/components/ListForm/index.tsx`        | Shared create/edit form for name, description, type, public flag                      |
| `src/features/lists/components/ListItemForm/index.tsx`    | Modal form for adding/editing items                                                   |
| `src/features/lists/components/ListItemList/index.tsx`    | Display list of items with edit/delete buttons                                        |
| `src/features/lists/components/ListDetail/index.tsx`      | Detail view of a list (public)                                                        |
| `src/features/lists/components/CreateListModal/index.tsx` | Modal for quick list creation (from dashboard button)                                 |
| `src/features/lists/index.ts`                             | Barrel export                                                                         |
| `src/app/(protected)/dashboard/lists/page.tsx`            | Dashboard lists management page                                                       |
| `src/app/(protected)/dashboard/lists/[id]/edit/page.tsx`  | Edit list with item management                                                        |
| `src/app/(public)/lists/[id]/page.tsx`                    | Public detail page (no discovery page)                                                |

### Existing files to modify

| File                                             | Change                                                        |
| ------------------------------------------------ | ------------------------------------------------------------- |
| `src/features/user/types/User.type.ts`           | Add `user_lists` field with items for count                   |
| `src/features/user/components/Profile/index.tsx` | Add Lists section with item count, Gerenciar button for owner |
| `src/features/dashboard/index.tsx`               | Update "Criar Lista" card href from `/` to `/dashboard/lists` |
| `src/shared/ui/Layout/Sidebar/SidebarNav.tsx`    | Removed "Listas" navigation link (profile-centric)            |

## Acceptance Criteria

- [ ] `/lists` returns 404 (discovery page removed)
- [ ] `/lists/[id]` shows full list details: name, description, type badge, item count, creator info
- [ ] `/lists/[id]` displays items in fixed order (by creation date, ascending) with title, optional image, optional description, and optional URL
- [ ] Creator name/avatar on `/lists/[id]` is clickable and links to creator's profile
- [ ] Edit and Delete buttons on `/lists/[id]` are visible only to the list owner
- [ ] `/dashboard/lists` is protected — unauthenticated users are redirected to login
- [ ] `/dashboard/lists` displays all lists owned by the authenticated user with name, type, item count, public/private indicator
- [ ] "Criar lista" button on dashboard opens a modal to create a new list
- [ ] Create list modal form validates that Name and List Type are filled before submitting
- [ ] On successful create, user is redirected to `/dashboard/lists/[id]/edit` to add items
- [ ] `/dashboard/lists/[id]/edit` is protected and only accessible to the list owner
- [ ] Edit form is pre-populated with current list values
- [ ] "Add Item" button on edit page opens a modal to add an item
- [ ] Item modal validates that title is filled before submitting
- [ ] Item images can be uploaded via multipart form-data; images are associated with the item
- [ ] Items are displayed in a list on the edit page with edit and delete buttons
- [ ] Delete button for items calls `DELETE /api/list-items/:id` and removes the item from the list
- [ ] Delete button for lists calls `DELETE /api/lists/:id` with a confirmation modal
- [ ] User profile page (`/user/[id]`) has a Lists section showing all public lists by that user with title, type badge, and item count
- [ ] "Gerenciar" button appears on own profile Lists section, linking to `/dashboard/lists`
- [ ] "Gerenciar" button does not appear when viewing other users' profiles
- [ ] Sidebar no longer shows "Listas" link
- [ ] All service files use `apiClient` — no bare `axios`
- [ ] No `console.log`, `console.warn`, or `console.error` in any new file
- [ ] TypeScript — no `any` types in new files
- [ ] TanStack Query cache is invalidated correctly after mutations (create/update/delete)

## Out of Scope

- Private lists (all lists are public by default in MVP)
- List sharing with specific users
- Collaborative lists (multiple owners)
- Social features (liking, commenting on lists)
- Advanced sorting/search (initial MVP: sort by date descending, filter by type only)
- Pagination (initial implementation uses default Strapi page size)
- Bulk item operations (import/export lists)
- List duplication / copying
