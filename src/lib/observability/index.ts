import { PostHogAdapter } from "./providers/posthog";
import { SentryAdapter } from "./providers/sentry";
import { CompositeAdapter } from "./composite";
import { NoopAdapter } from "./noop";
import type { ObservabilityAdapter } from "./types";

/**
 * Central observability singleton.
 *
 * This is the only import call sites should ever use:
 *   import { obs } from "@/lib/observability"
 *
 * Current providers (when NEXT_PUBLIC_OBSERVABILITY_ENABLED=true):
 *   - SentryAdapter  → captureError, captureMessage, identify, reset
 *   - PostHogAdapter → trackEvent, trackPageView, identify, reset
 *
 * Both adapters receive identify() and reset() calls simultaneously via
 * CompositeAdapter — so sign-in/sign-out links the user in both Sentry
 * and PostHog in a single obs.identify() call from AuthContext.
 *
 * To add a third provider: create a provider file, add an instance below.
 * To swap a provider: replace the instance below.
 * In both cases: zero call site changes required.
 */
const enabled = process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === "true";

export const obs: ObservabilityAdapter = enabled
  ? new CompositeAdapter([new SentryAdapter(), new PostHogAdapter()])
  : new NoopAdapter();

export type { ObservabilityAdapter };
