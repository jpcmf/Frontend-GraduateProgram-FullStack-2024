import { NextRequest, NextResponse } from "next/server";

import { generateChatResponse } from "@/server/lib/gemini";
import type { AIResponse } from "@/types/ai";

export async function POST(request: NextRequest): Promise<NextResponse<AIResponse | { error: string }>> {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required and must be a non-empty string" }, { status: 400 });
    }

    const { answer, confidence } = await generateChatResponse({ message });

    return NextResponse.json({ answer, confidence });
  } catch (error) {
    console.error("[AI Chat API] Error:", error);
    return NextResponse.json({ error: "Deu ruim truta! Tente novamente." }, { status: 500 });
  }
}
