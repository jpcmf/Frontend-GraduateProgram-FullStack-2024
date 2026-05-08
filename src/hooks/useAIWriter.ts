import { useCallback, useState } from "react";

import { isAIWriterSupported } from "@/utils/ai/isSupported";

export interface UseAIWriterState {
  isLoading: boolean;
  error: string | null;
}

export interface UseAIWriterResult extends UseAIWriterState {
  improveText: (text: string) => Promise<string | null>;
}

/**
 * Hook to handle on-device text improvement using the browser's writing APIs.
 * Tries Rewriter API first, falls back to Writer API.
 * Returns the improved text or null if an error occurs.
 *
 * API references:
 * - https://developer.chrome.com/docs/ai/rewriter-api
 * - https://developer.chrome.com/docs/ai/writer-api
 *
 * @returns Object with isLoading flag, error message, and improveText function
 */
export function useAIWriter(): UseAIWriterResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const improveText = useCallback(async (text: string): Promise<string | null> => {
    // Check if API is supported
    if (!isAIWriterSupported()) {
      setError("Text improvement is not supported in this browser");
      return null;
    }

    // Validate input
    if (!text || text.trim().length === 0) {
      setError("Cannot improve empty text");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
       
      const globalScope = globalThis as any;
      let improvedText: string | null = null;

      // Try Rewriter API first (dedicated for rewriting)
      if (globalScope.Rewriter && typeof globalScope.Rewriter.create === "function") {
         
        console.log("[useAIWriter] Using Rewriter API");

        const availability = await globalScope.Rewriter.availability();
        if (availability !== "unavailable") {
          const rewriter = await globalScope.Rewriter.create({
            sharedContext: "This is a spot description for a skateboarding spot guide.",
            tone: "neutral",
            format: "plain-text",
            length: "same"
          });
          improvedText = await rewriter.rewrite(text);
        }
      }

      // Fallback to Writer API if Rewriter didn't work
      if (!improvedText && globalScope.Writer && typeof globalScope.Writer.create === "function") {
         
        console.log("[useAIWriter] Using Writer API (fallback)");

        const availability = await globalScope.Writer.availability();
        if (availability !== "unavailable") {
          const writer = await globalScope.Writer.create({
            sharedContext:
              "You are improving a skateboarding spot description to make it clearer and more useful for other skaters.",
            tone: "casual"
          });
          // Use Writer to generate an improved version of the text
          improvedText = await writer.write(text, {
            context:
              "Improve this spot description by clarifying the terrain, obstacles, and space. Keep it concise and useful."
          });
        }
      }

      if (!improvedText) {
        setError("Failed to improve text - APIs unavailable");
        setIsLoading(false);
        return null;
      }

      setIsLoading(false);
      return improvedText;
    } catch (err) {
      // Don't expose raw error messages to users
      setError("Failed to improve text. Please try again.");
       
      console.error("[useAIWriter] Error:", err);
      setIsLoading(false);
      return null;
    }
  }, []);

  return {
    isLoading,
    error,
    improveText
  };
}
