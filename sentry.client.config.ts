import * as Sentry from "@sentry/nextjs";

/**
 * Sentry browser (client-side) initialization.
 * Loaded automatically by @sentry/nextjs when the app boots in the browser.
 *
 * tracesSampleRate: percentage of page loads that include a performance trace.
 * 0.1 = 10% — safe for production. Increase if you need more trace coverage.
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  enabled: process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === "true",
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0
});
