# Plan: Spot Comments & Reactions Frontend

## Overview

Implement the frontend comment system for the Next.js application. Users can view, create, edit, and delete comments on spot detail pages; react with hearts; and see a community activity feed of recent comments on the home page.

**Spec:** `docs/superpowers/specs/2026-09-17-comments.md` (Status: ready — updated per grilling session 2026-09-22)
**Backend Spec:** `skatehub-strapi/docs/superpowers/specs/2026-09-17-comments.md` (Status: ready; PR #87 open)

## Locked decisions (grilling session 2026-09-22)

Reference: `docs/adr/0001-activity-feed-community-home.md`

- **Q1** — Backend: write frontend now, target a **local Strapi running the `feature/spot-comments-reactions` branch**; cloud deploy verification stays the only open gate.
- **Q2/Q10** — Activity feed is **community-wide on the public home page (`/`)**, not a per-user profile feed. `getUserComments`/`useUserComments` are dropped.
- **Q3/Q14** — Backend `POPULATE` must be extended (client `populate` is overridden server-side): add `spot: { fields: ["id", "name"] }` and `author.avatar` (`url` + `formats.thumbnail.url`) to the comment controller's fixed `POPULATE`.
- **Q4** — Flagging **deferred** — no `FlagCommentModal`; report UI waits for a backend endpoint.
- **Q5** — Reactions are **optimistic** (in-place cache update + revert on failure) with a pending guard; background invalidate on settle.
- **Q6** — Spot comment list: fetch all + **client-side sort** (Newest/Oldest). Feed: **page-based load more** via `pagination[page]&pagination[pageSize]`.
- **Q7** — "edited" derived from `updatedAt !== createdAt` (no backend field).
- **Q8** — Deep links: `#comment-<id>` hash anchors + scrollIntoView + soft highlight in `CommentList` / feed.
- **Q11** — Dashboard's dead "Atividades recentes" placeholder (`Hello`) stays untouched.
- **Q12** — Home feed is a **client-hook component** (mirrors `StoriesHome`/`SkatistasHome`), read-only — no react/edit controls.
- **Q13** — Add `formatTimeAgo` util (date-fns `formatDistanceToNow`, `ptBR`, "há 2 horas"); `formatSmartDate` stays for existing uses.
- **Q15** — Every comment mutation invalidates **both** `["comments", spotId]` and `["recent-comments"]`.

## Backend contract corrections (from Strapi code review)

- `POST /api/reactions/upsert` body must be `{ "data": { comment, type } }` (backend reads `ctx.request.body.data`); returns 201 created / 204 deleted. **Not** flat `{ comment, type }` as the old plan said.
- `GET /api/comments` meta is `{ pagination: { total } }` only — no `page/pageSize/pageCount`. Pagination params are honored; feed derives "load more" from `total` vs loaded count.
- Client `populate` params are **always overridden** by the controller's fixed `POPULATE` — the frontend passes `filters`/`sort`/`pagination` but not `populate`.

## Steps

### 1. Create Comment types

**File:** `src/features/comments/types/comments.ts`

Define TypeScript types:

- `Reaction` (id, type: "heart", user: { id, username, name, avatar? })
- `CommentAttributes` (text, links, images, author, spot?, reactions, flagged, flagged_reason, createdAt, updatedAt)
- `Comment` (id, attributes: CommentAttributes)
- `CommentsResponse` (data: Comment[], meta: { pagination: { total } })
- `CreateCommentInput` (text, spot, images?)
- `UpdateCommentInput` (text, images?)

`author` includes `avatar?` (Q14); `spot` is populated on the backend with `{ id, name }` (Q3) and typed optional.

### 2. Create Comment services

**File:** `src/features/comments/services/getComments.ts`

Fetch comments for a spot (public):

- Query: `GET /api/comments?filters[spot][id][$eq]=<spotId>&sort=-createdAt`
- No `populate` params — server fixed populate covers author/images/reactions.user (+ spot/avatar per Q3/Q14).
- Use `apiClient`. Return `CommentsResponse`.

**File:** `src/features/comments/services/getRecentComments.ts`

Fetch the community feed for the home page (public), page-based:

- Query: `GET /api/comments?sort=-createdAt&pagination[page]=<page>&pagination[pageSize]=<pageSize>`
- Use `apiClient`. Return `CommentsResponse`.

**File:** `src/features/comments/services/createComment.ts`

- POST `/api/comments` with body: `{ data: { text, spot, images? } }` — `apiClient`, Bearer via interceptor.
- Return created `Comment`.

**File:** `src/features/comments/services/updateComment.ts`

- PUT `/api/comments/:id` with body: `{ data: { text, images? } }` — `apiClient`, Bearer.
- Return updated `Comment`.

**File:** `src/features/comments/services/deleteComment.ts`

- DELETE `/api/comments/:id` — `apiClient`, Bearer.
- Return success status.

**File:** `src/features/comments/services/upsertReaction.ts`

- POST `/api/reactions/upsert` with body: `{ data: { comment, type: "heart" } }` — `apiClient`, Bearer.
- Handle 201 (created) and 204 (deleted).

### 3. Create Comment hooks

**File:** `src/features/comments/hooks/useComments.ts`

- Query key: `["comments", spotId]`. Use `getComments(spotId)`. Return query with data, isLoading, error.

**File:** `src/features/comments/hooks/useRecentComments.ts`

- Query key: `["recent-comments", page]`. Use `getRecentComments(page, pageSize)`. Return query with data, isLoading, error, plus `total` for load-more.

**File:** `src/features/comments/hooks/useCreateComment.ts`

- Use `createComment(input)`. On success invalidate `["comments", spotId]` **and** `["recent-comments"]` (Q15). Return mutation.

**File:** `src/features/comments/hooks/useUpdateComment.ts`

- Use `updateComment(commentId, input)`. Invalidates `["comments", spotId]` + `["recent-comments"]`.

**File:** `src/features/comments/hooks/useDeleteComment.ts`

- Use `deleteComment(commentId)`. Invalidates `["comments", spotId]` + `["recent-comments"]`.

**File:** `src/features/comments/hooks/useUpsertReaction.ts`

- Use `upsertReaction(commentId)`. **Optimistic**: update the `["comments", spotId]` cache in place (append/remove current user's reaction), revert on error, guard while `isPending`. Invalidate both keys on settle (Q5, Q15).

### 4. Create Comment components

**File:** `src/features/comments/components/CommentList/index.tsx`

- Props: spotId, currentUserId, isLoading, comments.
- Render comment count header + sort selector (Newest/Oldest, client-side, Q6).
- Map comments to `<CommentCard />`. Handle loading/empty states.
- Support `#comment-<id>` anchor: on mount, `scrollIntoView` + soft highlight (Q8).

**File:** `src/features/comments/components/CommentCard/index.tsx`

- Props: comment, currentUserId, onEdit, onDelete, onReact, isReacting.
- Display: author avatar (`next/image` or Chakra `Avatar` with initials fallback, Q14) + name + relative timestamp, text, images grid.
- Render `<ReactionButton />`. Show Edit/Delete only if `String(user.id) === String(author.id)`.
- Show "editado" when `updatedAt !== createdAt` (Q7).
- No flag/report button — deferred (Q4).

**File:** `src/features/comments/components/CommentForm/index.tsx`

- Props: spotId, onSubmit, initialText?, initialImages?, isLoading.
- Textarea (max 500 chars) + character counter. Image upload queue (1–5) via `POST /api/upload`, removable before submit.
- Submit label "Post Comment"/"Update Comment". Validation: text required, ≤500.

**File:** `src/features/comments/components/ReactionButton/index.tsx`

- Props: comment, currentUserId, isLoading, onToggle.
- Heart count = `reactions.data.length`. Filled if any `reaction.user.id === currentUserId`, outline otherwise. Disabled if unauthenticated or pending (Q5 guard).

**File:** `src/features/comments/components/RecentCommentsFeed/index.tsx`

- Props: none.
- Uses `useRecentComments(currentPage, pageSize)`.
- Read-only activity cards: author avatar + name, spot name (link to `/spots/<id>#comment-<id>`), truncated text, reaction count, relative timestamp (Q8, Q12, Q13).
- "Load more" button (page-based, Q6); render while `loaded.length < total`.
- Loading/error/empty states.

### 5. Create barrel export

**File:** `src/features/comments/index.ts`

```typescript
export {
  useComments,
  useRecentComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useUpsertReaction
} from "./hooks";
export type {
  Comment,
  CommentAttributes,
  CommentsResponse,
  CreateCommentInput,
  UpdateCommentInput,
  Reaction
} from "./types";
export {
  getComments,
  getRecentComments,
  createComment,
  updateComment,
  deleteComment,
  upsertReaction
} from "./services";
export { CommentList, CommentCard, CommentForm, ReactionButton, RecentCommentsFeed } from "./components";
```

### 6. Integrate CommentList into Spot Detail Page

**File:** `src/features/spots/components/SpotDetail/index.tsx` (client component)

Replace the current disabled placeholder box ("Comentários — placeholder until backend is implemented"):

- Add `<CommentForm spotId={id} />` above `<CommentList spotId={id} />`.
- Use `useAuth()` to render the form and enable reacting only when authenticated.
- Move the comments section under a `TitleSection` "Comentários" header with count.

### 7. Integrate RecentCommentsFeed into the Home Page

**File:** `src/app/page.tsx`

- Add `<RecentCommentsFeed />` below `<StoriesHome />` / `<SkatistasHome />` (client component, no changes to the page's "use client" nature).
- Optionally wrap in a "Atividades recentes" `TitleSection`.

## Verification

- [ ] `src/features/comments/types/comments.ts` exports all required types
- [ ] All service functions use `apiClient` (no bare axios)
- [ ] `upsertReaction` posts `{ data: { comment, type: "heart" } }` and handles 201/204
- [ ] All hooks use TanStack Query with correct query keys: `["comments", spotId]`, `["recent-comments"]`
- [ ] All mutations invalidate both `["comments", spotId]` and `["recent-comments"]`
- [ ] Reaction toggle updates optimistically and reverts on failure; guarded while pending
- [ ] `/spots/[id]` displays comments section with form (auth-only) + list
- [ ] No flag/report button anywhere; `FlagCommentModal` does not exist (deferred)
- [ ] "editado" shows when `updatedAt !== createdAt`
- [ ] Home page renders the community feed; "Load more" appends pages until `total` reached
- [ ] Feed items link to `/spots/<id>#comment-<id>`; spot page scrolls to and highlights the comment
- [ ] Dashboard placeholder untouched
- [ ] No `console.log`, `console.warn`, or `console.error` in any new file
- [ ] No `any` types in TypeScript files
- [ ] All acceptance criteria in spec are marked with `[x]`

## Out of scope (unchanged from spec)

- Comment threading, @-mentions, moderation workflows, admin notifications, real-time updates, reaction types beyond heart, flag/report UI (deferred).
