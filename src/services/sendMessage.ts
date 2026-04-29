import type { AIResponse } from "@/types/ai";

export async function sendMessage(message: string): Promise<AIResponse> {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}
