/**
 * OpenRouter API Client for SkateHub AI Assistant
 * Handles skateboarding Q&A and advice generation
 * Free models available at openrouter.ai/models?q=free
 */
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Free models you can use (check openrouter.ai/models?q=free for updated list):
// - "meta-llama/llama-3.3-70b-instruct:free"
// - "deepseek/deepseek-r1:free"
// - "google/gemma-3-27b-it:free"
const MODEL = "meta-llama/llama-3.3-70b-instruct:free";

export interface ChatOptions {
  message: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
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
- Não traduza para o português brasileiro algumas palavras técnicas do skate, como "ollie", "kickflip", "grind", "nose", "tail", "concave", etc. Use os termos originais em inglês para manter a autenticidade
Estilo de comunicação:
- Fale como um skatista experiente, não como um robô
- Pode usar expressões naturais como "boa", "na moral", "bora", "faz assim"
- Foque em ajudar o usuário a evoluir de verdade`;

export async function generateChatResponse({ message }: ChatOptions): Promise<ChatResult> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      // Optional but recommended by OpenRouter for app identification
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "SkateHub AI"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message ?? "Unknown error"}`);
  }

  const data = (await response.json()) as OpenRouterResponse;
  const answer = data.choices?.[0]?.message?.content;

  if (!answer) {
    throw new Error("Invalid response structure from OpenRouter API");
  }

  const confidence = answer.includes("não sei") || answer.includes("não tenho certeza") ? 0.6 : 0.9;

  return { answer, confidence };
}

export async function streamChatResponse({ message }: ChatOptions): Promise<ReadableStream<Uint8Array>> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "SkateHub AI"
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message ?? "Unknown error"}`);
  }

  if (!response.body) {
    throw new Error("No response body from OpenRouter");
  }

  return response.body;
}
