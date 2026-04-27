import posthog from "posthog-js";

import type { ObservabilityAdapter } from "../types";

/**
 * PostHog analytics adapter.
 *
 * PostHog is initialized via PostHogProvider in src/app/providers.tsx.
 * This adapter exposes PostHog's capture methods through the ObservabilityAdapter
 * interface. Call sites never import posthog-js directly — they use obs.
 *
 * Free tier: 1,000,000 events/month, 1-year retention, 5,000 session replays/month.
 *
 * To swap PostHog for another analytics tool (e.g. Umami self-hosted):
 *   1. Create a new provider file implementing ObservabilityAdapter
 *   2. Replace PostHogAdapter in src/lib/observability/index.ts
 *   3. Zero call site changes required.
 */
export class PostHogAdapter implements ObservabilityAdapter {
  init(): void {
    // PostHog initializes via PostHogProvider in providers.tsx — nothing to do here.
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    // Links this device/session to a known user in PostHog.
    // After this call, all events are attributed to userId in the PostHog dashboard.
    posthog.identify(userId, traits);
  }

  reset(): void {
    // Unlinks the user — call on sign-out.
    // Subsequent events will be recorded as a new anonymous user.
    posthog.reset();
  }

  captureError(_error: Error, _context?: Record<string, unknown>): void {
    // Error tracking is handled by SentryAdapter — PostHog does not receive errors.
  }

  captureMessage(_message: string, _level?: "info" | "warning" | "error"): void {
    // Not applicable for PostHog.
  }

  trackEvent(name: string, properties?: Record<string, unknown>): void {
    posthog.capture(name, properties);
  }

  trackPageView(path?: string): void {
    // PostHogProvider captures page views automatically on route changes.
    // This method handles manual page view calls for unusual navigation scenarios.
    posthog.capture("$pageview", path ? { $current_url: path } : undefined);
  }
}
