import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Node.js server initialization.
 * Loaded from src/instrumentation.ts when NEXT_RUNTIME === "nodejs".
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  enabled: process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === "true"
});
