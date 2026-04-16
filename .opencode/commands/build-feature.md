---
description: Implement a frontend feature from its spec file
---

Read the spec file at `specs/$ARGUMENTS.md`.

Verify the spec Status is `ready` or `in-progress`. If it is `draft`, stop and ask the user to review the spec first.

Update the spec Status to `in-progress`.

Read `AGENTS.md` for architecture conventions before writing any code.

Implement every item in the spec following the conventions in `AGENTS.md`:

- No `console.log`, `console.warn`, or `console.error` in any file
- All API calls use `apiClient` from `src/lib/apiClient.ts` — never bare `axios`
- Auth state accessed via `useAuth` hook only
- TanStack Query hooks for all data fetching and mutations
- Invalidate the relevant query cache after every mutation
- TypeScript — no `any` types

After each acceptance criterion is satisfied, mark it `[x]` in the spec file.

When all criteria are met, update the spec Status to `done`.
