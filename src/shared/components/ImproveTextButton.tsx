import { useCallback } from "react";

import { Button, Tooltip } from "@chakra-ui/react";

import { useAIWriter } from "@/hooks/useAIWriter";
import { isAIWriterSupported } from "@/utils/ai/isSupported";

export interface ImproveTextButtonProps {
  /**
   * The current text to improve. Button is hidden if empty or undefined.
   */
  text?: string;

  /**
   * Callback fired when text is successfully improved.
   * Called with the new improved text.
   */
  onImprove: (improvedText: string) => void;

  /**
   * Optional CSS class to apply to the button
   */
  className?: string;
}

/**
 * "Improve text" button component that triggers on-device text rewriting.
 * Uses the browser's native Rewriter API.
 *
 * Features:
 * - Hidden on unsupported browsers
 * - Hidden when text field is empty
 * - Shows loading state during rewriting
 * - Calls onImprove callback with the improved text
 * - Gracefully handles errors without UI disruption
 */
export function ImproveTextButton({ text, onImprove, className }: ImproveTextButtonProps) {
  const { isLoading, improveText } = useAIWriter();
  const isSupported = isAIWriterSupported();
  const isEmpty = !text || text.trim().length === 0;

  // Temporary debug logging - REMOVE BEFORE COMMIT
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasAPI = typeof (window as any).ai?.rewriter?.rewrite === "function";
    if (text && text.length > 0) {
      // Only log when there's text to reduce noise
      // eslint-disable-next-line no-console
      console.log(
        "[ImproveTextButton] Debug - hasAPI:",
        hasAPI,
        "isSupported:",
        isSupported,
        "isEmpty:",
        isEmpty,
        "text length:",
        text.length
      );
    }
  }

  const handleClick = useCallback(async () => {
    if (!text) return;
    const improvedText = await improveText(text);
    if (improvedText) {
      onImprove(improvedText);
    }
  }, [text, improveText, onImprove]);

  // Hide button if feature not supported or text is empty
  if (!isSupported || isEmpty) {
    return null;
  }

  return (
    <Tooltip label="Improve text clarity and structure using AI">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleClick}
        isLoading={isLoading}
        loadingText="Improving..."
        className={className}
      >
        Improve text
      </Button>
    </Tooltip>
  );
}
