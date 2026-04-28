import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { AIResponse } from "@/types/ai";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `You are an experienced skateboarding instructor.

Rules:
- Explain concepts clearly and simply
- Use step-by-step instructions when helpful
- Prioritize safety (helmet, environment, progression)
- Answer only skateboarding-related questions
- If unsure, say you don't know instead of guessing

Return your response strictly in JSON format:
{
  "answer": string,
  "level": "beginner" | "intermediate" | "advanced",
  "confidence": number (0 to 1)
}`;

export async function POST(request: NextRequest): Promise<NextResponse<AIResponse | { error: string }>> {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    // Extract text from response
    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response format from AI");
    }

    // Parse JSON response
    let parsedResponse: AIResponse;
    try {
      parsedResponse = JSON.parse(content.text);
    } catch {
      throw new Error("Invalid JSON response from AI");
    }

    // Validate response structure
    if (
      typeof parsedResponse.answer !== "string" ||
      !["beginner", "intermediate", "advanced"].includes(parsedResponse.level) ||
      typeof parsedResponse.confidence !== "number" ||
      parsedResponse.confidence < 0 ||
      parsedResponse.confidence > 1
    ) {
      throw new Error("Response does not match expected schema");
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
