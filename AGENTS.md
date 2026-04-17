# SkateHub Frontend — Agent Rules

## Project Context

This is the **Next.js 14 frontend** for SkateHub, a social platform for the skateboarding community.
Built with TypeScript, Chakra UI, TanStack Query, and a custom cookie-based auth system backed by Strapi.
Read `docs/TECHNICAL_ANALYSIS.md` for the full architecture analysis and known issues.
Read the backend spec files at `/Users/joaopaulo/www/pucrs/project/skatehub-strapi/specs/` for API contracts.

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

- Pages live in `src/app/` (App Router file-system routing)
- Route protection is handled in `src/app/(protected)/layout.tsx` with `useAuth()` hook — do not add auth checks in individual pages
- Public routes in `src/app/(public)/` — no auth required
- Protected routes in `src/app/(protected)/` — requires authentication
- Feature UI lives in `src/features/<feature-name>/` — one folder per feature with `index.tsx` as the entry point
- Shared reusable components live in `src/components/`
- All API calls go through `src/lib/apiClient.ts` (Axios instance with base URL + 401 interceptor) — never use bare `axios`
- Service functions live in `src/services/<verb><Entity>.ts` (e.g. `getSpots.ts`, `createSpot.ts`)
- TanStack Query hooks live in `src/hooks/use<Entity>.ts` — one hook per resource
- Types for API responses live in `src/types/<feature>.ts`
- Auth state is accessed via the `useAuth` hook (`src/hooks/useAuth.ts`) — never import `AuthContext` directly

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
