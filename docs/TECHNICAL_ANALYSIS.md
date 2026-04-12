# Technical Analysis — SkateHub Frontend

> Stack: Next.js 16 (Pages Router) · React 19 · TypeScript · Chakra UI 2 · Strapi (auth + API)
> Date: April 2026 · Last updated: April 2026 (PRs #146, #147, #148, #149)

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
Protected pages: /dashboard, /user/edit
  → guarded by getServerSideProps (checks cookie presence only — no signature/expiry validation)

Auth pages: /auth/signin, /auth/signup, /auth/forgot-password, /auth/reset-password
  → guarded by redirectIfAuthenticated utility

Completely unguarded: /, /skatistas, /general, /spots, /user/[id]
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
      destroyCookie(undefined, "auth.token");
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

### B-5: `getServerSideProps` Using `any` Type — ✅ FIXED (PR #148)

**File:** `src/pages/user/edit.tsx:9`

```ts
export const getServerSideProps = async (ctx: any) => {
```

This bypasses TypeScript. Use `GetServerSidePropsContext` as done in `dashboard.tsx`.

### B-6: `AuthContext` Created Without Default Values — ✅ FIXED (PR #148)

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

---

## 5. Performance Improvements

### P-1: `QueryClient` Missing Global Configuration — ✅ FIXED (PR #148)

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

### P-2: No Image Domain Configuration for Strapi Production URL — ✅ FIXED (PR #149)

**File:** `next.config.ts`

There is no `images.remotePatterns` configuration. If you use `next/image` with Strapi-hosted avatars from the production Railway URL, it will fail in production.

**Fix in `next.config.ts`:**

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "127.0.0.1" }, { hostname: "strapi-production-b6f4.up.railway.app" }]
  }
};
```

### P-3: No Loading/Error Boundaries — ✅ FIXED (PR #149)

The app now has a global `ErrorBoundary` component (`src/components/ErrorBoundary/index.tsx`) wrapping the entire page tree in `_app.tsx`. Unhandled errors in async components or query fetchers are caught and display a user-facing fallback with a "Try again" reset option.

---

## 6. Best Practice Violations

### BP-1: Dual Authentication Systems — ✅ RESOLVED (PR #147)

The dead NextAuth system (`pages/api/auth/[...nextauth].ts`, `types/next-auth.d.ts`) was deleted. The codebase now has a single auth system (custom cookie + Strapi). The `next-auth` package was removed from `package.json` in PR #149.

### BP-2: Route Protection is Scattered and Inconsistent — ✅ FIXED (PR #148)

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

### BP-4: No Custom Hook for Accessing Auth — ✅ FIXED (PR #148)

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

### ~~Priority 3 — Architecture Improvements~~ ✅ DONE (PR #148)

| Task                                                 | File(s)                           | Status  |
| ---------------------------------------------------- | --------------------------------- | ------- |
| Add `middleware.ts` for centralized route protection | `src/middleware.ts` (new file)    | ✅ Done |
| Create `useAuth` custom hook                         | `src/hooks/useAuth.ts` (new file) | ✅ Done |
| Fix `AuthContext` default values                     | `AuthContext.tsx:31`              | ✅ Done |
| Add `retry` config to `QueryClient`                  | `QueryProvider/index.tsx`         | ✅ Done |
| Fix `getServerSideProps` `any` typing                | `pages/user/edit.tsx`             | ✅ Done |

### ~~Priority 4 — Quality of Life~~ ✅ DONE (PR #149)

| Task                                       | File(s)                                  | Status            |
| ------------------------------------------ | ---------------------------------------- | ----------------- |
| Add `images.remotePatterns` to next.config | `next.config.ts`                         | ✅ Done           |
| Add global `ErrorBoundary` component       | `src/components/ErrorBoundary/index.tsx` | ✅ Done           |
| Fix `uploadAvatar` silent error swallowing | `src/services/uploadAvatar.ts`           | ✅ Done (PR #146) |
| Remove `next-auth` from `package.json`     | `package.json`                           | ✅ Done           |

---

_Initial analysis from commit `7285d6c`. Updated to reflect PR #146 (JWT token expiry fix), PR #147 (security hardening), PR #148 (architecture improvements), and PR #149 (quality of life)._
