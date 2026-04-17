# Feature: Implement Automated Testing Suite

**Status:** ready  
**Priority:** high  
**Affects:** Testing infrastructure, CI/CD pipeline, all features  
**Effort Estimate:** 40-50 hours (4 weeks, post-App Router release)  
**Target Start:** Week 6 (after App Router stabilization)

## Problem Statement

SkateHub Frontend has completed the App Router migration to production. The codebase lacks automated testing infrastructure, creating risks:

1. **Regression Risk** — No automated detection of breaking changes
2. **Developer Confidence** — Hard to refactor without safety net
3. **CI/CD Gap** — No automated quality gates preventing bad PRs
4. **Onboarding** — New developers can't verify changes with tests
5. **Quality** — Manual testing is slow and error-prone

## Solution

Implement comprehensive automated test suite across three layers:

- **Unit Tests (60-70%)** — Hooks, services, utilities with Vitest
- **Integration Tests (15-25%)** — Components, auth flows with React Testing Library
- **E2E Tests (5-10%)** — User journeys with Playwright

## UI / UX Description

This is an infrastructure feature. User-facing changes: **None**.

**Developer experience improves:**

1. **Before PR Submission**

   ```bash
   pnpm test              # Run unit/integration tests locally
   pnpm test:coverage     # See coverage report
   pnpm e2e               # Run E2E tests
   ```

2. **During PR Review**
   - GitHub Actions automatically runs all tests
   - PR shows test results badge
   - Coverage report attached
   - Failing tests block merge

3. **After Merge**
   - Commits only merge with passing tests
   - Coverage trends tracked over time
   - Regressions prevented automatically

## Data Requirements

No new API endpoints needed. Tests mock existing API with MSW (Mock Service Worker).

## Component & File Plan

### New Directories Created

```
src/__tests__/                          # Test directory
├── setup.ts                            # Global test setup
├── mocks/
│   ├── api.ts                          # API handlers
│   └── server.ts                       # MSW server setup
├── utils/
│   └── test-utils.tsx                  # Custom render + wrappers
├── hooks/                              # Hook tests
│   ├── useAuth.test.ts
│   ├── useUsers.test.ts
│   ├── useSingleUser.test.ts
│   ├── useSpots.test.ts
│   └── useStories.test.ts
├── services/                           # Service tests
│   ├── createSpot.test.ts
│   ├── updateSpot.test.ts
│   ├── signUpRequest.test.ts
│   ├── getSpots.test.ts
│   ├── getUser.test.ts
│   └── getUsers.test.ts
├── utils/                              # Utility tests
│   ├── auth.test.ts
│   ├── date.test.ts
│   ├── socialMedia.test.ts
│   └── mapbox.test.ts
├── features/                           # Component tests
│   ├── SpotForm.test.tsx
│   ├── SignInForm.test.tsx
│   ├── StoriesSwiper.test.tsx
│   └── ProtectedLayout.test.tsx
├── pages/                              # Page tests
│   ├── auth/
│   │   ├── signin.test.tsx
│   │   └── signup.test.tsx
│   └── protected/
│       ├── user-edit.test.tsx
│       └── spots-new.test.tsx
└── integration/                        # Integration tests
    ├── auth-flow.test.tsx
    ├── spot-creation.test.tsx
    └── user-profile.test.tsx

e2e/                                    # E2E tests
├── auth.spec.ts
├── spots.spec.ts
├── user.spec.ts
└── full-journey.spec.ts

.github/workflows/
└── test.yml                            # CI/CD pipeline

.vite/
├── vitest.config.ts                    # Vitest configuration
└── vitest.setup.ts                     # Test setup

package.json (updated)                  # New test scripts

docs/
├── TESTING.md                          # Quick reference (already created)
└── AUTOMATED_TESTING_IMPLEMENTATION_ROADMAP.md  # Roadmap + checklist
```

### Configuration Files to Create

1. **vitest.config.ts** — Vitest configuration
2. **vitest.setup.ts** — Global test setup (MSW server)
3. **playwright.config.ts** — Playwright configuration
4. **.github/workflows/test.yml** — CI/CD pipeline
5. **src/**tests**/mocks/server.ts** — MSW server setup
6. **src/**tests**/utils/test-utils.tsx** — Custom render wrapper

### Package.json Updates

Add dependencies:

```json
{
  "devDependencies": {
    "vitest": "^latest",
    "@vitest/ui": "^latest",
    "@vitest/coverage-v8": "^latest",
    "@testing-library/react": "^latest",
    "@testing-library/jest-dom": "^latest",
    "msw": "^latest",
    "@playwright/test": "^latest",
    "happy-dom": "^latest"
  },
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

### Existing Files Modified

1. **AGENTS.md** — Add testing standards section ✅ (done)
2. **docs/TESTING.md** — Quick reference guide ✅ (done)

## Acceptance Criteria

### Phase 1: Infrastructure Setup ✅

- [ ] Vitest installed and configured
- [ ] React Testing Library configured
- [ ] MSW API mocking working
- [ ] Playwright installed and configured
- [ ] GitHub Actions workflow created
- [ ] Example unit test demonstrates setup
- [ ] All test commands work: `pnpm test`, `pnpm test:watch`, `pnpm test:coverage`, `pnpm e2e`
- [ ] Coverage thresholds configured (70% minimum)

### Phase 2: Unit Tests ✅

- [ ] All 5 hooks tested with 80-90% coverage
- [ ] All 6 services tested with 90% coverage
- [ ] All 4 utilities tested with 95% coverage
- [ ] API calls mocked with MSW
- [ ] Error cases tested
- [ ] Overall coverage >50%
- [ ] All tests pass locally and in CI/CD

### Phase 3: Component & Integration Tests ✅

- [ ] All 5 critical pages tested with 70-80% coverage
- [ ] All 4 key components tested with 80%+ coverage
- [ ] Auth flow integration test passes
- [ ] Spot creation flow integration test passes
- [ ] User profile flow integration test passes
- [ ] Protected layout auth check verified
- [ ] Form validation tested
- [ ] Overall coverage >65-70%
- [ ] All tests pass locally and in CI/CD

### Phase 4: E2E Tests ✅

- [ ] Auth flow E2E test passes (sign up → confirmation → sign in)
- [ ] Spot creation E2E test passes (browse → create → view)
- [ ] User profile E2E test passes (view → edit → save)
- [ ] Session management E2E test passes (logout → redirect → re-login)
- [ ] All 4+ E2E scenarios passing
- [ ] Tests run in <5 minutes (parallel execution)
- [ ] Screenshots/videos captured on failure
- [ ] All tests pass in CI/CD

### CI/CD Integration ✅

- [ ] GitHub Actions workflow runs on every PR
- [ ] Failing tests block merge to main
- [ ] Coverage reports generated
- [ ] Test results visible in PR
- [ ] No regressions caught automatically

### Final Verification ✅

- [ ] Coverage report shows >70% for critical paths
- [ ] All unit tests passing (100%)
- [ ] All integration tests passing (100%)
- [ ] All E2E tests passing (100%)
- [ ] CI/CD pipeline fully functional
- [ ] Team comfortable writing new tests
- [ ] Documentation complete and reviewed
- [ ] No regressions in production for 2 weeks post-completion

## Success Metrics

| Metric             | Target                       | Verification                    |
| ------------------ | ---------------------------- | ------------------------------- |
| Overall Coverage   | >70%                         | `pnpm test:coverage`            |
| Unit Coverage      | >90%                         | Services, hooks, utils          |
| Component Coverage | >80%                         | Pages, features                 |
| E2E Scenarios      | 10+                          | All major flows                 |
| Test Execution     | <2 min (unit) + <5 min (e2e) | CI/CD timing                    |
| PR Blocks          | 100%                         | Failing tests prevent merge     |
| Team Adoption      | 100%                         | New features written with tests |

## Out of Scope

- **Visual Regression Testing** — Future phase (Percy/Chromatic)
- **Performance Testing** — Future phase (Lighthouse CI)
- **Load/Stress Testing** — Future phase (k6/Artillery)
- **Mobile Testing** — Consider post-launch
- **Accessibility Testing** — Consider post-launch
- **Mutation Testing** — Future phase (Stryker)

## Implementation Timeline

| Phase                    | Week        | Duration      | Owner                |
| ------------------------ | ----------- | ------------- | -------------------- |
| Phase 1: Infrastructure  | 6           | 8 hours       | DevOps/Lead Dev      |
| Phase 2: Unit Tests      | 7           | 10 hours      | Full Team (2-3 devs) |
| Phase 3: Component Tests | 8           | 12 hours      | Frontend Specialists |
| Phase 4: E2E Tests       | 9           | 10 hours      | QA + Senior Dev      |
| Buffer & Review          | 6-9         | 10 hours      | All                  |
| **Total**                | **4 weeks** | **~50 hours** | **Team effort**      |

## Risk Mitigation

| Risk                   | Likelihood | Impact | Mitigation                       |
| ---------------------- | ---------- | ------ | -------------------------------- |
| Tests too slow         | Medium     | Medium | Parallel execution, separate E2E |
| Flaky E2E tests        | High       | High   | Retry logic, explicit waits      |
| API mocking complexity | Medium     | Medium | MSW handlers reusable            |
| Test maintenance       | Medium     | Medium | Clear conventions, templates     |
| Coverage gaps          | Low        | High   | Coverage reports, code review    |
| Team adoption          | Low        | High   | Clear documentation, examples    |

## Dependencies

- **Prerequisite:** App Router migration complete and stable in production
- **Team Availability:** 2-3 developers for 4 weeks
- **No blockers** — All tools and integrations straightforward

## Next Steps

1. **Approval** — Tech lead reviews and approves spec
2. **Scheduling** — Plan testing implementation for Week 6+
3. **Setup** — Install dependencies and configure tools
4. **Execution** — Follow 4-week implementation roadmap
5. **Review** — Weekly progress check-ins

---

## Reference

For detailed implementation roadmap, see: `docs/AUTOMATED_TESTING_IMPLEMENTATION_ROADMAP.md`
For quick reference guide, see: `docs/TESTING.md`
