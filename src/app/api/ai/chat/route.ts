import { NextRequest } from "next/server";

import { streamChatResponse } from "@/server/lib/openrouter";
// To use Gemini instead, swap the import above to:
// import { streamChatResponse } from "@/server/lib/gemini";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { message } = body as { message: unknown };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Message is required and must be a non-empty string" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const stream = await streamChatResponse({ message });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Deu ruim truta! Tente novamente." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
