import type { ObservabilityAdapter } from "./types";

/**
 * Delegates every ObservabilityAdapter method call to all registered adapters.
 *
 * This is what makes the adapter pattern scale beyond one vendor.
 * When obs.identify(userId) is called, BOTH Sentry and PostHog receive
 * the user identity in one call — the call site knows nothing about either.
 *
 * Adding a third provider (e.g. a custom logging tool):
 *   1. Create the provider file implementing ObservabilityAdapter
 *   2. Add an instance to the array in src/lib/observability/index.ts
 *   3. Zero call site changes required.
 */
export class CompositeAdapter implements ObservabilityAdapter {
  constructor(private readonly adapters: ObservabilityAdapter[]) {}

  init(): void {
    this.adapters.forEach(a => a.init());
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    this.adapters.forEach(a => a.identify(userId, traits));
  }

  reset(): void {
    this.adapters.forEach(a => a.reset());
  }

  captureError(error: Error, context?: Record<string, unknown>): void {
    this.adapters.forEach(a => a.captureError(error, context));
  }

  captureMessage(message: string, level?: "info" | "warning" | "error"): void {
    this.adapters.forEach(a => a.captureMessage(message, level));
  }

  trackEvent(name: string, properties?: Record<string, unknown>): void {
    this.adapters.forEach(a => a.trackEvent(name, properties));
  }

  trackPageView(path?: string): void {
    this.adapters.forEach(a => a.trackPageView(path));
  }
}
