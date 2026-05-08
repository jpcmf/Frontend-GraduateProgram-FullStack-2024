/**
 * Detects if the browser supports the Rewriter API for on-device text improvement.
 * The Rewriter API is available in Chrome 132+ and Edge 132+.
 */
export function isAIWriterSupported(): boolean {
  // Check if we're in a browser environment (SSR safety)
  if (typeof window === "undefined") {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;

  // Check for the Rewriter API in different possible locations
  const hasRewriter =
    typeof win.ai?.rewriter?.rewrite === "function" ||
    typeof win.ai?.rewriter?.rewriteText === "function" ||
    typeof win.ai?.textRewriter?.rewrite === "function" ||
    typeof win.aiTextRewriter?.rewrite === "function";

  // DEBUG: Log for troubleshooting
  if (hasRewriter) {
    // eslint-disable-next-line no-console
    console.log("[isAIWriterSupported] Rewriter API detected");
  } else {
    // eslint-disable-next-line no-console
    console.log("[isAIWriterSupported] Rewriter API NOT found. window.ai:", win.ai);
  }

  return hasRewriter;
}


  // Check if the Rewriter API exists on the window object

  const win = window as any;
  return typeof win.ai?.rewriter?.rewrite === "function";
}
