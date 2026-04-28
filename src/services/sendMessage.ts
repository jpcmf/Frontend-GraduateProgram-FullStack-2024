import { apiClient } from "@/lib/apiClient";
import type { AIResponse } from "@/types/ai";

export async function sendMessage(message: string): Promise<AIResponse> {
  const response = await apiClient.post("/api/ai/chat", { message });
  return response.data;
}
