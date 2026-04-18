# Technical Analysis — SkateHub Frontend

> Stack: Next.js 16 (Pages Router) · React 19 · TypeScript · Chakra UI 2 · Strapi (auth + API)
> Date: April 2026 · Last updated: April 16, 2026 (reCAPTCHA timeout fix completed, SpotDetail redesign completed)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Critical Bug: JWT Token Expiry — Root Cause & Fix](#2-critical-bug-jwt-token-expiry--root-cause--fix)
3. [Security Issues](#3-security-issues)
4. [Bugs and Edge Cases](#4-bugs-and-edge-cases)
5. [Performance Improvements](#5-performance-improvements)
6. [Best Practice Violations](#6-best-practice-violations)
7. [Recommended Auth Architecture](#7-recommended-auth-architecture)
8. [Implementation Roadmap](#8-implementation-roadmap)
9. [Stories Feature — Implementation Notes](#9-stories-feature--implementation-notes)
10. [Spots Feature — Implementation Notes](#10-spots-feature--implementation-notes)
11. [Recent Improvements (April 14, 2026)](#11-recent-improvements-april-14-2026)

---

## 1. Architecture Overview

### Auth System

> ✅ The dead NextAuth system was removed in PR #147. The codebase now has a single auth system.

| System                 | Files                                                                          | Status                        |
| ---------------------- | ------------------------------------------------------------------------------ | ----------------------------- |
| **Custom cookie auth** | `src/contexts/AuthContext.tsx`, `src/services/auth.ts`, `src/lib/apiClient.ts` | Active — the only auth system |

### Token Lifecycle (current state after PR #146)

```
User submits login form
  → POST /api/auth/local  (Strapi)
  → receives { user, jwt }
  → setCookie("auth.token", jwt, { maxAge: 3600, secure, sameSite: lax, path: / })
  → setUser(user), setToken(jwt)
  → Router.push("/")

Page load
  → parseCookies()  ← reads auth.token
  → if present: await userMe(token) to hydrate user  ← properly awaited
  → if userMe throws: signOut()

While session is active
  → apiClient request interceptor attaches Bearer token from cookie automatically
  → apiClient response interceptor: on 401 → destroyCookie → Router.replace(/auth/signin)
  → setInterval (5s): checks cookie presence → signOut if cookie gone
  → visibilitychange: re-checks cookie when tab regains focus → signOut if cookie gone
```

### Route Protection

```
Protected pages: /dashboard, /user/edit, /spots/new, /spots/:id/edit
  → guarded by middleware.ts (checks cookie presence)

Auth pages: /auth/signin, /auth/signup, /auth/forgot-password, /auth/reset-password
  → guarded by redirectIfAuthenticated utility

Completely unguarded: /, /skatistas, /general, /spots, /spots/[id], /user/[id]
```

---

## 2. Critical Bug: JWT Token Expiry — Root Cause & Fix

> ✅ **RESOLVED in PR #146**

### Root Cause Analysis

The problem has **three compounding layers**:

#### Layer 1 — Race between cookie expiry and in-memory state

`AuthContext` stores the user and token in React state. When the browser deletes the expired cookie (after 1 hour), the React state is NOT cleared. The component that holds `user` and `token` is still alive, so `isAuthenticated` remains `true` and the UI continues to show as logged in.

```ts
// AuthContext.tsx — useEffect runs only once on mount
useEffect(() => {
  const { "auth.token": token } = parseCookies(); // ← only checked at startup
  // ...
}, []); // ← empty dependency array = never re-runs
```

#### Layer 2 — No 401 interceptor

All service files pass the stale in-memory token directly to Axios without any error handling at the HTTP layer:

```ts
// services/auth.ts — every authenticated request looks like this
const res = await axios.get(`${API}/api/users/me`, {
  headers: { Authorization: `Bearer ${token}` } // ← no interceptor to catch 401
});
```

When Strapi returns `401 Unauthorized` (expired JWT), the error bubbles up to each individual call site. Some call sites have no `.catch()` at all (e.g., `uploadAvatar.ts` has a `catch` that just `console.log`s and returns `undefined` silently).

#### Layer 3 — `getServerSideProps` only checks cookie presence

The server-side guard on `/dashboard` checks whether the cookie exists, not whether the token is valid:

```ts
// pages/dashboard.tsx
export const getServerSideProps = async ctx => {
  const { "auth.token": token } = parseCookies(ctx);
  if (!token) {
    /* redirect */
  }
  // ← No call to Strapi to verify the token is still valid
  return { props: {} };
};
```

After cookie expiry, this correctly redirects the user. But during the valid window (while inside the app), if the token expires mid-session, there is no mechanism to detect and recover.

### Fix Strategy

**Recommended: Axios interceptor + `signOut` on 401**

This is the minimal-change, highest-impact fix. It requires changes to two files.

#### Step 1 — Create a centralized Axios instance (`src/lib/apiClient.ts`)

```ts
import axios from "axios";
import { destroyCookie, parseCookies } from "nookies";
import Router from "next/router";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL
});

// Attach token from cookie before every request
apiClient.interceptors.request.use(config => {
  if (typeof window !== "undefined") {
    const { "auth.token": token } = parseCookies();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally — clear auth state and redirect
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      destroyCookie(undefined, "auth.token");
      // Force a full-page reload to clear React state
      Router.replace("/auth/signin");
    }
    return Promise.reject(error);
  }
);
```

#### Step 2 — Use `apiClient` in all service files

Replace all direct `axios` imports in `src/services/` with `apiClient`:

```ts
// src/services/auth.ts — before
import axios from "axios";
const res = await axios.get(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } });

// After
import { apiClient } from "@/lib/apiClient";
const res = await apiClient.get("/api/users/me"); // token attached automatically by interceptor
```

Files to update:

- `src/services/auth.ts` — `userMe`, `updateUserProfile`
- `src/services/uploadAvatar.ts`
- `src/services/linkAvatar.ts`

#### Step 3 — Poll the cookie and react to tab focus from `AuthContext`

Two guards are used together to cover all cookie-removal scenarios:

- **`setInterval` (5 s)** — catches expiry or manual deletion while the tab is active and in focus
- **`visibilitychange` listener** — catches expiry that happened while the tab was backgrounded

```ts
useEffect(() => {
  const checkCookie = () => {
    const { "auth.token": cookieToken } = parseCookies();
    if (!cookieToken && user) {
      setUser(null);
      setToken(null);
      destroyCookie(undefined, "auth.token", { path: "/" });
      Router.push("/auth/signin");
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") checkCookie();
  };

  const intervalId = setInterval(checkCookie, 5000);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    clearInterval(intervalId);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [user]);
```

> **Important:** `destroyCookie` must be called with `{ path: "/" }` to match the `path` used when the cookie was set. Without it, the browser silently ignores the deletion — see [B-7](#b-7-destroycookie-missing-path--logout-does-not-clear-cookie).

#### Step 4 (Optional) — Silent token refresh

Strapi v4+ does not natively issue refresh tokens with the default JWT provider. If you want silent refresh, you have two options:

**Option A — Extend the JWT expiry in Strapi**
In Strapi's `config/plugins.js`, increase JWT token TTL to match your UX expectations (e.g., 7 days). The cookie `maxAge` in the frontend should match.

```ts
// src/contexts/AuthContext.tsx
setCookie(undefined, "auth.token", jwt, {
  maxAge: 60 * 60 * 24 * 7, // 7 days — must match Strapi JWT TTL
  httpOnly: false, // must be false for nookies client-side reads
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/"
});
```

**Option B — Implement a Strapi custom refresh endpoint**
Requires backend changes. A custom `/api/auth/refresh` route accepts a valid (non-expired) JWT and returns a new one. This is more complex and only worth it for long-lived sessions.

---

## 3. Security Issues

> PRs #146 and #147 resolved all items in this section.

### [CRITICAL] S-1: reCAPTCHA Secret Key Exposed in Client Bundle — ✅ FIXED (PR #147)

**File:** `.env.local`

```
NEXT_PUBLIC_RECAPTCHA_SECRET_KEY=6Ldat98r...  ← NEXT_PUBLIC_ prefix embeds this in JS bundle
```

The `NEXT_PUBLIC_` prefix causes Next.js to inline this value into every page's JavaScript. Any user can open DevTools and read it. The secret key must **never** leave the server — strip the prefix and use it only in API routes.

```
# .env.local — fix
RECAPTCHA_SITE_KEY=6Ldat98r...      # public, safe to expose
RECAPTCHA_SECRET_KEY=6Ldat98r...    # server-only, no NEXT_PUBLIC_ prefix
```

### [HIGH] S-2: Auth Cookie Missing Security Flags — ✅ FIXED (PR #147)

**File:** `src/contexts/AuthContext.tsx:86`

```ts
setCookie(undefined, "auth.token", jwt, {
  maxAge: 60 * 60 * 1
  // ← no httpOnly, no secure, no sameSite, no path
});
```

The cookie is readable by JavaScript, which means any XSS vulnerability in the app or a third-party script can steal the JWT.

**Fix:**

```ts
setCookie(undefined, "auth.token", jwt, {
  maxAge: 60 * 60 * 1,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/"
});
```

Note: `httpOnly: true` cannot be used with `nookies`-based client-side reads via `parseCookies()`. To use `httpOnly`, you must set the cookie exclusively via a Next.js API route (so only the server reads it) and pass the token to the client via `getServerSideProps` props. This is a bigger architectural change covered in [Section 7](#7-recommended-auth-architecture).

### [HIGH] S-3: Dead NextAuth Endpoint is Live — ✅ FIXED (PR #147)

**File:** `src/pages/api/auth/[...nextauth].ts`

This handler responds at `/api/auth/csrf`, `/api/auth/session`, `/api/auth/providers`, etc. None of these are used by your UI, but they are active and accept public traffic. Leaving an unused authentication endpoint alive increases attack surface.

**Fix applied:** Deleted `src/pages/api/auth/[...nextauth].ts` and `src/types/next-auth.d.ts`. The `next-auth` package remains in `package.json` but is no longer referenced anywhere in the codebase and can be removed in a future cleanup.

### [MEDIUM] S-4: Email API Route — Host Header Spoofing — ✅ FIXED (PR #147)

**File:** `src/pages/api/sendConfirmationEmail.ts`

The endpoint previously checked:

```ts
req.headers.host.startsWith(NODEMAILER_REQUEST_SERVER);
// where NODEMAILER_REQUEST_SERVER = "localhost"
```

This provided false security — the `Host` header can be overridden by a malicious proxy or spoofed in some CDN configurations. More fundamentally, since the caller is client-side JavaScript (`confirmation.tsx`), any origin restriction at the HTTP level is meaningless.

**Fix applied:** Removed the Host header check entirely. Added server-side email format validation as the actual security boundary. The `NODEMAILER_REQUEST_SERVER` constant was removed from `constant.ts` and `.env.local`.

### [MEDIUM] S-5: `/auth/confirmation` Accepts Unvalidated Email from URL — ✅ FIXED (PR #147)

**File:** `src/pages/auth/confirmation.tsx`

The page reads `router.query.email` and used it directly to call the email notification API without any validation.

**Fix applied:** `sendConfirmationEmail.ts` now validates `userEmail` via regex before processing. Invalid or missing values return a `400` immediately.

### [LOW] S-5b: `/auth/confirmation` Breaks for Emails Containing `+` — ✅ FIXED

**Files:** `src/app/(public)/auth/confirmation/page.tsx`, Strapi `src/extensions/users-permissions/strapi-server.js`

The Strapi `emailConfirmation` controller built the redirect URL by concatenating `user.email` without encoding it:

```
settings.email_confirmation_redirection + "?email=" + user.email
```

A `+` in the email address (e.g. `user+tag@example.com`) was treated as a space by `URLSearchParams` / `useSearchParams().get()` on the frontend, causing the regex validation in `/api/sendConfirmationEmail` to reject the request with a 400.

**Fix applied (Strapi):** `encodeURIComponent(user.email)` now encodes the email before appending it to the redirect URL, so `+` becomes `%2B`.

**Fix applied (Frontend):** `confirmation/page.tsx` now extracts the `email` parameter directly from `window.location.search` using a regex + `decodeURIComponent`, bypassing `useSearchParams().get()` which silently converts `+` to a space regardless of encoding.

### [LOW] S-6: `console.log` with API Response Data in Production — ✅ FIXED (PR #146)

**Files:** `src/services/uploadAvatar.ts`, `src/services/linkAvatar.ts`

**Fix applied:** All `console.log` calls removed from both service files as part of the apiClient migration.

### [LOW] S-7: `.gitignore` — Verify `.env.local` is Excluded — ✅ CONFIRMED SAFE

The `.env*.local` pattern in `.gitignore` covers `.env.local`. Confirmed that the file has never been committed to the repository.

---

## 4. Bugs and Edge Cases

### B-1: `isLoading` Race Condition on Auth Init — ✅ FIXED (PR #146)

**File:** `src/contexts/AuthContext.tsx:66-73`

```ts
try {
  setToken(token);
  userMe(token)          // ← async, not awaited
    .then(response => {
      setUser(...)
    })
    .catch(() => {
      signOut();
    });
} catch (error) {        // ← this catch never fires for userMe rejections
  signOut();
} finally {
  setIsLoading(false);   // ← fires BEFORE userMe resolves
}
```

`setIsLoading(false)` executes before `userMe()` completes because the promise is not awaited. The `dashboard.tsx` page renders `<Spinner>` while `isLoading || !user`, so it may flash the spinner unnecessarily — but worse, there is a window where `isLoading === false` and `user === null` simultaneously, which could affect any conditional UI that checks both.

**Fix:** Await the promise properly:

```ts
try {
  setToken(token);
  const userData = await userMe(token);
  setUser(/* normalize userData */);
} catch {
  signOut();
} finally {
  setIsLoading(false);
}
```

### B-2: `signOut` During Rendering (StrictMode Edge Case)

**File:** `src/contexts/AuthContext.tsx:66`

`signOut()` is called from within the `useEffect` callback. `signOut()` calls `Router.push("/auth/signin")`. In React 18 StrictMode with concurrent rendering, `useEffect` runs twice on mount for development. This can cause a double-redirect in development but should not affect production builds.

### B-3: `uploadAvatar` Silently Returns `undefined` on Error — ✅ FIXED (PR #146)

**File:** `src/services/uploadAvatar.ts`

```ts
} catch (error) {
  console.log(error);
  // ← returns undefined implicitly
}
```

Any caller checking the returned value for success will silently get `undefined` instead of an error, making failures invisible to the user.

**Fix:** Re-throw the error so the caller can handle it:

```ts
} catch (error) {
  throw error;
}
```

### B-4: `updateUserProfile` Sends `category.id` but Type Expects `Category` Object

**File:** `src/services/auth.ts:64`

```ts
const payload = {
  category: data.category.id // ← sends number
  // ...
};
```

But the `UpdateUserData` type says `category: Category` (an object). The Strapi API likely accepts either, but the type is misleading and will cause a TypeScript error if strict mode is enforced.

### B-5: `getServerSideProps` Using `any` Type

**File:** `src/pages/user/edit.tsx:9`

```ts
export const getServerSideProps = async (ctx: any) => {
```

This bypasses TypeScript. Use `GetServerSidePropsContext` as done in `dashboard.tsx`.

### B-6: `AuthContext` Created Without Default Values

**File:** `src/contexts/AuthContext.tsx:31`

```ts
export const AuthContext = createContext({} as AuthContextType);
```

Using `{}` cast to `AuthContextType` means any consumer that is rendered outside `AuthProvider` will access `undefined` properties without a runtime error. This makes bugs silent during testing.

**Fix:** Provide explicit default no-ops:

```ts
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
  signIn: async () => {},
  signOut: () => {},
  updateUser: async () => {}
});
```

> ✅ **FIXED** — The default context value in `AuthContext.tsx` was updated to use explicit no-ops. (Spots feature branch)

### B-7: `destroyCookie` Missing `path` — Logout Does Not Clear Cookie — ✅ FIXED (feat/spots)

**File:** `src/contexts/AuthContext.tsx`

`destroyCookie` was called without the `{ path: "/" }` option in two places:

```ts
// signOut() — before fix
destroyCookie(undefined, "auth.token");

// checkCookie() polling useEffect — before fix
destroyCookie(undefined, "auth.token");
```

When a browser cookie is set with an explicit `path` attribute (e.g., `path=/`), the browser only accepts a deletion (`Set-Cookie: auth.token=; maxAge=-1`) if the deletion request includes the same `path`. Without it, the deletion header does not match the existing cookie and the browser silently keeps it. The result: pressing Logout appeared to work in the UI (React state was cleared) but the `auth.token` cookie persisted in the browser. On the next page load, `parseCookies()` found the cookie, `userMe()` was called with the still-valid JWT, and the user was treated as logged in again.

**Why it wasn't caught in Playwright tests:** Playwright manages cookies in an isolated context. `document.cookie` manipulation in tests may not enforce `path` matching the same way a real browser does. The bug only manifests in a real browser session.

**Fix applied:**

```ts
// signOut()
destroyCookie(undefined, "auth.token", { path: "/" });

// checkCookie() polling useEffect
destroyCookie(undefined, "auth.token", { path: "/" });
```

Both calls now match the `path: "/"` set during `signIn()` via `setCookie`.

---

## 5. Performance Improvements

### P-1: `QueryClient` Missing Global Configuration

**File:** `src/components/QueryProvider/index.tsx`

```ts
const [queryClient] = useState(() => new QueryClient());
```

No `defaultOptions` are set. On errors (including 401s), TanStack Query will retry 3 times by default, which means a failing authenticated request will produce 3 identical API calls before giving up.

**Fix:**

```ts
const [queryClient] = useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
          retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) return false; // don't retry auth errors
            return failureCount < 2;
          }
        }
      }
    })
);
```

### P-2: No Image Domain Configuration for Strapi Production URL — ✅ FIXED (Spots feature)

**File:** `next.config.ts`

`remotePatterns` now includes `127.0.0.1`, `strapi-production-b6f4.up.railway.app`, and `res.cloudinary.com` (added when Spots photos served from Cloudinary caused a runtime error).

### P-3: No Loading/Error Boundaries

The app has no `ErrorBoundary` component and no global error handling in TanStack Query's `QueryClient`. Unhandled errors in async components or query fetchers will crash the entire page tree.

---

## 6. Best Practice Violations

### BP-1: Dual Authentication Systems — ✅ RESOLVED (PR #147)

The dead NextAuth system (`pages/api/auth/[...nextauth].ts`, `types/next-auth.d.ts`) was deleted. The codebase now has a single auth system (custom cookie + Strapi). The `next-auth` package can be removed from `package.json` in a future cleanup.

### BP-2: Route Protection is Scattered and Inconsistent

Each protected page must manually add a `getServerSideProps` guard. This pattern is error-prone: any new page that forgets to add it is unprotected.

**Better approach:** Centralize protection in `middleware.ts`:

```ts
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/user/edit"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth.token")?.value;
  const isProtected = PROTECTED.some(p => req.nextUrl.pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/user/edit"]
};
```

This removes the need for per-page `getServerSideProps` guards (though they can be kept as a secondary layer).

### BP-3: Token Passed as React State Through Component Tree

The `token` is stored in `AuthContext` and passed to service functions as a parameter. This means components must access the context, extract the token, and pass it to service calls — creating tight coupling and repetition.

With the `apiClient` interceptor approach (Section 2), the token is read directly from the cookie in the interceptor. No component needs to handle the token at all.

### BP-4: No Custom Hook for Accessing Auth

Consumers import `AuthContext` directly via `useContext`:

```ts
const { user, isLoading } = useContext(AuthContext);
```

Wrap it in a custom hook to ensure it's always consumed inside `AuthProvider`:

```ts
// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx.signIn) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

---

## 7. Recommended Auth Architecture

The following diagram shows the target state after applying all fixes:

```
Browser
  ├── Cookie: auth.token (secure, sameSite=lax, path=/)
  │     └── Set by: AuthContext.signIn() via nookies
  │     └── Read by: apiClient request interceptor (every API call)
  │     └── Read by: middleware.ts (edge, route protection)
  │     └── Read by: AuthContext useEffect (initial hydration)
  │
  ├── React State (AuthContext)
  │     └── user: User | null
  │     └── isAuthenticated: boolean
  │     └── isLoading: boolean
  │     (token is NOT stored in React state — read from cookie by interceptor)
  │
  ├── apiClient (src/lib/apiClient.ts)
  │     └── Request interceptor: attaches Bearer token from cookie
  │     └── Response interceptor: on 401 → destroyCookie → Router.replace(/auth/signin)
  │
  ├── middleware.ts (edge)
  │     └── Checks cookie for protected routes
  │     └── Redirects unauthenticated users before page renders
  │
  └── AuthContext
        └── useEffect: initial load → userMe() to hydrate user state
        └── visibilitychange listener: re-checks cookie when tab refocuses
        └── signIn: POST /auth/local → set cookie → hydrate user
        └── signOut: destroy cookie → clear state → redirect
```

---

## 8. Implementation Roadmap

### ~~Priority 1 — Fix the Broken Auth State~~ ✅ DONE (PR #146)

| Task                                                          | File(s)                        | Status  |
| ------------------------------------------------------------- | ------------------------------ | ------- |
| Create `apiClient` with 401 interceptor                       | `src/lib/apiClient.ts`         | ✅ Done |
| Replace `axios` with `apiClient` in all services              | `src/services/*.ts`            | ✅ Done |
| Add `setInterval` + `visibilitychange` guard to `AuthContext` | `src/contexts/AuthContext.tsx` | ✅ Done |
| Fix `userMe` not being awaited in `useEffect`                 | `src/contexts/AuthContext.tsx` | ✅ Done |

### ~~Priority 2 — Security Hardening~~ ✅ DONE (PR #147)

| Task                                            | File(s)                                                   | Status  |
| ----------------------------------------------- | --------------------------------------------------------- | ------- |
| Remove `NEXT_PUBLIC_` from reCAPTCHA secret key | `.env.local`, `.env.example`                              | ✅ Done |
| Add `secure`, `sameSite`, `path` to `setCookie` | `AuthContext.tsx`                                         | ✅ Done |
| Delete dead NextAuth endpoint and types         | `pages/api/auth/[...nextauth].ts`, `types/next-auth.d.ts` | ✅ Done |
| Remove `console.log` from service files         | `uploadAvatar.ts`, `linkAvatar.ts`                        | ✅ Done |
| Replace host-header check with email validation | `sendConfirmationEmail.ts`                                | ✅ Done |

### Priority 3 — Architecture Improvements

| Task                                                 | File(s)                   | Effort  | Status  |
| ---------------------------------------------------- | ------------------------- | ------- | ------- |
| Add `middleware.ts` for centralized route protection | `src/middleware.ts`       | Medium  | ✅ Done |
| Create `useAuth` custom hook                         | `src/hooks/useAuth.ts`    | Trivial | ✅ Done |
| Fix `AuthContext` default values                     | `AuthContext.tsx:31`      | Trivial | ✅ Done |
| Add `retry` config to `QueryClient`                  | `QueryProvider/index.tsx` | Trivial | Open    |
| Fix `getServerSideProps` `any` typing                | `pages/user/edit.tsx`     | Trivial | Open    |
| Fix `destroyCookie` missing `path` (logout bug)      | `AuthContext.tsx`         | Trivial | ✅ Done |

### Priority 4 — Quality of Life

| Task                                       | File(s)                                  | Effort  | Status  |
| ------------------------------------------ | ---------------------------------------- | ------- | ------- |
| Add `images.remotePatterns` to next.config | `next.config.ts`                         | Trivial | ✅ Done |
| Add global `ErrorBoundary` component       | `src/components/ErrorBoundary.tsx` (new) | Medium  | Open    |
| Fix `uploadAvatar` silent error swallowing | `src/services/uploadAvatar.ts`           | Trivial | Open    |

---

_Initial analysis from commit `7285d6c`. Updated to reflect PR #146 (JWT token expiry fix), PR #147 (security hardening), the Stories feature (fix/stories-avatar branch), the Spots feature (feat/spots branch), and the logout cookie path fix (feat/spots branch)._

---

## 10. Spots Feature — Implementation Notes

### Files changed (branch `feat/spots`)

| File                                      | Change                                                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `src/types/spots.ts`                      | New — `Spot`, `SpotAttributes`, `SpotCreator`, `SpotPhoto`, `SpotsResponse`, `SpotResponse`, `CreateSpotPayload`, `UpdateSpotPayload` |
| `src/services/getSpots.ts`                | New — `GET /api/spots` with `populate[photos]` and `populate[created_by_user]`                                                        |
| `src/services/getSpotById.ts`             | New — `GET /api/spots/:id` with same populate params                                                                                  |
| `src/services/createSpot.ts`              | New — `POST /api/spots`                                                                                                               |
| `src/services/updateSpot.ts`              | New — `PUT /api/spots/:id`                                                                                                            |
| `src/services/deleteSpot.ts`              | New — `DELETE /api/spots/:id`                                                                                                         |
| `src/hooks/useSpots.ts`                   | New — `queryKey: ["spots"]`, `staleTime: 5 min`                                                                                       |
| `src/hooks/useSpot.ts`                    | New — `queryKey: ["spots", id]`, `enabled: !!id`                                                                                      |
| `src/hooks/useCreateSpot.ts`              | New — invalidates `["spots"]` on success                                                                                              |
| `src/hooks/useUpdateSpot.ts`              | New — invalidates `["spots"]` and `["spots", id]` on success                                                                          |
| `src/hooks/useDeleteSpot.ts`              | New — invalidates `["spots"]` on success                                                                                              |
| `src/features/spots/SpotCard/index.tsx`   | New — card with thumbnail (`next/image`), type badge, name, address; links to `/spots/[id]`                                           |
| `src/features/spots/SpotForm/index.tsx`   | New — shared create/edit form; photo upload via `POST /api/upload`; Name + Type validation                                            |
| `src/features/spots/SpotDetail/index.tsx` | New — detail view; photo gallery; Google Maps embed; owner-only Edit/Delete with `AlertDialog`                                        |
| `src/pages/spots/index.tsx`               | Replaced placeholder — uses `useSpots()`, renders `SpotCard` grid, auth-gated "Add" button                                            |
| `src/pages/spots/[id]/index.tsx`          | Detail page (moved from `[id].tsx` to allow nested `edit` route)                                                                      |
| `src/pages/spots/[id]/edit.tsx`           | New — edit page; owner-only guard; pre-populated `SpotForm`; calls `useUpdateSpot`                                                    |
| `src/pages/spots/new.tsx`                 | New — create page; calls `useCreateSpot`; redirects to detail on success                                                              |
| `src/middleware.ts`                       | Added `/spots/new` and `/spots/:id/edit` to protected routes and matcher                                                              |
| `next.config.ts`                          | Added `res.cloudinary.com` to `remotePatterns` (Strapi can store uploads on Cloudinary)                                               |
| `specs/spots.md`                          | All 16 acceptance criteria marked `[x]`; status set to `done`                                                                         |

### Key design decisions

#### `[id].tsx` moved to `[id]/index.tsx`

Next.js cannot have both a file `pages/spots/[id].tsx` and a directory `pages/spots/[id]/` — the file system conflict prevents the nested `edit` route from being registered. The detail page was moved to `[id]/index.tsx` to enable `[id]/edit.tsx` as a sibling.

#### `created_by_user` typed as `SpotCreator | undefined`

`SpotAttributes.created_by_user` is typed as `SpotCreator | undefined` and all usages use optional chaining (`created_by_user?.data`). This handles spots created via the Strapi admin UI before the relation was enforced.

#### Root cause of missing `created_by_user` — two bugs, both fixed

**Bug 1 — Strapi REST sanitization strips user relations (FIXED in controller):**

Strapi's REST API response sanitizer strips relations targeting `plugin::users-permissions.user` from the response, regardless of the `populate` param in the controller. This is a security default: user data is not exposed through resource endpoints unless the role explicitly allows it via Settings → Roles → enable `find` on User.

The fix was to bypass the sanitizer by using `strapi.entityService` directly in `find`, `findOne`, and `create`, and calling `ctx.send()` manually. The controller only exposes `id`, `username`, and `name` fields from the related user — no sensitive data.

See `skatehub-strapi/src/api/spot/controllers/spot.js`.

**Bug 2 — Custom router POST route had empty config (FIXED in route):**

In `skatehub-strapi/src/api/spot/routes/spot.js`, the `POST /spots` route originally had `config: {}`. An empty config (no `auth: false`) is sufficient for Strapi to run the JWT strategy and populate `ctx.state.user`. The controller's `create` method explicitly guards against a missing user with `ctx.unauthorized()` and always injects `created_by_user` from `ctx.state.user.id`.

**Verified end-to-end:** After both fixes, `GET /api/spots/:id` returns `created_by_user.data` including `id`, `username`, and `name` for all requests (public and authenticated). The spot detail page displays "Criado por <name>" and shows Edit/Delete buttons for the owner.

#### Owner check is client-side only

The edit page renders an "access denied" message if the logged-in user is not the spot owner. This is a UX guard only — the Strapi API enforces ownership at the API level (`PUT /api/spots/:id` returns 403 for non-owners via the `is-owner` policy). The middleware only checks for the presence of a valid auth cookie, not ownership.

### Recurring Strapi pattern — bypass sanitizer for user relations

> **This pattern applies to every resource with a relation to `users-permissions.user`.**

Rather than enabling `find` on the User resource in the Strapi admin (which exposes the user list endpoint to all authenticated users), use `strapi.entityService` directly in the controller and restrict the returned fields to a safe whitelist (`id`, `username`, `name`). Call `ctx.send(this.transformResponse(entity))` to format the response correctly without going through the sanitizer.

This approach is safe, requires no Strapi admin changes, and is consistent across environments.

---

## 9. Stories Feature — Implementation Notes

### Files changed (branch `fix/stories-avatar`)

| File                                     | Change                                                                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `src/lib/queryClient.ts`                 | New — exports singleton `QueryClient` shared by `QueryProvider` and `AuthContext`                                      |
| `src/components/QueryProvider/index.tsx` | Consumes singleton instead of creating with `useState`                                                                 |
| `src/contexts/AuthContext.tsx`           | `signIn` calls `queryClient.invalidateQueries(["stories"])`; `signOut` calls `queryClient.clear()`                     |
| `src/services/getStories.ts`             | Migrated from bare `axios` to `apiClient`; nested avatar populate query; 24h filter helper (commented out — see below) |
| `src/types/stories.ts`                   | `author.data` typed as `{ ... } \| null`; avatar `url` + `formats.thumbnail` fields added                              |
| `src/features/stories/home/index.tsx`    | Mapping moved after loading/error guards; `.filter()` with type predicate removes null-author entries                  |
| `src/features/stories/modal/index.tsx`   | `key={userId}` on `<Stories>`; `stories.length === 0` added to loading guard; `onAllStoriesEnd` prop                   |
| `src/components/StoriesSwiper/index.tsx` | `currentIndex` + `handleAdvanceToNextUser`; passes `onAllStoriesEnd` to `StoriesModal`                                 |
| `src/hooks/useStoriesByUserId.ts`        | Removed `keepPreviousData`; `staleTime: 1 minute`                                                                      |
| `src/hooks/useStories.ts`                | `staleTime: 1 minute`; `refetchOnWindowFocus: false`                                                                   |

### Key design decisions

#### Singleton `QueryClient`

`AuthProvider` sits **above** `QueryClientProvider` in `_app.tsx`, so it cannot use `useQueryClient()`. The `QueryClient` instance is created once in `src/lib/queryClient.ts` and imported directly by both `QueryProvider` and `AuthContext`. This is intentional.

#### Cache invalidation on login

`signIn` must call `queryClient.invalidateQueries({ queryKey: ["stories"] })` — **not** `removeQueries`. `removeQueries` deletes the cache entry without scheduling a refetch, so the stories query never re-runs after login unless the component remounts. `invalidateQueries` marks the entry stale and immediately triggers a background refetch for any active subscriber.

#### `keepPreviousData` removed from `useStoriesByUserId`

`keepPreviousData` returns stale data instantly on `userId` change, bypassing `isLoading`. `react-insta-stories` crashes when the `stories` prop changes length mid-play. Removing it ensures a true loading state on every user change.

#### `key={userId}` on `<Stories>`

`react-insta-stories` has no API to reset to index 0 when the `stories` prop changes. `key={userId}` forces a full React remount on every user change, resetting internal state cleanly.

#### 24h filter is intentionally commented out

`getStories.ts` contains a `get24hISOThreshold()` helper and the Strapi filter query, but both are commented out with a `// TODO: re-enable before production` note. This is deliberate — the filter is disabled during development so seed data (created months ago) remains visible.

### Strapi backend requirement — Authenticated role permissions

> **This is a recurring gotcha.** Document it here so it is not forgotten.

The `Authenticated` role in Strapi must have `find` permission on `plugin::users-permissions.user`. Without it, the `populate[author]` param is silently ignored for authenticated requests — the `author` field is stripped entirely from the response, causing the `.filter(story => story.attributes.author?.data != null)` guard to exclude all stories.

**Symptom:** Stories visible when logged out, invisible after login. Network tab shows 200 OK on both requests. The authenticated response is missing the `author` key entirely.

**Fix (Strapi admin):**

1. Settings → Users & Permissions Plugin → Roles → **Authenticated**
2. Users-permissions → User → enable **`find`**
3. Save

---

## 11. Recent Improvements (April 14, 2026)

### Theme System Refactoring — `useColors` Hook Unification

**Objective:** Replace scattered `useColorModeValue` calls across the codebase with a centralized `useColors` hook that exports a consistent theme palette.

**Commits:**

- `4498c9c` — feat: add `logoFillColor` and `bgColorNoOpacity` to useColors hook
- `8d36444` — fix: add missing `borderColor` property to useColors hook
- `fe32846` — refactor: replace useColorModeValue with useColors hook in SpotCard
- `920d14b` — refactor: replace useColorModeValue with useColors hook for background color
- `ae90b9b` — refactor: integrate useColors hook for background and border colors in Header
- `ac46789` — refactor: replace useColorModeValue with useColors hook in LogoSkateHub
- `2d75feb` — refactor: replace useColorModeValue with useColors hook in SidebarNav
- `ee62194` — refactor: enhance Sidebar component with dynamic colors and improved structure
- `e106582` — refactor: update Header component to use bgColorNoOpacity and improve Link styling

**Impact:**

- Single source of truth for light/dark mode colors across all components
- Easier to maintain and update the theme globally
- Reduced duplication and import noise

**Status:** ✅ Complete — all major components now use the centralized `useColors` hook

### Bug Fixes — SpotDetail Component

**Commits:**

- `b1436d1` — fix: remove unused MAPS_KEY constant and simplify address check in SpotDetail
- `9a422c0` — fix: update text alignment for spot description in SpotDetail component

**Changes:**

- Simplified conditional logic for Google Maps embed
- Improved text rendering in the spot description section

### Code Quality Improvements

**Commits:**

- `afbda8d` — fix: standardize import statement quotes (consistency across codebase)
- `81cf6fe` — chore: add .txt and .http files to .gitignore (avoid committing test files)
- `074170e` — fix: adjust margin-bottom of Flex component in StoriesSwiper
- `0bad0a4` — fix: remove bottom margin from Flex component in Skatistas

### Known Issues to Address (Priority Order)

#### 1. reCAPTCHA Timeout After Logout ✅ FIXED (April 16, 2026)

**Status:** Complete — fixed in commit `8fd8396`

**Problem (previously):** After logout, users were redirected to `/auth/signin`. The invisible reCAPTCHA widget (`size="invisible"`) was being loaded asynchronously. If a user tried to submit the login form before the widget finished loading, Google's reCAPTCHA threw `"reCAPTCHA Timeout (b)"` (timeout after 30 seconds internally).

**Root Cause:** The `executeAsync()` call was not guarded by a "widget ready" signal. The form could be submitted before the widget's JavaScript had finished initializing.

**Solution Implemented:**

1. Added `isRecaptchaReady` state boolean to all three auth pages
2. Set it to `true` via the `asyncScriptOnLoad` callback (only signal that indicates full widget readiness)
3. Guard form submission: disabled submit button and show toast if not ready
4. Removed all `console.log` / `console.error` in callbacks (violated project rules)
5. Replaced `fetch` with `apiClient` in signup page via new `signUpRequest()` service

**Files Fixed:**

- `src/pages/auth/signin.tsx` — already had guards; verified working
- `src/features/login/modal/login.tsx` — fixed with readiness guard
- `src/pages/auth/signup.tsx` — fixed with readiness guard + `apiClient` migration
- `src/services/signUpRequest.ts` — new service file

**Changes:**

- Submit buttons now disabled until reCAPTCHA widget is fully loaded
- No race condition: form cannot be submitted before widget ready
- All console statements removed
- Improved error messaging (show toast if widget takes too long or unavailable)

#### 2. Console Statements in Production Files ✅ FIXED (April 16, 2026)

**Status:** Complete — fixed in commit `8fd8396`

All console statements have been removed from auth pages as part of the reCAPTCHA timeout fix.

#### 3. Signup Page Arch Violation ✅ FIXED (April 16, 2026)

**Status:** Complete — fixed in commit `8fd8396`

**Changes:**

- Created new `src/services/signUpRequest.ts` service
- Migrated `src/pages/auth/signup.tsx` from bare `fetch` to `apiClient`
- Now benefits from automatic token injection, 401 interceptor, and centralized error handling

#### 4. RecAPTCHA Token Dropped in SignIn (LOW)

**File:** `src/contexts/AuthContext.tsx:115`

```ts
async function signIn({ email, password }: SignInData) {
  // ← recaptcha token is in destructure but silently discarded
  const { user, jwt } = await signInRequest({ email, password });
```

**Problem:** The `SignInData` type includes `recaptcha?: string`, but the `signIn` function only destructures `{ email, password }`. The token collected from the form is never forwarded to the backend.

**Current Status:** This may be intentional if the backend doesn't yet validate the token. Needs clarification with backend owner.

**Fix (if needed):** Forward the recaptcha token to `signInRequest()`.

### Recommendations for Next Sprint

1. ✅ **FIXED:** reCAPTCHA timeout issue (affects login UX post-logout) — commit `8fd8396`
2. ✅ **FIXED:** Console statements cleaned up from auth pages — commit `8fd8396`
3. ✅ **FIXED:** Signup refactored to use `apiClient` for consistency — commit `8fd8396`
4. **REVIEW:** Clarify backend's reCAPTCHA token validation expectations (see item 4 below)
