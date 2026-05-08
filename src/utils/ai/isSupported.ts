/**
 * Detects if the browser supports the Rewriter API for on-device text improvement.
 * The Rewriter API is available in Chrome 137-148 (Origin Trial) and Edge 137-148.
 *
 * API reference: https://developer.chrome.com/docs/ai/rewriter-api
 */
export function isAIWriterSupported(): boolean {
  // Check if we're in a browser environment (SSR safety)
  if (typeof globalThis === "undefined") {
    return false;
  }

  // The Rewriter API is a global (accessible via globalThis or window)
  // Check if Rewriter global exists and has required methods
  const hasRewriter = !!(
    (globalThis as any).Rewriter &&
    typeof (globalThis as any).Rewriter.create === "function" &&
    typeof (globalThis as any).Rewriter.availability === "function"
  );

  // DEBUG: Log what we find
  if (typeof globalThis !== "undefined") {
     
    console.log("[isAIWriterSupported] Rewriter:", (globalThis as any).Rewriter);
     
    console.log("[isAIWriterSupported] hasRewriter:", hasRewriter);
  }

  return hasRewriter;
}
