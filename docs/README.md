# Documentation Index

This directory contains all project documentation, including design decisions, testing strategies, and implementation guides.

## 🆕 Latest Plan Review (2026-10-09)

### New UI Layout & Skatistas Pagination Implementation

A complete review of the spec and implementation plan for the new app shell and paginated skatistas directory.

**Start here:** [`START_HERE_2026-10-09.md`](./START_HERE_2026-10-09.md)

### Supporting Documents

1. **[`START_HERE_2026-10-09.md`](./START_HERE_2026-10-09.md)** (5 min)
   - Quick orientation guide
   - Reading order and quick facts
   - Timeline and success criteria

2. **[`PLAN_REVIEW_SUMMARY_2026-10-09.md`](./PLAN_REVIEW_SUMMARY_2026-10-09.md)** (5 min)
   - Overall assessment: plan + spec alignment
   - 5 issues identified (all fixed)
   - Risk analysis and implementation timeline

3. **[`PLAN_REVIEW_FIXES_2026-10-09.md`](./PLAN_REVIEW_FIXES_2026-10-09.md)** (10 min)
   - Detailed description of each fix
   - Why each issue matters
   - Verification checklist

4. **[`IMPLEMENTATION_CHECKLIST_2026-10-09.md`](./IMPLEMENTATION_CHECKLIST_2026-10-09.md)** (reference while coding)
   - Task-by-task checklist
   - Git commit messages
   - Verification steps for each task

5. **[`superpowers/plans/2026-10-09-new-ui-layout-pagination.md`](./superpowers/plans/2026-10-09-new-ui-layout-pagination.md)** (reference)
   - Complete implementation plan with all 9 tasks
   - Step-by-step instructions
   - Edge case handling

6. **[`../specs/new-ui-layout.md`](../specs/new-ui-layout.md)** (reference)
   - Feature specification
   - Acceptance criteria
   - Data requirements

---

## 📂 Directory Structure

```
docs/
├── START_HERE_2026-10-09.md               ← Begin here
├── PLAN_REVIEW_SUMMARY_2026-10-09.md
├── PLAN_REVIEW_FIXES_2026-10-09.md
├── IMPLEMENTATION_CHECKLIST_2026-10-09.md
├── superpowers/                           ← Implementation plans
│   └── plans/
│       └── 2026-10-09-new-ui-layout-pagination.md
├── adr/                                   ← Architecture Decision Records
├── TECHNICAL_ANALYSIS.md                  ← System architecture & known issues
├── TESTING.md                             ← Testing strategies
├── APP_ROUTER_*.md                        ← App Router migration guides
├── AUTOMATED_TESTING_*.md                 ← Test infrastructure planning
└── README.md                              ← This file
```

---

## Other Documentation

### Architecture & Analysis

- **[`TECHNICAL_ANALYSIS.md`](./TECHNICAL_ANALYSIS.md)**
  - Full system architecture breakdown
  - Known issues and limitations
  - API client design
  - Authentication flow

### Testing

- **[`TESTING.md`](./TESTING.md)**
  - Testing standards and conventions
  - Tool setup (Vitest, RTL, MSW, Playwright)
  - Test file organization

- **[`APP_ROUTER_TESTING_STRATEGY.md`](./APP_ROUTER_TESTING_STRATEGY.md)**
  - App Router-specific testing approach
  - Migration from Pages Router to App Router

- **[`APP_ROUTER_TESTING_CHECKLIST.md`](./APP_ROUTER_TESTING_CHECKLIST.md)**
  - Pre-launch verification checklist

- **[`AUTOMATED_TESTING_IMPLEMENTATION_ROADMAP.md`](./AUTOMATED_TESTING_IMPLEMENTATION_ROADMAP.md)**
  - Phased test infrastructure rollout plan

### Migration Guides

- **[`APP_ROUTER_ROLLBACK_GUIDE.md`](./APP_ROUTER_ROLLBACK_GUIDE.md)**
  - How to revert to Pages Router if needed

- **[`APP_ROUTER_TROUBLESHOOTING.md`](./APP_ROUTER_TROUBLESHOOTING.md)**
  - Common issues and solutions during App Router migration

### Architecture Decisions

- **[`adr/`](./adr/)**
  - Architecture Decision Records
  - Rationale for major technical choices

---

## How to Use This Directory

### For Implementation

1. **Starting a new feature?**
   - Check for a plan in `superpowers/plans/`
   - Use the associated implementation checklist
   - Reference the spec in the root `specs/` directory

2. **During development?**
   - Keep `TECHNICAL_ANALYSIS.md` open for architecture questions
   - Follow testing guidelines from `TESTING.md` or task-specific guides
   - Check `AGENTS.md` for coding standards

### For Reference

- **Architecture questions** → `TECHNICAL_ANALYSIS.md`
- **Testing setup** → `TESTING.md` or `APP_ROUTER_*.md`
- **Decisions on why we built something** → `adr/`
- **Current implementation plan** → `superpowers/plans/`

---

## Quick Links

- **Spec files:** [`../specs/`](../specs/)
- **Coding standards:** [`../AGENTS.md`](../AGENTS.md)
- **Context:** [`../CONTEXT.md`](../CONTEXT.md)
- **Changelog:** [`../CHANGELOG.md`](../CHANGELOG.md)

---

**Last updated:** 2026-10-09
