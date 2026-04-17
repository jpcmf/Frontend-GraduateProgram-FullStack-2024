# Automated Testing Implementation Roadmap

**Complete guide for executing the 4-week testing plan**  
**Reference:** See `specs/AUTOMATED_TESTING.md` for feature spec and acceptance criteria

---

## Overview Timeline

```
Week 1: Infrastructure Setup (8 hours)
├── Install dependencies
├── Configure Vitest, RTL, MSW, Playwright
├── Setup GitHub Actions CI/CD
└── Create example tests

Week 2: Unit Tests (10 hours)
├── Test all hooks (5 total)
├── Test all services (6 total)
├── Test all utilities (4 total)
└── Target: >50% coverage

Week 3: Component & Integration Tests (12 hours)
├── Test critical pages (5 total)
├── Test key components (4 total)
├── Test auth and spot flows
└── Target: >65-70% coverage

Week 4: E2E Tests (10 hours)
├── Setup Playwright
├── Write auth flow E2E
├── Write spot creation E2E
└── Target: >70% coverage + all critical paths
```

---

## Phase 1: Infrastructure Setup (Week 1, 8 hours)

### Day 1: Install Dependencies (2 hours)

**Step 1: Install core testing tools**

```bash
# 1. Test framework
pnpm add -D vitest@latest @vitest/ui@latest @vitest/coverage-v8@latest

# 2. Component testing
pnpm add -D @testing-library/react@latest @testing-library/jest-dom@latest
pnpm add -D happy-dom@latest

# 3. API mocking
pnpm add -D msw@latest

# 4. E2E testing
pnpm add -D @playwright/test@latest

# 5. Verify all installed
pnpm list | grep vitest
```

**Step 2: Update package.json scripts**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "e2e": "playwright test",
    "e2e:debug": "playwright test --debug",
    "e2e:ui": "playwright test --ui",
    "e2e:codegen": "playwright codegen http://localhost:3000"
  }
}
```

**Checklist:**

- [ ] All dependencies installed
- [ ] Test commands available in package.json
- [ ] Can run `pnpm test --version`

---

### Day 2-3: Configuration & Setup (3 hours)

**Step 1: Create Vitest configuration**

Create `vitest.config.ts` in project root:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: ["node_modules/", "vitest.setup.ts", "**/*.test.ts", "**/*.test.tsx"],
      statements: 70,
      branches: 65,
      functions: 70,
      lines: 70
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
```

**Step 2: Create test setup file**

Create `vitest.setup.ts` in project root:

```typescript
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./src/__tests__/mocks/server";
import "@testing-library/jest-dom";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Step 3: Create MSW mock setup**

Create `src/__tests__/mocks/server.ts`:

```typescript
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

Create `src/__tests__/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from "msw";

export const handlers = [
  // Example: Mock auth endpoint
  http.post("/api/auth/login", () => {
    return HttpResponse.json({ token: "mock-token" });
  }),

  // Example: Mock spots endpoint
  http.get("/api/spots", () => {
    return HttpResponse.json([
      { id: "1", name: "Spot 1" },
      { id: "2", name: "Spot 2" }
    ]);
  })
];
```

**Step 4: Create test utilities**

Create `src/__tests__/utils/test-utils.tsx`:

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/styles/theme';

const createTestQueryClient = () => new QueryClient();

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

**Checklist:**

- [ ] `vitest.config.ts` created
- [ ] `vitest.setup.ts` created
- [ ] MSW server setup complete (`src/__tests__/mocks/server.ts`)
- [ ] MSW handlers file created (`src/__tests__/mocks/handlers.ts`)
- [ ] Test utilities created (`src/__tests__/utils/test-utils.tsx`)

---

### Day 4-5: CI/CD & Documentation (3 hours)

**Step 1: Create GitHub Actions workflow**

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm build
      - run: pnpm e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

**Step 2: Write example unit test**

Create `src/__tests__/utils/auth.test.ts` (example):

```typescript
import { describe, it, expect } from "vitest";
import { isValidEmail } from "@/utils/auth";

describe("auth utilities", () => {
  describe("isValidEmail", () => {
    it("should return true for valid email", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
    });

    it("should return false for invalid email", () => {
      expect(isValidEmail("invalid")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isValidEmail("")).toBe(false);
    });
  });
});
```

**Step 3: Verify setup works**

```bash
# Run tests
pnpm test

# Should show 1 test passing

# Check coverage
pnpm test:coverage

# Should generate coverage report

# Open UI
pnpm test:ui

# Should open browser with test dashboard
```

**Checklist:**

- [ ] `.github/workflows/test.yml` created
- [ ] Example test written and passing
- [ ] `pnpm test` works locally
- [ ] `pnpm test:coverage` generates report
- [ ] `pnpm test:ui` opens dashboard
- [ ] GitHub Actions workflow triggers on PR

---

## Phase 2: Unit Tests (Week 2, 10 hours)

### Hooks to Test (2.5 hours)

**Create test files:**

```bash
mkdir -p src/__tests__/hooks
touch src/__tests__/hooks/useAuth.test.ts
touch src/__tests__/hooks/useUsers.test.ts
touch src/__tests__/hooks/useSingleUser.test.ts
touch src/__tests__/hooks/useSpots.test.ts
touch src/__tests__/hooks/useStories.test.ts
```

**Template for each hook test:**

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user when authenticated", async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });
  });

  it("should return null when not authenticated", async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  // Add more tests for each hook...
});
```

**Target:** 80-90% coverage per hook

### Services to Test (3 hours)

**Create test files:**

```bash
mkdir -p src/__tests__/services
touch src/__tests__/services/createSpot.test.ts
touch src/__tests__/services/updateSpot.test.ts
touch src/__tests__/services/signUpRequest.test.ts
touch src/__tests__/services/getSpots.test.ts
touch src/__tests__/services/getUser.test.ts
touch src/__tests__/services/getUsers.test.ts
```

**Template for each service test:**

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createSpot } from "@/services/createSpot";
import { server } from "@/__tests__/mocks/server";
import { http, HttpResponse } from "msw";

describe("createSpot", () => {
  it("should create spot with valid data", async () => {
    server.use(
      http.post("/api/spots", () => {
        return HttpResponse.json({ id: "1", name: "New Spot" });
      })
    );

    const result = await createSpot({
      name: "New Spot",
      description: "Great spot"
    });

    expect(result.id).toBe("1");
  });

  it("should throw error on validation failure", async () => {
    await expect(createSpot({ name: "", description: "" })).rejects.toThrow();
  });
});
```

**Target:** 90% coverage per service

### Utils to Test (2.5 hours)

**Create test files:**

```bash
mkdir -p src/__tests__/utils
touch src/__tests__/utils/date.test.ts
touch src/__tests__/utils/socialMedia.test.ts
touch src/__tests__/utils/mapbox.test.ts
```

**Template for each utility test:**

```typescript
import { describe, it, expect } from "vitest";
import { formatDate } from "@/utils/date";

describe("date utilities", () => {
  it("should format date correctly", () => {
    const result = formatDate(new Date("2026-04-17"));
    expect(result).toMatch(/April|Apr/);
  });
});
```

**Target:** 95% coverage per utility

### Verification

```bash
# Week 2 end
pnpm test:coverage

# Should show:
# - Hooks: 80-90%
# - Services: 90%
# - Utils: 95%
# - Overall: >50%
```

**Checklist:**

- [ ] All 5 hook tests written
- [ ] All 6 service tests written
- [ ] All 4 utility tests written
- [ ] Coverage shows >50% overall
- [ ] All tests passing locally
- [ ] All tests passing in CI/CD

---

## Phase 3: Component & Integration Tests (Week 3, 12 hours)

### Pages to Test (4 hours)

**Create test files:**

```bash
mkdir -p src/__tests__/pages/auth
mkdir -p src/__tests__/pages/protected
touch src/__tests__/pages/auth/signin.test.tsx
touch src/__tests__/pages/auth/signup.test.tsx
touch src/__tests__/pages/protected/user-edit.test.tsx
touch src/__tests__/pages/protected/spots-new.test.tsx
```

**Template for page test:**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import SignInPage from '@/app/(public)/auth/signin/page';

describe('SignIn Page', () => {
  it('should render sign-in form', () => {
    render(<SignInPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const user = userEvent.setup();
    render(<SignInPage />);

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert success state
  });
});
```

**Target:** 70-80% coverage per page

### Components to Test (4 hours)

**Create test files:**

```bash
mkdir -p src/__tests__/features
touch src/__tests__/features/SpotForm.test.tsx
touch src/__tests__/features/SignInForm.test.tsx
touch src/__tests__/features/StoriesSwiper.test.tsx
touch src/__tests__/features/ProtectedLayout.test.tsx
```

**Template for component test:**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import SpotForm from '@/features/spots/SpotForm';

describe('SpotForm', () => {
  it('should render all form fields', () => {
    render(<SpotForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<SpotForm />);

    await user.type(screen.getByLabelText(/name/i), 'New Spot');
    await user.click(screen.getByRole('button', { name: /create/i }));

    // Assert submission
  });
});
```

**Target:** 80%+ coverage per component

### Integration Tests (4 hours)

**Create test files:**

```bash
mkdir -p src/__tests__/integration
touch src/__tests__/integration/auth-flow.test.tsx
touch src/__tests__/integration/spot-creation.test.tsx
touch src/__tests__/integration/user-profile.test.tsx
```

**Template for integration test:**

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

describe("Auth Flow Integration", () => {
  it("should sign in and access protected route", async () => {
    // 1. Arrange: Setup mocks
    // 2. Act: User signs in
    // 3. Assert: User can access protected content
  });
});
```

**Target:** 100% for critical flows

### Verification

```bash
# Week 3 end
pnpm test:coverage

# Should show:
# - Pages: 70-80%
# - Components: 80%+
# - Overall: 65-70%
```

**Checklist:**

- [ ] All page tests written
- [ ] All component tests written
- [ ] All integration tests written
- [ ] Coverage shows 65-70% overall
- [ ] All critical flows tested
- [ ] All tests passing locally and CI/CD

---

## Phase 4: E2E Tests (Week 4, 10 hours)

### Setup Playwright (1 hour)

**Create `playwright.config.ts`:**

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI
  }
});
```

**Create test directory:**

```bash
mkdir -p e2e
```

### Auth Flow E2E (3 hours)

**Create `e2e/auth.spec.ts`:**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should sign up with email confirmation", async ({ page }) => {
    // 1. Navigate to signup
    await page.goto("/auth/signup");

    // 2. Fill form
    await page.fill('[name="email"]', "newuser@test.com");
    await page.fill('[name="password"]', "Password123!");
    await page.click('button[type="submit"]');

    // 3. Verify confirmation page
    await page.waitForURL(/confirmation/);

    // 4. In real app, user clicks email link
    // await page.goto('/auth/confirmation?email=newuser@test.com');

    // 5. Complete registration
    // ...
  });

  test("should sign in with valid credentials", async ({ page }) => {
    await page.goto("/auth/signin");

    await page.fill('[name="email"]', "test@test.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');

    await page.waitForURL("/dashboard");
    expect(page.url()).toContain("/dashboard");
  });
});
```

### Spots E2E (3 hours)

**Create `e2e/spots.spec.ts`:**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Spots", () => {
  test("should browse spots and view details", async ({ page }) => {
    await page.goto("/spots");

    // Wait for list to load
    await page.waitForSelector("text=Spot");

    // Click first spot
    const firstSpot = page.locator('[data-testid="spot-card"]').first();
    await firstSpot.click();

    // Verify detail page
    await page.waitForURL(/spots\/[a-z0-9]+/);
    expect(page.url()).toMatch(/spots\/[a-z0-9]+/);
  });

  test("should create new spot when authenticated", async ({ page }) => {
    // 1. Sign in first
    await page.goto("/auth/signin");
    await page.fill('[name="email"]', "test@test.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');
    await page.waitForURL("/dashboard");

    // 2. Navigate to create spot
    await page.goto("/spots/new");

    // 3. Fill form
    await page.fill('[name="name"]', "New Test Spot");
    await page.fill('[name="description"]', "Great spot for testing");

    // 4. Submit
    await page.click('button:has-text("Create")');

    // 5. Verify redirect to spot detail
    await page.waitForURL(/spots\/[a-z0-9]+$/);
  });
});
```

### User Profile E2E (2 hours)

**Create `e2e/user.spec.ts`:**

```typescript
import { test, expect } from "@playwright/test";

test.describe("User Profile", () => {
  test("should view user profile", async ({ page }) => {
    await page.goto("/user/1");

    expect(page.locator("text=Profile")).toBeVisible();
    expect(page.locator('[data-testid="user-name"]')).toBeVisible();
  });

  test("should edit profile when authenticated", async ({ page }) => {
    // Sign in
    await page.goto("/auth/signin");
    await page.fill('[name="email"]', "test@test.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');

    // Go to edit
    await page.goto("/user/edit");

    // Edit profile
    await page.fill('[name="name"]', "Updated Name");
    await page.click('button:has-text("Save")');

    // Verify success
    expect(page.locator("text=Profile updated")).toBeVisible();
  });
});
```

### Session Management E2E (2 hours)

**Create `e2e/full-journey.spec.ts`:**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Full User Journey", () => {
  test("should handle session expiry and re-login", async ({ page }) => {
    // 1. Sign in
    await page.goto("/auth/signin");
    await page.fill('[name="email"]', "test@test.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');
    await page.waitForURL("/dashboard");

    // 2. Access protected route
    await page.goto("/spots/new");
    expect(page.url()).toContain("/spots/new");

    // 3. Simulate token expiry (in real app, would happen naturally)
    // await page.context().clearCookies();

    // 4. Try to access protected route again
    // Should redirect to signin
    // await page.reload();
    // await page.waitForURL('/auth/signin');

    // 5. Sign in again
    // await page.fill('[name="email"]', 'test@test.com');
    // ...
  });
});
```

### Verification

```bash
# Run E2E tests
pnpm e2e

# Should show all tests passing

# View report
pnpm e2e

# Should open HTML report with screenshots/videos

# Debug mode
pnpm e2e:debug

# Opens Playwright Inspector
```

**Checklist:**

- [ ] Playwright configured
- [ ] Auth E2E tests written and passing
- [ ] Spots E2E tests written and passing
- [ ] User profile E2E tests written and passing
- [ ] Session management E2E tests written and passing
- [ ] All tests run in <5 minutes
- [ ] Videos/screenshots captured on failure
- [ ] All tests passing in CI/CD

---

## Final Verification (End of Week 4)

```bash
# 1. Run all tests
pnpm test && pnpm test:coverage && pnpm e2e

# 2. Check coverage report
# Should show >70% overall

# 3. Verify CI/CD
# All tests passing on latest main branch

# 4. Check coverage trends
# Should show improvement over 4 weeks

# 5. Team validation
# New features written with tests
# No regressions in 2 weeks post-completion
```

---

## Weekly Check-In Template

### Each Friday EOD, Report:

```
Week [1-4] Testing Implementation Status

✅ Completed:
- [ ] Specific tests implemented
- [ ] Coverage achieved: X%
- [ ] Blockers cleared

❌ Blocked:
- [ ] (if any)

📊 Metrics:
- Unit tests: X passing
- Component tests: X passing
- E2E tests: X passing
- Coverage: X%
- Time spent: X hours

🎯 Next Week:
- [ ] Goals for next week
```

---

## Common Issues & Solutions

### Issue: Tests timing out

```typescript
// Increase timeout
it(
  "test name",
  async () => {
    // ...
  },
  { timeout: 10000 }
);
```

### Issue: API mocks not working

```typescript
// Ensure server is listening
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
```

### Issue: Flaky E2E tests

```typescript
// Use explicit waits
await page.waitForSelector("text=Spot Created");
await page.waitForURL("/dashboard");
```

---

## Success Indicators

By end of Week 4, you should have:

✅ 100+ unit tests  
✅ 20+ component tests  
✅ 10+ E2E scenarios  
✅ >70% code coverage  
✅ <2 minute test execution (unit)  
✅ <5 minute E2E execution (parallel)  
✅ CI/CD pipeline blocking bad PRs  
✅ Team comfortable writing tests

---

## Next Steps After Week 4

1. **Maintain** — Add tests for every new feature
2. **Improve** — Gradually increase coverage to 80%+
3. **Expand** — Add visual regression tests (Phase 5)
4. **Optimize** — Performance testing with Lighthouse CI (Phase 5)

---

## Resources

- **Vitest:** https://vitest.dev
- **React Testing Library:** https://testing-library.com/react
- **MSW:** https://mswjs.io
- **Playwright:** https://playwright.dev
