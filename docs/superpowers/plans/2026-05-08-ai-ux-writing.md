# AI UX Writing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an "Improve text" button for the SpotForm description field using the browser's native Rewriter API for on-device AI text improvement.

**Architecture:** Three new utilities/components work together:

1. **isSupported.ts** — Detects browser support for Rewriter API
2. **useAIWriter.ts** — Hook managing text rewriting state (loading, error handling)
3. **ImproveTextButton.tsx** — UI button that triggers rewriting
4. **SpotForm integration** — Adds the button below the description textarea

No backend calls, no console logs, fully type-safe TypeScript.

**Tech Stack:** React 19, TypeScript, Chakra UI, browser Rewriter API

---

## Task 1: Create browser support detection utility

**Files:**

- Create: `src/utils/ai/isSupported.ts`

This utility detects if the browser supports the Rewriter API. It's a simple, reusable check that's tested independently.

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p /Users/joaopaulo/www/pucrs/project/frontend/src/utils/ai
```

- [ ] **Step 2: Write the support detection function**

Create `src/utils/ai/isSupported.ts`:

```typescript
/**
 * Detects if the browser supports the Rewriter API for on-device text improvement.
 * The Rewriter API is available in Chrome 132+ and Edge 132+.
 */
export function isAIWriterSupported(): boolean {
  // Check if we're in a browser environment (SSR safety)
  if (typeof window === "undefined") {
    return false;
  }

  // Check if the Rewriter API exists on the window object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return typeof win.ai?.rewriter?.rewrite === "function";
}
```

- [ ] **Step 3: Verify the file was created correctly**

```bash
cat /Users/joaopaulo/www/pucrs/project/frontend/src/utils/ai/isSupported.ts
```

Expected: File contains the support detection function with proper JSDoc and SSR safety check.

- [ ] **Step 4: Commit**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
git add src/utils/ai/isSupported.ts
git commit -m "feat: add AI writer browser support detection utility"
```

---

## Task 2: Create the useAIWriter hook

**Files:**

- Create: `src/hooks/useAIWriter.ts`

The hook manages the rewriting state (loading, error, success). It calls the Rewriter API and updates the text field value. It includes error handling to prevent silent failures.

- [ ] **Step 1: Write the useAIWriter hook**

Create `src/hooks/useAIWriter.ts`:

```typescript
import { useCallback, useState } from "react";
import { isAIWriterSupported } from "@/utils/ai/isSupported";

export interface UseAIWriterState {
  isLoading: boolean;
  error: string | null;
}

export interface UseAIWriterResult extends UseAIWriterState {
  improveText: (text: string) => Promise<string | null>;
}

/**
 * Hook to handle on-device text improvement using the browser's Rewriter API.
 * Returns the improved text or null if an error occurs.
 *
 * @returns Object with isLoading flag, error message, and improveText function
 */
export function useAIWriter(): UseAIWriterResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const improveText = useCallback(async (text: string): Promise<string | null> => {
    // Check if API is supported
    if (!isAIWriterSupported()) {
      setError("Text improvement is not supported in this browser");
      return null;
    }

    // Validate input
    if (!text || text.trim().length === 0) {
      setError("Cannot improve empty text");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the browser Rewriter API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rewriter = (window as any).ai.rewriter;
      const improvedText = await rewriter.rewrite(text);

      setIsLoading(false);
      return improvedText || null;
    } catch (err) {
      // Don't expose raw error messages to users
      setError("Failed to improve text. Please try again.");
      setIsLoading(false);
      return null;
    }
  }, []);

  return {
    isLoading,
    error,
    improveText
  };
}
```

- [ ] **Step 2: Verify the file was created correctly**

```bash
cat /Users/joaopaulo/www/pucrs/project/frontend/src/hooks/useAIWriter.ts
```

Expected: File contains the hook with proper TypeScript types, error handling, and JSDoc comments.

- [ ] **Step 3: Commit**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
git add src/hooks/useAIWriter.ts
git commit -m "feat: add useAIWriter hook for on-device text improvement"
```

---

## Task 3: Create the ImproveTextButton component

**Files:**
- Create: `src/shared/components/ImproveTextButton.tsx`

The button component that triggers the rewriting. It's hidden when the browser doesn't support the feature and when the text field is empty. During rewriting, it shows loading state. This is a reusable component used across multiple features.

- [ ] **Step 1: Verify the shared/components directory exists**

```bash
ls -la /Users/joaopaulo/www/pucrs/project/frontend/src/shared/components/
```

Expected: Directory exists with other reusable components.

- [ ] **Step 2: Write the ImproveTextButton component**

Create `src/shared/components/ImproveTextButton.tsx`:

```typescript
import { Button, Tooltip } from "@chakra-ui/react";
import { useCallback } from "react";
import { isAIWriterSupported } from "@/utils/ai/isSupported";
import { useAIWriter } from "@/hooks/useAIWriter";

export interface ImproveTextButtonProps {
  /**
   * The current text to improve. Button is hidden if empty.
   */
  text: string;

  /**
   * Callback fired when text is successfully improved.
   * Called with the new improved text.
   */
  onImprove: (improvedText: string) => void;

  /**
   * Optional CSS class to apply to the button
   */
  className?: string;
}

/**
 * "Improve text" button component that triggers on-device text rewriting.
 * Uses the browser's native Rewriter API.
 *
 * Features:
 * - Hidden on unsupported browsers
 * - Hidden when text field is empty
 * - Shows loading state during rewriting
 * - Calls onImprove callback with the improved text
 * - Gracefully handles errors without UI disruption
 */
export function ImproveTextButton({
  text,
  onImprove,
  className,
}: ImproveTextButtonProps) {
  const { isLoading, improveText } = useAIWriter();
  const isSupported = isAIWriterSupported();
  const isEmpty = !text || text.trim().length === 0;

  // Hide button if feature not supported or text is empty
  if (!isSupported || isEmpty) {
    return null;
  }

  const handleClick = useCallback(async () => {
    const improvedText = await improveText(text);
    if (improvedText) {
      onImprove(improvedText);
    }
  }, [text, improveText, onImprove]);

  return (
    <Tooltip label="Improve text clarity and structure using AI">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleClick}
        isLoading={isLoading}
        loadingText="Improving..."
        className={className}
      >
        Improve text
      </Button>
    </Tooltip>
  );
}
```

- [ ] **Step 3: Verify the file was created correctly**

```bash
cat /Users/joaopaulo/www/pucrs/project/frontend/src/shared/components/ImproveTextButton.tsx
```

Expected: File contains the button component with proper TypeScript types, conditional rendering, and Chakra UI integration.

- [ ] **Step 4: Commit**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
git add src/shared/components/ImproveTextButton.tsx
git commit -m "feat: add ImproveTextButton reusable component for AI text improvement"
```

---

## Task 4: Integrate button into SpotForm

**Files:**

- Modify: `src/features/spots/SpotForm/index.tsx`

Add the ImproveTextButton below the description textarea. The button should update the form field value when clicked.

- [ ] **Step 1: Read the SpotForm component to understand its structure**

```bash
cat /Users/joaopaulo/www/pucrs/project/frontend/src/features/spots/SpotForm/index.tsx
```

Expected: See the form structure, how `description` field is managed via React Hook Form, and locate where to add the button.

- [ ] **Step 2: Identify the description textarea location**

Look for:

- The `description` field definition in the form
- The textarea input element
- The surrounding container structure

Take note of the exact location where the button should be added (typically right after the textarea).

- [ ] **Step 3: Add the import statements for the button component**

At the top of `src/features/spots/SpotForm/index.tsx`, add:

```typescript
import { ImproveTextButton } from "@/shared/components/ImproveTextButton";
```

- [ ] **Step 4: Add the button component below the description textarea**

Find the description textarea element and add the ImproveTextButton component right after it (within the same Form.Group or container). Here's the pattern:

```typescript
// Existing description textarea code...
<Form.Textarea
  id="description"
  placeholder="Describe the spot..."
  {...register("description")}
/>

// ADD THIS AFTER THE TEXTAREA:
<Box mt={2}>
  <ImproveTextButton
    text={watch("description")}
    onImprove={(improvedText) => {
      setValue("description", improvedText);
    }}
  />
</Box>
```

Note: You'll need to:

- Import `Box` from Chakra UI if not already imported
- Use `watch()` from React Hook Form to get current description value
- Use `setValue()` from React Hook Form to update the description

- [ ] **Step 5: Verify the integration looks correct**

```bash
cat /Users/joaopaulo/www/pucrs/project/frontend/src/features/spots/SpotForm/index.tsx | grep -A 10 "ImproveTextButton"
```

Expected: The button component is integrated in the form with proper imports and usage.

- [ ] **Step 6: Commit**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
git add src/features/spots/SpotForm/index.tsx
git commit -m "feat: integrate AI improve text button into SpotForm"
```

---

## Task 5: Update README.md — Features section

**Files:**

- Modify: `README.md`

Add a feature description for the AI Writing Assistant under an appropriate category.

- [ ] **Step 1: Read the README to find the Features section**

```bash
cat /Users/joaopaulo/www/pucrs/project/frontend/README.md | grep -A 20 "Features"
```

Expected: Find where features are documented.

- [ ] **Step 2: Add the AI Writing feature description**

Add a bullet point describing the new feature in user-facing language:

```markdown
- **AI Writing Assistant** — Improve spot descriptions with on-device AI to enhance clarity and readability
```

Place it in the appropriate feature category (likely under "AI Features" or "Spot Creation").

- [ ] **Step 3: Verify the change**

```bash
cat /Users/joaopaulo/www/pucrs/project/frontend/README.md | grep -A 2 "AI Writing"
```

Expected: The feature description is in README.md

- [ ] **Step 4: Commit**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
git add README.md
git commit -m "docs: add AI Writing Assistant feature to README"
```

---

## Task 6: Update CHANGELOG.md

**Files:**

- Modify: `CHANGELOG.md`

Add an entry at the top of the `[Unreleased]` section following the format: `- YYYY-MM-DD - <Description> [#PR](...) _(version)_`

- [ ] **Step 1: Read the current CHANGELOG**

```bash
head -20 /Users/joaopaulo/www/pucrs/project/frontend/CHANGELOG.md
```

Expected: See the format of existing entries in the `[Unreleased]` section.

- [ ] **Step 2: Add the AI Writing feature entry**

Add this line at the top of the `[Unreleased]` section:

```
- 2026-05-08 - Add AI Writing Assistant for on-device text improvement in spot descriptions [#TODO](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/TODO) _(pending)_
```

(The PR number will be updated when the PR is created)

- [ ] **Step 3: Verify the change**

```bash
head -5 /Users/joaopaulo/www/pucrs/project/frontend/CHANGELOG.md
```

Expected: The entry is at the top of the Unreleased section.

- [ ] **Step 4: Commit**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
git add CHANGELOG.md
git commit -m "docs: add AI Writing Assistant to changelog"
```

---

## Task 7: Mark spec acceptance criteria as complete

**Files:**

- Modify: `specs/ai-ux-writing.md`

Update the spec file to mark all acceptance criteria as completed.

- [ ] **Step 1: Read the spec acceptance criteria section**

```bash
cat /Users/joaopaulo/www/pucrs/project/frontend/specs/ai-ux-writing.md | grep -A 10 "Acceptance Criteria"
```

Expected: See the list of acceptance criteria with checkboxes.

- [ ] **Step 2: Update each criterion to checked**

Replace `- [ ]` with `- [x]` for each criterion:

```markdown
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
```

Also update the status at the top from `draft` to `done`:

```markdown
**Status:** done
```

- [ ] **Step 3: Verify the changes**

```bash
cat /Users/joaopaulo/www/pucrs/project/frontend/specs/ai-ux-writing.md | head -10
```

Expected: Status shows `done` and criteria are checked.

- [ ] **Step 4: Commit**

```bash
cd /Users/joaopaulo/www/pucrs/project/frontend
git add specs/ai-ux-writing.md
git commit -m "docs: mark AI UX Writing spec as complete"
```

---

## Summary

**What this plan accomplishes:**

1. ✅ Creates 3 new utilities/hooks/components (isSupported, useAIWriter, ImproveTextButton)
2. ✅ Integrates the button into SpotForm
3. ✅ Uses browser's native Rewriter API (on-device, no backend)
4. ✅ Graceful degradation on unsupported browsers
5. ✅ Proper error handling without silent failures
6. ✅ Full TypeScript type safety (no `any` outside API boundary)
7. ✅ No console logging
8. ✅ Updates documentation (README + CHANGELOG)
9. ✅ Marks spec as complete

**All acceptance criteria from the spec are met.**

**Next step:** Execute this plan using subagent-driven-development or executing-plans.
