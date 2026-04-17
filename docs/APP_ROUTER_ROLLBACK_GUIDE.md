# App Router Migration: Rollback Guide

## Quick Rollback (Before Phase 4 Cleanup)

If you encounter blockers at any point **before deleting `src/pages/`**, rollback is trivial:

```bash
# Delete the App Router code (keeps Pages Router intact)
rm -rf src/app/

# Both routers continue coexisting—no harm done
npm run dev
```

Pages Router will continue working exactly as before. This is the beauty of incremental migration—zero risk until cleanup phase.

---

## Full Rollback (After Phase 4 Cleanup)

If issues arise after deleting `pages/` and `middleware.ts`:

### Option 1: Git Revert (Recommended)

```bash
# Revert the cleanup commit
git revert <cleanup-commit-hash>

# This restores pages/ and middleware.ts automatically
npm run dev
```

### Option 2: Manual Restore

```bash
# Restore from git history
git checkout HEAD~1 -- src/pages/ src/middleware.ts

# Restart
npm run dev
```

### Option 3: Feature Branch Reset

If the entire migration caused issues:

```bash
# Revert to before migration started
git checkout main
git reset --hard HEAD

# Switch back to main branch
npm run dev
```

---

## Partial Rollback (If Specific Phases Failed)

### Phase 0 Fails (Root Layout Issues)

```bash
# Delete root app/ layout only—keep other progress
rm src/app/layout.tsx src/app/error.tsx src/app/not-found.tsx

# Fix issues in _app.tsx or root providers
# Then re-attempt Phase 0
```

### Phase 1 Fails (Public Routes Broken)

```bash
# Delete public routes but keep setup
rm -rf src/app/\(public\)/

# Verify Pages Router public routes still work
# Then re-attempt Phase 1
```

### Phase 2 Fails (Protected Routes Broken)

```bash
# Delete protected routes but keep Phase 0-1 progress
rm -rf src/app/\(protected\)/

# Review middleware.ts logic
# Fix issues in protected layout
# Then re-attempt Phase 2
```

### Phase 3 Fails (API Routes Broken)

```bash
# Delete new API routes but keep everything else
rm -rf src/app/api/

# Old pages/api/ routes still work
# Fix issues with new route handlers
# Then re-attempt Phase 3
```

---

## Rollback Checklist

Use this after any rollback to verify the Pages Router is fully restored:

- [ ] `npm run dev` starts without errors
- [ ] Home page (`/`) loads and renders
- [ ] Auth pages (`/auth/signin`, `/auth/signup`) accessible
- [ ] Public routes (spots, user profiles) load data correctly
- [ ] Protected routes redirect unauthenticated users
- [ ] Can sign in and access protected routes
- [ ] API routes respond: `curl http://localhost:3000/api/sendConfirmationEmail`
- [ ] No console errors or warnings
- [ ] `npm run build` completes successfully

---

## Prevent Rollback Scenarios

### Best Practices to Avoid Needing Rollback

1. **Test Each Phase Locally:**
   - Don't assume a phase works—test it manually
   - Check browser console after each route load
   - Test auth flows explicitly

2. **Commit Often:**

   ```bash
   git add .
   git commit -m "feat: Phase 0 setup - root layout + error boundary"
   git commit -m "feat: Phase 1 - public routes migrated"
   # etc.
   ```

3. **Build After Each Phase:**

   ```bash
   npm run build
   ```

   This catches TypeScript errors early.

4. **Don't Skip Testing:**
   - Follow the testing checklist in `APP_ROUTER_MIGRATION.md`
   - Don't proceed to next phase if current phase has warnings

5. **Document Issues as You Go:**
   - If you hit an error, note it with reproduction steps
   - Use these notes for the troubleshooting guide

---

## Emergency Contacts

If rollback doesn't resolve issues:

1. Check `docs/APP_ROUTER_TROUBLESHOOTING.md` for known issues
2. Review the error message carefully—most are layout-related auth checks
3. Ensure you're using `'use client'` in auth layout (Server Components can't use hooks)
4. Verify `useAuth()` returns the expected shape: `{ auth: { token: string | null }, isLoading: boolean }`

---

## Git Strategy

### Before Starting Migration

```bash
# Create feature branch
git checkout -b feat/app-router-migration

# Tag the starting point (useful for reference)
git tag migration-start
```

### After Each Phase

```bash
# Commit phase completion
git add .
git commit -m "feat: Phase X - <description>"

# Tag each phase (for quick reference)
git tag phase-X-complete
```

### If You Need to Rollback to a Specific Phase

```bash
# List all tags
git tag

# Reset to a specific phase
git checkout phase-1-complete

# Or revert to main
git checkout main
```

---

## Time to Rollback

- **Phase 0 failure:** <5 minutes (just delete `src/app/`)
- **Phase 1-3 failure:** <10 minutes (delete partial `src/app/` or revert commit)
- **Phase 4 failure:** <15 minutes (git revert cleanup commit)
- **Complete rollback:** <5 minutes (git reset or checkout)

**Total impact if rollback needed:** 15-30 minutes max. Pages Router continues serving users while you fix App Router issues offline.
