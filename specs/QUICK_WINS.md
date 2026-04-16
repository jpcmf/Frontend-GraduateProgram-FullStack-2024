# Feature: Quick Wins — Performance & Code Quality Improvements

**Status:** ready
**Priority:** medium
**Affects:** Build performance, bundle size, code quality, developer experience
**Effort Estimate:** 4-6 hours (can be done in parallel with App Router migration)

## Problem Statement

While the App Router migration improves code organization, there are several low-hanging fruit improvements that can be done independently:

1. **Build Performance:** Identify and remove unused dependencies
2. **Bundle Size:** Analyze and optimize client-side JavaScript
3. **Code Quality:** Enable stricter TypeScript checks, remove dead code
4. **Developer Experience:** Improve linting and formatting

These improvements provide immediate value without blocking the App Router migration.

## Opportunities

### 1. Unused Dependencies Audit

**Effort:** 30-45 minutes

**Scope:**

- Audit `package.json` dependencies
- Identify packages not used in codebase
- Safely remove unused packages
- Update lock file

**Commands:**

```bash
# Find unused dependencies
npx depcheck

# Review results and manually verify
# Before removing, search codebase:
grep -r "package-name" src/ --include="*.ts" --include="*.tsx"

# Remove unused packages
npm uninstall unused-package

# Run build to verify no breakage
npm run build
```

**Expected Outcome:**

- Reduced `node_modules` size (faster installs)
- Smaller lock file
- Clearer dependencies
- Faster CI/CD builds

**Risk:** Low (easy to re-add if something breaks)

---

### 2. Bundle Size Analysis

**Effort:** 1-1.5 hours

**Scope:**

- Analyze which packages consume most JavaScript
- Identify optimization opportunities
- Check for duplicate dependencies
- Plan tree-shaking improvements

**Tools:**

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Create temporary analysis build
npx next build --analyze

# View interactive bundle visualization
```

**Expected Findings:**

- Large dependencies that could be replaced
- Unused re-exports being bundled
- Opportunities for code-splitting
- Chakra UI component granularity

**Risk:** Very low (analysis only, no code changes)

---

### 3. TypeScript Strict Mode Review

**Effort:** 1.5-2 hours

**Scope:**

- Review current TypeScript settings
- Enable additional strict checks
- Fix any new type errors
- Update configuration

**Current State:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
    // Check tsconfig.json for exact settings
  }
}
```

**Potential Improvements:**

```json
{
  "compilerOptions": {
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitOverride": true
  }
}
```

**Process:**

1. Enable one strict flag at a time
2. Run `npm run build`
3. Fix TypeScript errors
4. Commit
5. Repeat for next flag

**Risk:** Low-Medium (might require refactoring type definitions)

---

### 4. ESLint Rules Enhancement

**Effort:** 1-2 hours

**Scope:**

- Review ESLint configuration
- Enable additional useful rules
- Fix violations in codebase
- Document rules for team

**Potential Rules:**

```javascript
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@next/next/no-html-link-for-pages": "error",
    "@next/next/no-img-element": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error",
    "curly": "error"
  }
}
```

**Risk:** Medium (requires code fixes but improves quality long-term)

---

### 5. Dead Code Removal

**Effort:** 1.5-2 hours

**Scope:**

- Find unused files and functions
- Safely remove dead code
- Verify no side effects from removal
- Update exports

**Tools:**

```bash
# Find unused exports
npm install --save-dev unimported

# Analyze codebase
npx unimported --help

# Identify dead files
npx unimported --find-dead-code

# Review results and safely delete
```

**Common Dead Code:**

- Commented-out functions
- Unused hooks
- Unused service functions
- Old type definitions
- Unused utility functions

**Risk:** Medium-High (requires careful verification)

---

### 6. Lighthouse Audit & Optimization

**Effort:** 2-3 hours

**Scope:**

- Run Lighthouse audit
- Identify performance bottlenecks
- Implement quick wins
- Re-audit to measure improvement

**Typical Issues Fixed:**

- Unused JavaScript (tree-shaking)
- Large images (compression, WebP)
- Render-blocking resources
- Cumulative Layout Shift (CLS)
- Largest Contentful Paint (LCP)

**Commands:**

```bash
# Build production
npm run build
npm run start

# Audit in Chrome DevTools (F12 > Lighthouse)
# Or use CLI:
npx lighthouse http://localhost:3000 --view
```

**Risk:** Low-Medium (performance improvements rarely break things)

---

### 7. Dependency Version Updates

**Effort:** 1-2 hours

**Scope:**

- Check for outdated dependencies
- Update patch and minor versions
- Run tests to verify compatibility
- Update lock file

**Commands:**

```bash
# Check for outdated packages
npm outdated

# Update all minor/patch versions
npm update

# For major versions, update manually
npm install react@latest

# Run build and tests
npm run build
```

**Risk:** Low-Medium (depends on package compatibility)

---

### 8. Code Formatting & Consistency

**Effort:** 30-45 minutes

**Scope:**

- Review Prettier configuration
- Format entire codebase
- Commit formatting changes
- Document conventions

**Commands:**

```bash
# Check if formatting is consistent
npx prettier --check src/

# Format entire codebase
npx prettier --write src/

# Add pre-commit hook to auto-format
npm install --save-dev husky lint-staged
npx husky install
```

**Risk:** Very low (formatting only, no functional changes)

---

### 9. Import Organization

**Effort:** 1-1.5 hours

**Scope:**

- Organize imports consistently
- Remove unused imports
- Group imports by type (react, third-party, relative)
- Enable import linting

**Before:**

```typescript
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Spot } from "@/types/spot";
import { getSpots } from "@/services/getSpots";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
```

**After:**

```typescript
import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import clsx from "clsx";

import type { Spot } from "@/types/spot";
import { getSpots } from "@/services/getSpots";
```

**Tool:**

```bash
npm install --save-dev eslint-plugin-import

# .eslintrc.json
{
  "plugins": ["import"],
  "rules": {
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "sibling", "parent", "index"],
        "alphabeticalOrder": true
      }
    ]
  }
}
```

**Risk:** Low (formatting and organization only)

---

### 10. API Response Types Validation

**Effort:** 1.5-2 hours

**Scope:**

- Review API response types in `src/types/`
- Validate against actual Strapi responses
- Use Zod or io-ts for runtime validation
- Add type guards

**Current State:**

```typescript
// src/types/spot.ts
export interface Spot {
  id: number;
  name: string;
  // etc.
}
```

**Improved State (with Zod validation):**

```typescript
import { z } from "zod";

export const SpotSchema = z.object({
  id: z.number(),
  name: z.string()
  // etc.
});

export type Spot = z.infer<typeof SpotSchema>;

// At runtime, validate responses
export function isSpot(data: unknown): data is Spot {
  return SpotSchema.safeParse(data).success;
}
```

**Risk:** Medium (requires adding new dependency and type guards)

---

## Implementation Order (Recommended)

1. **Start:** Unused Dependencies Audit (quick win, frees up CI/CD)
2. **Parallel:** Bundle Size Analysis (informs future decisions)
3. **Next:** Code Formatting & Consistency (foundation for other work)
4. **Next:** Import Organization (uses formatting foundation)
5. **Next:** ESLint Rules Enhancement (catches more issues)
6. **Next:** TypeScript Strict Mode (incremental improvements)
7. **Next:** Dead Code Removal (requires careful review)
8. **Next:** API Response Validation (improves runtime safety)
9. **Next:** Dependency Updates (minor/patch versions)
10. **Finally:** Lighthouse Optimization (data-driven improvements)

---

## Quick Wins by Time Investment

### < 1 Hour

- Code Formatting
- Unused Dependencies Audit
- Bundle Size Analysis (analysis phase)
- Dependency Version Updates (minor versions)

### 1-2 Hours

- Import Organization
- ESLint Rules Enhancement
- API Response Types Validation
- Lighthouse Audit (initial pass)

### 2+ Hours

- Dead Code Removal (thorough)
- TypeScript Strict Mode (multiple checks)
- Lighthouse Optimization (multiple iterations)
- Dependency Updates (major versions, careful testing)

---

## Expected Outcomes

### After All Quick Wins

- ✅ No unused dependencies
- ✅ Bundle size reduced 5-15%
- ✅ TypeScript stricter, catching more errors at compile time
- ✅ Code formatted consistently
- ✅ Imports organized logically
- ✅ ESLint warnings resolved
- ✅ No dead code
- ✅ Lighthouse score improved 5-10 points
- ✅ Faster builds and CI/CD
- ✅ Better developer experience

---

## Acceptance Criteria

- [ ] Unused dependencies identified and documented
- [ ] Bundle size analysis completed with findings
- [ ] Code formatted consistently across project
- [ ] Imports organized per team standards
- [ ] ESLint rules enabled and no violations
- [ ] TypeScript strict mode improvements implemented
- [ ] Dead code removed (with verification)
- [ ] API response validation improved
- [ ] Dependencies updated (compatible versions)
- [ ] Lighthouse audit shows improvements
- [ ] `npm run build` completes with 0 errors
- [ ] No functionality broken by quick wins

---

## Files Affected

### Build & Config Files

- `package.json` — Dependencies updated
- `package-lock.json` — Regenerated
- `.eslintrc.json` — Rules enhanced
- `tsconfig.json` — Strict settings
- `.prettierrc` — Formatting standardized
- `next.config.ts` — May be optimized

### Code Files (Minor)

- `src/**/*.ts` — Imports organized, formatting applied
- `src/**/*.tsx` — Imports organized, formatting applied
- `src/types/**/*.ts` — Type validation added
- `src/lib/**/*.ts` — Dead code removed

### Removed Files

- Unused files identified by depcheck
- Dead code deleted

---

## Out of Scope

- Architectural refactoring (covered by App Router migration)
- Component rewriting
- Dependency major version upgrades (unless low-risk)
- Database or API changes
- Feature additions

---

## Success Criteria

- All quick wins completed
- No functionality broken
- Build time improved
- Bundle size improved
- Code quality metrics improved
- Team productivity improved
- All checks pass: `npm run build && npm run lint`

---

## Parallel Execution Strategy

These quick wins can be executed in parallel with the App Router migration:

**Developer 1:** App Router Migration (Phases 0-4)
**Developer 2:** Quick Wins (in any order from list above)

**Checkpoint:** After Phase 2 of App Router migration is complete, merge Quick Wins PRs and continue migration on cleaned-up codebase.

This approach:

- Keeps both initiatives moving
- Allows flexibility in scheduling
- Creates multiple small PRs (easier review)
- Provides quick value while major migration progresses

---

## When to Do Quick Wins

- **Option A:** Before App Router migration (cleaner baseline)
- **Option B:** After Phase 1 of App Router migration (parallel work)
- **Option C:** After App Router migration completes (focus on migration first)

**Recommendation:** Option B (parallel work keeps momentum)

---

## Measuring Success

### Before

```bash
npm run build
# Check output:
# - Build time: X seconds
# - Bundle size: Y MB
# - TypeScript errors: Z
# - ESLint violations: N
```

### After

```bash
npm run build
# Expected improvements:
# - Build time: X - 10% seconds
# - Bundle size: Y - 10% MB (or better)
# - TypeScript errors: Z - 5+ caught
# - ESLint violations: 0 (or near 0)
```

---

## Documentation

After completing quick wins, update:

- `docs/TECHNICAL_ANALYSIS.md` — Add performance section
- `AGENTS.md` — Update code quality rules
- `.eslintrc.json` — Document enabled rules
- `tsconfig.json` — Document strict settings

---

## Team Communication

When quick wins are complete, communicate:

- Bundle size reduction percentage
- Build time improvement
- Number of issues caught by stricter TypeScript
- ESLint violations fixed
- Lighthouse improvements

This shows progress and value delivered independently of App Router migration.
