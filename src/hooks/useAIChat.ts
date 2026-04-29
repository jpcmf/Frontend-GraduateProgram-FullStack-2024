import { useState, useTransition } from "react";

import type { Message } from "@/types/ai";

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();

  const submitMessage = async (userMessage: string) => {
    const userId = `user-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      { id: userId, role: "user", content: userMessage }
    ]);

    startTransition(async () => {
      const assistantId = `assistant-${Date.now()}`;

      // Add empty assistant bubble immediately so it appears before tokens arrive
      setMessages(prev => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" }
      ]);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok || !response.body) {
          throw new Error("Stream response error");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter(line => line.startsWith("data: "));

          for (const line of lines) {
            const raw = line.slice("data: ".length).trim();
            if (raw === "[DONE]") break;

            try {
              const parsed = JSON.parse(raw) as {
                choices: Array<{ delta: { content?: string } }>;
              };
              const token = parsed.choices?.[0]?.delta?.content ?? "";

              if (token) {
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantId
                      ? { ...msg, content: msg.content + token }
                      : msg
                  )
                );
              }
            } catch {
              // Malformed chunk — skip silently
            }
          }
        }
      } catch {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantId
              ? { ...msg, content: "Deu ruim truta! Tente novamente." }
              : msg
          )
        );
      }
    });
  };

  return { messages, isPending, submitMessage };
}
