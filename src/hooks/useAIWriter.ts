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
 * Hook to handle on-device text improvement using the browser's Rewriter API.
 * Returns the improved text or null if an error occurs.
 *
 * API reference: https://developer.chrome.com/docs/ai/rewriter-api
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
      // Access the global Rewriter API
       
      const RewriterAPI = (globalThis as any).Rewriter;

      if (!RewriterAPI) {
        setError("Rewriter API not available");
        setIsLoading(false);
        return null;
      }

      // Check availability before creating rewriter
      const availability = await RewriterAPI.availability();
      if (availability === "unavailable") {
        setError("Rewriter API is unavailable in this browser");
        setIsLoading(false);
        return null;
      }

      // Create rewriter instance with default options
      const rewriter = await RewriterAPI.create({
        sharedContext: "This is a spot description for a skateboarding spot guide.",
        tone: "neutral",
        format: "plain-text",
        length: "same"
      });

      // Call rewrite to improve the text
      const improvedText = await rewriter.rewrite(text);

      setIsLoading(false);
      return improvedText || null;
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
