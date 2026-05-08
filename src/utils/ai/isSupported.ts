/**
 * Detects if the browser supports the Rewriter API for on-device text improvement.
 * The Rewriter API is available in Chrome 132+ and Edge 132+.
 */
export function isAIWriterSupported(): boolean {
  // Check if we're in a browser environment (SSR safety)
  if (typeof window === "undefined") {
    return false;
  }

  // Check if the Rewriter API exists on the window object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return typeof win.ai?.rewriter?.rewrite === "function";
}
