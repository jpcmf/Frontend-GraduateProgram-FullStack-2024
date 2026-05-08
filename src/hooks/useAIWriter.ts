import { useCallback, useState } from "react";

import { isAIWriterSupported } from "@/utils/ai/isSupported";

export interface UseAIWriterState {
  isLoading: boolean;
  error: string | null;
}

export interface UseAIWriterOptions {
  sharedContext?: string;
  tone?: "more-casual" | "neutral" | "more-formal";
  improveContext?: string;
}

export interface UseAIWriterResult extends UseAIWriterState {
  improveText: (text: string, options?: UseAIWriterOptions) => Promise<string | null>;
}

/**
 * Hook to handle on-device text improvement using the browser's writing APIs.
 * Tries Rewriter API first, falls back to Writer API.
 * Returns the improved text or null if an error occurs.
 *
 * Supports dynamic context via the improveText callback.
 * Use by passing context object:
 *   improveText(text, { context: "..." })
 *
 * API references:
 * - https://developer.chrome.com/docs/ai/rewriter-api
 * - https://developer.chrome.com/docs/ai/writer-api
 *
 * @returns Object with isLoading flag, error message, and improveText function
 */
export interface UseAIWriterOptions {
  sharedContext?: string;
  tone?: "more-casual" | "neutral" | "more-formal";
  improveContext?: string;
}

export function useAIWriter(options?: UseAIWriterOptions): UseAIWriterResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const improveText = useCallback(
    async (text: string, customOptions?: UseAIWriterOptions): Promise<string | null> => {
      // Merge default and custom options
      const mergedOptions = { ...options, ...customOptions };
      const {
        sharedContext = "Você está melhorando uma descrição de um local para um guia de pistas de skate.",
        tone = "neutral",
        improveContext = "Melhore esta descrição em português clarificando o terreno, obstáculos e espaço. Mantenha conciso e útil. Responda APENAS com o texto melhorado, sem explicações."
      } = mergedOptions;

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const globalScope = globalThis as any;
        let improvedText: string | null = null;

        // Try Rewriter API first (dedicated for rewriting)
        if (globalScope.Rewriter && typeof globalScope.Rewriter.create === "function") {
          const availability = await globalScope.Rewriter.availability();
          if (availability !== "unavailable") {
            const rewriter = await globalScope.Rewriter.create({
              sharedContext,
              tone,
              format: "plain-text",
              length: "same",
              expectedInputLanguages: ["pt-BR"],
              expectedContextLanguages: ["pt-BR"],
              outputLanguage: "pt-BR"
            });
            improvedText = await rewriter.rewrite(text);
          }
        }

        // Fallback to Writer API if Rewriter didn't work
        if (
          !improvedText &&
          globalScope.Writer &&
          typeof globalScope.Writer.create === "function"
        ) {
          const availability = await globalScope.Writer.availability();
          if (availability !== "unavailable") {
            const writer = await globalScope.Writer.create({
              sharedContext,
              tone
            });
            // Use Writer to generate an improved version of the text
            improvedText = await writer.write(text, {
              context: improveContext
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
        setIsLoading(false);
        return null;
      }
    },
    [options]
  );

  return {
    isLoading,
    error,
    improveText
  };
}
