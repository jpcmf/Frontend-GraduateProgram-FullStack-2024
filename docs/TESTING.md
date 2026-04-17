# Automated Testing Implementation Guide

**Quick Reference** — Phase 1-4 implementation handbook for developers

---

## Overview Timeline

```
Week 1: Infrastructure Setup
├── Install Vitest, RTL, MSW, Playwright
├── Configure test files structure
└── Create CI/CD pipeline

Week 2: Unit Tests (Hooks, Services, Utils)
├── Test all hooks (useAuth, useSpots, etc.)
├── Test all services (createSpot, signUp, etc.)
└── Test all utilities (date, auth, etc.)

Week 3: Component & Integration Tests
├── Test critical pages
├── Test key components
└── Test auth/spot creation flows

Week 4: E2E Tests (Playwright)
├── Sign up & email confirmation
├── Spot creation & browsing
├── User profile & following
└── Session management & logout
```

---

## Installation Quick Reference

### Phase 1: Install Dependencies (Week 1, Day 1)

```bash
# 1. Test framework
pnpm add -D vitest @vitest/ui @vitest/coverage-v8

# 2. Component testing
pnpm add -D @testing-library/react @testing-library/jest-dom happy-dom

# 3. API mocking
pnpm add -D msw

# 4. E2E testing
pnpm add -D @playwright/test

# 5. Verify
pnpm test --version
```

### Add NPM Scripts (Week 1, Day 1)

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "e2e": "playwright test",
    "e2e:debug": "playwright test --debug",
    "e2e:ui": "playwright test --ui"
  }
}
```

---

## Test File Naming Conventions

### Unit Tests

- **File:** `src/__tests__/hooks/useAuth.test.ts` (matches `src/hooks/useAuth.ts`)
- **File:** `src/__tests__/services/createSpot.test.ts` (matches `src/services/createSpot.ts`)
- **File:** `src/__tests__/utils/date.test.ts` (matches `src/utils/date.ts`)

### Component Tests

- **File:** `src/__tests__/features/SpotForm.test.tsx` (matches `src/features/spots/SpotForm/index.tsx`)
- **File:** `src/__tests__/pages/auth/signin.test.tsx` (matches `src/app/(public)/auth/signin/page.tsx`)

### Integration Tests

- **File:** `src/__tests__/integration/auth-flow.test.tsx` (cross-feature scenario)
- **File:** `src/__tests__/integration/spot-creation.test.tsx` (full feature flow)

### E2E Tests

- **File:** `e2e/auth.spec.ts` (auth scenarios)
- **File:** `e2e/spots.spec.ts` (spot features)
- **File:** `e2e/user.spec.ts` (user features)

---

## Test Skeleton Templates

### Unit Test Template

```typescript
// src/__tests__/hooks/useAuth.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user when authenticated", async () => {
    // Arrange
    const mockUser = { id: "1", name: "John", email: "john@test.com" };
    // (mock setup here)

    // Act
    const { result } = renderHook(() => useAuth());

    // Assert
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it("should handle errors correctly", async () => {
    // Test error case
  });
});
```

### Component Test Template

```typescript
// src/__tests__/features/SignInForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SignInForm from '@/features/auth/SignInForm';

describe('SignInForm', () => {
  it('should render form fields', () => {
    // Arrange
    render(<SignInForm />);

    // Assert
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<SignInForm />);

    // Act
    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert
    // (check results)
  });
});
```

### E2E Test Template

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should sign in with valid credentials", async ({ page }) => {
    // Arrange & Act
    await page.goto("/auth/signin");
    await page.fill('input[name="email"]', "test@test.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');

    // Assert
    await page.waitForURL("/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("should show validation error on invalid email", async ({ page }) => {
    // Test invalid input
  });
});
```

---

## Week 1 Checklist

### Day 1: Installation & Setup

- [ ] Install all dependencies
- [ ] Add test scripts to package.json
- [ ] Create `vitest.config.ts`
- [ ] Create test directory structure
- [ ] Create MSW mock handlers
- [ ] Commit: "test: setup vitest and testing infrastructure"

### Day 2-3: Configuration

- [ ] Configure Vitest coverage thresholds
- [ ] Setup React Testing Library with custom render
- [ ] Setup MSW server
- [ ] Create test utilities file
- [ ] Test one simple utility function
- [ ] Commit: "test: configure test environment and utilities"

### Day 4-5: CI/CD & Documentation

- [ ] Create GitHub Actions workflow
- [ ] Setup coverage reporting
- [ ] Create CONTRIBUTING.md testing section
- [ ] Write example unit test (auth utility)
- [ ] Run full test suite
- [ ] Commit: "test: add ci/cd pipeline and documentation"

---

## Week 2 Checklist — Unit Tests

### Hooks to Test (Assign 1-2 per developer)

- [ ] `useAuth` — Auth state, loading, errors
- [ ] `useUsers` — Fetch users, pagination
- [ ] `useSingleUser` — Fetch user by ID, 404 handling
- [ ] `useSpots` — Fetch spots, filters
- [ ] `useStories` — Fetch stories, empty state

### Services to Test (Assign 1-2 per developer)

- [ ] `createSpot` — POST with validation
- [ ] `updateSpot` — PUT with validation
- [ ] `signUpRequest` — Sign up flow
- [ ] `getSpots` — GET with pagination
- [ ] `getUser` — GET single user
- [ ] `getUsers` — GET users list

### Utils to Test

- [ ] `auth.ts` — Token management
- [ ] `date.ts` — Date formatting
- [ ] `socialMedia.ts` — URL validation
- [ ] `mapbox.ts` — Coordinate formatting

---

## Week 3 Checklist — Component Tests

### Pages to Test

- [ ] `/auth/signin` — Form rendering, submission, error
- [ ] `/auth/signup` — Form validation, duplicate email
- [ ] `/user/edit` — Protected access, data loading, save
- [ ] `/spots/new` — Protected access, form, creation
- [ ] `/spots/[id]/edit` — Protected, load data, update

### Components to Test

- [ ] `SpotForm` — All form fields, validation
- [ ] `SignInForm` — Email/password, errors
- [ ] `StoriesSwiper` — Rendering, swiping
- [ ] `ProtectedLayout` — Auth check, loading state

### Integration Tests

- [ ] Auth flow: Sign in → access protected route
- [ ] Spot creation: Form → API call → redirect
- [ ] User profile: Load data → edit → save

---

## Week 4 Checklist — E2E Tests

### E2E Scenarios

- [ ] Auth: Sign up → email confirmation → sign in
- [ ] Spots: View list → view detail → create new → view map
- [ ] User: View profile → edit profile → save changes
- [ ] Session: Logout → redirect → try protected route → redirected to signin

---

## Coverage Targets by Phase

### Week 2 (Unit Tests)

```
Hooks:     Target 80-90% coverage
Services:  Target 90% coverage
Utils:     Target 95% coverage
Overall:   Target 50% coverage
```

### Week 3 (Component + Integration)

```
Components:    Target 80% coverage
Pages:         Target 70% coverage
Overall:       Target 65-70% coverage
```

### Week 4 (E2E)

```
Critical paths: 100% covered
Overall:        70%+ coverage
```

---

## Running Tests During Development

### During Implementation

```bash
# Watch mode (auto-rerun on file change)
pnpm test:watch

# Specific test file
pnpm test src/__tests__/hooks/useAuth.test.ts

# UI dashboard (see all tests + coverage)
pnpm test:ui
```

### Before Commit

```bash
# Full run (unit + integration)
pnpm test

# With coverage report
pnpm test:coverage

# E2E tests (if week 4)
pnpm e2e
```

### CI/CD Pipeline

```bash
# GitHub Actions will run:
pnpm lint              # ESLint check
pnpm test              # All unit tests
pnpm test:coverage     # Coverage report
pnpm build             # Build verification
pnpm e2e               # E2E tests (week 4+)
```

---

## Common Testing Patterns

### Testing API Calls with MSW

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { server } from "@/__tests__/mocks/server";
import { http, HttpResponse } from "msw";

describe("getSpots", () => {
  it("should fetch spots successfully", async () => {
    // Setup MSW handler
    server.use(
      http.get("/api/spots", () => {
        return HttpResponse.json([
          { id: "1", name: "Spot 1" },
          { id: "2", name: "Spot 2" }
        ]);
      })
    );

    // Test your code
    const result = await getSpots();
    expect(result).toHaveLength(2);
  });
});
```

### Testing Protected Routes

```typescript
describe("ProtectedLayout", () => {
  it("should redirect unauthenticated users", () => {
    // Mock useAuth to return null
    vi.mock("@/hooks/useAuth", () => ({
      useAuth: () => ({ user: null, isLoading: false })
    }));

    // Render should redirect
    expect(router.push).toHaveBeenCalledWith("/auth/signin");
  });
});
```

### Testing Forms

```typescript
import userEvent from '@testing-library/user-event';

describe('SpotForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<SpotForm />);

    await user.type(screen.getByLabelText(/name/i), 'New Spot');
    await user.type(screen.getByLabelText(/description/i), 'Great spot');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(createSpot).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Spot' })
    );
  });
});
```

### Testing E2E Workflows

```typescript
test("complete sign-up and spot creation", async ({ page }) => {
  // 1. Sign up
  await page.goto("/auth/signup");
  await page.fill('[name="email"]', "new@test.com");
  // ... fill rest of form
  await page.click('button[type="submit"]');

  // 2. Verify email (in real app, click link from email)
  // await page.goto('/auth/confirmation?email=new@test.com');

  // 3. Complete registration
  // await page.goto('/general');
  // ... complete athlete registration

  // 4. Create spot
  // await page.goto('/spots/new');
  // ... fill spot form
  // ... submit

  // 5. Verify spot created
  // await page.goto('/spots');
  // expect(page.getByText('New Spot')).toBeVisible();
});
```

---

## Troubleshooting

### Tests Timing Out

```typescript
// Increase timeout for slow tests
it(
  "should fetch data",
  async () => {
    // ...
  },
  { timeout: 10000 }
); // 10 seconds
```

### Flaky E2E Tests

```typescript
// Use explicit waits
await page.waitForSelector("text=Spot Created");
await page.waitForURL("/dashboard");
```

### API Mock Not Working

```typescript
// Make sure server is started in test setup
import { server } from "@/__tests__/mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### State Not Updating in Tests

```typescript
// Use waitFor to wait for state updates
await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});
```

---

## Commit Message Convention for Tests

```
test: add unit tests for useAuth hook

- Test authenticated user state
- Test unauthenticated state
- Test token refresh flow
- Coverage: 90%

test: add component tests for SignInForm

- Test form rendering
- Test validation
- Test submission error handling

test: add e2e test for auth flow

- Sign up → email confirmation → sign in
- Verify protected route access
```

---

## Resources

- **Vitest Docs:** https://vitest.dev
- **React Testing Library:** https://testing-library.com/react
- **MSW Docs:** https://mswjs.io
- **Playwright Docs:** https://playwright.dev
- **Testing Best Practices:** https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

---

## Questions? Reference This

1. **"How do I write a test?"** → See Test Skeleton Templates above
2. **"Where do I put test files?"** → See Test File Location section
3. **"How do I mock API calls?"** → See Testing API Calls pattern
4. **"Tests are slow"** → Use parallel workers + split unit/E2E
5. **"How do I handle auth in tests?"** → Mock useAuth hook with vi.mock()
