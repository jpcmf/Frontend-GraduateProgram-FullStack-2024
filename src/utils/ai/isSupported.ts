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

  // DEBUG: Log browser info and all AI-related globals
   
  console.log("[isAIWriterSupported] Browser UA:", (globalThis as any).navigator?.userAgent);
   
  console.log("[isAIWriterSupported] globalThis.Rewriter:", (globalThis as any).Rewriter);
   
  console.log("[isAIWriterSupported] window.ai:", (globalThis as any).ai);
   
  console.log("[isAIWriterSupported] All AI globals:", {
    ai: (globalThis as any).ai,
    aiTextRewriter: (globalThis as any).aiTextRewriter,
    Rewriter: (globalThis as any).Rewriter,
    Writer: (globalThis as any).Writer,
    Translator: (globalThis as any).Translator,
    LanguageDetector: (globalThis as any).LanguageDetector,
    Summarizer: (globalThis as any).Summarizer,
    Prompt: (globalThis as any).Prompt
  });

  // The Rewriter API is a global (accessible via globalThis or window)
  // Check if Rewriter global exists and has required methods
  const hasRewriter = !!(
    (globalThis as any).Rewriter &&
    typeof (globalThis as any).Rewriter.create === "function" &&
    typeof (globalThis as any).Rewriter.availability === "function"
  );

   
  console.log("[isAIWriterSupported] hasRewriter:", hasRewriter);

  return hasRewriter;
}
