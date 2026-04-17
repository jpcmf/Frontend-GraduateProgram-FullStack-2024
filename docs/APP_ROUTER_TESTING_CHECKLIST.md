# App Router Migration: Testing Checklist

Use this checklist to verify each migration phase works correctly before proceeding.

---

## Phase 0: Setup Testing

### Root Layout Renders

- [ ] `npm run dev` starts without errors
- [ ] Homepage (`/`) loads without errors
- [ ] Browser console has no errors/warnings
- [ ] Page title renders correctly
- [ ] Chakra UI styles apply (no unstyled text)

### Providers Initialized

- [ ] Auth context available (no "useAuth hook requires provider" errors)
- [ ] React Query works (no "QueryClient not found" errors)
- [ ] Chakra theme applies globally

### Error Boundary Works

- [ ] Error page exists and is reachable
- [ ] Global error boundary catches errors (test by visiting `/error-test` or similar)

### Not Found Page Works

- [ ] Visiting non-existent route (`/fake-route-xyz`) shows 404 page
- [ ] 404 page is custom (not default Next.js)

### TypeScript & Build

- [ ] `npm run build` completes with 0 errors
- [ ] No TypeScript compilation errors
- [ ] No warnings about unused variables

---

## Phase 1: Public Routes Testing

### Navigation & Routing

- [ ] Can navigate to `/auth/signin`
- [ ] Can navigate to `/auth/signup`
- [ ] Can navigate to `/auth/forgot-password`
- [ ] Can navigate to `/auth/confirmation`
- [ ] Can navigate to `/auth/reset-password`
- [ ] Can navigate to `/spots`
- [ ] Can navigate to `/spots/[id]` (spot details)
- [ ] Can navigate to `/user/[id]` (user profile)

### Auth Pages (Redirect Logged-In Users)

- [ ] Sign in while logged in → redirects to `/` (or dashboard)
- [ ] Sign up while logged in → redirects to `/`
- [ ] Forgot password while logged in → redirects to `/`

### Page Content Loads

- [ ] Spots listing loads data correctly (displays spots)
- [ ] Spot detail page loads individual spot data
- [ ] User profile page loads user data
- [ ] No missing images or broken links
- [ ] Forms render correctly (inputs, buttons visible)

### API Data Fetching

- [ ] Network tab shows successful API requests
- [ ] Data displays without "loading..." state remaining
- [ ] Error messages show if API fails (don't silently fail)

### TypeScript & Build

- [ ] `npm run build` completes with 0 errors
- [ ] No TypeScript errors related to route params or data types

---

## Phase 2: Protected Routes Testing

### Auth Redirect Works

- [ ] Sign out and visit `/spots/new` → redirected to `/auth/signin`
- [ ] Sign out and visit `/spots/[id]/edit` → redirected to `/auth/signin`
- [ ] Sign out and visit `/user/edit` → redirected to `/auth/signin`

### Protected Content Accessible When Authenticated

- [ ] Sign in with valid credentials
- [ ] Visit `/spots/new` → page loads, form visible
- [ ] Visit `/spots/[id]/edit` → page loads, form visible
- [ ] Visit `/user/edit` → page loads, form visible
- [ ] Can interact with forms (click buttons, type in fields)

### Protected Layout Auth Check

- [ ] Protected layout uses `'use client'` directive
- [ ] Protected layout checks `useAuth()` hook
- [ ] Protected layout redirects to signin if no token
- [ ] Protected layout shows loading state while checking auth
- [ ] Protected layout renders children when authenticated

### Form Submissions (Protected Pages)

- [ ] Create spot form submits successfully
- [ ] Edit spot form submits successfully
- [ ] User edit form submits successfully
- [ ] Success/error messages display
- [ ] Form state clears after successful submission

### Session Management

- [ ] Sign in, access protected route, then sign out
- [ ] After sign out, protected routes redirect to signin
- [ ] Token is removed from cookies after logout
- [ ] No "stale" data displayed after logout

### TypeScript & Build

- [ ] `npm run build` completes with 0 errors
- [ ] No TypeScript errors in protected layout or pages

---

## Phase 3: API Routes Testing

### Send Confirmation Email API

- [ ] `curl -X POST http://localhost:3000/api/send-confirmation-email -H "Content-Type: application/json" -d '{"email":"test@example.com"}'`
- [ ] Returns 200 status code
- [ ] Email service called (check logs or mock)
- [ ] Invalid requests return appropriate error codes

### Sitemap API

- [ ] `curl http://localhost:3000/api/sitemap`
- [ ] Returns 200 status code
- [ ] Returns valid XML (not HTML or JSON)
- [ ] Contains expected URLs
- [ ] Header `Content-Type: application/xml` or `text/xml`

### Error Handling

- [ ] Malformed requests return 400
- [ ] Missing required fields return 400
- [ ] Unauthorized requests return 401 (if applicable)
- [ ] Server errors return 500

### TypeScript & Build

- [ ] `npm run build` completes with 0 errors
- [ ] No TypeScript errors in API routes

---

## Phase 4: Cleanup Testing

### Pages Router Deleted

- [ ] `src/pages/` directory no longer exists
- [ ] `src/middleware.ts` no longer exists
- [ ] No files reference deleted directories

### All Routes Still Work

- [ ] Public routes work (auth, spots, users)
- [ ] Protected routes require auth
- [ ] API routes respond correctly

### Build & Deployment

- [ ] `npm run build` completes with 0 errors and 0 warnings
- [ ] Build output size is reasonable (check `.next/`)
- [ ] `npm run dev` starts without errors
- [ ] No console errors or warnings on any page

### Full Routing Smoke Test

- [ ] `/` (home) loads
- [ ] `/auth/signin` loads
- [ ] `/spots` loads
- [ ] `/spots/[id]` loads with real spot data
- [ ] `/user/[id]` loads with real user data
- [ ] `/spots/new` (protected) requires auth
- [ ] `/user/edit` (protected) requires auth
- [ ] `/fake-route` shows 404

---

## Full Integration Testing (Post-Migration)

### Complete Auth Flow

1. [ ] Start logged out
2. [ ] Visit `/auth/signin`
3. [ ] Enter credentials
4. [ ] Click "Sign In"
5. [ ] Redirected to home or dashboard
6. [ ] Auth token in cookies
7. [ ] Can access protected routes
8. [ ] Click "Sign Out"
9. [ ] Redirected to signin
10. [ ] Cannot access protected routes
11. [ ] Auth token removed from cookies

### Data Consistency

- [ ] Spots data matches backend
- [ ] User data matches backend
- [ ] Profile info matches signed-in user
- [ ] Created/edited data persists across page reloads

### Performance

- [ ] Pages load quickly (< 2 seconds)
- [ ] Forms respond immediately to input
- [ ] No layout shift or visual flashing
- [ ] Images load without alt-text errors

### Accessibility

- [ ] Forms are keyboard navigable
- [ ] Buttons have focus indicators
- [ ] No console a11y warnings
- [ ] Links and buttons have descriptive labels

### Browser Compatibility

- [ ] Works in Chrome/Edge (latest)
- [ ] Works in Firefox (latest)
- [ ] Works in Safari (latest)
- [ ] Mobile responsive (test at 375px width)

---

## Automated Tests (If Available)

- [ ] Run test suite: `npm test`
- [ ] All tests pass
- [ ] No flaky tests
- [ ] Coverage maintained or improved

---

## Lighthouse Audit

Run after cleanup phase:

```bash
npm run build
npm run start
# In another terminal:
# Use Chrome DevTools Lighthouse tab or:
# npx lighthouse http://localhost:3000
```

Check:

- [ ] Performance score >= 80 (or no regression)
- [ ] Accessibility score >= 90
- [ ] Best Practices score >= 90
- [ ] SEO score >= 90

---

## Manual Regression Testing

Test these flows that might be affected by migration:

### Authentication

- [ ] Sign up works
- [ ] Email confirmation works
- [ ] Forgot password works
- [ ] Reset password works
- [ ] Sign in/out work
- [ ] Token refresh works

### Spots

- [ ] View all spots
- [ ] View spot details
- [ ] Create new spot (protected)
- [ ] Edit spot (protected)
- [ ] Delete spot (protected)
- [ ] Search/filter spots (if applicable)

### Users

- [ ] View user profile
- [ ] View own profile
- [ ] Edit profile (protected)
- [ ] Upload avatar (if applicable)

### General

- [ ] Navigation works
- [ ] Breadcrumbs correct (if present)
- [ ] Pagination works (if present)
- [ ] Error messages display
- [ ] Loading states show
- [ ] Empty states display

---

## Known Issues to Watch For

| Issue                                          | Phase | Symptom                          | Solution                                                      |
| ---------------------------------------------- | ----- | -------------------------------- | ------------------------------------------------------------- |
| Protected layout missing `'use client'`        | 2     | "useAuth not available" error    | Add `'use client'` to protected layout                        |
| Auth check in layout causes hydration mismatch | 2     | "Hydration failed" console error | Ensure loading state and null return before auth token exists |
| Dynamic routes `[id]` params undefined         | 1     | 404 or param is undefined        | Ensure route structure matches: `/spots/[id]/page.tsx`        |
| API route methods not exported                 | 3     | 405 Method Not Allowed           | Export `async function POST()`, `GET()`, etc.                 |
| Middleware not deleted                         | 4     | Conflicting auth logic           | Delete `src/middleware.ts` after moving logic to layouts      |

---

## When to Proceed to Next Phase

Only proceed when:

- [ ] All tests in this section pass
- [ ] No console errors or warnings
- [ ] `npm run build` succeeds with 0 errors
- [ ] Code review approved (if applicable)
- [ ] No known issues from "Known Issues to Watch For" table

If any check fails, review the "Known Issues" section and troubleshooting guide before proceeding.
