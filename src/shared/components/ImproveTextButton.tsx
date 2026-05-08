import { useCallback } from "react";

import { Button, Tooltip } from "@chakra-ui/react";

import { useAIWriter } from "@/hooks/useAIWriter";
import { isAIWriterSupported } from "@/utils/ai/isSupported";

export interface ImproveTextButtonProps {
  /**
   * The current text to improve. Button is hidden if empty.
   */
  text: string;

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

  const handleClick = useCallback(async () => {
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
