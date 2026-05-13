/**
 * The contract every observability provider must implement.
 *
 * Call sites import only `obs` from `@/lib/observability` — they never
 * reference this interface or any vendor SDK directly. This means swapping
 * a vendor (e.g. Sentry → GlitchTip) requires changing only the provider
 * file and index.ts — zero call site changes.
 */
export interface ObservabilityAdapter {
  /** Called once at app boot on the client side. */
  init(): void;

  /**
   * Link all subsequent events and errors to a known user.
   * Call after a successful sign-in.
   * @param userId  - Stable user identifier (e.g. Strapi user ID as string)
   * @param traits  - Optional user properties (e.g. { email })
   */
  identify(userId: string, traits?: Record<string, unknown>): void;

  /**
   * Unlink the current user session.
   * Call on sign-out so subsequent events are recorded as anonymous.
   */
  reset(): void;

  /**
   * Send a caught or unexpected error to the error tracking provider.
   * @param error   - The Error object
   * @param context - Additional key/value metadata (e.g. { url, status })
   */
  captureError(error: Error, context?: Record<string, unknown>): void;

  /**
   * Send a custom log message (not an Error object) to the error tracker.
   * Useful for recording non-fatal warnings that need attention.
   */
  captureMessage(message: string, level?: "info" | "warning" | "error"): void;

  /**
   * Record a user action or business event.
   * @example obs.trackEvent("spot_created", { spotId: 42 })
   * @example obs.trackEvent("story_viewed", { storyId, authorId })
   */
  trackEvent(name: string, properties?: Record<string, unknown>): void;

  /**
   * Record a page view.
   * Called automatically by PostHogProvider on every route change.
   * Only call manually in unusual navigation scenarios.
   */
  trackPageView(path?: string): void;
}
