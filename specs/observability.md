# Feature: Observability Layer

**Status:** ready
**Priority:** high
**Affects:** `src/instrumentation.ts`, `src/lib/observability/`, `src/app/layout.tsx`, `src/app/providers.tsx`, `src/lib/apiClient.ts`, `src/contexts/AuthContext.tsx`, `next.config.ts`

## Problem Statement

SkateHub is in production with no visibility into errors, performance, or user behavior. Problems are only discovered when users report them. This feature adds a complete, vendor-swappable observability layer covering error tracking, performance monitoring, server tracing, and user analytics — without coupling any call site to a specific vendor SDK.

## UI / UX Description

No user-facing UI is added. All observability is passive instrumentation:

- Errors are automatically captured and sent to Sentry
- Core Web Vitals are measured from real user page loads via Vercel Speed Insights
- Page views are tracked automatically on every route change via PostHog
- Server-side `fetch()` calls to Strapi are traced automatically via `@vercel/otel`
- User identity is linked after sign-in and cleared after sign-out

## Data Requirements

No new API endpoints. All data flows outward to third-party services:

- **Sentry** — receives error reports (browser + server)
- **Vercel Speed Insights** — receives Core Web Vitals from the browser
- **Vercel Analytics** — receives page view events
- **PostHog** — receives custom events and page views
- **Vercel OTel collector** — receives server-side traces

## Component & File Plan

### New files

- `src/instrumentation.ts` — Next.js server boot hook; initializes `@vercel/otel` and Sentry server SDK
- `src/lib/observability/types.ts` — `ObservabilityAdapter` interface
- `src/lib/observability/noop.ts` — No-op adapter (dev / CI / tests)
- `src/lib/observability/index.ts` — `obs` singleton (the only import for call sites)
- `src/lib/observability/composite.ts` — Delegates calls to all registered adapters
- `src/lib/observability/providers/sentry.ts` — Sentry error tracking adapter
- `src/lib/observability/providers/posthog.ts` — PostHog analytics adapter
- `sentry.client.config.ts` — Sentry browser init
- `sentry.server.config.ts` — Sentry Node.js server init
- `sentry.edge.config.ts` — Sentry Edge runtime init

### Modified files

- `src/app/layout.tsx` — add `<SpeedInsights />` and `<Analytics />`
- `src/app/providers.tsx` — wrap with `PostHogProvider`
- `src/lib/apiClient.ts` — forward non-401 errors to `obs.captureError()`
- `src/contexts/AuthContext.tsx` — call `obs.identify()` on sign-in, `obs.reset()` on sign-out
- `next.config.ts` — wrap with `withSentryConfig` for source map upload
- `.env.example` — document all new environment variables

## Acceptance Criteria

- [ ] `obs.captureError()` sends an error visible in Sentry dashboard with TypeScript stack trace
- [ ] `obs.trackEvent()` sends an event visible in PostHog dashboard
- [ ] `obs.identify()` called after sign-in — errors in Sentry and events in PostHog are linked to the user
- [ ] `obs.reset()` called after sign-out — subsequent events are anonymous
- [ ] All non-401 Axios errors forwarded to `obs.captureError()` automatically from `apiClient.ts`
- [ ] `<SpeedInsights />` present in layout — CWV data visible in Vercel dashboard
- [ ] `<Analytics />` present in layout — page views visible in Vercel dashboard
- [ ] `@vercel/otel` initialized in `instrumentation.ts` — server fetch spans visible in Vercel trace viewer
- [ ] `NEXT_PUBLIC_OBSERVABILITY_ENABLED=false` disables Sentry and PostHog silently (noop adapter)
- [ ] No vendor imports (`posthog-js`, `@sentry/nextjs`) outside `src/lib/observability/` except Sentry config files
- [ ] No `any` types in new files
- [ ] `pnpm build` passes with no TypeScript errors

## Out of Scope

- Session replay tuning
- Feature flags or A/B testing via PostHog
- OTel trace export to external backend (Grafana, Honeycomb) — future phase
- Custom Sentry alert rules or dashboards
- User consent / cookie banner
