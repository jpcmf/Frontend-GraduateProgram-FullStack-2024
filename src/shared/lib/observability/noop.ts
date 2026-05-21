import type { ObservabilityAdapter } from "./types";

/**
 * No-op implementation of ObservabilityAdapter.
 *
 * All methods are empty. Used when NEXT_PUBLIC_OBSERVABILITY_ENABLED is
 * not "true" — typically in local development and CI environments to avoid
 * polluting production analytics with test data.
 */
export class NoopAdapter implements ObservabilityAdapter {
  init(): void {}
  identify(_userId: string, _traits?: Record<string, unknown>): void {}
  reset(): void {}
  captureError(_error: Error, _context?: Record<string, unknown>): void {}
  captureMessage(_message: string, _level?: "info" | "warning" | "error"): void {}
  trackEvent(_name: string, _properties?: Record<string, unknown>): void {}
  trackPageView(_path?: string): void {}
}
