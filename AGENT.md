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

- Pages live in `src/pages/` (Next.js file-system routing)
- Route protection is handled centrally in `src/middleware.ts` — do not add `getServerSideProps` guards in individual pages unless strictly necessary
- Feature UI lives in `src/features/<feature-name>/` — one folder per feature with `index.tsx` as the entry point
- Shared reusable components live in `src/components/`
- All API calls go through `src/lib/apiClient.ts` (Axios instance with base URL + 401 interceptor) — never use bare `axios`
- Service functions live in `src/services/<verb><Entity>.ts` (e.g. `getSpots.ts`, `createSpot.ts`)
- TanStack Query hooks live in `src/hooks/use<Entity>.ts` — one hook per resource
- Types for API responses live in `src/types/<feature>.ts`
- Auth state is accessed via the `useAuth` hook (`src/hooks/useAuth.ts`) — never import `AuthContext` directly

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
