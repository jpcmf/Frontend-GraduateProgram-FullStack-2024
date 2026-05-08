# Feature: AI UX — Writing Assistant

**Status:** done
**Priority:** medium
**Affects:** Existing forms (SpotForm, User Profile/Bio), new client-side utilities

## Problem Statement

Users often write incomplete, vague, or low-quality descriptions when creating skate spots. This reduces the usefulness of content for the community and makes it harder for others to understand the characteristics of a spot.

The AI UX Writing Assistant improves user-generated text directly in the UI using on-device AI, increasing clarity, usefulness, and consistency without requiring backend interaction.

---

## UI / UX Description

### Supported contexts (MVP)

- `/spots/new`
- `/spots/[id]/edit`
- (future) user profile / bio

---

### Behavior

- A button is displayed near text fields (e.g., description textarea):
  - Label: "Improve text"

- Button is visible only when the field is not empty
- On click:
  - Uses on-device AI (Rewriter API) to improve the text
  - Replaces the current content with an improved version

---

### UX Requirements

- Response should feel near-instant (no blocking loading states)
- No network requests should be made
- If the feature is not supported:
  - Button is hidden OR disabled with tooltip

- User remains in control (no auto-rewrite without action)

---

## Data Requirements

- No backend interaction
- Runs entirely on the client

---

### APIs used (browser)

- Rewriter API (primary)
- Proofreader API (optional, secondary)

---

## Writing Rules (Critical)

The AI must:

- Improve clarity and readability
- Fix grammar and spelling
- Preserve the original meaning
- Keep descriptions concise and useful
- Maintain a natural tone aligned with skate culture (not overly formal)

---

### Domain-Specific Rules (Skate Spots)

The AI should prioritize making the description more useful for other skaters by:

- Clarifying the type of terrain (street, skatepark, DIY, etc.)
- Highlighting relevant characteristics when present:
  - Ground quality (smooth, rough, cracked)
  - Obstacles (rails, ledges, gaps, stairs, banks)
  - Space (wide, tight, crowded)

- Improving structure and flow of the description

---

### Strict Constraints

- Do NOT invent new information
- Do NOT add features not mentioned by the user
- Do NOT exaggerate or make assumptions
- Do NOT change the intent of the original text
- Do NOT transform the text into a formal or robotic tone

---

### Example

**Input:**
"pico bom, chão liso, da pra mandar umas manobras"

**Output:**
"Pico com chão liso, bom para manobras de street e com espaço suficiente para montar linhas."

---

## Component & File Plan

### New files

| File                                    | Purpose                                     |
| --------------------------------------- | ------------------------------------------- |
| `src/hooks/useAIWriter.ts`              | Hook to handle on-device AI rewriting       |
| `src/utils/ai/isSupported.ts`           | Detect browser support                      |
| `src/features/ai/ImproveTextButton.tsx` | Button component for triggering improvement |

---

### Existing files to modify

| File                                    | Change                                   |
| --------------------------------------- | ---------------------------------------- |
| `src/features/spots/SpotForm/index.tsx` | Add "Improve text" button to description |
| (future) profile form                   | Add support for bio improvement          |

---

## Acceptance Criteria

- [x] "Improve text" button appears when textarea has content
- [x] Clicking the button replaces text with improved version
- [x] Text is clearer, more structured, and more useful
- [x] No hallucinated or invented information is introduced
- [x] No API calls are made (client-only execution)
- [x] Feature works only on supported browsers
- [x] Graceful fallback when unsupported
- [x] No `console.log`, `console.warn`, or `console.error` in new files
- [x] TypeScript — no `any` types

---

## Error Handling

- If AI processing fails:
  - Do not modify original text
  - Optionally show subtle feedback (non-blocking)

---

## Out of Scope

- Backend-based text generation
- Saving multiple versions of text
- Undo/redo history
- Tone selection (formal, casual, etc.)
- Multi-language rewriting
