import { NextRequest } from "next/server";
import { parseCookies } from "nookies";

import { streamChatResponse } from "@/server/lib/openrouter";

export async function POST(request: NextRequest): Promise<Response> {
  // Hard auth gate — never call the AI provider for unauthenticated requests
  const cookies = parseCookies({ req: request } as never);
  const token = cookies["auth.token"] ?? request.cookies.get("auth.token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

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
