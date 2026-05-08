import { useCallback } from "react";
import { RiLightbulbFlashLine } from "react-icons/ri";

import { Button, Tooltip } from "@chakra-ui/react";

import { useAIWriter, type UseAIWriterOptions } from "@/hooks/useAIWriter";
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

  /**
   * Optional AI writing context options (shared context, tone, improve context).
   * Use this to customize behavior for different use cases (e.g., spot descriptions vs user profiles).
   */
  aiOptions?: UseAIWriterOptions;
}

/**
 * "Improve text" button component that triggers on-device text rewriting.
 * Uses the browser's native Rewriter API (with Writer API fallback).
 *
 * Features:
 * - Hidden on unsupported browsers
 * - Hidden when text field is empty
 * - Shows loading state during rewriting
 * - Calls onImprove callback with the improved text
 * - Gracefully handles errors without UI disruption
 * - Supports custom AI context for different use cases
 *
 * @example
 * // For spot descriptions (default)
 * <ImproveTextButton text={text} onImprove={setText} />
 *
 * @example
 * // For user profiles with custom context
 * <ImproveTextButton
 *   text={bio}
 *   onImprove={setBio}
 *   aiOptions={{
 *     sharedContext: "You are improving a user profile bio.",
 *     improveContext: "Make it more engaging and concise."
 *   }}
 * />
 */
export function ImproveTextButton({
  text,
  onImprove,
  className,
  aiOptions
}: ImproveTextButtonProps) {
  const { isLoading, improveText } = useAIWriter();
  const isSupported = isAIWriterSupported();
  const isEmpty = !text || text.trim().length === 0;

  const handleClick = useCallback(async () => {
    if (!text) return;
    const improvedText = await improveText(text, aiOptions);
    if (improvedText) {
      onImprove(improvedText);
    }
  }, [text, improveText, onImprove, aiOptions]);

  // Hide button if feature not supported or text is empty
  if (!isSupported || isEmpty) {
    return null;
  }

  return (
    <Tooltip label="Melhore a clareza e a estrutura do texto usando IA.">
      <Button
        size="sm"
        variant="link"
        colorScheme="green"
        onClick={handleClick}
        isLoading={isLoading}
        loadingText="Aprimorando texto com IA..."
        className={className}
        position="absolute"
        right={0}
        display="flex"
        gap={1}
      >
        <RiLightbulbFlashLine size={18} />
        Aprimorar texto com IA
      </Button>
    </Tooltip>
  );
}
