import { useState, useTransition } from "react";

import { sendMessage } from "@/services/sendMessage";
import type { Message } from "@/types/ai";

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();

  const submitMessage = async (userMessage: string) => {
    // Add user message to chat
    const userId = `user-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      {
        id: userId,
        role: "user",
        content: userMessage
      }
    ]);

    // Fetch assistant response
    startTransition(async () => {
      try {
        const response = await sendMessage(userMessage);

        // Add assistant message to chat
        const assistantId = `assistant-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: response.answer
          }
        ]);
      } catch (error) {
        // Add error message to chat
        const errorId = `error-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: errorId,
            role: "assistant",
            content: "Something went wrong. Please try again."
          }
        ]);
      }
    });
  };

  return {
    messages,
    isPending,
    submitMessage
  };
}
