# App Router Migration: Testing & Validation Strategy

## Overview

This guide explains:

1. **Why Playwright is NOT used during migration phases**
2. **What validation methods we DO use** (instant feedback)
3. **When Playwright tests are added** (post-migration)
4. **Development workflow** (avoid slow builds)

---

## Testing Strategy During Migration (Phases 0-4)

### Level 1: Type Safety (Instant, Free)

**TypeScript Strict Mode** catches errors automatically:

```bash
# Already enabled in tsconfig.json
# Errors appear immediately when you save files

✅ Import errors (missing files)
✅ Type mismatches (wrong prop types)
✅ Missing required props
✅ Invalid hook usage
✅ React Server Component violations
```

**No additional setup needed.** Dev server shows these automatically.

---

### Level 2: Linting (Instant, Free)

**ESLint** validates code quality:

```bash
# Included in dev server startup
pnpm dev

✅ Unused variables
✅ Hook dependency violations
✅ Import ordering
✅ Console statements in production code
✅ React best practices
```

Run manually anytime:

```bash
pnpm exec eslint src/app --fix
```

---

### Level 3: Dev Server Validation (Instant, Free)

**Hot Module Replacement (HMR)** provides live feedback:

```bash
# Run once per session
pnpm dev

# Now:
# - Make changes to a file
# - Save (Ctrl+S)
# - See result in browser instantly (<100ms)
# - No restart needed
```

**What you can verify:**

- ✅ Routes load correctly
- ✅ Components render without errors
- ✅ Browser console shows no errors
- ✅ Styles apply correctly
- ✅ Links navigate to correct pages
- ✅ Forms are interactive

**Example workflow:**

```typescript
// Edit src/app/(public)/auth/signin/page.tsx
// Save file
// Browser updates instantly
// Check: Does page render? Any console errors?
```

---

### Level 4: Manual Browser Testing (2-5 minutes)

After each phase, manually test in browser:

**Checklist:**

- Navigate to each new route
- Check page loads without errors
- Click buttons/links
- Verify data loads (API calls work)
- Check responsive design
- No console errors or warnings

---

## Why NOT Playwright During Migration

### Playwright Drawbacks for Development

| Aspect               | Playwright                            | Dev Server                     |
| -------------------- | ------------------------------------- | ------------------------------ |
| **Feedback time**    | 30-60 seconds (need full app running) | <100ms                         |
| **Setup complexity** | Requires test file + fixtures         | Already running                |
| **Iteration speed**  | Change code → run test → wait → fix   | Change code → instant feedback |
| **Debugging**        | Hard to debug test failures           | Browser dev tools available    |
| **Maintenance**      | Tests need updating if HTML changes   | No test code to maintain       |

### When Playwright Makes Sense

✅ **Post-migration validation** (after Phase 4)
✅ **CI/CD validation** (automated checks before deploy)
✅ **Regression testing** (ensure new changes don't break old features)
✅ **Complex user flows** (multi-step interactions)

❌ **During development** (too slow, not needed)
❌ **Type checking** (TypeScript already does this)
❌ **Import validation** (dev server catches these)

---

## Development Workflow (Phases 0-4)

### Setup (Do Once)

```bash
# Terminal 1: Start dev server
cd /Users/joaopaulo/www/pucrs/project/frontend
pnpm dev

# Output should show:
#   ▲ Next.js 16.0.7 (Turbopack)
#   - Local: http://localhost:3000
#   - Ready in 2.3s
```

### Per-File Development

```bash
# 1. Create new file in src/app
#    (e.g., src/app/(public)/auth/signin/page.tsx)

# 2. Save file
#    → Dev server detects change
#    → TypeScript checks types
#    → ESLint checks code quality

# 3. Check errors in dev terminal or browser console

# 4. Fix errors (they appear immediately in dev server)

# 5. Browser auto-reloads (HMR) - changes visible instantly

# 6. Manual check: Visit http://localhost:3000/auth/signin
```

### After Each Phase

```bash
# Terminal (stop dev server: Ctrl+C)

# 1. Quick validation
bash scripts/validate-dev.sh

# 2. Manual browser testing
# - Run pnpm dev again
# - Visit all new routes
# - Click buttons
# - Check console

# 3. Format code
pnpm format

# 4. Full build check (final validation)
pnpm run build

# 5. Commit
git add .
git commit -m "feat: Phase X - ..."

# 6. Start dev server again (for next phase)
pnpm dev
```

---

## Validation Script

Use the included validation script for quick checks:

```bash
bash scripts/validate-dev.sh
```

This runs:

1. TypeScript type checking
2. ESLint linting
3. Import resolution
4. Summary report

**Output example:**

```
🔍 Validating App Router Changes...

1️⃣  Type Checking...
   ✅ No TypeScript errors

2️⃣  Linting...
   ✅ No ESLint errors

3️⃣  Import Resolution...
   ✅ All imports valid

✨ Quick validation complete!
💡 Tip: Next, run 'pnpm dev' to test in browser
```

---

## Catching Issues Early

### TypeScript catches these immediately

```typescript
// ❌ This will show error immediately in dev server:
import { useRouter } from "next/router"; // Wrong import!

// ✅ Fix: use next/navigation for App Router
import { useRouter } from "next/navigation";

// ❌ This will show error immediately:
<Link href="/non-existent-route">  // Static check possible

// ✅ TypeScript knows all routes through file system
```

### ESLint catches these immediately

```typescript
// ❌ Unused variable warning:
const router = useRouter(); // Not used?

// ❌ Hook dependency issue:
useEffect(() => {
  doSomething(router);
}, []); // Missing router in dependencies

// ✅ ESLint catches both, fix appears in console
```

### Dev Server catches these immediately

```typescript
// ❌ Component doesn't render:
export default function Page() {
  throw new Error("Something broke");
}
// Browser shows error boundary, console shows stack trace

// ❌ Chakra styles not applied:
// Check browser console for Chakra warnings

// ✅ These appear instantly with HMR
```

---

## Testing Phases

### Phase 0-4: Migration (Type Safety + Dev Server)

**Skip formal tests during migration** (they'd need constant updating)

**Instead use:**

- TypeScript type checking (instant, continuous)
- ESLint linting (instant, continuous)
- Dev server validation (instant, continuous)
- Manual browser testing (2-5 min per phase)
- Quick validation script (30 seconds)

### Phase 5: Post-Migration (Add Playwright)

After Phase 4 cleanup, set up Playwright for:

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test("user can sign in", async ({ page }) => {
  await page.goto("/auth/signin");
  await page.fill('[name="email"]', "user@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button:has-text("Sign In")');
  await expect(page).toHaveURL("/");
});

test("protected routes redirect to signin", async ({ page }) => {
  await page.goto("/spots/new");
  await expect(page).toHaveURL("/auth/signin");
});
```

---

## Summary: No Playwright During Migration

| Phase                 | Testing Method                   | Why                             |
| --------------------- | -------------------------------- | ------------------------------- |
| **0-4: Migration**    | TypeScript + ESLint + Dev Server | Instant feedback, no build wait |
| **4: Post-Migration** | Manual + Validation Script       | Verify all phases work          |
| **5+: Regression**    | Playwright E2E tests             | Prevent future regressions      |

---

## Troubleshooting Dev Issues

### Issue: Dev server shows error but browser works

**Solution:** Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: Changes not appearing in browser

**Solution:** Check dev server terminal for errors, hard refresh

### Issue: TypeScript error not showing in dev server

**Solution:** Run `pnpm exec tsc --noEmit` in separate terminal

### Issue: ESLint errors not visible

**Solution:** Check terminal where you ran `pnpm dev`, or run `pnpm exec eslint src/app`

---

## When To Use `pnpm build`

| Scenario         | Frequency              | Purpose                        |
| ---------------- | ---------------------- | ------------------------------ |
| After each phase | Once per phase         | Final validation before commit |
| Before pushing   | Once per PR            | Ensure production build works  |
| Pre-deployment   | Once before deploy     | Full verification              |
| Not during dev   | Never during iteration | Too slow (2-5 minutes)         |

---

## Dev Workflow Checklist

- [ ] Terminal 1: `pnpm dev` running (leave it running)
- [ ] Browser open to http://localhost:3000
- [ ] Make code changes
- [ ] Save file (Ctrl+S)
- [ ] Check dev server terminal for errors
- [ ] Check browser console for errors
- [ ] See changes in browser instantly (HMR)
- [ ] After phase: Run validation script
- [ ] After phase: Manual browser testing
- [ ] After phase: `pnpm format`
- [ ] After phase: `pnpm build`
- [ ] After phase: `git commit`
- [ ] Repeat for next phase

---

## Performance Comparison

### Validation Methods Speed

```
TypeScript check:   ~1 second
ESLint check:       ~3 seconds
Dev HMR update:     <100 ms
Validation script:  ~10 seconds
Full build:         2-5 minutes
Playwright test:    30-60 seconds per test
```

**For migration development:** Use TypeScript + Dev Server (instant)
**For final validation:** Use validation script + build (10-20 seconds)
**For deployment:** Use Playwright tests + build (full verification)

---

## Questions?

- **Q: Do I need to write tests during Phase 1-4?**
  A: No. Type checking + dev server give instant feedback. Write tests post-migration.

- **Q: Can I use the dev server to test everything?**
  A: Yes! Manual testing in dev is sufficient for all phases.

- **Q: When should I use `pnpm build`?**
  A: Only after each phase is complete, before committing.

- **Q: What if dev server works but build fails?**
  A: Run `pnpm build` to see production-specific errors. Usually missing exports or type issues.
