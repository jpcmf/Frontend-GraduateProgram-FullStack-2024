# Feature: AI Assistant

**Status:** draft
**Priority:** high
**Affects:** New pages, components, services, hooks, and API route for AI chat

## Problem Statement

Users often have questions about skateboarding (tricks, gear, safety, progression) but lack immediate, reliable guidance inside the platform.

The AI Assistant provides a conversational interface that answers skateboarding-related questions in a clear, safe, and structured way, acting as a virtual skate instructor.

This feature is part of the core product experience and must provide consistent, high-quality responses.

---

## UI / UX Description

### AI Assistant page (`/ai`)

- Public page (no authentication required for MVP)
- Chat interface with hero section, suggestions, and conversation flow

---

### Layout: Hero + Suggestions (Before First Message)

**Hero Section** (centered, ~40% viewport height):

- Icon: Green AI/robot icon
- Title: "AI Assistant"
- Subtitle: "Ask anything about the skateboarding world"

**Suggestions Area** (below hero):

- 3 full-width or grid-layout suggestion buttons
- Clicking a suggestion auto-fills input and submits
- Buttons:
  - "How to do an ollie?"
  - "What board should I use for street skating?"
  - "How to avoid injuries while skating?"

**Input Area** (bottom):

- Text input field: "Ask a question about skateboarding..."
- Green send button (always visible)

---

### Layout: Chat Conversation (After First Message)

**Hero Section:** Hidden/faded
**Suggestions:** Disappear completely
**Chat Area:** Expands to full space

- Messages scroll vertically
- AI messages: Dark gray bubble, left-aligned, green icon
- User messages: Green/teal bubble, right-aligned, user avatar
- Auto-scroll to latest message
- Loading state: Spinner + "AI Assistant is thinking..."

**Input Area:** Stays at bottom, input remains enabled

---

### Message Display

- **User messages:** Plain text, right-aligned with user avatar
- **AI messages:** Plain text (no markdown), left-aligned with AI icon
- Multi-line text with word wrap supported
- No timestamps

---

### Chat Behavior

- User submits a question (via input or suggestion click)
- Loading state shown while awaiting response
- Assistant responds with plain text answer
- Messages remain in chat history
- Input field clears after submission
- User can continue asking questions

---

## Data Requirements

### API Route (internal)

| Endpoint       | Method | Auth | Description                      |
| -------------- | ------ | ---- | -------------------------------- |
| `/api/ai/chat` | POST   | None | Sends user prompt to AI provider |

---

### Request shape

```json
{
  "message": "How to do an ollie?"
}
```

---

### Response shape

```json
{
  "answer": "To perform an ollie, start by positioning your back foot on the tail...",
  "level": "beginner",
  "confidence": 0.85
}
```

---

### Notes

- Response must always follow the defined JSON structure
- No raw model output should be returned directly to the UI
- The API route is responsible for parsing and validating the response

---

## Prompt Specification

The system prompt must enforce:

- Role: experienced skateboarding instructor
- Tone: clear, supportive, instructional
- Audience: beginner to intermediate skaters
- Constraints:
  - Avoid unsafe advice
  - Avoid unrelated topics
  - Do not hallucinate unknown facts
  - Prefer step-by-step explanations

---

### Example system prompt

```txt
You are an experienced skateboarding instructor.

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
}
```

---

## Model Strategy

- Default: external AI API (e.g., OpenAI, Claude, Gemini)
- Model must support:
  - Structured output (JSON)
  - Strong instruction following

---

### Future (not in MVP)

- Model selection layer (multi-provider fallback)
- RAG (Retrieval-Augmented Generation) with skate knowledge base

---

## Component & File Plan

### New files

| File                                | Purpose                                |
| ----------------------------------- | -------------------------------------- |
| `src/types/ai.ts`                   | `AIResponse` type                      |
| `src/services/sendMessage.ts`       | Calls `/api/ai/chat`                   |
| `src/hooks/useAIChat.ts`            | Manages chat state (messages, loading) |
| `src/features/ai/Chat/index.tsx`    | Main chat UI                           |
| `src/features/ai/Message/index.tsx` | Individual message component           |
| `src/pages/ai/index.tsx`            | AI Assistant page                      |
| `src/pages/api/ai/chat.ts`          | Server route to call AI provider       |

---

## State Management

### Chat state

```ts
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
```

- Stored locally (React state)
- No persistence required for MVP

---

## Acceptance Criteria

- [ ] Hero section displays: icon, title, subtitle (visible on page load)
- [ ] Suggestion buttons display and are clickable (visible on page load)
- [ ] Clicking a suggestion auto-fills input and submits
- [ ] First message submission hides hero section and suggestions
- [ ] Chat area expands to full space after first message
- [ ] User messages display right-aligned with avatar
- [ ] AI messages display left-aligned with green icon
- [ ] Messages scroll and auto-scroll to latest
- [ ] Loading state shows while waiting for response
- [ ] User can continue asking questions after response
- [ ] Input field clears after each submission
- [ ] Responses are plain text (no markdown)
- [ ] No `console.log`, `console.warn`, or `console.error` in new files
- [ ] TypeScript — no `any` types in new files

---

## Error Handling

- If API fails:
  - Show generic error message: "Something went wrong. Please try again."

- If response is invalid:
  - Do not render raw output
  - Fallback to safe error message

---

## Out of Scope

- Authentication (chat history per user)
- Persistent chat history
- Voice input / speech-to-text
- Image or video understanding
- Trick detection via camera
- RAG (knowledge base integration)
- Multi-language support
- Personalization based on user skill level
