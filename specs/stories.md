# Feature: Stories

**Status:** done
**Priority:** high
**Affects:** `src/features/stories/`, `src/services/getStories.ts`, `src/types/stories.ts`, `src/hooks/useStories.ts`, `src/hooks/useStoriesByUserId.ts`, `src/components/StoriesSwiper/`

## Problem Statement

Users can post short video/photo stories that appear in a horizontal "Online agora" strip on the home page. Tapping a story avatar opens a fullscreen story viewer. This is a core engagement mechanic of the platform.

The initial implementation had a 3-layer bug chain: the Strapi populate query was wrong (requesting `avatar` as a scalar field instead of a nested media relation), the TypeScript types had no `avatar` field, and the mapping layer hardcoded `image: ""` with a TODO comment — so all avatars fell back to Robohash placeholders.

## UI / UX Description

### Home page (`/`)

- A horizontal `StoriesSwiper` strip labelled "Online agora" shows one circular avatar per user who has active stories
- Each avatar shows the user's real profile photo (Strapi avatar `thumbnail` format preferred, fallback to full `url`, fallback to Robohash `https://robohash.org/<name>` if no avatar uploaded)
- Clicking an avatar opens `StoriesModal` for that user

### Story viewer modal

- Renders each story as a fullscreen card using `react-insta-stories`
- Automatically advances to the next story and closes the modal when all stories for that user have ended

## Data Requirements

### `GET /api/stories` (home strip — unique authors)

```
/api/stories
  ?populate[author][fields][0]=username
  &populate[author][fields][1]=name
  &populate[author][populate][avatar][fields][0]=url
  &populate[author][populate][avatar][fields][1]=formats
```

Returns `StoriesResponse`. The `author.data.attributes.avatar.data.attributes` contains:

- `url` — full-size image URL
- `formats.thumbnail.url` — thumbnail URL (preferred for the avatar circle)

### `GET /api/stories` (filtered by user — modal)

Same query string plus:

```
&filters[author][id][$eq]=<userId>
```

Both endpoints are public (no auth required).

## Component & File Plan

| File                                     | Role                                                                          |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| `src/services/getStories.ts`             | Fetches all stories or stories by user ID via `apiClient`                     |
| `src/types/stories.ts`                   | TypeScript types for `StoriesResponse`, `StoryAttributes`, `author`, `avatar` |
| `src/hooks/useStories.ts`                | TanStack Query hook — `queryKey: ["stories"]`                                 |
| `src/hooks/useStoriesByUserId.ts`        | TanStack Query hook — `queryKey: ["stories", userId]`                         |
| `src/features/stories/home/index.tsx`    | Maps API response to `StoriesSwiper` props, including avatar URL resolution   |
| `src/features/stories/modal/index.tsx`   | Fullscreen viewer using `react-insta-stories`                                 |
| `src/components/StoriesSwiper/index.tsx` | Renders horizontal avatar strip; falls back to Robohash when `image` is `""`  |

## Acceptance Criteria

- [x] `GET /api/stories` uses nested populate for `avatar` (not scalar field)
- [x] `getStories` and `getStoriesByUserId` use `apiClient` — not bare `axios`
- [x] `StoryAttributes.author.data.attributes` has `avatar` typed correctly
- [x] `StoriesHome` resolves avatar URL: thumbnail → full URL → `""` (Robohash fallback in `StoriesSwiper`)
- [x] Real user photos appear in the "Online agora" strip when the user has an avatar uploaded
- [x] Users without an avatar uploaded show the Robohash placeholder (expected behavior)
- [x] No `console.warn` or `console.log` in `StoriesModal`
- [x] Story viewer auto-closes when all stories end

## Out of Scope

- Adding, deleting, or editing stories (write operations)
- Story expiry / 24-hour TTL (backend concern)
- Story view counts
- "Seen" / "unseen" ring indicator on avatars
- Offline status indicator (`isUserOffline` — still hardcoded `false`)
