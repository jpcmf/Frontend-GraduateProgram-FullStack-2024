# Feature: Migrate Next.js Pages Router to App Router

**Status:** ready
**Priority:** high
**Affects:** All pages, routing, middleware, layout system, API routes
**Effort Estimate:** 12-16 hours (phased over multiple sessions)

## Problem Statement

The current Pages Router (Next.js 12-style) is approaching EOL and lacks modern features like Server Components, streaming, and built-in layouts. App Router provides:

- Better code organization with route groups and layouts
- Server Components by default (30-40% less client JS)
- Improved data fetching patterns
- Better error handling
- Future-proof for React 19+ features

The SkateHub frontend is ready for this migration: no Pages Router-specific features block migration, tech stack is fully compatible, and incremental migration strategy allows coexistence during transition.

## UI / UX Description

**No user-facing changes.** The migration is a structural refactor:

- All routes continue working identically
- Route URLs remain unchanged
- Authentication flows unchanged
- Data fetching unchanged
- Visual appearance unchanged

This is a **technical debt elimination** and **infrastructure modernization**, not a feature addition.

## Data Requirements

No new data requirements. Same API endpoints continue being used via `src/lib/apiClient.ts`.

## Current Architecture (Pages Router)

```
src/pages/
├── _app.tsx                    (root providers: Auth, Query, Chakra)
├── index.tsx                   (home page)
├── auth/
│   ├── signin.tsx             (login page)
│   ├── signup.tsx             (sign up page)
│   ├── forgot-password.tsx    (forgot password)
│   ├── confirmation.tsx       (email confirmation)
│   └── reset-password.tsx     (password reset)
├── spots/
│   ├── index.tsx              (spots listing)
│   ├── [id].tsx               (spot details)
│   ├── [id]/edit.tsx          (spot edit - protected)
│   └── new.tsx                (create spot - protected)
├── user/
│   ├── [id].tsx               (user profile)
│   └── edit.tsx               (user settings - protected)
├── 404.tsx                     (custom 404)
├── 500.tsx                     (custom error page)
└── api/
    ├── sendConfirmationEmail.ts
    └── sitemap.ts

src/middleware.ts
├── Pure auth check (redirects unauthenticated from protected routes)
├── Protected routes: /dashboard, /user/edit, /spots/new, /spots/:id/edit
└── Uses auth.token cookie

src/app/ (currently empty in Pages Router)
```

## Target Architecture (App Router)

```
src/app/
├── layout.tsx                 (root layout - replaces _app.tsx providers)
├── error.tsx                  (global error boundary)
├── not-found.tsx              (404 page)
├── page.tsx                   (home page)
├── (public)/                  (route group - public pages)
│   ├── layout.tsx             (public layout - no auth required)
│   ├── auth/
│   │   ├── layout.tsx         (auth layout - redirect if already logged in)
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── confirmation/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   └── spots/
│       ├── page.tsx           (listing)
│       ├── [id]/
│       │   └── page.tsx       (detail)
│       └── user/
│           └── [id]/
│               └── page.tsx   (user profile)
├── (protected)/               (route group - requires auth)
│   ├── layout.tsx             (auth check - redirects if not logged in)
│   ├── dashboard/
│   │   └── page.tsx           (if exists - future dashboard)
│   ├── spots/
│   │   ├── new/
│   │   │   └── page.tsx       (create)
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx   (edit)
│   └── user/
│       └── edit/
│           └── page.tsx       (settings)
└── api/
    ├── send-confirmation-email/
    │   └── route.ts
    └── sitemap/
        └── route.ts

src/middleware.ts              (DELETED - logic moved to layouts)
```

## Component & File Plan

### Phase 0: Setup (1-2 hours)

**Deliverables:**

- Root layout with providers
- Global error boundary
- Not-found page
- Tailwind CSS verification

**Files to Create:**

1. `src/app/layout.tsx` — Root layout (replaces `_app.tsx`)
   - Imports Auth provider, Query provider, Chakra provider
   - Sets up HTML/body structure
   - Adds metadata

2. `src/app/error.tsx` — Global error boundary
   - Catches errors in any route
   - Shows error UI with recovery option

3. `src/app/not-found.tsx` — Custom 404
   - Moved from `pages/404.tsx`

4. `src/app/page.tsx` — Home page
   - Moved from `pages/index.tsx`

**Files to Modify:**

- None (setup phase is additive)

**Files to Delete:**

- Not yet (kept until all routes migrated)

---

### Phase 1: Public Routes (2-3 hours)

**Deliverables:**

- All public pages working in App Router
- Auth pages prevent logged-in access

**Files to Create:**

1. `src/app/(public)/layout.tsx` — Public route group layout

2. `src/app/(public)/auth/layout.tsx` — Auth layout
   - Check if user is logged in
   - If yes, redirect to `/dashboard` or `/`
   - If no, allow access

3. `src/app/(public)/auth/signin/page.tsx`
   - Converted from `pages/auth/signin.tsx`

4. `src/app/(public)/auth/signup/page.tsx`
   - Converted from `pages/auth/signup.tsx`

5. `src/app/(public)/auth/forgot-password/page.tsx`
   - Converted from `pages/auth/forgot-password.tsx`

6. `src/app/(public)/auth/confirmation/page.tsx`
   - Converted from `pages/auth/confirmation.tsx`

7. `src/app/(public)/auth/reset-password/page.tsx`
   - Converted from `pages/auth/reset-password.tsx`

8. `src/app/(public)/spots/page.tsx`
   - Converted from `pages/spots/index.tsx`

9. `src/app/(public)/spots/[id]/page.tsx`
   - Converted from `pages/spots/[id].tsx`

10. `src/app/(public)/user/[id]/page.tsx`
    - Converted from `pages/user/[id].tsx`

**Conversion Pattern (getServerSideProps → Async Component):**

Before (Pages Router):

```typescript
// pages/spots/index.tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  const spots = await fetchSpots();
  return { props: { spots } };
};

export default function SpotsPage({ spots }: { spots: Spot[] }) {
  return <div>{spots.map(spot => <div key={spot.id}>{spot.name}</div>)}</div>;
}
```

After (App Router):

```typescript
// app/(public)/spots/page.tsx
export default async function SpotsPage() {
  const spots = await fetchSpots();
  return <div>{spots.map(spot => <div key={spot.id}>{spot.name}</div>)}</div>;
}
```

**Client Components:**

- Any component with `'use client'` directive (hooks, event handlers)
- Form components, client-side query hooks still use `'use client'`

---

### Phase 2: Protected Routes (3-4 hours)

**Deliverables:**

- Protected route group functional
- Auth middleware logic moved to layout
- Users redirected to signin when accessing protected routes without auth

**Files to Create:**

1. `src/app/(protected)/layout.tsx` — Protected route group layout
   - Check `useAuth()` hook for `auth.token`
   - If not authenticated, redirect to `/auth/signin`
   - If authenticated, render children
   - This replaces all logic from `src/middleware.ts`

2. `src/app/(protected)/spots/new/page.tsx`
   - Converted from `pages/spots/new.tsx`

3. `src/app/(protected)/spots/[id]/edit/page.tsx`
   - Converted from `pages/spots/[id]/edit.tsx`

4. `src/app/(protected)/user/edit/page.tsx`
   - Converted from `pages/user/edit.tsx`

**Auth Check Pattern (Protected Layout):**

```typescript
// app/(protected)/layout.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { auth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !auth.token) {
      router.push('/auth/signin');
    }
  }, [auth.token, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!auth.token) {
    return null; // Prevent flash of protected content
  }

  return children;
}
```

---

### Phase 3: API Routes (0.5-1 hour)

**Deliverables:**

- API routes working with new route handlers
- Same endpoint structure maintained

**Files to Create:**

1. `src/app/api/send-confirmation-email/route.ts`
   - Converted from `pages/api/sendConfirmationEmail.ts`
   - HTTP method handlers: `POST`

2. `src/app/api/sitemap/route.ts`
   - Converted from `pages/api/sitemap.ts`
   - HTTP method handler: `GET`

**Conversion Pattern (Pages API Route → App Router Route Handler):**

Before (Pages Router):

```typescript
// pages/api/sendConfirmationEmail.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // handle POST
    res.status(200).json({ success: true });
  }
}
```

After (App Router):

```typescript
// app/api/send-confirmation-email/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // handle POST
  return NextResponse.json({ success: true });
}
```

---

### Phase 4: Cleanup (0.5-1 hour)

**Deliverables:**

- All code migrated to App Router
- Pages Router entirely removed
- Middleware removed

**Files to Delete:**

1. `src/pages/` — Entire directory (40+ files)
2. `src/middleware.ts` — Auth logic now in `(protected)/layout.tsx`

**Files to Update:**

1. `next.config.ts` — Remove any Pages Router-specific config (if any)
2. `.gitignore` — No changes needed
3. `tsconfig.json` — No changes needed
4. `package.json` — No changes needed (already on Next.js 14+)

---

## Acceptance Criteria

- [ ] Phase 0: Root layout + error boundary + not-found page rendering correctly
- [ ] Phase 0: No TypeScript errors after adding `src/app/layout.tsx`
- [ ] Phase 0: `npm run build` succeeds with 0 errors
- [ ] Phase 1: All public pages (auth, spots, users) accessible at correct routes
- [ ] Phase 1: Auth pages prevent logged-in users from accessing (redirect to home)
- [ ] Phase 1: All data fetches return expected data (no 404s or API errors)
- [ ] Phase 1: Forms work correctly (still client-side form state)
- [ ] Phase 2: Protected routes redirect unauthenticated users to `/auth/signin`
- [ ] Phase 2: Protected routes allow authenticated users to access content
- [ ] Phase 2: Creating/editing spots works with auth checks
- [ ] Phase 2: User settings page requires auth
- [ ] Phase 3: API routes respond to requests correctly
- [ ] Phase 3: `POST /api/send-confirmation-email` sends emails
- [ ] Phase 3: `GET /api/sitemap` returns valid XML
- [ ] Phase 4: All `pages/` and `middleware.ts` deleted successfully
- [ ] Phase 4: No broken imports or references to deleted files
- [ ] Full Build: `npm run build` completes with 0 errors and 0 warnings
- [ ] Full Build: `npm run dev` starts without errors
- [ ] Full Routing: All routes accessible and functional
- [ ] Full Auth: Sign in, sign out, protected route access all work
- [ ] Bundle Size: No regression in client-side JavaScript (should improve ~30-40%)

---

## Testing Strategy

### Phase Testing (After Each Phase)

1. **Manual Route Testing:**
   - Visit each new route in browser
   - Verify page renders without errors
   - Check console for warnings/errors

2. **Functional Testing:**
   - Authenticate and test protected routes
   - Test form submissions
   - Test error states

3. **Build Testing:**
   - Run `npm run build` after each phase
   - Verify no TS errors
   - Check bundle size hasn't regressed

### Full Integration Testing (After Cleanup)

1. **Routing Smoke Test:**
   - All public routes accessible
   - All protected routes require auth
   - Auth redirects work

2. **Auth Flow Test:**
   - Sign in → protected route accessible
   - Sign out → protected route redirects to signin
   - Invalid token → redirects to signin

3. **API Test:**
   - All API routes respond correctly
   - Error handling works

4. **Performance Test:**
   - Bundle size analysis
   - Lighthouse scores
   - No regressions in Core Web Vitals

---

## Rollback Plan

At any point during migration, if blockers arise:

1. **Before Cleanup Phase:**
   - Delete `src/app/` directory
   - Both routers coexist—Pages Router still functional
   - No code deleted yet—complete rollback

2. **After Cleanup Phase:**
   - Restore from git: `git revert <cleanup-commit>`
   - If major issues, can revert entire feature branch

3. **Rollback Checklist:**
   - Restore `src/pages/` from git
   - Restore `src/middleware.ts` from git
   - Delete `src/app/` directory
   - Restart `npm run dev`
   - Verify old routes work again

---

## Risk Mitigation

| Risk                                                         | Likelihood | Impact   | Mitigation                                                 |
| ------------------------------------------------------------ | ---------- | -------- | ---------------------------------------------------------- |
| Auth layout check fails, users can't access protected routes | Medium     | High     | Test auth flow extensively in Phase 2 before cleanup       |
| Dynamic routes `[id]` break with new file structure          | Low        | High     | Verify dynamic routing works after Phase 1                 |
| API routes return wrong status codes                         | Low        | Medium   | Test all API routes in Phase 3 before cleanup              |
| Middleware removal causes route redirects to fail            | Medium     | High     | Implement all layout-based auth before deleting middleware |
| Build fails after cleanup                                    | Low        | Critical | Run `npm run build` after each phase                       |
| Third-party package incompatibilities                        | Very Low   | High     | All packages verified as compatible beforehand             |

---

## Out of Scope

- Rewriting components in React Server Components (optional optimization post-migration)
- Changing API endpoints or data models
- UI/UX changes or redesigns
- Performance optimizations beyond what App Router provides naturally
- Turbopack production builds (still in beta—continue using Webpack)
- Middleware for request rewriting (future feature if needed)

---

## Success Criteria

- All routes accessible and functional
- No errors in browser console
- Auth flows working (login, logout, protected access)
- `npm run build` completes with 0 errors
- Bundle size maintained or improved (expected: ~30-40% reduction)
- No user-facing changes (technical refactor only)
- Feature branch can be merged to main
- Pages Router entirely removed from codebase

---

## Timeline

| Phase                     | Duration   | Cumulative      |
| ------------------------- | ---------- | --------------- |
| Phase 0: Setup            | 1-2 hours  | 1-2 hours       |
| Phase 1: Public Routes    | 2-3 hours  | 3-5 hours       |
| Phase 2: Protected Routes | 3-4 hours  | 6-9 hours       |
| Phase 3: API Routes       | 0.5-1 hour | 6.5-10 hours    |
| Phase 4: Cleanup          | 0.5-1 hour | 7-11 hours      |
| **Buffer & Testing**      | 2-5 hours  | **12-16 hours** |

---

## Implementation Notes & Dev Workflow

### Before Starting

- Create feature branch: `git checkout -b feat/app-router-migration`
- Start dev server: `pnpm dev` (leave running during all phases)

### During Each Phase

- **DO NOT run `npm run build`** (too slow, 2-5 minutes)
- **Use `pnpm dev` for instant validation** (<30 seconds)
- Check browser at http://localhost:3000 for visual verification
- Watch console for errors/warnings in dev server
- TypeScript errors appear immediately when files are saved

### After Each Phase

1. Manual testing in browser (click routes, interact with components)
2. Run quick validation: `bash scripts/validate-dev.sh`
3. Run `npm run build` (final check before commit)
4. Run `pnpm format` at the end of each phase
5. Commit with clear message

### Notes

- Keep `src/pages/` and `src/app/` both present until Phase 4
- TypeScript strict mode already enabled—catches errors automatically
- Path aliases (`@/*`) work automatically in App Router
- Both routers coexist safely until cleanup phase
