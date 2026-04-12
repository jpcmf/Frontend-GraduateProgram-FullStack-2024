---
description: Verify frontend implementation against spec acceptance criteria
---

Read the spec file at `specs/$ARGUMENTS.md`.

For each acceptance criterion, check the actual implementation files to verify it is satisfied:

- Read the relevant page, feature component, service, hook, and type files
- Confirm the criterion is met with a file path and line number reference
- If a criterion is NOT met, mark it `[ ]` and explain what is missing

Navigate to the feature in the browser at `localhost:3000` and take a screenshot to visually verify the UI matches the spec.

Output a verification report:

- ✅ for each passing criterion (with file reference)
- ❌ for each failing criterion (with explanation)

If any criteria fail, suggest the exact changes needed to fix them.
