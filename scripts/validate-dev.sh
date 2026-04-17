#!/bin/bash

# App Router Migration: Quick Validation Script
# Purpose: Verify Phase changes without full build
# Run this: pnpm validate:dev

echo "🔍 Validating App Router Changes..."
echo ""

# 1. TypeScript Check
echo "1️⃣  Type Checking..."
pnpm exec tsc --noEmit 2>&1 | grep -E "error|warning" | head -20 || echo "   ✅ No TypeScript errors"
echo ""

# 2. ESLint Check
echo "2️⃣  Linting..."
pnpm exec eslint src/app src/components src/contexts --max-warnings 5 2>&1 | grep -E "error|✖" || echo "   ✅ No ESLint errors"
echo ""

# 3. Import Resolution Check
echo "3️⃣  Import Resolution..."
pnpm exec eslint src/app --rule "import/no-unresolved: error" 2>&1 | grep -E "error" || echo "   ✅ All imports valid"
echo ""

# 4. Summary
echo "✨ Quick validation complete!"
echo "💡 Tip: Next, run 'pnpm dev' to test in browser"
