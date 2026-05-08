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
        // Call the browser Rewriter API - try different possible APIs
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any;
        let rewriteFunc = null;

        // Try different possible API locations
        if (typeof win.ai?.rewriter?.rewrite === "function") {
          rewriteFunc = win.ai.rewriter.rewrite;
        } else if (typeof win.ai?.rewriter?.rewriteText === "function") {
          rewriteFunc = win.ai.rewriter.rewriteText;
        } else if (typeof win.ai?.textRewriter?.rewrite === "function") {
          rewriteFunc = win.ai.textRewriter.rewrite;
        } else if (typeof win.aiTextRewriter?.rewrite === "function") {
          rewriteFunc = win.aiTextRewriter.rewrite;
        }

        if (!rewriteFunc) {
          setError("Rewriter API not found");
          setIsLoading(false);
          return null;
        }

        const improvedText = await rewriteFunc(text);

        setIsLoading(false);
        return improvedText || null;
      } catch (_err) {
        // Don't expose raw error messages to users
        setError("Failed to improve text. Please try again.");
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
