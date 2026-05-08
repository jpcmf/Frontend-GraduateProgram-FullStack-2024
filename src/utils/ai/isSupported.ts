/**
 * Detects if the browser supports AI text improvement for on-device text enhancement.
 *
 * Priority order (Chrome 148+):
 * 1. Rewriter API (dedicated for rewriting) — Chrome 137-148 origin trial
 * 2. Writer API (fallback for rewriting) — Chrome 137-148 origin trial, currently available
 *
 * API reference:
 * - https://developer.chrome.com/docs/ai/rewriter-api
 * - https://developer.chrome.com/docs/ai/writer-api
 */
export function isAIWriterSupported(): boolean {
  // Check if we're in a browser environment (SSR safety)
  if (typeof globalThis === "undefined") {
    return false;
  }

  // Check for Rewriter API (primary, dedicated for rewriting)
  const hasRewriter = !!(
    (globalThis as any).Rewriter &&
    typeof (globalThis as any).Rewriter.create === "function" &&
    typeof (globalThis as any).Rewriter.availability === "function"
  );

  // Check for Writer API (fallback for rewriting)
  const hasWriter = !!(
    (globalThis as any).Writer &&
    typeof (globalThis as any).Writer.create === "function" &&
    typeof (globalThis as any).Writer.availability === "function"
  );

  // Support either API
  return hasRewriter || hasWriter;
}
