# Feature: AI Assistant

**Status:** in-progress
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
  "confidence": 0.85
}
```

---

### Implementation Notes

- **Provider:** Google Gemini 2.0 Flash (REST API)
- **Backend:** Server-side `generateChatResponse()` in `src/server/lib/gemini.ts`
- **Retry logic:** Exponential backoff (max 3 attempts) with 30s timeout per request
- **Response format:** Plain text (Gemini handles formatting based on system prompt)
- **Confidence calculation:** Based on response content keywords and structure
- **Error handling:** Generic error message with retry mechanism

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
  - Keep responses concise but informative (2-4 paragraphs)

---

### System Prompt (Implementation)

```txt
You are an experienced skateboarding instructor and community expert.

Rules:
- Explain concepts clearly and simply
- Use step-by-step instructions when helpful
- Prioritize safety (helmet, environment, progression)
- Answer only skateboarding-related questions
- If a question is not about skateboarding, politely redirect to skateboarding topics
- If unsure about something, say you don't know instead of guessing
- Keep responses concise but informative (2-4 paragraphs)
- Use encouraging and supportive tone
```

---

## Model & Provider Strategy

**Current Implementation:**

- Provider: Google Gemini 2.0 Flash (via REST API)
- Environment variable: `GOOGLE_GENERATIVE_AI_KEY`
- API endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- Response format: Plain text (structured by system prompt)

**Reliability Features:**

- Exponential backoff retry (max 3 attempts)
- Request timeout: 30 seconds
- Retry delay: 1s → 2s → 4s
- Comprehensive error logging for debugging

---

### Future (not in MVP)

- Model selection layer (multi-provider fallback)
- RAG (Retrieval-Augmented Generation) with skate knowledge base
- Billing/quota management dashboard

---

## Component & File Plan

### New files

| File                                | Purpose                                     | Status      |
| ----------------------------------- | ------------------------------------------- | ----------- |
| `src/types/ai.ts`                   | `AIResponse`, `Message` types                | ✅ Created  |
| `src/services/sendMessage.ts`       | Calls `/api/ai/chat`                        | ✅ Created  |
| `src/hooks/useAIChat.ts`            | Manages chat state (messages, loading)      | ✅ Created  |
| `src/features/ai/Chat/index.tsx`    | Main chat UI with hero + suggestions        | ✅ Created  |
| `src/features/ai/Message/index.tsx` | Individual message component                 | ✅ Created  |
| `src/app/(public)/ai/page.tsx`      | AI Assistant public page                    | ✅ Created  |
| `src/app/api/ai/chat/route.ts`      | Server route to call Gemini                 | ✅ Created  |
| `src/server/lib/gemini.ts`          | Gemini API client with retry logic          | ✅ Created  |

### Modified files

| File                              | Changes                              | Status      |
| --------------------------------- | ------------------------------------ | ----------- |
| `src/components/Sidebar/SidebarNav.tsx` | Added AI Assistant nav link         | ✅ Updated  |

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

- [x] Hero section displays: icon, title, subtitle (visible on page load)
- [x] Suggestion buttons display and are clickable (visible on page load)
- [x] Clicking a suggestion auto-fills input and submits
- [x] First message submission hides hero section and suggestions
- [x] Chat area expands to full space after first message
- [x] User messages display right-aligned with avatar
- [x] AI messages display left-aligned with green icon
- [x] Messages scroll and auto-scroll to latest
- [x] Loading state shows while waiting for response
- [x] User can continue asking questions after response
- [x] Input field clears after each submission
- [x] Responses are plain text (no markdown)
- [x] No `console.log`, `console.warn`, or `console.error` in new files
- [x] TypeScript — no `any` types in new files
- [x] API route uses server-side Gemini client (`generateChatResponse()`)
- [x] Retry logic implemented with exponential backoff
- [x] Error handling with generic user-facing messages
- [x] Build compiles with no TypeScript errors

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
