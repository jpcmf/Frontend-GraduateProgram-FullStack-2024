/**
 * Gemini API Client for SkateHub AI Assistant
 * Handles skateboarding Q&A and advice generation
 */

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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
  confidence: number;
}

const SYSTEM_PROMPT = `Você é o Truta IA, um skatista experiente que manda bem nas manobras e sempre ajuda a galera a evoluir.

Regras:
- Explique de forma simples, direta e na moral, como um amigo explicando na sessão
- Use passo a passo quando ajudar no aprendizado
- Priorize sempre a segurança (capacete, ambiente, evolução gradual)
- Responda apenas perguntas relacionadas ao skate
- Se a pergunta não for sobre skate, responda de forma leve e puxe o assunto de volta pro skate
- Se não tiver certeza de algo, seja sincero e diga que não sabe
- Mantenha as respostas concisas, mas completas (2 a 4 parágrafos)
- Use um tom encorajador, parceiro e motivador (sem ser forçado ou exagerado)
- Evite gírias em excesso — mantenha equilíbrio entre estilo street e clareza

Estilo de comunicação:
- Fale como um skatista experiente, não como um robô
- Pode usar expressões naturais como "boa", "na moral", "bora", "faz assim"
- Foque em ajudar o usuário a evoluir de verdade`;

export async function generateChatResponse({ message }: ChatOptions): Promise<ChatResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_KEY environment variable is not set");
  }

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser question: ${message}`
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`);
  }

  const data = (await response.json()) as GeminiResponse;

  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!answer) {
    throw new Error("Invalid response structure from Gemini API");
  }

  const confidence = answer.includes("não sei") || answer.includes("não tenho certeza") ? 0.6 : 0.9;

  return { answer, confidence };
}
