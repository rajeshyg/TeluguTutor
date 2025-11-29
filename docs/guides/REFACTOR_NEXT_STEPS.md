---
title: Framework Refactor - Next Steps
created: 2025-11-29
status: ready
branch: feature/framework-refactor
---

# TeluguTutor Framework Refactor - Next Steps

## ⚠️ CRITICAL GAP: Missing Functional Specs

**Before ANY code refactoring, create these specs in `docs/specs/functional/`:**

### Required Functional Specs
- [x] `grapheme-learning.md` - Telugu character learning flow, card display, pronunciation
- [x] `adaptive-practice.md` - Difficulty adjustment algorithm, mastery thresholds
- [x] `progress-tracking.md` - User progress persistence, statistics, visualization
- [x] `micro-practice.md` - Quick practice session flow, timing, scoring
- [x] `theme-glassmorphic.md` - New UI theme requirements, color palette, components

### Spec Template (Use for Each)
```markdown
# [Feature Name] Spec

## Description
[What and why]

## Requirements
### Functional
- [List features]

### Non-Functional
- [Performance, UX requirements]

## Data Model
[Schema/types needed]

## Components
[React components involved]

## Testing Strategy
- Unit: [what to test]
- E2E: [user flows]
```

---

## ✅ COMPLETED: Theme Compliance Refactor (Nov 29, 2025)

### Results
- **Before**: 96 theme compliance violations
- **After**: 9 violations (semantic colors - intentional)
- **Reduction**: 91% decrease in violations

### Components Updated
- [x] `Layout.jsx` - bg-background, text-foreground
- [x] `ThemeToggle.jsx` - text-muted-foreground
- [x] `Home.jsx` - All cards, headers, progress bars
- [x] `Learn.jsx` - Loading states, headers, progress
- [x] `Progress.jsx` - Stats cards, tabs, mastery details
- [x] `MicroPractice.jsx` - Headers, practice cards
- [x] `GraphemeMatch.jsx` - Option buttons, results
- [x] `DecomposeRebuild.jsx` - Build zone, tiles, hints
- [x] `TransliterationChallenge.jsx` - Options, results
- [x] `ConfidenceIndicator.jsx` - Container, progress
- [x] `AdaptivePracticeAlert.jsx` - Button styling

### Remaining Violations (Intentional Semantic Colors)
The 9 remaining violations are semantic feedback colors that should remain hardcoded:
- Green (`text-green-500/600`) - Success states (correct answers, checkmarks)
- Red (`text-red-500`) - Error states (wrong answers)
- Yellow (`text-yellow-400/500`) - Accent highlights (stars, sun icon, sparkles)

These communicate universal meaning and are exempt per **F-TG-013** (interactive element state feedback).

### Theme Variables Used
- `bg-background` / `text-foreground` - Main surfaces
- `bg-card` / `text-card-foreground` - Card components
- `bg-secondary` / `text-secondary-foreground` - Secondary surfaces
- `bg-muted` / `text-muted-foreground` - Muted elements
- `bg-primary` / `text-primary-foreground` - Primary actions
- `bg-accent` / `text-accent-foreground` - Accent elements
- `border-border` - Border colors

---

## 🔍 VALIDATION RESULTS (Run Today)

### Structure Validation
- **39 Warnings**: All .js/.jsx files in `src/` (should be .ts/.tsx for TypeScript project)
- **25 Errors**: Forbidden JavaScript extensions, unexpected test directories

### Theme Compliance Validation  
- **96 Violations**: Hardcoded Tailwind color classes throughout components
- **Affected**: All components using direct colors like `bg-white`, `text-purple-900`, etc.

### Redundancy Check
- **1 Issue**: Duplicate React imports in `ThemeContext.tsx`

---

## ✅ COMPLETED: Bug Fixes - Progress Tracking (Nov 29, 2025)

**All critical progress tracking bugs have been fixed!**

### Bugs Fixed
| Bug | Fix Applied | File |
|-----|-------------|------|
| **BUG-001** | Added `graphemeModuleMap` (Map) for per-module filtering | `Home.jsx` |
| **BUG-002** | Changed filter to `mastery_level === 'mastered'` (matches Progress.jsx) | `Home.jsx` |
| **BUG-003** | Added `moduleGraphemeCounts` for accurate totals per module | `Home.jsx` |
| **BUG-005** | Fixed JSX syntax error (duplicate `>`) | `DecomposeRebuild.jsx` |

### Implementation Details
```javascript
// Home.jsx - Fixed logic with proper module filtering
const graphemeModuleMap = useMemo(() => {
  const map = new Map();
  TELUGU_GRAPHEMES.forEach(g => map.set(g.id, g.module));
  return map;
}, []);

const getModuleProgress = (moduleId) => {
  const moduleMastery = masteryData.filter(m => {
    const graphemeModule = graphemeModuleMap.get(m.grapheme_id);
    return graphemeModule === moduleId && m.confidence_score > 0;
  });
  // Now correctly filters by module!
};
```

---

## 🎯 NEXT: Phase 3 - User Authentication

**Priority**: Add user authentication so progress can be saved per user.

### ⚠️ SIMPLICITY PRINCIPLE
> **DO NOT over-engineer. Keep it simple and maintainable.**
> - Start with simple localStorage-based user identification
> - Upgrade to Supabase Auth when ready for production

---

## 🐛 KNOWN BUGS (Manual Testing - Nov 29, 2025)

### Critical Bugs
| Bug | Description | Status | File(s) |
|-----|-------------|--------|---------||
| **BUG-001** | Progress shows same for ALL categories (3/70) | ✅ FIXED | `Home.jsx` |
| **BUG-002** | Letters Mastered shows 0 | ✅ FIXED | `Home.jsx` |
| **BUG-003** | Progress changes inconsistently (0/10 → 2/35 → 3/70) | ✅ FIXED | `Home.jsx` |
| **BUG-004** | No user login - progress not saved | 🔄 IN PROGRESS | New feature needed |
| **BUG-005** | JSX syntax error in DecomposeRebuild | ✅ FIXED | `DecomposeRebuild.jsx` |

### Bug Details (from testing)
```
Telugu Learning
Welcome back, Test User!

Stars Earned: 216
Letters Mastered: 0      ← WRONG: Should show mastered count
Minutes Practiced: 7

All modules show:
- Progress: 3/70         ← WRONG: Same for all, should be per-module
```

### Root Cause Analysis
```javascript
// Home.jsx - Current broken logic
const getModuleProgress = (moduleId) => {
  const moduleMastery = masteryData.filter(m => {
    // This would require joining with grapheme data - simplified for now
    return m.confidence_score > 0;  // ← BUG: Not filtering by module!
  });
  
  return {
    completed: moduleMastery.filter(m => m.confidence_score >= 80).length,
    total: Math.max(moduleMastery.length, 10),  // ← BUG: Wrong total calculation
    // ...
  };
};
```

---

## 📋 QUALITY CONTROL CHECKLIST

### Before EVERY Iteration
```bash
# 1. Run automated validations
node scripts/validation/validate-structure.cjs
node scripts/validation/validate-theme-compliance.js
node scripts/core/check-redundancy.js

# 2. Start dev server
npm run dev

# 3. Manual testing checklist:
# - [ ] Home page loads without errors
# - [ ] Progress shows DIFFERENT values per module
# - [ ] Letters Mastered shows correct count
# - [ ] Complete a puzzle → progress updates correctly
# - [ ] Dark/Light mode toggle works
# - [ ] No console errors
```

### After EVERY Iteration
```bash
# 1. Re-run all validations
node scripts/validation/validate-structure.cjs
node scripts/validation/validate-theme-compliance.js
node scripts/core/check-redundancy.js

# 2. Run E2E tests
npm run test

# 3. Manual smoke test
# - [ ] All pages load
# - [ ] Puzzles work (GraphemeMatch, DecomposeRebuild, Transliteration)
# - [ ] Progress tracking accurate
```

---

## 📊 RESEARCH TASKS (Create Sub-Specs)

### R-001: Telugu Language Accuracy Research
**Location**: `docs/specs/research/telugu-accuracy.md`
```markdown
# Telugu Language Accuracy Research

## Objective
Verify accuracy of Telugu grapheme metadata in `src/data/teluguGraphemes.js`

## Research Areas
- [ ] Transliteration accuracy (ISO 15919 standard)
- [ ] Pronunciation guides correctness
- [ ] Component breakdown accuracy for compound characters
- [ ] Confusable character pairs validation
- [ ] Module categorization (Achchulu, Hallulu, etc.)

## Sources to Verify
- Telugu Wikipedia
- University linguistics resources
- Native speaker validation

## Deliverable
Updated `teluguGraphemes.js` with verified data
```

### R-002: Market Research - Feature Quality
**Location**: `docs/specs/research/market-quality.md`
```markdown
# Market Research - Quality Standards

## Objective
Benchmark against existing Telugu learning apps

## Competitors to Analyze
- [ ] Duolingo (if Telugu available)
- [ ] Google Learn Telugu
- [ ] Other Telugu learning apps

## Quality Metrics
- Learning progression design
- Gamification effectiveness
- UI/UX patterns
- Accessibility standards

## Deliverable
Quality improvement recommendations
```

### R-003: Market Research - Feature Ideas
**Location**: `docs/specs/research/market-features.md`
```markdown
# Market Research - Feature Ideas

## Objective
Identify valuable features from competitors

## Feature Categories
- [ ] Audio pronunciation
- [ ] Handwriting recognition
- [ ] Spaced repetition algorithms
- [ ] Social/competitive features
- [ ] Offline support

## Deliverable
Prioritized feature backlog with specs
```

---

## 🔐 NEW FEATURE: User Authentication

**Location**: `docs/specs/functional/user-authentication.md`

### Requirements (High Level)
- User registration (email/password or social login)
- Login/logout functionality
- Progress saved per user
- Guest mode (optional - local storage only)

### Implementation Options
1. **Simple**: localStorage with user ID (no real auth)
2. **Medium**: Supabase Auth (free tier)
3. **Full**: Custom backend with JWT

### Recommended: Option 2 (Supabase)
- Free tier sufficient
- Built-in user management
- Easy React integration
- Can store progress in Supabase DB

---

## Order of Operations (Updated)

1. **✅ Create functional specs** (COMPLETED)
2. **✅ Theme compliance** (COMPLETED - 91% reduction)
3. **✅ Fix critical bugs** (COMPLETED - Nov 29, 2025)
   - ✅ Progress per-module calculation
   - ✅ Letters mastered count
   - ✅ Consistent totals
   - ✅ JSX syntax error fix
4. **🔐 User authentication** (PRIORITY 1 - NEXT)
5. **📊 Research tasks** (Can run in parallel)
   - Telugu accuracy verification
   - Market quality research
   - Feature ideas research
6. **🧹 Code cleanup** (After auth implemented)
7. **📝 TypeScript conversion** (Optional - only if needed)
8. **✅ Final validation**

---

## ⚠️ ANTI-PATTERNS TO AVOID

| Don't Do This | Do This Instead |
|---------------|-----------------|
| Convert to TypeScript before fixing bugs | Fix bugs first, type later |
| Add complex architecture | Keep simple, add complexity only when needed |
| Over-abstract early | Start concrete, abstract when patterns emerge |
| Skip manual testing | Always test manually after changes |
| Ignore validation scripts | Run before AND after every change |
| Big refactors | Small, incremental changes |

---

## Validation Checklist

Before each commit:
```bash
node scripts/validation/validate-structure.cjs
node scripts/validation/validate-theme-compliance.js
node scripts/core/check-redundancy.js
```

After changes - Manual Testing:
```
- [ ] Home page: Check each module shows DIFFERENT progress
- [ ] Home page: Letters Mastered shows actual count
- [ ] Learn page: Complete puzzle → return to Home → verify progress updated
- [ ] Progress page: Data matches Home page
- [ ] Theme toggle: Works in both directions
- [ ] No console errors in browser DevTools
```

---

## Quick Reference

| Task | Location |
|------|----------|
| Create feature specs | `docs/specs/functional/` |
| Create research specs | `docs/specs/research/` |
| Bug tracking | This file (KNOWN BUGS section) |
| Theme reference | `src/contexts/ThemeContext.tsx` |
| Framework skills | `.claude/skills/` |
| Technical specs | `docs/specs/technical/` |
| Validation scripts | `scripts/` |

---

## Order of Operations

1. **✅ Create functional specs** (COMPLETED)
2. **✅ Theme spec → Theme implementation** (COMPLETED - 91% reduction in violations)
3. **✅ Fix critical bugs** (COMPLETED - Nov 29, 2025)
4. **🔐 Add user authentication** (NEXT - Priority 1)
5. **📊 Research tasks** (Parallel)
6. **🧹 Code cleanup**
7. **📝 TypeScript conversion** (Only if needed)
8. **✅ Final validation**
