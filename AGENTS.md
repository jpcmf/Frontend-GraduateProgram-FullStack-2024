# SkateHub Frontend — Agent Rules

## Project Context

This is the **Next.js 16 + React 19 frontend** for SkateHub, a social platform for the skateboarding community.
Built with TypeScript, Chakra UI, TanStack Query, and a custom cookie-based auth system backed by Strapi.
Read `docs/TECHNICAL_ANALYSIS.md` for the full architecture analysis and known issues.
Read the backend spec files at `/Users/joaopaulo/www/pucrs/project/skatehub-strapi/specs/` for API contracts.

## Git Branch Rules

**NEVER commit directly to `develop` or `main`.** Always create a feature branch before starting any work.

```bash
git checkout develop
git pull
git checkout -b feature/<feature-name>
```

Every piece of work — features, fixes, docs, plans — goes on its own branch and is merged via PR.

---

## Spec-Driven Development Workflow

This project uses **Spec-Driven Development**. Every feature must follow this process:

```
1. SPEC     → Write or read the spec file in specs/<feature-name>.md
2. PLAN     → Use /plan-feature to produce a task checklist
3. BUILD    → Implement only what the spec defines
4. VERIFY   → Cross-check implementation against spec acceptance criteria
```

**Before writing any code for a feature:**

- Read the relevant spec file in `specs/`
- If no spec exists for the task, ask the user to define one or run `/spec-new`
- Never add UI, services, or behaviors not described in the spec

**After writing code:**

- Check every acceptance criterion in the spec
- Mark completed items in the spec with `[x]`

## Architecture Conventions

This project uses **Vertical Slice Architecture (VSA)** for feature organization. Features are co-located and self-contained; each feature owns its hooks, services, components, and types.

### File Structure

```
src/
├── app/                              # App Router pages & layouts
│   ├── (public)/                     # Public routes (no auth required)
│   ├── (protected)/                  # Protected routes (auth required)
│   ├── layout.tsx                    # Root layout
│   └── SidebarDrawerContext.tsx       # App-level context (shared across layout)
├── features/
│   ├── auth/                         # Authentication feature
│   │   ├── components/               # Auth UI components
│   │   ├── hooks/                    # Auth-specific hooks (e.g., useSignIn)
│   │   ├── services/                 # Auth services (e.g., signIn.ts, signOut.ts)
│   │   ├── types/                    # Auth types (Auth, User, Session)
│   │   └── index.ts                  # Barrel export: export { useSignIn, types, ... }
│   ├── spots/                        # Spots feature
│   │   ├── components/
│   │   ├── hooks/                    # e.g., useSpots, useSpot, useCreateSpot
│   │   ├── services/                 # e.g., getSpots.ts, createSpot.ts, deleteSpot.ts
│   │   ├── types/
│   │   └── index.ts
│   ├── user/                         # User profile & account feature
│   │   ├── components/
│   │   ├── hooks/                    # e.g., useProfile, useAvatarUpload
│   │   ├── services/                 # e.g., getProfile.ts, updateProfile.ts
│   │   ├── types/
│   │   └── index.ts
│   ├── stories/                      # Stories feature
│   ├── ai/                           # AI chat feature
│   ├── skatistas/                    # Skatistas feature
│   └── dashboard/                    # Dashboard feature
├── shared/
│   ├── ui/                           # Reusable UI components (not domain-specific)
│   │   ├── layout/                   # Header, Sidebar, Footer, etc.
│   │   └── form/                     # Form inputs, buttons, etc.
│   ├── hooks/                        # Hooks used across multiple features
│   │   ├── useAuth.ts                # Auth state (used by all features)
│   │   ├── useColors.ts              # Chakra colors (used across UI)
│   │   └── index.ts
│   ├── lib/
│   │   ├── apiClient.ts              # Axios instance (base URL + 401 interceptor)
│   │   └── storage.ts
│   ├── types/
│   │   └── index.ts                  # Global types (if needed)
│   └── utils/
│       ├── validate.ts               # Validation helpers
│       └── format.ts
└── ...
```

### Import Rules

**Cross-feature imports are forbidden.** Use this hierarchy:

1. **Within a feature** — use relative paths:

   ```typescript
   // ✓ Good: relative path within feature
   import { useSpot } from "../../hooks/useSpot";
   import type { Spot } from "../../types/spots";
   import { getSpot } from "../../services/getSpot";
   ```

2. **From another feature** — import from barrel export only:

   ```typescript
   // ✓ Good: barrel export from feature
   import { useSpot, type Spot } from "@/features/spots";

   // ✗ Bad: direct import from feature internals
   import useSpot from "@/features/spots/hooks/useSpot";
   ```

3. **From shared layer** — import directly (shared layer is meant for reuse):

   ```typescript
   // ✓ Good: shared imports
   import { useAuth } from "@/shared/hooks/useAuth";
   import { Button } from "@/shared/ui/form/Button";
   import { apiClient } from "@/shared/lib/apiClient";
   ```

4. **Never import from `src/contexts/`, `src/services/`, `src/hooks/`, `src/types/`** — these old paths no longer exist; use feature or shared imports instead.

### Feature Barrel Exports

Every feature must export its public API via `src/features/<feature>/index.ts`:

```typescript
// src/features/spots/index.ts
export { useSpots, useSpot, useCreateSpot } from "./hooks";
export type { Spot, CreateSpotInput } from "./types";
export { getSpots, createSpot } from "./services";
export { SpotForm, SpotCard } from "./components";
```

This makes the feature's API discoverable and prevents internal details from leaking.

### Shared Layer Usage

- **Shared components**: `@/shared/ui/` — Header, Sidebar, footer, buttons, form inputs (not domain-specific)
- **Shared hooks**: `@/shared/hooks/` — `useAuth`, `useColors` (used by 2+ features)
- **Shared services**: `@/shared/lib/` — `apiClient.ts`, storage utilities (used by multiple features)

If code is needed by only one feature, keep it in that feature. If 2+ features need it, move it to `@/shared/`.

### Routing & Auth

- Pages live in `src/app/` (App Router file-system routing)
- Route protection is handled in `src/app/(protected)/layout.tsx` with `useAuth()` hook — do not add auth checks in individual pages
- Public routes in `src/app/(public)/` — no auth required
- Protected routes in `src/app/(protected)/` — requires authentication
- Auth state is accessed via the `useAuth` hook (`@/shared/hooks/useAuth.ts`) — never import `AuthContext` directly

### API Communication

- All API calls go through `@/shared/lib/apiClient.ts` (Axios instance with base URL + 401 interceptor) — never use bare `axios`
- Service functions are co-located in feature `services/` folder
- TanStack Query hooks are co-located in feature `hooks/` folder
- Types for API responses are co-located in feature `types/` folder

## Documentation Maintenance Rules

These two steps are **required before any PR can be considered complete**:

### After every feature implementation

1. **Update `README.md` — Features section**
   Add a bullet describing the new feature under the relevant category (or create a new one). Keep it concise: one line, user-facing language.

2. **Update `CHANGELOG.md` — prepend a new entry**
   Add the entry at the top of the `## [Unreleased]` section using this exact format:

   ```
   - YYYY-MM-DD - <Description of change> [#PR](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/<number>) _(vX.Y.Z)_
   ```

   When a version is released, move all `[Unreleased]` entries under a new versioned heading:

   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD
   ```

### Rules

- Never skip documentation updates — they are part of the definition of done
- Feature descriptions in `README.md` must be user-facing (what it does), not technical (how it works)
- Changelog entries must match the PR title and version in `package.json`

---

## Testing Standards

### Test Coverage Requirements

Every feature must include tests at the appropriate levels:

- **Unit Tests** — All hooks, services, and utilities
- **Component Tests** — Critical pages and complex components
- **Integration Tests** — API calls, auth flows, state management
- **E2E Tests** — Complete user journeys (added when Playwright infrastructure is ready)

### Testing Tools & Setup

**Current Status:** Infrastructure setup planned post-release (see `specs/AUTOMATED_TESTING_PLAN.md`)

**When tests are available:**

- Unit tests run via `pnpm test`
- Coverage reports via `pnpm test:coverage`
- E2E tests run via `pnpm e2e`

### Test File Location & Naming

```
src/__tests__/
├── hooks/
│   └── useAuth.test.ts              (matches src/hooks/useAuth.ts)
├── services/
│   └── createSpot.test.ts           (matches src/services/createSpot.ts)
├── features/
│   └── SpotForm.test.tsx            (matches feature component)
├── pages/
│   └── auth/signin.test.tsx         (matches page)
├── utils/
│   └── date.test.ts                 (matches utility)
└── integration/
    └── auth-flow.test.ts            (cross-feature scenario)

e2e/
├── auth.spec.ts                     (authentication journeys)
├── spots.spec.ts                    (spot features)
└── user.spec.ts                     (user profile features)
```

### Writing Tests

**Test Conventions:**

- Use Vitest for unit/component tests
- Use React Testing Library for component testing (user-centric)
- Use MSW (Mock Service Worker) for API mocking
- Use Playwright for E2E testing
- Mock external services (maps, reCAPTCHA, etc.)
- Test user interactions, not implementation details
- Aim for >80% coverage of critical paths

**Example Unit Test:**

```typescript
import { describe, it, expect } from "vitest";
import { isValidEmail } from "@/utils/validate";

describe("isValidEmail", () => {
  it("should return true for valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("should return false for invalid email", () => {
    expect(isValidEmail("invalid")).toBe(false);
  });
});
```

**Example Component Test:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import SignInForm from '@/features/auth/SignInForm';

describe('SignInForm', () => {
  it('should render form with email and password fields', () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
```

### When Adding New Features

1. **Before Implementation** — Read or create spec in `specs/`
2. **During Implementation** — Write tests alongside code (TDD encouraged)
3. **After Implementation** — Ensure >80% test coverage for new code
4. **Before PR** — Run `pnpm test` and `pnpm test:coverage` locally
5. **CI/CD Validation** — GitHub Actions runs all tests on PR

### Debugging Tests

```bash
# Run tests in watch mode (rerun on file changes)
pnpm test:watch

# Run specific test file
pnpm test src/__tests__/hooks/useAuth.test.ts

# Debug with UI dashboard
pnpm test:ui

# Generate coverage report
pnpm test:coverage

# Debug E2E tests
pnpm e2e:debug
```

## Playwright / Browser Verification

When using Playwright tools for visual verification:

- After taking screenshots, snapshots, or saving console/network logs to `.playwright-mcp/`, delete all generated files in that folder before ending the session.
- Use `rm -rf .playwright-mcp/*` after verification is complete.
- Never commit `.playwright-mcp/` contents — they are temporary debugging artifacts.

## Code Quality Rules

- No `console.log`, `console.warn`, or `console.error` in any production file
- All service files must use `apiClient` — never bare `axios`
- TypeScript strict mode is on — no `any` types without a documented reason
- All images from Strapi must go through the `next/image` component or be listed in `next.config.ts` `remotePatterns`
- Form validation errors must be shown to the user — never swallowed silently
- All mutating operations (create/update/delete) must invalidate the relevant TanStack Query cache after success

## Security Rules

These rules apply to every task — features, fixes, docs, and refactors.

### Secrets and environment variables

- **Never hardcode secrets** — no API keys, tokens, passwords, or DSNs anywhere in source code
- **Never expose secrets in the README or any public-facing file** — variable names belong in `.env.example` with empty values and inline comments; nothing more
- **Never commit `.env.local`** — it is gitignored for a reason; verify before every commit
- **Never use the `NEXT_PUBLIC_` prefix for server-only values** — anything prefixed `NEXT_PUBLIC_` is inlined into the client JavaScript bundle and readable by anyone
- **Server-only keys** (reCAPTCHA secret, Sentry auth token, AI provider keys, SMTP passwords) must have no `NEXT_PUBLIC_` prefix and must only be accessed in API routes or server components

### API routes and server code

- **Always authenticate API routes** — every route that touches user data must verify the `auth.token` cookie before processing the request; return `401` immediately if absent
- **Never return raw error messages to the client** — catch blocks must return generic user-facing messages (e.g. `"Something went wrong, please try again."`); log the real error server-side only
- **Validate all inputs server-side** — never trust data from `request.json()` without type-checking and length/format validation; return `400` for invalid payloads
- **Never expose internal service errors** — stack traces, database errors, and provider error messages must never reach the HTTP response body

### Frontend and public repository

- **This repository is public** — treat every file that is committed as publicly readable
- **Never log sensitive data** — do not log tokens, user emails, passwords, or API responses containing personal data
- **Auth checks belong in middleware and layout guards** — never rely solely on client-side conditional rendering to protect content
- **Cookie flags** — auth cookies must always be set with `secure: true` (production), `sameSite: "lax"`, and `path: "/"` — never omit these

### Before opening a PR — security checklist

- [ ] No secrets or tokens in any committed file
- [ ] No `NEXT_PUBLIC_` prefix on server-only variables
- [ ] All new API routes validate auth and sanitise input
- [ ] No raw error details returned to the client
- [ ] No `console.log` with sensitive data
- [ ] `.env.local` is not staged (`git status` confirms)

---

## File & Directory References

When implementing a feature, load these files as needed:

- Architecture & known issues: @docs/TECHNICAL_ANALYSIS.md
- API client (base URL, interceptor): @src/lib/apiClient.ts
- Auth context and token lifecycle: @src/contexts/AuthContext.tsx
- Auth hook: @src/hooks/useAuth.ts
- Route protection middleware: @src/middleware.ts
- App entry point: @src/pages/\_app.tsx
- Home page: @src/pages/index.tsx
- Constant definitions (API base URL): @src/utils/constant.ts

## Spec File Format

All spec files follow this structure:

```markdown
# Feature: <Name>

**Status:** draft | ready | in-progress | done
**Priority:** high | medium | low
**Affects:** list of pages / components / services / hooks touched

## Problem Statement

Why this feature exists.

## UI / UX Description

What the user sees and does. Include page routes, key components, and user flows.

## Data Requirements

Which API endpoints are consumed. Reference the backend spec API Contract section.

## Component & File Plan

New files to create and existing files to modify.

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Out of Scope

What this spec explicitly does NOT cover.
```

**The `## Data Requirements` section must reference the backend spec** (`specs/<feature>.md` in the Strapi repo) as the source of truth for endpoint shapes and query strings. The frontend spec focuses on the UI layer only.
