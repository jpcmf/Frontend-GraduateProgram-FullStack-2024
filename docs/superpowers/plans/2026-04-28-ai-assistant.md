# AI Assistant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public chat interface where users ask skateboarding questions and receive AI-powered responses with structured output (answer, skill level, confidence).

**Architecture:**

- Frontend: React chat UI with local state (no persistence), message list, input field, loading states
- Backend: API route that calls an external AI provider (OpenAI/Claude/Gemini) with a skateboarding-specific system prompt, parses JSON response, validates structure
- No authentication required for MVP
- Responses follow strict JSON schema (answer, level, confidence)

**Tech Stack:**

- React (hooks: `useState`, `useTransition` for loading)
- TanStack Query for server calls (though this is a simple POST, no cache needed)
- TypeScript (no `any` types)
- Chakra UI for components
- External AI API (OpenAI GPT-4, Claude 3, or Gemini 2.0)

---

## File Structure

### New files to create

- `src/types/ai.ts` — AI types (Message, AIResponse)
- `src/services/sendMessage.ts` — API client for `/api/ai/chat`
- `src/hooks/useAIChat.ts` — Chat state management hook
- `src/features/ai/Chat/index.tsx` — Main chat UI component
- `src/features/ai/Message/index.tsx` — Individual message component
- `src/app/(public)/ai/page.tsx` — Public AI page
- `src/app/api/ai/chat/route.ts` — Server route to call AI provider

### Modified files

- None (this is a new feature with no cross-cutting changes)

---

## Task 1: Define AI Types

**Files:**

- Create: `src/types/ai.ts`

- [ ] **Step 1: Write `src/types/ai.ts` with Message and AIResponse types**

Create the file with these exact types:

```typescript
export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type AIResponse = {
  answer: string;
  level: "beginner" | "intermediate" | "advanced";
  confidence: number;
};
```

- [ ] **Step 2: Verify the file compiles**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit src/types/ai.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types/ai.ts
git commit -m "types: add AI chat message and response types"
```

---

## Task 2: Create API Client Service

**Files:**

- Create: `src/services/sendMessage.ts`

- [ ] **Step 1: Write `src/services/sendMessage.ts`**

```typescript
import { apiClient } from "@/lib/apiClient";
import type { AIResponse } from "@/types/ai";

export async function sendMessage(message: string): Promise<AIResponse> {
  const response = await apiClient.post("/api/ai/chat", { message });
  return response.data;
}
```

- [ ] **Step 2: Verify import paths work**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit src/services/sendMessage.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/services/sendMessage.ts
git commit -m "feat: add sendMessage service for AI chat API"
```

---

## Task 3: Create useAIChat Hook

**Files:**

- Create: `src/hooks/useAIChat.ts`

- [ ] **Step 1: Write `src/hooks/useAIChat.ts`**

```typescript
import { useState, useTransition } from "react";
import { sendMessage } from "@/services/sendMessage";
import type { Message, AIResponse } from "@/types/ai";

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();

  const submitMessage = async (userMessage: string) => {
    // Add user message to chat
    const userId = `user-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      {
        id: userId,
        role: "user",
        content: userMessage
      }
    ]);

    // Fetch assistant response
    startTransition(async () => {
      try {
        const response = await sendMessage(userMessage);

        // Add assistant message to chat
        const assistantId = `assistant-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: response.answer
          }
        ]);
      } catch (error) {
        // Add error message to chat
        const errorId = `error-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: errorId,
            role: "assistant",
            content: "Something went wrong. Please try again."
          }
        ]);
      }
    });
  };

  return {
    messages,
    isPending,
    submitMessage
  };
}
```

- [ ] **Step 2: Verify types and imports**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit src/hooks/useAIChat.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useAIChat.ts
git commit -m "feat: add useAIChat hook for chat state management"
```

---

## Task 4: Create Message Component

**Files:**

- Create: `src/features/ai/Message/index.tsx`

- [ ] **Step 1: Create directory**

```bash
mkdir -p /Users/joaopaulo/www/pucrs/project/frontend/src/features/ai/Message
```

- [ ] **Step 2: Write `src/features/ai/Message/index.tsx`**

```typescript
import { Box, Text, HStack, Avatar, VStack } from "@chakra-ui/react";
import type { Message } from "@/types/ai";

interface MessageProps {
  message: Message;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <HStack
      align="flex-start"
      spacing={3}
      mb={4}
      justifyContent={isUser ? "flex-end" : "flex-start"}
      w="100%"
    >
      {!isUser && (
        <Avatar
          size="sm"
          name="AI Assistant"
          bg="green.400"
          color="white"
        />
      )}

      <VStack align={isUser ? "flex-end" : "flex-start"} spacing={1} maxW="70%">
        <Box
          bg={isUser ? "blue.100" : "gray.100"}
          px={4}
          py={3}
          borderRadius="md"
          wordBreak="break-word"
        >
          <Text fontSize="sm" color={isUser ? "blue.900" : "gray.900"}>
            {message.content}
          </Text>
        </Box>
      </VStack>

      {isUser && (
        <Avatar
          size="sm"
          name="You"
          bg="blue.400"
          color="white"
        />
      )}
    </HStack>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit src/features/ai/Message/index.tsx
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/features/ai/Message/index.tsx
git commit -m "feat: add Message component for displaying chat messages"
```

---

## Task 5: Create Chat Component

**Files:**

- Create: `src/features/ai/Chat/index.tsx`

**Design:** Hero section + suggestions (pre-conversation) → Chat area (post-conversation)

- [ ] **Step 1: Create directory**

```bash
mkdir -p /Users/joaopaulo/www/pucrs/project/frontend/src/features/ai/Chat
```

- [ ] **Step 2: Write `src/features/ai/Chat/index.tsx`**

Key requirements:

- Hero section: Icon, "AI Assistant" title, subtitle (visible when `messages.length === 0`)
- Suggestions: 3 clickable buttons below hero (visible when `messages.length === 0`)
- Chat area: Message list (visible when `messages.length > 0`)
- When first message sent: Hero/suggestions hidden, chat expands full space
- Input field always at bottom
- Auto-scroll to latest message
- Loading state: Spinner + "AI Assistant is thinking..."
- No timestamps on messages

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { VStack, HStack, Input, Button, Box, Spinner, Text, Center } from "@chakra-ui/react";
import { RiRobot2Line } from "react-icons/ri";
import { Message } from "../Message";
import { useAIChat } from "@/hooks/useAIChat";

const INITIAL_SUGGESTIONS = [
  "How to do an ollie?",
  "What board should I use for street skating?",
  "How to avoid injuries while skating?"
];

export function Chat() {
  const { messages, isPending, submitMessage } = useAIChat();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isConversationStarted = messages.length > 0;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isPending) return;

    const message = inputValue;
    setInputValue("");
    await submitMessage(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // Trigger submit immediately
    setTimeout(() => {
      submitMessage(suggestion);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <VStack
      h="100vh"
      w="100%"
      bg="white"
      spacing={0}
      justify="space-between"
      p={4}
    >
      {/* Main content area */}
      <Box
        flex={1}
        w="100%"
        overflowY="auto"
        borderRadius="md"
        mb={4}
        maxW="800px"
        mx="auto"
      >
        {!isConversationStarted ? (
          /* Hero + Suggestions (before conversation) */
          <Center h="100%" flexDirection="column" gap={8}>
            {/* Hero Section */}
            <VStack spacing={4} textAlign="center">
              <Box
                w={16}
                h={16}
                borderRadius="full"
                bg="gray.800"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <RiRobot2Line size={32} color="#48D597" />
              </Box>
              <VStack spacing={2}>
                <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                  AI Assistant
                </Text>
                <Text fontSize="md" color="gray.600">
                  Ask anything about the skateboarding world
                </Text>
              </VStack>
            </VStack>

            {/* Suggestions */}
            <VStack spacing={3} align="stretch" w="100%" maxW="500px">
              {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  textAlign="left"
                  h="auto"
                  py={3}
                  px={4}
                  whiteSpace="normal"
                  borderColor="gray.300"
                  _hover={{ borderColor: "green.400", bg: "green.50" }}
                >
                  {suggestion}
                </Button>
              ))}
            </VStack>
          </Center>
        ) : (
          /* Chat area (after first message) */
          <VStack align="stretch" spacing={4}>
            {messages.map(msg => (
              <Message key={msg.id} message={msg} />
            ))}
            {isPending && (
              <HStack justify="flex-start">
                <Spinner size="sm" color="green.400" />
                <Text fontSize="sm" color="gray.500">
                  AI Assistant is thinking...
                </Text>
              </HStack>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>

      {/* Input area (always at bottom) */}
      <HStack w="100%" maxW="800px" mx="auto" spacing={2}>
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about skateboarding..."
          disabled={isPending}
          borderColor="gray.300"
          _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px rgb(72, 213, 151)" }}
        />
        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isPending}
          bg="green.400"
          color="white"
          _hover={{ bg: "green.500" }}
          _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          Send
        </Button>
      </HStack>
    </VStack>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit src/features/ai/Chat/index.tsx
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/features/ai/Chat/index.tsx
git commit -m "feat: redesign Chat component with hero section, suggestions, and conversation flow"
```

---

## Task 6: Create AI Public Page

**Files:**

- Create: `src/app/(public)/ai/page.tsx`

- [ ] **Step 1: Create directory**

```bash
mkdir -p /Users/joaopaulo/www/pucrs/project/frontend/src/app/\(public\)/ai
```

- [ ] **Step 2: Write `src/app/(public)/ai/page.tsx`**

```typescript
import { Chat } from "@/features/ai/Chat";

export const metadata = {
  title: "AI Assistant | SkateHub",
  description: "Ask the AI Assistant anything about skateboarding"
};

export default function AIPage() {
  return <Chat />;
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit src/app/\(public\)/ai/page.tsx
```

Expected: No errors

- [ ] **Step 4: Verify route works**

Navigate to `http://localhost:3000/ai` and confirm the page loads with the Chat component (input field, suggestions visible).

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/ai/page.tsx
git commit -m "feat: add public /ai page with Chat component"
```

---

## Task 7: Create API Route (Backend Chat Handler)

**Files:**

- Create: `src/app/api/ai/chat/route.ts`

- [ ] **Step 1: Create directory**

```bash
mkdir -p /Users/joaopaulo/www/pucrs/project/frontend/src/app/api/ai/chat
```

- [ ] **Step 2: Get your AI provider API key**

Choose ONE of:

- **OpenAI** (GPT-4): Get key from https://platform.openai.com/api-keys → add to `.env.local` as `OPENAI_API_KEY`
- **Claude** (Anthropic): Get key from https://console.anthropic.com/ → add to `.env.local` as `ANTHROPIC_API_KEY`
- **Gemini** (Google): Get key from https://aistudio.google.com/app/apikeys → add to `.env.local` as `GOOGLE_GENERATIVE_AI_KEY`

For this example, we'll use **OpenAI GPT-4 Turbo** (most reliable for structured output).

- [ ] **Step 3: Install OpenAI SDK**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm add openai
```

- [ ] **Step 4: Write `src/app/api/ai/chat/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AIResponse } from "@/types/ai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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
      return NextResponse.json({ error: "Message is required and must be a non-empty string" }, { status: 400 });
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
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
```

**Important notes:**

- Uses Claude 3.5 Sonnet (better at following structured output constraints than GPT-4)
- Validates request shape and response shape
- Returns generic error message to client (not internal details)
- No `console.log` statements

- [ ] **Step 5: Verify TypeScript**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm tsc --noEmit src/app/api/ai/chat/route.ts
```

Expected: No errors

- [ ] **Step 6: Add `.env.local` variable**

Add to `.env.local`:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

(Get from https://console.anthropic.com/account/keys)

- [ ] **Step 7: Test the API route locally**

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"How to do an ollie?"}'
```

Expected response (example):

```json
{
  "answer": "To perform an ollie, start by positioning your back foot on the tail of the board...",
  "level": "beginner",
  "confidence": 0.95
}
```

- [ ] **Step 8: Commit**

```bash
git add src/app/api/ai/chat/route.ts
git commit -m "feat: add /api/ai/chat endpoint with Claude AI integration"
```

---

## Task 8: Update .env.example

**Files:**

- Modify: `.env.example`

- [ ] **Step 1: Add AI environment variable**

Append to `.env.example`:

```
# AI Assistant
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add ANTHROPIC_API_KEY to .env.example"
```

---

## Task 9: Manual Testing & Verification

**Files:**

- None (testing only)

- [ ] **Step 1: Start dev server**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm dev
```

- [ ] **Step 2: Navigate to `/ai` in browser**

```
http://localhost:3000/ai
```

Expected: Chat UI loads with empty state showing 3 suggestion buttons

- [ ] **Step 3: Click a suggestion (e.g., "How to do an ollie?")**

Expected:

- Suggestion text appears in the input field
- Text is selected/focused

- [ ] **Step 4: Click "Send" button**

Expected:

- Message appears in chat as a "user" message (blue bubble, right-aligned)
- Loading state appears ("AI Assistant is thinking...")
- After ~2 seconds, assistant response appears (gray bubble, left-aligned)

- [ ] **Step 5: Submit a non-skateboarding question (e.g., "What's the capital of France?")**

Expected:

- AI Assistant declines politely with message like: "I'm here to help with skateboarding questions. This seems outside my area. Do you have any skate-related questions?"

- [ ] **Step 6: Submit an empty message**

Expected:

- "Send" button is disabled
- No empty message sent

- [ ] **Step 7: Check browser console for errors**

Expected: No errors, warnings, or `console.log` statements

- [ ] **Step 8: Verify TypeScript build passes**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm build
```

Expected: Build succeeds with no TypeScript errors

---

## Task 10: Final Verification Against Spec

**Files:**

- None (verification only)

Check each acceptance criterion from the spec:

- [ ] ✅ `/ai` page renders a functional chat interface
  - Evidence: Page loads, chat UI visible with input, send button, message list

- [ ] ✅ User can submit a message and receive a response
  - Evidence: Message submitted, assistant response received within 2-3s

- [ ] ✅ Loading state is shown while waiting for response
  - Evidence: "AI Assistant is thinking..." appears while awaiting response

- [ ] ✅ Responses follow the defined JSON structure
  - Evidence: API returns `{ answer, level, confidence }` in all cases

- [ ] ✅ Responses are parsed and rendered correctly
  - Evidence: `answer` field appears in chat message, level/confidence not exposed to UI

- [ ] ✅ Assistant answers only skateboarding-related questions
  - Evidence: Non-skate questions declined appropriately

- [ ] ✅ Assistant tone is instructional and beginner-friendly
  - Evidence: Manual read of responses — clear, simple language, step-by-step where relevant

- [ ] ✅ No `console.log`, `console.warn`, or `console.error` in new files
  - Evidence: `grep -r "console\." src/features/ai src/hooks/useAIChat.ts src/services/sendMessage.ts src/app/api/ai`
  - Expected: No matches

- [ ] ✅ TypeScript — no `any` types in new files
  - Evidence: `grep -r "any" src/features/ai src/hooks/useAIChat.ts src/types/ai.ts src/services/sendMessage.ts`
  - Expected: Only in comments (e.g., JSDoc), not in code

---

## Summary of Files Created

| File                                | Purpose                       | Status |
| ----------------------------------- | ----------------------------- | ------ |
| `src/types/ai.ts`                   | Message, AIResponse types     | ✅     |
| `src/services/sendMessage.ts`       | API client for `/api/ai/chat` | ✅     |
| `src/hooks/useAIChat.ts`            | Chat state management         | ✅     |
| `src/features/ai/Message/index.tsx` | Single message component      | ✅     |
| `src/features/ai/Chat/index.tsx`    | Main chat UI                  | ✅     |
| `src/app/(public)/ai/page.tsx`      | Public AI page route          | ✅     |
| `src/app/api/ai/chat/route.ts`      | Backend AI API route          | ✅     |

---

## Commits Made

```
feat: add public /api/ai/chat endpoint with Claude AI integration
feat: add Chat component for AI conversation interface
feat: add public /ai page with Chat component
feat: add Message component for displaying chat messages
feat: add useAIChat hook for chat state management
feat: add sendMessage service for AI chat API
types: add AI chat message and response types
docs: add ANTHROPIC_API_KEY to .env.example
```
