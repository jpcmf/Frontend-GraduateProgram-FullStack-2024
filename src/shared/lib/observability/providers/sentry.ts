import * as Sentry from "@sentry/nextjs";

import type { ObservabilityAdapter } from "../types";

/**
 * Sentry error tracking adapter.
 *
 * Sentry is initialized by:
 *   - sentry.client.config.ts (browser)
 *   - src/instrumentation.ts → sentry.server.config.ts (Node.js server)
 *   - src/instrumentation.ts → sentry.edge.config.ts (Edge runtime)
 *
 * This adapter exposes Sentry's capture methods through the ObservabilityAdapter
 * interface. Call sites never import @sentry/nextjs directly — they use obs.
 *
 * To swap Sentry for another error tracker (e.g. GlitchTip self-hosted):
 *   1. Create src/lib/observability/providers/glitchtip.ts implementing ObservabilityAdapter
 *   2. Replace SentryAdapter with GlitchTipAdapter in src/lib/observability/index.ts
 *   3. No call site changes required.
 */
export class SentryAdapter implements ObservabilityAdapter {
  init(): void {
    // Sentry initializes via its config files — nothing to do here.
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    // Associates this user with all subsequent errors in Sentry.
    // Visible in Sentry dashboard on each issue: "Affected users: X"
    Sentry.setUser({ id: userId, ...traits });
  }

  reset(): void {
    // Removes the user association — call on sign-out.
    Sentry.setUser(null);
  }

  captureError(error: Error, context?: Record<string, unknown>): void {
    Sentry.withScope(scope => {
      if (context) scope.setExtras(context);
      Sentry.captureException(error);
    });
  }

  captureMessage(message: string, level: "info" | "warning" | "error" = "info"): void {
    Sentry.captureMessage(message, level);
  }

  trackEvent(_name: string, _properties?: Record<string, unknown>): void {
    // Sentry does not handle analytics events.
    // Events are handled by PostHogAdapter.
  }

  trackPageView(_path?: string): void {
    // Sentry does not handle page views.
    // Page views are handled by PostHogAdapter.
  }
}
