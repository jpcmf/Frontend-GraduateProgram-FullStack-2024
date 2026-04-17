# Automated Testing Implementation Plan

**Status:** ready  
**Priority:** high  
**Target Timeline:** 4 weeks (post-App Router release)  
**Effort Estimate:** 40-50 hours across team

## Executive Summary

This plan establishes a phased approach to adding automated test coverage to SkateHub Frontend. The migration to App Router is complete and stable in production. Now we implement a comprehensive testing strategy to prevent regressions and ensure quality.

**Key Metrics:**

- Target Coverage: 70-80% of critical paths
- Unit Test Coverage: All hooks, services, utilities
- Integration Coverage: Auth flows, protected routes, API calls
- E2E Coverage: User journeys, full feature workflows

---

## Problem Statement

### Current State

- ✅ Build validation (TypeScript, ESLint)
- ✅ Manual testing checklist documented
- ❌ No automated unit tests
- ❌ No automated integration tests
- ❌ No automated E2E tests
- ❌ No CI/CD test pipeline

### Pain Points

1. **Regression Risk** — Changes could break existing functionality without automated detection
2. **Developer Confidence** — Hard to refactor without safety net
3. **CI/CD Gap** — No automated quality gates before deployment
4. **Onboarding** — New team members can't verify changes with tests
5. **Documentation** — No executable test specification for features

### Desired State

- ✅ Comprehensive test suite running in CI/CD
- ✅ >70% code coverage on critical paths
- ✅ Fast feedback loop (tests run in <2 minutes)
- ✅ Clear testing conventions for team
- ✅ Automated regressions prevention

---

## Testing Architecture

### Testing Pyramid

```
                    ▲
                   /|\
                  / | \      E2E (5-10%)
                 /  |  \     Playwright - Full user journeys
                /   |   \
               /____|____\
              /     |     \    Integration (15-25%)
             / React TL  \    Testing Library - Component + API
            /______|_____\
           /       |       \   Unit (60-70%)
          /  Vitest | Jest  \  Vitest - Hooks, Utils, Services
         /__________|_______\
        ╚═══════════════════╝

Testing Distribution
- Unit Tests: 60-70% (Fast, deterministic)
- Integration: 15-25% (Medium speed, high value)
- E2E: 5-10% (Slow, real user scenarios)
```

### Tools & Stack

| Layer       | Tool                          | Purpose               | Install Time |
| ----------- | ----------------------------- | --------------------- | ------------ |
| Unit        | **Vitest**                    | Fast unit test runner | 10 min       |
| Unit        | **React Testing Library**     | Component testing     | 5 min        |
| Unit        | **@testing-library/jest-dom** | DOM matchers          | 2 min        |
| Integration | **msw** (Mock Service Worker) | API mocking           | 5 min        |
| E2E         | **Playwright**                | Browser automation    | 15 min       |
| Utilities   | **@vitest/ui**                | Test dashboard        | 2 min        |
| Utilities   | **@vitest/coverage-v8**       | Coverage reports      | 5 min        |

**Why These Tools?**

- ✅ Vitest: Fastest, ESM-native, Next.js compatible
- ✅ React Testing Library: User-centric, encourages best practices
- ✅ MSW: API mocking without changing code
- ✅ Playwright: No flakiness, great for Next.js apps

---

## Phase Breakdown

### Phase 1: Test Infrastructure Setup (Week 1)

**Duration:** 8 hours  
**Deliverables:** Development environment ready, CI/CD pipeline configured

#### Tasks

1. Install and configure Vitest
2. Setup React Testing Library
3. Configure code coverage tools
4. Setup Playwright
5. Configure GitHub Actions / CI pipeline
6. Create test file structure and conventions
7. Write example unit test
8. Document setup in CONTRIBUTING.md

#### Files to Create

```
.vite/                              # Vitest config
├── vitest.config.ts               # Vitest configuration
├── vitest.setup.ts                # Test setup file

src/__tests__/                      # Test directory structure
├── setup.ts                        # Global test setup
├── mocks/
│   ├── api.ts                      # API handlers
│   └── handlers.ts                 # MSW handlers
├── utils/
│   └── test-utils.tsx              # Custom render + wrappers

.github/workflows/
├── test.yml                        # CI/CD test pipeline

docs/
├── TESTING.md                      # Testing guide (new)
```

#### Acceptance Criteria

- [ ] `pnpm test` runs and passes
- [ ] `pnpm test:watch` starts in watch mode
- [ ] `pnpm test:coverage` generates coverage report
- [ ] CI/CD pipeline runs tests on PR
- [ ] Example test demonstrates setup

---

### Phase 2: Unit Tests (Week 2)

**Duration:** 10 hours  
**Deliverables:** Tests for all hooks, services, and utilities

#### Test Coverage Map

**Hooks (src/hooks/)**

```
useAuth.ts                          Target: 90% coverage
├── ✓ Returns user when authenticated
├── ✓ Returns null when not authenticated
├── ✓ Handles loading state
├── ✓ Handles token refresh
└── ✓ Handles logout

useUsers.ts                         Target: 80% coverage
├── ✓ Fetches users list
├── ✓ Handles pagination
├── ✓ Handles search filter
└── ✓ Handles errors

useSingleUser.ts                    Target: 80% coverage
├── ✓ Fetches single user
├── ✓ Handles not found (404)
└── ✓ Handles errors

useSpots.ts                         Target: 80% coverage
├── ✓ Fetches spots list
├── ✓ Handles pagination
└── ✓ Handles errors

useStories.ts                       Target: 80% coverage
├── ✓ Fetches stories
├── ✓ Handles empty state
└── ✓ Handles errors
```

**Services (src/services/)**

```
createSpot.ts                       Target: 90% coverage
├── ✓ Makes POST request with correct data
├── ✓ Validates input before request
└── ✓ Handles API errors

updateSpot.ts                       Target: 90% coverage
├── ✓ Makes PUT request
├── ✓ Validates input
└── ✓ Handles errors

signUpRequest.ts                    Target: 90% coverage
├── ✓ Makes signup POST request
├── ✓ Validates email format
├── ✓ Handles duplicate email error
└── ✓ Handles network error

getSpots.ts                         Target: 90% coverage
├── ✓ Fetches spots with filters
├── ✓ Handles pagination params
└── ✓ Handles errors

getUser.ts                          Target: 90% coverage
├── ✓ Fetches user by ID
└── ✓ Handles 404 not found

getUsers.ts                         Target: 90% coverage
├── ✓ Fetches users with pagination
└── ✓ Handles errors
```

**Utils (src/utils/)**

```
auth.ts                             Target: 95% coverage
├── ✓ getTokenFromStorage
├── ✓ setTokenToStorage
├── ✓ removeTokenFromStorage
├── ✓ isValidToken
└── ✓ getTokenExpiry

date.ts                             Target: 95% coverage
├── ✓ formatDate function
├── ✓ parseDate function
└── ✓ calculateDaysDiff

socialMedia.ts                      Target: 90% coverage
├── ✓ formatInstagram
├── ✓ formatTikTok
├── ✓ validateUrl

mapbox.ts                           Target: 85% coverage
├── ✓ formatCoordinates
└── ✓ parseGeoJSON
```

#### Files to Create

```
src/__tests__/
├── hooks/
│   ├── useAuth.test.ts
│   ├── useUsers.test.ts
│   ├── useSingleUser.test.ts
│   ├── useSpots.test.ts
│   └── useStories.test.ts
├── services/
│   ├── createSpot.test.ts
│   ├── updateSpot.test.ts
│   ├── signUpRequest.test.ts
│   ├── getSpots.test.ts
│   ├── getUser.test.ts
│   └── getUsers.test.ts
└── utils/
    ├── auth.test.ts
    ├── date.test.ts
    ├── socialMedia.test.ts
    └── mapbox.test.ts
```

#### Acceptance Criteria

- [ ] All hooks tested with >80% coverage
- [ ] All services tested with >90% coverage
- [ ] All utilities tested with >95% coverage
- [ ] API calls mocked with MSW
- [ ] Error cases covered
- [ ] `pnpm test:coverage` shows >70% overall

---

### Phase 3: Component & Integration Tests (Week 3)

**Duration:** 12 hours  
**Deliverables:** Tests for pages, forms, and critical components

#### Component Test Coverage

**Pages (src/app/)**

```
(public)/auth/signin/page.tsx       Target: 85% coverage
├── ✓ Renders sign-in form
├── ✓ Validates email/password
├── ✓ Handles sign-in success
├── ✓ Handles sign-in error
└── ✓ Redirects when already logged in

(public)/auth/signup/page.tsx       Target: 85% coverage
├── ✓ Renders sign-up form
├── ✓ Validates all fields
├── ✓ Handles duplicate email
└── ✓ Handles network error

(protected)/user/edit/page.tsx      Target: 80% coverage
├── ✓ Requires authentication
├── ✓ Loads user data
├── ✓ Updates user info
├── ✓ Handles validation errors
└── ✓ Shows success message

(protected)/spots/new/page.tsx      Target: 80% coverage
├── ✓ Requires authentication
├── ✓ Renders spot form
├── ✓ Creates spot on submit
├── ✓ Handles form errors
└── ✓ Redirects on success
```

**Features (src/features/)**

```
SpotForm component                  Target: 90% coverage
├── ✓ Renders all form fields
├── ✓ Validates required fields
├── ✓ Handles file upload
├── ✓ Submits with correct data
└── ✓ Shows error messages

SignInForm component                Target: 90% coverage
├── ✓ Renders email/password inputs
├── ✓ Validates email format
├── ✓ Shows loading state
├── ✓ Handles login error
└── ✓ Submits form data

StoriesSwiper component             Target: 85% coverage
├── ✓ Renders stories list
├── ✓ Swipes between stories
├── ✓ Handles empty state
└── ✓ Loads images correctly

ProtectedLayout component           Target: 95% coverage
├── ✓ Shows spinner while loading
├── ✓ Redirects if not authenticated
├── ✓ Renders children if authenticated
└── ✓ Handles auth state changes
```

#### Integration Test Scenarios

**Auth Flow**

```
Feature: User Authentication
  Scenario: Sign in with valid credentials
    Given user is on signin page
    When user enters valid email and password
    And clicks sign-in button
    Then user is authenticated
    And user is redirected to dashboard

  Scenario: Cannot access protected route without auth
    Given user is not authenticated
    When user navigates to /spots/new
    Then user is redirected to /auth/signin

  Scenario: Protected layout shows loading then content
    Given user is authenticated
    When user navigates to /dashboard
    Then loading spinner appears
    And dashboard content loads
```

**Spot Creation Flow**

```
Feature: Create Spot
  Scenario: Create spot with all required data
    Given user is authenticated
    When user navigates to /spots/new
    And fills in all spot form fields
    And submits the form
    Then spot is created
    And user is redirected to spot detail page
    And new spot appears in spots list

  Scenario: Form validation on create spot
    Given user is on /spots/new
    When user submits empty form
    Then validation errors appear
    And spot is not created
```

#### Files to Create

```
src/__tests__/
├── pages/
│   ├── auth/
│   │   ├── signin.test.tsx
│   │   └── signup.test.tsx
│   └── protected/
│       ├── user.edit.test.tsx
│       └── spots.new.test.tsx
├── features/
│   ├── SpotForm.test.tsx
│   ├── SignInForm.test.tsx
│   ├── StoriesSwiper.test.tsx
│   └── ProtectedLayout.test.tsx
└── integration/
    ├── auth-flow.test.tsx
    ├── spot-creation.test.tsx
    └── user-profile.test.tsx
```

#### Acceptance Criteria

- [ ] All critical components tested with >80% coverage
- [ ] Auth flow integration test passes
- [ ] Form validation tests pass
- [ ] Protected route tests pass
- [ ] Overall coverage >70%

---

### Phase 4: E2E Tests (Week 4)

**Duration:** 10 hours  
**Deliverables:** Full user journey tests with Playwright

#### E2E Test Scenarios

**User Journey 1: Sign Up & Create First Spot**

```
Feature: Complete skateboard spot creation workflow

  Scenario: New user signs up and creates their first spot
    Given user visits skatehub.com
    When user clicks "Sign Up"
    And fills in signup form with valid data
    And submits signup
    Then user receives confirmation email link
    And user clicks email confirmation link
    And user is redirected to /general (registration)
    And user completes athlete registration
    And user navigates to /spots/new
    And user fills in spot form with:
      - Name, description, difficulty
      - Location (map pin)
      - Photos upload
    And user submits the form
    Then spot is created successfully
    And user is redirected to spot detail page
    And spot appears in /spots listing
    And user can view their spot on map
```

**User Journey 2: User Discovery & Interaction**

```
Feature: User discovers and interacts with spots

  Scenario: User browses spots and views skatista profiles
    Given user is on /spots
    When user views spot listing
    And user filters spots by difficulty
    And user clicks on a spot
    Then spot detail page loads
    And spot location shows on map
    And creator profile link is visible
    And user clicks creator profile
    Then creator skatista page loads
    And creator's stories are visible
    And user can follow creator (if logged in)
```

**User Journey 3: Profile Management**

```
Feature: User manages their profile and settings

  Scenario: User updates profile information
    Given user is authenticated
    When user navigates to /user/edit
    And user updates name, bio, avatar
    And user adds social media links
    And user clicks save
    Then profile is updated successfully
    And user sees success notification
    And updated info appears on profile page /user/[id]
```

**User Journey 4: Authentication Edge Cases**

```
Feature: Auth flow edge cases

  Scenario: User session expires and re-authenticates
    Given user is logged in
    When auth token expires
    And user tries to access protected route
    Then user is redirected to /auth/signin
    And user can log in again
    And user is redirected to original protected route

  Scenario: User logs out
    Given user is authenticated
    When user clicks logout
    Then user is logged out
    And user cannot access /dashboard
    And user is redirected to /auth/signin
```

#### Playwright Test Files

```
e2e/
├── auth.spec.ts
│   ├── Sign up and email confirmation
│   ├── Sign in with valid credentials
│   ├── Sign in with invalid credentials
│   ├── Forgot password flow
│   └── Logout flow
├── spots.spec.ts
│   ├── View spots listing
│   ├── View spot details
│   ├── Create new spot (protected)
│   ├── Edit own spot (protected)
│   └── Delete own spot (protected)
├── user.spec.ts
│   ├── View user profile
│   ├── Edit profile (protected)
│   ├── Follow user (protected)
│   └── View user stories (if applicable)
└── full-journey.spec.ts
    ├── Sign up → complete registration → create spot
    ├── Sign in → browse spots → view profile
    └── Session expiry and re-login
```

#### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 1,
  workers: 4,
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
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

#### Acceptance Criteria

- [ ] All E2E scenarios pass
- [ ] Auth flow e2e test passes
- [ ] Spot creation e2e test passes
- [ ] User profile e2e test passes
- [ ] All screenshots/videos captured on failure
- [ ] Tests run in <5 minutes parallel

---

## Implementation Roadmap

### Week 1: Infrastructure (8 hours)

```
Monday
├── Morning (2h) — Install Vitest, RTL, MSW
├── Afternoon (2h) — Setup coverage tools & CI/CD
└── EOD — PR with test infrastructure

Tuesday-Wednesday
├── (2h) — Create test structure and conventions
├── (1h) — Write example unit test
├── (1h) — Document in CONTRIBUTING.md
└── EOD — PR with setup complete

Thursday-Friday
├── Review & adjust configuration
└── Prepare for Phase 2
```

### Week 2: Unit Tests (10 hours)

```
Monday-Tuesday
├── (5h) — Write tests for all hooks
├── (3h) — Write tests for all services
└── (2h) — Write tests for all utilities

Wednesday-Thursday
├── (2h) — Code review and refactor tests
├── (1h) — Update coverage thresholds
└── (2h) — Document test patterns

Friday
├── PR review
└── Ensure >70% coverage threshold
```

### Week 3: Component Tests (12 hours)

```
Monday-Tuesday
├── (6h) — Write tests for critical pages
├── (3h) — Write tests for key components
└── (2h) — Write integration tests

Wednesday-Thursday
├── (3h) — Mock complex dependencies
├── (2h) — Fix flaky tests
└── (1h) — Update coverage report

Friday
├── PR review
└── Ensure all tests pass in CI
```

### Week 4: E2E Tests (10 hours)

```
Monday-Tuesday
├── (5h) — Setup Playwright
├── (3h) — Write auth flow E2E tests
└── (2h) — Write spot creation E2E tests

Wednesday-Thursday
├── (3h) — Write user profile E2E tests
├── (2h) — Handle flaky tests
└── (1h) — Configure test retry logic

Friday
├── PR review
├── Run full test suite
└── All tests passing
```

### Success Criteria After 4 Weeks

- ✅ 100+ unit tests written
- ✅ 20+ integration tests written
- ✅ 10+ E2E test scenarios passing
- ✅ >70% code coverage
- ✅ All critical paths covered
- ✅ CI/CD pipeline running tests on every PR
- ✅ Test failures block merge to main

---

## Test File Structure & Conventions

### Unit Test Example

```typescript
// src/__tests__/hooks/useAuth.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";
import * as authService from "@/services/getAuthUser";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user when authenticated", async () => {
    const mockUser = { id: "1", name: "John", email: "john@test.com" };
    vi.spyOn(authService, "getAuthUser").mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should return null when not authenticated", async () => {
    vi.spyOn(authService, "getAuthUser").mockRejectedValue(new Error("Unauthorized"));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

### Component Test Example

```typescript
// src/__tests__/features/SignInForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignInForm from '@/features/auth/SignInForm';
import * as signInService from '@/services/signIn';

describe('SignInForm', () => {
  it('should render email and password inputs', () => {
    render(<SignInForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should handle sign in on form submit', async () => {
    const signInMock = vi.spyOn(signInService, 'signIn').mockResolvedValue({ token: 'abc' });
    render(<SignInForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('test@test.com', 'password123');
    });
  });
});
```

### E2E Test Example

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should sign in with valid credentials", async ({ page }) => {
    await page.goto("/auth/signin");

    await page.fill('input[name="email"]', "test@test.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');

    await page.waitForURL("/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/auth/signin");

    await page.fill('input[name="email"]', "invalid@test.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button:has-text("Sign In")');

    const errorMessage = page.locator("text=Invalid credentials");
    await expect(errorMessage).toBeVisible();
  });
});
```

---

## Package Installation Commands

### Phase 1: Setup

```bash
# Install testing tools
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
pnpm add -D @testing-library/react @testing-library/jest-dom
pnpm add -D msw

# Install Playwright
pnpm add -D @playwright/test

# Install supporting tools
pnpm add -D happy-dom  # lightweight DOM implementation for tests
```

### Package.json Scripts to Add

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

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
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
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
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

  coverage:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - name: Report coverage
        run: echo "Coverage reports available in build artifacts"
```

---

## Success Metrics

### Coverage Targets (End of Phase 4)

| Category         | Target                       | Approach                       |
| ---------------- | ---------------------------- | ------------------------------ |
| Unit Tests       | >90% for hooks/services      | Vitest with coverage threshold |
| Component Tests  | >80% for pages/features      | React Testing Library          |
| E2E Tests        | 100% critical user paths     | Playwright scenarios           |
| Overall Coverage | >70%                         | Combined metrics               |
| Test Execution   | <2 min (unit) + <5 min (e2e) | Parallel workers               |
| PR Block         | Failing tests block merge    | GitHub Actions required        |

### Quality Gates

```yaml
Coverage thresholds (vitest.config.ts):
  - Lines: 70%
  - Branches: 65%
  - Functions: 70%
  - Statements: 70%

Blocks PR merge if:
  - Any test fails
  - Coverage drops below threshold
  - E2E tests fail
```

---

## Risk Mitigation

| Risk                    | Likelihood | Impact | Mitigation                                   |
| ----------------------- | ---------- | ------ | -------------------------------------------- |
| Tests too slow          | Medium     | Medium | Parallel execution, separate E2E from unit   |
| Flaky E2E tests         | High       | High   | Retry logic, wait strategies, explicit waits |
| API mocking complexity  | Medium     | Medium | MSW handlers reusable across tests           |
| Test maintenance burden | Medium     | Medium | Clear conventions, automated test generation |
| Coverage gaps           | Low        | High   | Coverage reports, team code review           |

---

## Team Responsibilities

### Week 1 (Infrastructure)

**Owner:** DevOps/Lead Developer

- Setup Vitest config
- Setup Playwright config
- Create GitHub Actions workflow
- Document conventions

### Week 2 (Unit Tests)

**Owner:** Full Team (3-4 developers)

- Each dev assigns ~3-4 services/hooks to test
- Peer review tests
- Ensure >70% coverage

### Week 3 (Component Tests)

**Owner:** Frontend Specialists

- Test critical pages and components
- Integration test scenarios
- Mock complex dependencies

### Week 4 (E2E Tests)

**Owner:** QA + Senior Developer

- Write E2E scenarios
- Handle flaky tests
- Configure retry logic

---

## Next Steps After 4 Weeks

### Ongoing Maintenance

1. **Every PR** — Run tests, maintain coverage >70%
2. **Weekly** — Review flaky test logs, fix issues
3. **Monthly** — Add new tests for new features
4. **Quarterly** — Review and improve test efficiency

### Future Enhancements

1. **Visual Regression Testing** — Playwright with Percy/Chromatic
2. **Performance Testing** — Lighthouse CI integration
3. **Load Testing** — k6 or Artillery for API endpoints
4. **Mutation Testing** — Find weak tests with Stryker

---

## Out of Scope

- Visual regression testing (Phase 5+)
- Performance benchmarking (Phase 5+)
- Load/stress testing (Phase 5+)
- Mobile testing (Consider Phase 5+)
- Accessibility testing (Consider Phase 5+)

---

## Success Criteria

**Plan is successful when:**

- ✅ 4 weeks complete with all phases delivered
- ✅ >70% code coverage achieved
- ✅ All critical user paths covered by E2E tests
- ✅ CI/CD pipeline runs tests on every PR
- ✅ Failing tests block merge to main
- ✅ Team comfortable writing new tests
- ✅ No regression bugs in production for 2 weeks post-release

---

## Approval & Sign-Off

**Document Status:** Ready for team review  
**Estimated Cost:** 40-50 developer hours (~1-1.5 weeks)  
**ROI:** Prevents 1-2 critical bugs per sprint (typical for frontend)

**Approvals Needed:**

- [ ] Tech Lead
- [ ] Product Owner
- [ ] QA Lead
