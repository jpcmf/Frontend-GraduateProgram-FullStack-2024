# Feature: Spots

**Status:** done
**Priority:** high
**Affects:** New pages: `src/pages/spots/index.tsx`, `src/pages/spots/[id].tsx`, `src/pages/spots/new.tsx`; New feature components, services, hooks, and types

## Problem Statement

Skateboarding spots are the core physical unit of the SkateHub community. Users need to be able to browse spots on a public map, view individual spot details including photos and location, and submit new spots when authenticated.

The backend implementation is complete (see `specs/spots.md` in the Strapi repo — Status: done). This spec covers the frontend UI layer only.

## UI / UX Description

### Spots list page (`/spots`)

- Public page (no auth required to view)
- Shows a grid/list of all spots with: spot name, type badge (street / skatepark / diy / plaza / other), address, and first photo thumbnail
- Each spot card is clickable and navigates to `/spots/[id]`
- A "Add Spot" button is shown only to authenticated users; clicking it navigates to `/spots/new`

### Spot detail page (`/spots/[id]`)

- Public page
- Shows full spot info: name, description, type, address
- Photo gallery (multiple photos)
- Google Maps embed using the `address` string:
  ```
  https://www.google.com/maps/embed/v1/place?key=<NEXT_PUBLIC_GOOGLE_MAPS_KEY>&q=<encodeURIComponent(address)>
  ```
- Creator info (username/name)
- Edit and Delete buttons shown only to the spot owner

### Create spot page (`/spots/new`) — auth required

- Protected route (middleware redirects unauthenticated users)
- Form fields: Name (required), Description, Type (select: street/skatepark/diy/plaza/other), Address
- Photo upload: multiple images via `POST /api/upload` before creating the spot
- On submit: `POST /api/spots` with the collected photo IDs
- On success: redirect to `/spots/[id]` of the new spot

### Edit spot (`/spots/[id]/edit`) — auth + owner required

- Same form as create, pre-populated with current values
- On submit: `PUT /api/spots/:id`
- On success: redirect back to `/spots/[id]`

## Data Requirements

All endpoint shapes are defined in the backend spec: `specs/spots.md` (Strapi repo) — `## API Contract` section.

Key endpoints consumed:

| Endpoint                                                                                                                           | Auth               | Used on                              |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------ |
| `GET /api/spots?populate[photos]=true&populate[created_by_user][fields][0]=username&populate[created_by_user][fields][1]=name`     | Public             | `/spots` list                        |
| `GET /api/spots/:id?populate[photos]=true&populate[created_by_user][fields][0]=username&populate[created_by_user][fields][1]=name` | Public             | `/spots/[id]` detail                 |
| `POST /api/spots`                                                                                                                  | Bearer JWT         | `/spots/new` form                    |
| `PUT /api/spots/:id`                                                                                                               | Bearer JWT + owner | `/spots/[id]/edit` form              |
| `DELETE /api/spots/:id`                                                                                                            | Bearer JWT + owner | `/spots/[id]` detail (delete button) |
| `POST /api/upload`                                                                                                                 | Bearer JWT         | Photo upload in create/edit forms    |

## Component & File Plan

### New files

| File                                      | Purpose                                                              |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `src/types/spots.ts`                      | `Spot`, `SpotAttributes`, `SpotsResponse`, `SpotResponse` types      |
| `src/services/getSpots.ts`                | `GET /api/spots`                                                     |
| `src/services/getSpotById.ts`             | `GET /api/spots/:id`                                                 |
| `src/services/createSpot.ts`              | `POST /api/spots`                                                    |
| `src/services/updateSpot.ts`              | `PUT /api/spots/:id`                                                 |
| `src/services/deleteSpot.ts`              | `DELETE /api/spots/:id`                                              |
| `src/hooks/useSpots.ts`                   | TanStack Query hook — `queryKey: ["spots"]`                          |
| `src/hooks/useSpot.ts`                    | TanStack Query hook — `queryKey: ["spots", id]`                      |
| `src/hooks/useCreateSpot.ts`              | TanStack `useMutation` — invalidates `["spots"]` on success          |
| `src/hooks/useUpdateSpot.ts`              | TanStack `useMutation` — invalidates `["spots"]` and `["spots", id]` |
| `src/hooks/useDeleteSpot.ts`              | TanStack `useMutation` — invalidates `["spots"]` on success          |
| `src/features/spots/SpotCard/index.tsx`   | Card component for list page                                         |
| `src/features/spots/SpotForm/index.tsx`   | Shared create/edit form                                              |
| `src/features/spots/SpotDetail/index.tsx` | Detail view with map embed and photo gallery                         |
| `src/pages/spots/index.tsx`               | List page                                                            |
| `src/pages/spots/[id].tsx`                | Detail page                                                          |
| `src/pages/spots/new.tsx`                 | Create page (protected)                                              |
| `src/pages/spots/[id]/edit.tsx`           | Edit page (protected)                                                |

### Existing files to modify

| File                | Change                                                             |
| ------------------- | ------------------------------------------------------------------ |
| `src/middleware.ts` | Add `/spots/new` and `/spots/:id/edit` to protected routes matcher |
| `next.config.ts`    | No change needed — `remotePatterns` already covers the Strapi URL  |

## Acceptance Criteria

- [x] `/spots` page lists all spots publicly with name, type badge, address, and thumbnail
- [x] Clicking a spot card navigates to `/spots/[id]`
- [x] "Add Spot" button is visible only when authenticated
- [x] `/spots/[id]` shows full spot details: name, description, type, address, photos, creator
- [x] `/spots/[id]` embeds a Google Maps iframe using the `address` field
- [x] Edit and Delete buttons on `/spots/[id]` are visible only to the spot owner
- [x] Delete button calls `DELETE /api/spots/:id` and redirects to `/spots` on success
- [x] `/spots/new` is protected — unauthenticated users are redirected to login
- [x] Create form validates that Name and Type are filled before submitting
- [x] Photos can be uploaded on the create form; photo IDs are sent in `POST /api/spots`
- [x] On successful create, user is redirected to the new spot's detail page
- [x] `/spots/[id]/edit` is protected and only accessible to the spot owner
- [x] Edit form is pre-populated with current spot values
- [x] All service files use `apiClient` — no bare `axios`
- [x] No `console.log`, `console.warn`, or `console.error` in any new file
- [x] TypeScript — no `any` types in new files

## Out of Scope

- Geolocation-based "nearby spots" query
- Server-side geocoding or coordinate storage
- Spot ratings or reviews
- Spot check-ins
- SpotList (collections) UI — tracked separately
- Admin moderation / approval workflow
- Pagination (initial implementation uses default Strapi page size of 25)
