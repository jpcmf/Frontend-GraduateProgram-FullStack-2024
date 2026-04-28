import { NextRequest, NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import type { AIResponse } from "@/types/ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY!);

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
      return NextResponse.json({ error: "Message is required and must be a non-empty string" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser question: ${message}`
            }
          ]
        }
      ]
    });

    // Extract text from response
    const textContent = response.response.text();
    if (!textContent) {
      throw new Error("Empty response from AI");
    }

    // Parse JSON response
    let parsedResponse: AIResponse;
    try {
      parsedResponse = JSON.parse(textContent);
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
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
