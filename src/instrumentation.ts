import { registerOTel } from "@vercel/otel";

/**
 * Next.js server instrumentation hook.
 * Called once at server boot — never in the browser.
 * See: https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry
 */
export async function register() {
  /**
   * @vercel/otel — zero-config OpenTelemetry server tracing.
   *
   * Automatically instruments (no code changes required):
   *   - All fetch() calls from Server Components and API routes to Strapi
   *   - Incoming HTTP requests to Next.js API routes
   *   - Middleware execution time
   *
   * Traces are visible at: Vercel dashboard → Observability → Traces
   *
   * Because this uses the standard OTel format, adding an external trace
   * backend later (Grafana Cloud, Honeycomb, Datadog) is a config-only change
   * here — no application code changes required.
   */
  registerOTel({ serviceName: "skatehub" });

  /**
   * Sentry server-side initialization.
   *
   * Guarded by NEXT_RUNTIME so the correct config file is loaded for each
   * runtime environment:
   *   - "nodejs"  → full Node.js Sentry SDK (API routes, Server Components)
   *   - "edge"    → lightweight Edge Sentry SDK (middleware, Edge API routes)
   *
   * Dynamic imports are required here — static imports would load both
   * configs in all runtimes, causing errors.
   */
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}
