import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Edge runtime initialization.
 * Loaded from src/instrumentation.ts when NEXT_RUNTIME === "edge".
 * The Edge runtime runs middleware and Edge API routes.
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  enabled: process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === "true"
});
