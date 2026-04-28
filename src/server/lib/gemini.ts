/**
 * Gemini API Client for SkateHub AI Assistant
 * Handles skateboarding Q&A and advice generation
 */

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface ChatOptions {
  message: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface ChatResult {
  answer: string;
}

const SYSTEM_PROMPT = `You are an experienced skateboarding instructor and community expert.

Rules:
- Explain concepts clearly and simply
- Use step-by-step instructions when helpful
- Prioritize safety (helmet, environment, progression)
- Answer only skateboarding-related questions
- If a question is not about skateboarding, politely redirect to skateboarding topics
- If unsure about something, say you don't know instead of guessing
- Keep responses concise but informative (2-4 paragraphs)
- Use encouraging and supportive tone`;

export async function generateChatResponse({ message }: ChatOptions): Promise<ChatResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_KEY environment variable is not set");
  }

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser question: ${message}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Gemini API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`
    );
  }

  const data = (await response.json()) as GeminiResponse;

  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!answer) {
    throw new Error("Invalid response structure from Gemini API");
  }

  return { answer };
}
