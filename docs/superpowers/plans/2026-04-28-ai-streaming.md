# AI Assistant Streaming Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-shot AI response with true token-by-token streaming so the assistant message appears and grows in real time, like ChatGPT or Claude.ai.

**Architecture:** The API route pipes an OpenRouter SSE stream directly to the browser as a `ReadableStream`. The `useAIChat` hook reads the stream chunk-by-chunk and appends each token to the in-progress assistant message in React state. The Chat and Message components require no structural changes — they already re-render off the message list.

**Tech Stack:** Next.js App Router streaming (`Response` with `ReadableStream`), OpenRouter `stream: true`, browser `ReadableStream` / `TextDecoder`, existing Chakra UI components.

---

## File Structure

### Modified files

- `src/server/lib/openrouter.ts` — add `streamChatResponse` that calls OpenRouter with `stream: true` and returns the raw `Response` body
- `src/app/api/ai/chat/route.ts` — pipe the OpenRouter stream back to the client
- `src/hooks/useAIChat.ts` — read the stream, update a live assistant message token-by-token

### No new files needed

---

## Task 1: Add `streamChatResponse` to OpenRouter client

**Files:**

- Modify: `src/server/lib/openrouter.ts`

- [ ] **Step 1: Read the current file**

Open `src/server/lib/openrouter.ts` and confirm the existing `generateChatResponse` function is present.

- [ ] **Step 2: Add `streamChatResponse` export**

Append this function to the bottom of `src/server/lib/openrouter.ts` (after the existing `generateChatResponse`):

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

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/server/lib/openrouter.ts
git commit -m "feat: add streamChatResponse to OpenRouter client"
```

---

## Task 2: Create streaming API route

**Files:**

- Modify: `src/app/api/ai/chat/route.ts`

The existing `POST` handler returns a full JSON response. We replace it with one that pipes the OpenRouter SSE stream back to the browser. The client will read raw SSE lines and parse the `delta.content` tokens itself.

- [ ] **Step 1: Replace `src/app/api/ai/chat/route.ts` with the streaming version**

```typescript
import { NextRequest } from "next/server";

import { streamChatResponse } from "@/server/lib/openrouter";

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

With the dev server running (`pnpm dev`), run:

```bash
curl -N -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Como fazer um ollie?"}'
```

Expected: A stream of SSE lines like:

```
data: {"id":"...","choices":[{"delta":{"content":"Para"},...}],...}
data: {"id":"...","choices":[{"delta":{"content":" fazer"},...}],...}
...
data: [DONE]
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/ai/chat/route.ts
git commit -m "feat: stream OpenRouter SSE response from /api/ai/chat"
```

---

## Task 3: Update `useAIChat` hook to consume the stream

**Files:**

- Modify: `src/hooks/useAIChat.ts`

Instead of calling `sendMessage` (which waits for a full JSON response), we `fetch` the streaming endpoint directly, read the `ReadableStream`, parse each SSE `data:` line, and extract `choices[0].delta.content` — appending each token to the live assistant message.

- [ ] **Step 1: Replace `src/hooks/useAIChat.ts` with the streaming version**

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

      // Add an empty assistant message immediately so the bubble appears
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

          // SSE lines look like: "data: {...}\n\n" or "data: [DONE]\n\n"
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

1. Start dev server: `pnpm dev`
2. Navigate to `http://localhost:3000/ai`
3. Click a suggestion or type a question and send
4. Expected: assistant bubble appears immediately and text grows token-by-token
5. Expected: spinner ("Truta IA está pensando...") shows while streaming, disappears when done
6. Expected: input re-focuses after stream completes

- [ ] **Step 4: Verify no console errors in browser DevTools**

Open DevTools → Console. Expected: no errors or warnings.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAIChat.ts
git commit -m "feat: consume SSE stream in useAIChat for token-by-token rendering"
```

---

## Task 4: Remove unused `sendMessage` service dependency

**Files:**

- Read: `src/services/sendMessage.ts` — check if anything else imports it

- [ ] **Step 1: Check for other usages of `sendMessage`**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
grep -r "sendMessage" src/ --include="*.ts" --include="*.tsx"
```

Expected: only `src/services/sendMessage.ts` itself (no other imports after the hook rewrite).

- [ ] **Step 2: If no other usages, delete the file**

```bash
rm src/services/sendMessage.ts
```

If other files still import it — skip deletion and note it for later cleanup.

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

## Task 5: Final verification

- [ ] **Step 1: Full build**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm build
```

Expected: Build succeeds with no TypeScript or lint errors.

- [ ] **Step 2: End-to-end manual test**

1. `pnpm dev`
2. Go to `http://localhost:3000/ai`
3. Click "Como mandar aquele ollie cabuloso?"
4. Confirm: text streams in word-by-word, spinner disappears on completion
5. Send a second message in the same session — confirm it appends correctly
6. Send an empty message — confirm Send button stays disabled

- [ ] **Step 3: Check no `console.log` / `console.error` in new/modified files**

```bash
grep -r "console\." src/server/lib/openrouter.ts src/app/api/ai/chat/route.ts src/hooks/useAIChat.ts
```

Expected: No matches.

- [ ] **Step 4: Update plan doc status**

In `docs/superpowers/plans/2026-04-28-ai-streaming.md`, mark all checkboxes as done.

---

## Summary of Changes

| File                           | Change                                                     |
| ------------------------------ | ---------------------------------------------------------- |
| `src/server/lib/openrouter.ts` | Added `streamChatResponse`                                 |
| `src/app/api/ai/chat/route.ts` | Replaced JSON response with SSE stream pipe                |
| `src/hooks/useAIChat.ts`       | Replaced `sendMessage` with streaming fetch + token append |
| `src/services/sendMessage.ts`  | Deleted (no longer used)                                   |
