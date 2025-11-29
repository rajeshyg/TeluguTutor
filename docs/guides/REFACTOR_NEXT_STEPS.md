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
- [ ] `grapheme-learning.md` - Telugu character learning flow, card display, pronunciation
- [ ] `adaptive-practice.md` - Difficulty adjustment algorithm, mastery thresholds
- [ ] `progress-tracking.md` - User progress persistence, statistics, visualization
- [ ] `micro-practice.md` - Quick practice session flow, timing, scoring
- [ ] `theme-glassmorphic.md` - New UI theme requirements, color palette, components

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

## Phase 1: Theme Refactor (Main Objective)

### Source
- Theme from: OutreachTracker-v2 (glassmorphic design)
- Reference: `src/contexts/ThemeContext.tsx` (already copied)

### Tasks
- [ ] Review OutreachTracker-v2 theme implementation
- [ ] Document target color palette and design tokens
- [ ] Integrate ThemeProvider in `main.jsx`
- [ ] Update Tailwind config with theme variables
- [ ] Refactor components to use theme tokens (not hardcoded colors)
- [ ] Test dark/light mode toggle
- [ ] Ensure responsive design maintained

### Components to Update
- [ ] Layout.jsx
- [ ] ThemeToggle.jsx
- [ ] All pages (Home, Learn, Progress, MicroPractice)
- [ ] UI components (button, card, tabs)
- [ ] Learning components (puzzles, indicators)

---

## Phase 2: Code Refactor

### Structure Changes
- [ ] Reorganize to match framework structure
- [ ] Add TypeScript types (`src/types/`)
- [ ] Add service layer (`src/services/`)
- [ ] Add Zod schemas (`src/schemas/`)

### Follow TAC Workflow
```
Phase 0: Check constraints (.claude/skills/project-constraints/)
Phase 1: Scout (read specs, find patterns)
Phase 2: Plan (design before coding)
Phase 3: Build (implement following patterns)
```

---

## Phase 3: Cleanup (Post-Refactor)

### Stale File Audit
- [ ] Run `node scripts/core/check-redundancy.js`
- [ ] Identify unused components
- [ ] Identify dead imports
- [ ] List files for deletion

### Before Deleting
- [ ] All tests passing
- [ ] Manual QA complete
- [ ] Document removed files in commit message

### Known Redundant Files (Root Level)
- `DEVELOPER_GUIDE.md` → consolidate to `docs/guides/`
- `NEXT_STEPS_DEVELOPER.txt` → remove (replaced by this file)
- `SESSION_COMPLETION_SUMMARY.md` → remove after review
- `FRAMEWORK_INTEGRATION_SUMMARY.md` → move to `docs/guides/`

---

## Validation Checklist

Before each commit:
```bash
node scripts/validation/validate-structure.cjs
node scripts/validation/validate-theme-compliance.js
node scripts/core/check-redundancy.js
```

---

## Quick Reference

| Task | Location |
|------|----------|
| Create feature specs | `docs/specs/functional/` |
| Theme reference | `src/contexts/ThemeContext.tsx` |
| Framework skills | `.claude/skills/` |
| Technical specs | `docs/specs/technical/` |
| Validation scripts | `scripts/` |

---

## Order of Operations

1. **Create functional specs** (REQUIRED FIRST)
2. **Theme spec** → Theme implementation
3. **Component refactor** → Use new theme
4. **Test all features**
5. **Audit stale files**
6. **Delete unused code**
7. **Final validation**
