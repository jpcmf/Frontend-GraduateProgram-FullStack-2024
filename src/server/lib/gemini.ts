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

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface ChatAnalysis {
  answer: string;
  confidence: number;
}

/**
 * Builds the system prompt for skateboarding assistance
 */
function buildSystemPrompt(): string {
  return `You are an experienced skateboarding instructor and community expert.

Rules:
- Explain concepts clearly and simply
- Use step-by-step instructions when helpful
- Prioritize safety (helmet, environment, progression)
- Answer only skateboarding-related questions
- If a question is not about skateboarding, politely redirect to skateboarding topics
- If unsure about something, say you don't know instead of guessing
- Keep responses concise but informative (2-4 paragraphs)
- Use encouraging and supportive tone`;
}

/**
 * Generates AI feedback for skateboarding Q&A using Google Gemini
 * Implements timeout handling and automatic retry logic
 */
export async function generateChatResponse({
  message,
}: ChatOptions): Promise<ChatAnalysis> {
  if (!GEMINI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_KEY environment variable is not set");
  }

  const systemPrompt = buildSystemPrompt();

  // Retry configuration
  const MAX_RETRIES = 3;
  const INITIAL_DELAY = 1000; // 1 second
  const API_TIMEOUT = 30000; // 30 seconds per request

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `[Gemini] Calling Gemini API (attempt ${attempt}/${MAX_RETRIES})...`
      );

      // Create abort controller with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      try {
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
                    text: `${systemPrompt}\n\nUser question: ${message}`,
                  },
                ],
              },
            ],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log("[Gemini] Response status:", response.status);

        if (!response.ok) {
          const error = await response.json();
          console.error("[Gemini] API error response:", error);
          throw new Error(
            `Gemini API error: ${response.status} - ${error.error?.message || "Unknown error"}`
          );
        }

        const data = (await response.json()) as GeminiResponse;

        if (
          !data.candidates ||
          !data.candidates[0]?.content?.parts?.[0]?.text
        ) {
          console.error("[Gemini] Invalid response structure:", data);
          throw new Error("Invalid response structure from Gemini API");
        }

        const answer = data.candidates[0].content.parts[0].text;
        console.log(
          "[Gemini] Response generated successfully, length:",
          answer.length
        );

        // Calculate confidence based on response quality
        let confidence = 0.85; // Default high confidence
        if (answer.includes("don't know") || answer.includes("not sure")) {
          confidence = 0.6;
        } else if (answer.includes("skateboard") || answer.includes("skating")) {
          confidence = 0.95; // High confidence for on-topic responses
        }

        return {
          answer,
          confidence,
        };
      } catch (fetchError) {
        if (
          fetchError instanceof Error &&
          fetchError.name === "AbortError"
        ) {
          lastError = new Error(`Gemini API request timeout (${API_TIMEOUT}ms)`);
          console.error(
            `[Gemini] ${lastError.message}, attempt ${attempt}/${MAX_RETRIES}`
          );
        } else {
          lastError =
            fetchError instanceof Error
              ? fetchError
              : new Error(String(fetchError));
          console.error(
            `[Gemini] Request failed on attempt ${attempt}/${MAX_RETRIES}:`,
            lastError.message
          );
        }

        // If this is not the last attempt, wait and retry
        if (attempt < MAX_RETRIES) {
          const delayMs = INITIAL_DELAY * Math.pow(2, attempt - 1);
          console.log(`[Gemini] Retrying in ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    } catch (error) {
      // Outer catch for any sync errors
      lastError =
        error instanceof Error ? error : new Error(String(error));
      console.error(
        `[Gemini] Unexpected error on attempt ${attempt}/${MAX_RETRIES}:`,
        lastError.message
      );

      if (attempt < MAX_RETRIES) {
        const delayMs = INITIAL_DELAY * Math.pow(2, attempt - 1);
        console.log(`[Gemini] Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // All retries exhausted
  throw new Error(
    `Failed to generate response after ${MAX_RETRIES} attempts: ${lastError?.message || "Unknown error"}`
  );
}
