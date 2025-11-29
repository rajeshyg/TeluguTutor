# Progress Tracking Bugs - Fixed (Nov 29, 2025)

## Summary

Three bugs in progress tracking were identified and fixed:
1. Per-module progress showing same values for all modules
2. Letters Mastered count mismatch between Home and Progress pages
3. JSX syntax error in DecomposeRebuild.jsx

---

## Bug #1: Per-Module Progress Not Filtering by Module ✅ FIXED

### Issue
Home page displayed same progress (3/70) for ALL modules instead of different values per module.

### Root Cause
The `getModuleProgress()` function in `Home.jsx` was counting ALL graphemes with `confidence_score > 0`, without joining with grapheme data to filter by specific module.

### Solution
Updated `src/pages/Home.jsx`:
- Added import: `import { TELUGU_GRAPHEMES } from '@/data/teluguGraphemes'`
- Added import: `useMemo` to React imports
- Created `graphemeModuleMap`: Map of grapheme_id → module for efficient lookup
- Created `moduleGraphemeCounts`: Object counting total graphemes per module
- Rewrote `getModuleProgress()` to:
  - Filter mastery data by joining with grapheme module data
  - Use actual grapheme count per module instead of hardcoded value
  - Only count graphemes belonging to the specific moduleId

### Result
✅ Each module now displays DIFFERENT progress values based on graphemes in that module

---

## Bug #2: Letters Mastered Count Mismatch ✅ FIXED

### Issue
- **Home page**: "Letters Mastered: 6"
- **Progress page**: "Mastered: 0"
- These should be consistent!

### Root Cause
Two different filtering logics:
- **Home.jsx**: Counted `mastery_level === 'mastered' OR confidence_score >= 80`
- **Progress.jsx**: Counted only `mastery_level === 'mastered'`

The 6 items were graphemes with confidence ≥ 80 but mastery_level = 'proficient' (70-89 confidence range).

### Solution
Updated `src/pages/Home.jsx`:
- Changed Letters Mastered filter from:
  ```javascript
  masteryData.filter(m => m.mastery_level === 'mastered' || m.confidence_score >= 80).length
  ```
- To:
  ```javascript
  masteryData.filter(m => m.mastery_level === 'mastered').length
  ```
- Now matches Progress.jsx logic exactly

### Result
✅ Home and Progress pages show consistent "Letters Mastered" count

### Technical Note
Mastery levels are calculated in Learn.jsx when updating GraphemeMastery:
- **mastered**: confidence_score ≥ 90
- **proficient**: confidence_score 70-89
- **practicing**: confidence_score 40-69
- **learning**: confidence_score < 40

---

## Bug #3: JSX Syntax Error ✅ FIXED

### Issue
`DecomposeRebuild.jsx` line 87 had an extra `>` character, causing JSX parse error and blocking dev server startup.

### Solution
Fixed `src/components/puzzles/DecomposeRebuild.jsx`:
- Removed duplicate `>` character on line 87

### Result
✅ Dev server runs without parse errors

---

## Files Modified

```
src/pages/Home.jsx
  ✅ Added: import TELUGU_GRAPHEMES
  ✅ Added: useMemo to imports
  ✅ Added: graphemeModuleMap (useMemo)
  ✅ Added: moduleGraphemeCounts (useMemo)
  ✅ Updated: getModuleProgress() - now filters by module
  ✅ Updated: Letters Mastered filter - mastery_level === 'mastered' only

src/pages/Progress.jsx
  ✅ No changes needed - already using correct logic

src/components/puzzles/DecomposeRebuild.jsx
  ✅ Fixed: Removed duplicate > character

src/data/teluguGraphemes.js
  📖 Reference only - each grapheme has 'module' property
```

---

## How It Works Now

### Per-Module Progress
```javascript
// Get grapheme → module mapping
const graphemeModuleMap = useMemo(() => {
  const map = new Map();
  TELUGU_GRAPHEMES.forEach(g => map.set(g.id, g.module));
  return map;
}, []);

// Count graphemes per module
const moduleGraphemeCounts = useMemo(() => {
  const counts = {};
  TELUGU_GRAPHEMES.forEach(g => {
    counts[g.module] = (counts[g.module] || 0) + 1;
  });
  return counts;
}, []);

// Filter mastery by module
const getModuleProgress = (moduleId) => {
  const moduleMastery = masteryData.filter(m => {
    const graphemeModule = graphemeModuleMap.get(m.grapheme_id);
    return graphemeModule === moduleId && m.confidence_score > 0;
  });
  
  return {
    completed: moduleMastery.filter(m => m.confidence_score >= 80).length,
    total: moduleGraphemeCounts[moduleId] || 10,
    avgConfidence: ...
  };
};
```

### Letters Mastered Consistency
Both Home and Progress count:
```javascript
masteryData.filter(m => m.mastery_level === 'mastered').length
```

---

## Testing

### Manual Testing Completed
- ✅ Home page loads without errors
- ✅ Each module shows different progress numbers
- ✅ Module progress reflects only graphemes in that module
- ✅ Progress page displays correct breakdowns
- ✅ Letters Mastered consistent between pages
- ✅ No console errors during navigation

### Current State
```
Home Page:
  - Achchulu: Different progress from other modules
  - Hallulu: Different progress from other modules
  - (etc.)
  
Progress Page:
  - All (72): Total tracked graphemes
  - Mastered (0): Only mastery_level === 'mastered'
  - Proficient (7): Only mastery_level === 'proficient'
  - Practicing (3): Only mastery_level === 'practicing'
  - Learning (62): Only mastery_level === 'learning'
```

---

## Session Resumption

To continue development in a new session:

### 1. Quick Context
- Read `docs/specs/functional/progress-tracking.md` for full spec
- Review this document for what was fixed
- Understand mastery_level calculation in `src/pages/Learn.jsx` (lines 89-101)

### 2. Key Data Structure
- **Graphemes**: Have `module` property (achchulu, hallulu, gunintalu, hachchulu, vattulu, words)
- **Mastery**: Has `grapheme_id` (links to Grapheme), `confidence_score` (0-100), `mastery_level`
- **Progress**: Filters mastery by module using grapheme data join

### 3. Testing
```bash
npm run dev              # Verify no errors
npm run test             # Run E2E tests
```

### 4. Next Issues (If Continuing)
- [ ] Verify all 72 graphemes have correct module assignments
- [ ] Test updating mastery during puzzle completion
- [ ] Validate confidence_score calculations in Learn.jsx
- [ ] Run full test suite

---

## Commit Message

```
fix: progress tracking - per-module filtering and consistent mastery count

- Fix getModuleProgress() to filter graphemes by module
- Add graphemeModuleMap for efficient module lookups
- Add moduleGraphemeCounts for accurate totals per module
- Each module now shows different progress values
- Make Letters Mastered count consistent between Home and Progress
- Both pages now count only mastery_level === 'mastered'
- Fix JSX syntax error in DecomposeRebuild.jsx
```

---

**Last Updated**: 2025-11-29  
**Status**: ✅ All bugs fixed and tested
