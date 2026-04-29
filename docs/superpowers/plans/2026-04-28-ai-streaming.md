# AI Assistant Streaming Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-shot AI response with true token-by-token streaming so the assistant message appears and grows in real time, like ChatGPT or Claude.ai.

**Architecture:** The API route pipes an SSE stream from the active provider directly to the browser as a `ReadableStream`. Both `openrouter.ts` and `gemini.ts` export an identical `streamChatResponse` signature — Gemini's response is normalized into OpenRouter-compatible SSE format via a `TransformStream`. The `useAIChat` hook reads the stream chunk-by-chunk and appends each token to the in-progress assistant message in React state. The Chat and Message components require no structural changes.

**Tech Stack:** Next.js App Router streaming (`Response` with `ReadableStream`), OpenRouter `stream: true`, Gemini `streamGenerateContent?alt=sse`, browser `ReadableStream` / `TextDecoder`, `TransformStream`, existing Chakra UI components.

---

## File Structure

### Modified files

- `src/server/lib/openrouter.ts` — add `streamChatResponse` returning raw SSE as `ReadableStream`
- `src/server/lib/gemini.ts` — add `streamChatResponse` returning Gemini SSE normalized to OpenRouter format via `TransformStream`
- `src/app/api/ai/chat/route.ts` — pipe the provider stream back to the client (swap import to switch providers)
- `src/hooks/useAIChat.ts` — replace `sendMessage` with streaming fetch + token-by-token state updates

> **Provider switching:** both providers export the same `streamChatResponse({ message }): Promise<ReadableStream<Uint8Array>>` signature. To switch, change only the import in `route.ts`.

### Deleted files

- `src/services/sendMessage.ts` — no longer used after hook rewrite

---

## Task 1: Add `streamChatResponse` to OpenRouter client

**Files:**

- Modify: `src/server/lib/openrouter.ts`

- [ ] **Step 1: Append `streamChatResponse` to `src/server/lib/openrouter.ts`**

Add after the existing `generateChatResponse` function:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/server/lib/openrouter.ts
git commit -m "feat: add streamChatResponse to OpenRouter client"
```

---

## Task 2: Add `streamChatResponse` to Gemini client

**Files:**

- Modify: `src/server/lib/gemini.ts`

Gemini's streaming endpoint is `streamGenerateContent?alt=sse`. Its SSE chunks have a different shape than OpenRouter's. We normalize them inside a `TransformStream` so the hook's parser works identically for both providers.

- Gemini chunk: `data: {"candidates":[{"content":{"parts":[{"text":"token"}]}}]}`
- Normalized output: `data: {"choices":[{"delta":{"content":"token"}}]}`

- [ ] **Step 1: Add the streaming URL constant**

After the existing `GEMINI_API_URL` line in `src/server/lib/gemini.ts`, add:

```typescript
const GEMINI_STREAM_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse";
```

- [ ] **Step 2: Append `streamChatResponse` to `src/server/lib/gemini.ts`**

Add after the existing `generateChatResponse` function:

```typescript
export async function streamChatResponse({ message }: ChatOptions): Promise<ReadableStream<Uint8Array>> {
  if (!GEMINI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_KEY environment variable is not set");
  }

  const response = await fetch(GEMINI_STREAM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `${SYSTEM_PROMPT}\n\nUser question: ${message}` }]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message ?? "Unknown error"}`);
  }

  if (!response.body) {
    throw new Error("No response body from Gemini");
  }

  // Normalize Gemini SSE into OpenRouter-compatible format so the hook parser
  // works identically regardless of provider.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const text = decoder.decode(chunk, { stream: true });
      const lines = text.split("\n").filter(line => line.startsWith("data: "));

      for (const line of lines) {
        const raw = line.slice("data: ".length).trim();
        if (!raw || raw === "[DONE]") continue;

        try {
          const parsed = JSON.parse(raw) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const token = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          if (token) {
            const normalized = `data: ${JSON.stringify({ choices: [{ delta: { content: token } }] })}\n\n`;
            controller.enqueue(encoder.encode(normalized));
          }
        } catch {
          // Malformed chunk — skip
        }
      }
    },
    flush(controller) {
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
    }
  });

  return response.body.pipeThrough(transform);
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/server/lib/gemini.ts
git commit -m "feat: add streamChatResponse to Gemini client with normalized SSE output"
```

---

## Task 3: Update API route to pipe the stream

**Files:**

- Modify: `src/app/api/ai/chat/route.ts`

The existing `POST` handler returns a full JSON response. Replace it with one that pipes the provider SSE stream back to the browser. Change the import to switch providers.

- [ ] **Step 1: Replace `src/app/api/ai/chat/route.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Smoke-test with curl**

With the dev server running (`pnpm dev`):

```bash
curl -N -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Como fazer um ollie?"}'
```

Expected: A stream of SSE lines like:

```
data: {"choices":[{"delta":{"content":"Para"}}]}
data: {"choices":[{"delta":{"content":" fazer"}}]}
...
data: [DONE]
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/ai/chat/route.ts
git commit -m "feat: pipe provider SSE stream from /api/ai/chat"
```

---

## Task 4: Update `useAIChat` hook to consume the stream

**Files:**

- Modify: `src/hooks/useAIChat.ts`

Replace the `sendMessage` call with a direct `fetch` to the streaming endpoint. Read the `ReadableStream` chunk-by-chunk, parse each `data:` SSE line, extract `choices[0].delta.content`, and append each token to the live assistant message in state.

- [ ] **Step 1: Replace `src/hooks/useAIChat.ts`**

```typescript
import { useState, useTransition } from "react";

import type { Message } from "@/types/ai";

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();

  const submitMessage = async (userMessage: string) => {
    const userId = `user-${Date.now()}`;
    setMessages(prev => [...prev, { id: userId, role: "user", content: userMessage }]);

    startTransition(async () => {
      const assistantId = `assistant-${Date.now()}`;

      // Add empty assistant bubble immediately so it appears before tokens arrive
      setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok || !response.body) {
          throw new Error("Stream response error");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter(line => line.startsWith("data: "));

          for (const line of lines) {
            const raw = line.slice("data: ".length).trim();
            if (raw === "[DONE]") break;

            try {
              const parsed = JSON.parse(raw) as {
                choices: Array<{ delta: { content?: string } }>;
              };
              const token = parsed.choices?.[0]?.delta?.content ?? "";

              if (token) {
                setMessages(prev =>
                  prev.map(msg => (msg.id === assistantId ? { ...msg, content: msg.content + token } : msg))
                );
              }
            } catch {
              // Malformed chunk — skip silently
            }
          }
        }
      } catch {
        setMessages(prev =>
          prev.map(msg => (msg.id === assistantId ? { ...msg, content: "Deu ruim truta! Tente novamente." } : msg))
        );
      }
    });
  };

  return { messages, isPending, submitMessage };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Manual test in browser**

1. `pnpm dev`
2. Navigate to `http://localhost:3000/ai`
3. Click a suggestion or type a question and send
4. Expected: assistant bubble appears immediately, text grows token-by-token
5. Expected: spinner ("Truta IA está pensando...") shows while streaming, disappears when done
6. Expected: input re-focuses after stream completes
7. Send a second message — confirm it appends correctly without resetting the first

- [ ] **Step 4: Check browser DevTools console**

Expected: No errors or warnings.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAIChat.ts
git commit -m "feat: consume SSE stream in useAIChat for token-by-token rendering"
```

---

## Task 5: Remove unused `sendMessage` service

**Files:**

- Delete: `src/services/sendMessage.ts`

- [ ] **Step 1: Confirm no remaining usages**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
grep -r "sendMessage" src/ --include="*.ts" --include="*.tsx"
```

Expected: no matches (the hook no longer imports it).

- [ ] **Step 2: Delete the file**

```bash
rm src/services/sendMessage.ts
```

- [ ] **Step 3: Verify TypeScript still compiles**

```bash
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove unused sendMessage service (replaced by streaming fetch)"
```

---

## Task 6: Final verification

- [ ] **Step 1: Full build**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm build
```

Expected: Build succeeds with no TypeScript or lint errors.

- [ ] **Step 2: Check no `console.log` / `console.error` in modified files**

```bash
grep -r "console\." src/server/lib/openrouter.ts src/server/lib/gemini.ts src/app/api/ai/chat/route.ts src/hooks/useAIChat.ts
```

Expected: No matches.

- [ ] **Step 3: End-to-end manual test**

1. `pnpm dev`
2. Go to `http://localhost:3000/ai`
3. Send "Como mandar aquele ollie cabuloso?" — confirm streaming animation
4. Send a second message — confirm conversation continues correctly
5. Try switching the import in `route.ts` to Gemini and repeat step 3 — confirm same behavior

---

## Summary of Changes

| File                           | Change                                                     |
| ------------------------------ | ---------------------------------------------------------- |
| `src/server/lib/openrouter.ts` | Added `streamChatResponse`                                 |
| `src/server/lib/gemini.ts`     | Added `streamChatResponse` with normalized SSE output      |
| `src/app/api/ai/chat/route.ts` | Replaced JSON response with SSE stream pipe                |
| `src/hooks/useAIChat.ts`       | Replaced `sendMessage` with streaming fetch + token append |
| `src/services/sendMessage.ts`  | Deleted (no longer used)                                   |
