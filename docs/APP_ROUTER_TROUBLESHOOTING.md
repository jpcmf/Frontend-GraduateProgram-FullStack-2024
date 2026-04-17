# App Router Migration: Troubleshooting Guide

## Common Issues & Solutions

---

## Setup Phase Issues

### Issue: "Cannot find module '@/hooks/useAuth'"

**Symptom:** TypeScript error when importing Auth hook in layout

**Cause:** Path aliases not set up correctly

**Solution:**

```bash
# Verify tsconfig.json has path aliases
cat tsconfig.json | grep -A 5 "paths"

# Should show:
# "paths": {
#   "@/*": ["./src/*"]
# }

# If missing, add it and restart dev server
npm run dev
```

---

### Issue: "Chakra UI provider not found" error

**Symptom:** Components throw "useChakra" or provider error

**Cause:** Chakra provider not wrapped in root layout

**Solution:**

```typescript
// src/app/layout.tsx
import { Providers } from '@/components/providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

Ensure `Providers` component includes:

- CacheProvider (Chakra)
- ChakraProvider (Chakra)
- QueryClientProvider (React Query)
- AuthProvider (custom)

---

### Issue: "Module not found" errors in build

**Symptom:** `npm run build` fails with "Cannot find module" errors

**Cause:** Importing Pages Router components in App Router

**Solution:**

```bash
# Don't import from pages directory
# ❌ import Page from '../pages/auth/signin'

# Import from app directory instead
# ✅ import Page from '../app/(public)/auth/signin/page'

# Or use shared components:
# ✅ import SignInForm from '@/features/auth/SignInForm'
```

---

### Issue: "window is not defined" error

**Symptom:** Error during build or SSR

**Cause:** Browser APIs used in Server Component or during build

**Solution:**

```typescript
// Add 'use client' to components using window, localStorage, etc.
'use client';

export default function ClientComponent() {
  useEffect(() => {
    const value = localStorage.getItem('key'); // Now safe
  }, []);
  return <div>...</div>;
}
```

---

## Phase 1: Public Routes Issues

### Issue: Dynamic route params are `undefined`

**Symptom:** `params.id` is undefined in `[id]/page.tsx`

**Cause:** Incorrect folder structure

**Solution:**

```bash
# ❌ Wrong structure
src/app/spots/
├── [id].tsx

# ✅ Correct structure (App Router requires /page.tsx)
src/app/spots/
└── [id]/
    └── page.tsx
```

Convert all `[id].tsx` files to `[id]/page.tsx` directories.

---

### Issue: "Cannot read property 'query' of undefined"

**Symptom:** Old `getServerSideProps` patterns break

**Cause:** Pages Router patterns don't exist in App Router

**Solution:**

Before (Pages Router):

```typescript
export const getServerSideProps = async ({ params, query, req, res }) => {
  // Old pattern
};
```

After (App Router):

```typescript
// Option 1: Async component + params prop
export default async function Page({ params, searchParams }) {
  const id = params.id;
  const page = searchParams.page;
}

// Option 2: Client component + useSearchParams hook
("use client");
import { useSearchParams, useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;
}
```

---

### Issue: "hydration failed" error in browser

**Symptom:** "Hydration failed because the initial UI does not match..." in console

**Cause:** Server-rendered content doesn't match client-rendered content

**Solution:**

Most common cause: Date/time differences between server and client.

```typescript
// ❌ Bad: Server renders different content than client
export default async function Page() {
  const now = new Date(); // Different on server vs client
  return <div>{now.toString()}</div>;
}

// ✅ Good: Use useEffect for client-only content
'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading...</div>;

  return <div>{new Date().toString()}</div>;
}
```

---

### Issue: Images not loading from Strapi

**Symptom:** Images show broken icon or 404

**Cause:** Strapi URL not in `remotePatterns`

**Solution:**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337"
      },
      {
        protocol: "https",
        hostname: "your-strapi-domain.com"
      }
    ]
  }
};
```

Restart dev server after changes.

---

### Issue: Forms don't submit

**Symptom:** Click submit button, nothing happens

**Cause:** Client component not marked with `'use client'`

**Solution:**

```typescript
// ❌ This will fail (async component can't use onClick hooks)
export default async function LoginPage() {
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}

// ✅ Correct: Use client component for interactive forms
'use client';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const { handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Phase 2: Protected Routes Issues

### Issue: "useAuth hook requires AuthProvider" error

**Symptom:** Protected layout throws error about AuthProvider

**Cause:** Auth hook called before provider wrapped the component

**Solution:**

Ensure root layout wraps AuthProvider:

```typescript
// src/app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

### Issue: Protected routes show loading forever

**Symptom:** Protected page stuck on loading screen

**Cause:** Auth check infinite loop or token never validates

**Solution:**

Check auth hook returns correct shape:

```typescript
// In useAuth hook, verify it returns:
{
  auth: {
    token: string | null;
    // other auth fields
  },
  isLoading: boolean;
}
```

Add debugging to protected layout:

```typescript
'use client';

export default function ProtectedLayout({ children }) {
  const { auth, isLoading } = useAuth();

  // Debug
  console.log('Auth state:', { token: auth.token, isLoading });

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (!auth.token) {
    // useRouter().push() will be called in useEffect
    return null;
  }

  return children;
}
```

---

### Issue: "useRouter is not available in Server Component"

**Symptom:** Error in protected layout when trying to redirect

**Cause:** Using next/router instead of next/navigation

**Solution:**

Pages Router vs App Router:

```typescript
// ❌ Pages Router (wrong in App Router)
import { useRouter } from "next/router";

// ✅ App Router (correct)
import { useRouter } from "next/navigation";
```

---

### Issue: Redirect works but causes page flash

**Symptom:** Protected route briefly shows content before redirecting

**Cause:** Content rendered before redirect completes

**Solution:**

Return null while auth is being checked:

```typescript
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout({ children }) {
  const { auth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !auth.token) {
      router.push("/auth/signin");
    }
  }, [auth.token, isLoading, router]);

  // Don't render children until we know user is authenticated
  if (isLoading || !auth.token) {
    return null;
  }

  return children;
}
```

---

### Issue: "Middleware logic broken" after deleting middleware.ts

**Symptom:** Protected routes no longer redirect after deleting middleware

**Cause:** Protected layout not properly checking auth

**Solution:**

Verify protected layout follows this pattern:

```typescript
// app/(protected)/layout.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !auth.token) {
      router.push('/auth/signin');
    }
  }, [auth.token, isLoading, router]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!auth.token) {
    return null;
  }

  return children;
}
```

---

## Phase 3: API Routes Issues

### Issue: "405 Method Not Allowed"

**Symptom:** API route returns 405 error

**Cause:** Requested HTTP method not exported from route handler

**Solution:**

```typescript
// app/api/send-confirmation-email/route.ts

// ✅ Correct: Export function for each method
export async function POST(req: NextRequest) {
  // Handle POST
  return NextResponse.json({ success: true });
}

// ❌ Wrong: No function exported
// export default function handler() { ... }
```

---

### Issue: "Cannot parse body" error

**Symptom:** `req.json()` throws error in API route

**Cause:** Body not being read correctly

**Solution:**

```typescript
// ✅ Correct way to read body
export async function POST(req: NextRequest) {
  const body = await req.json();

  // body now contains parsed JSON
  console.log(body);

  return NextResponse.json({ received: body });
}
```

---

### Issue: API returns HTML instead of JSON

**Symptom:** Response is HTML (error page) instead of JSON

**Cause:** NextResponse not being used

**Solution:**

```typescript
// ❌ Wrong (will return HTML)
export async function GET() {
  return { data: "hello" };
}

// ✅ Correct
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: "hello" });
}
```

---

### Issue: "CORS error" calling API from frontend

**Symptom:** Browser shows CORS error in console

**Cause:** API not setting CORS headers

**Solution:**

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Add CORS headers if calling from different domain
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
```

---

## Phase 4: Cleanup Issues

### Issue: "Module not found" after deleting pages/

**Symptom:** Build fails because files reference deleted pages/

**Cause:** Stale imports from deleted directory

**Solution:**

```bash
# Find all imports from pages directory
grep -r "from.*pages/" src/ --include="*.ts" --include="*.tsx"

# Update imports to use app router paths
# ❌ import Page from '@/pages/auth/signin'
# ✅ import SignInForm from '@/features/auth/SignInForm'

# Or import page exports
# ✅ import { metadata } from '@/app/(public)/auth/signin/page'
```

---

### Issue: "Middleware still running" after deletion

**Symptom:** Redirects still happening unexpectedly

**Cause:** Stale middleware.ts still in git

**Solution:**

```bash
# Verify middleware.ts is deleted
ls -la src/middleware.ts  # Should show "No such file"

# If file still exists
rm src/middleware.ts

# Verify git sees deletion
git status  # Should show "deleted: src/middleware.ts"

# Restart dev server
npm run dev
```

---

### Issue: "Build includes Pages Router code"

**Symptom:** Build size large or Pages Router code in bundle

**Cause:** Pages Router code not fully deleted

**Solution:**

```bash
# Verify pages directory deleted
rm -rf src/pages/

# Verify no imports reference pages
grep -r "from.*pages/" src/ --include="*.ts" --include="*.tsx"

# Should return nothing

# Clean build
rm -rf .next/
npm run build
```

---

## Performance Issues

### Issue: "Pages load slowly after migration"

**Symptom:** Pages noticeably slower than before

**Cause:** Missing data fetching optimization

**Solution:**

```typescript
// ✅ Use async server components for data fetching
export default async function Page() {
  // This runs on server, data fetched before page loads
  const data = await fetchData();
  return <div>{data}</div>;
}

// ❌ Avoid client-side fetching for initial data
'use client';
export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // This delays page display
    fetchData().then(setData);
  }, []);

  return <div>{data}</div>;
}
```

---

### Issue: "Build time increased"

**Symptom:** `npm run build` takes longer

**Cause:** Unnecessary re-building or type checking

**Solution:**

```bash
# Profile build time
npm run build -- --debug

# Check for circular imports
npm install --save-dev eslint-plugin-import

# Run linter to find import issues
npx eslint src/ --ext .ts,.tsx
```

---

## Debugging Commands

### Check Current Router Status

```bash
# See if both routers exist
ls -la src/pages/ src/app/

# Check middleware exists or not
ls -la src/middleware.ts
```

### Verify Routes

```bash
# List all routes in App Router
find src/app -name "page.tsx" -o -name "route.ts" | sort

# List all routes in Pages Router (if still present)
find src/pages -name "*.tsx" | grep -v api | sort
```

### Check TypeScript Errors

```bash
# Run type checker
npx tsc --noEmit

# Get detailed errors
npm run build 2>&1 | head -50
```

### Debug Auth State

```typescript
// Add to protected layout temporarily
useEffect(() => {
  console.group("Auth Debug");
  console.log("Token:", auth.token);
  console.log("IsLoading:", isLoading);
  console.log("Full Auth:", auth);
  console.groupEnd();
}, [auth, isLoading]);
```

---

## When All Else Fails

1. **Check rollback guide:** `docs/APP_ROUTER_ROLLBACK_GUIDE.md`
2. **Review testing checklist:** `docs/APP_ROUTER_TESTING_CHECKLIST.md`
3. **Check migration spec for patterns:** `specs/APP_ROUTER_MIGRATION.md`
4. **Ask Claude for help:** Provide error message, file location, and what you're trying to do

---

## Known Limitations

| Limitation                                                            | Workaround                                       |
| --------------------------------------------------------------------- | ------------------------------------------------ |
| Server Components can't use React hooks (useState, useEffect, etc.)   | Use `'use client'` for interactive components    |
| Server Components can't use browser APIs (localStorage, window, etc.) | Use `'use client'` or move to client component   |
| Dynamic imports in Server Components have limitations                 | Use `React.lazy` in client components only       |
| Middleware can't directly protect routes in App Router                | Use layout-based auth checks instead             |
| Redirects in Server Components are limited                            | Use `redirect()` function from `next/navigation` |

---

## Support Resources

- **Next.js App Router Docs:** https://nextjs.org/docs/app
- **Next.js Migration Guide:** https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration
- **React Server Components:** https://react.dev/reference/rsc/server-components
- **Project Docs:** See `docs/TECHNICAL_ANALYSIS.md`
