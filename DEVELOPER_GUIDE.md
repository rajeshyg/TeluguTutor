# TeluguTutor Framework Refactor - Developer Guide

## ✅ COMPLETED IN THIS SESSION

### 1. Framework & Tools Integrated
- ✅ **SDD-TAC Framework**: Spec-Driven Development + Tactical Agentic Coding methodology
- ✅ **AI Skills**: 5 comprehensive skills in `.claude/skills/`
- ✅ **Validation Scripts**: Automated quality control and code consistency checks
- ✅ **Theme System**: Centralized theme management via React Context
- ✅ **Technical Specifications**: 65+ technical docs covering all aspects

### 2. Code Status
- ✅ All changes committed to `main` branch (commit: ff6b1a4)
- ✅ Code pushed to GitHub: https://github.com/rajeshyg/TeluguTutor
- ✅ New branch created: `feature/framework-refactor`
- ✅ **No existing functionality modified** - ready for work

### 3. Available Resources

#### Technical Specifications (Comprehensive)
- **Architecture**: `docs/specs/technical/architecture/` - API design, data flow, error handling
- **Coding Standards**: `docs/specs/technical/coding-standards/` - Naming, organization, TypeScript
- **Development Framework**: `docs/specs/technical/development-framework/` - SDD, TAC, agent orchestration
- **Security**: `docs/specs/technical/security/` - Auth, authorization, compliance
- **Testing**: `docs/specs/technical/testing/` - Unit, E2E, coverage targets
- **UI Standards**: `docs/specs/technical/ui-standards/` - Components, accessibility, theme

#### AI Framework Skills
- `.claude/skills/sdd-tac-workflow/SKILL.md` - Workflow methodology
- `.claude/skills/duplication-prevention/SKILL.md` - Code reuse patterns
- `.claude/skills/project-constraints/SKILL.md` - Architecture constraints
- `.claude/skills/coding-standards/SKILL.md` - Code quality guidelines
- `.claude/skills/security-rules/SKILL.md` - Security best practices

#### Validation & Quality
- `scripts/validation/validate-structure.cjs` - Project structure enforcement
- `scripts/validation/validate-theme-compliance.js` - Theme consistency
- `scripts/core/check-documentation.js` - Documentation quality
- `scripts/core/check-redundancy.js` - Code redundancy detection
- `scripts/core/detect-mock-data.js` - Production code verification

---

## 🚀 NEXT STEPS (FOR DEVELOPER)

### Step 1: Understand Current State
```bash
# You are on: feature/framework-refactor branch
git branch  # Verify you're on the new branch
git log --oneline -5  # See recent commits
```

### Step 2: Review Technical Specifications (READ FIRST)
Start with these docs to understand the vision:

1. **Architecture Overview**
   ```
   docs/specs/technical/README.md
   docs/specs/technical/architecture/system-overview.md
   docs/specs/technical/architecture/data-flow.md
   ```

2. **Development Framework**
   ```
   docs/specs/technical/development-framework/sdd-tac-methodology.md
   docs/specs/technical/development-framework/README.md
   ```

3. **Current Code Organization**
   ```
   docs/specs/technical/coding-standards/file-organization.md
   docs/specs/technical/PROJECT_STRUCTURE_MANIFEST.md
   ```

### Step 3: Create Feature Specs (BEFORE CODING)

Create feature specs in `/docs/specs/functional/` following SDD methodology:

**Example: Learning Module Spec**
```markdown
# Learning Module Feature Spec

## Description
User can view and practice Telugu graphemes with adaptive difficulty.

## Requirements

### Functional
- Display grapheme cards with pronunciation
- Track mastery level
- Provide difficulty adjustment
- Save progress

### Non-Functional
- Load time < 1 second
- Smooth animations (60fps)
- Responsive on mobile

## Data Model
[Define schema here]

## Components Needed
- GraphemeCard
- PracticeSession
- ProgressTracker

## Testing Strategy
- Unit: Individual grapheme validation
- E2E: Full learning flow
- Performance: Load time benchmarks
```

### Step 4: Refactor Code Systematically

Follow the TAC (Tactical Agentic Coding) workflow:

#### Phase 0: Constraint Check
```bash
# Before starting any feature:
# 1. Read .claude/skills/project-constraints/SKILL.md
# 2. Check for existing implementations
# 3. Verify architectural constraints
```

#### Phase 1: Scout
- Study existing patterns in codebase
- Review similar features already built
- Load domain knowledge from specs

#### Phase 2: Plan
- Design component structure
- Map data flow
- Write implementation comments

#### Phase 3: Build
- Implement following existing patterns
- Add TypeScript types
- Include unit tests
- Add E2E tests

### Step 5: Reorganize Project Structure

The new structure should follow:
```
src/
├── pages/              # Route-level pages
├── components/
│   ├── learning/       # Learning-related components
│   ├── practice/       # Practice mode components
│   ├── ui/             # UI components (buttons, cards, etc.)
│   └── layout/         # Layout components
├── services/           # API services (new)
├── schemas/            # Zod validation schemas (new)
├── hooks/              # Custom React hooks
├── contexts/           # React contexts (ThemeContext already here)
├── types/              # TypeScript type definitions (new)
├── utils/              # Utility functions
└── constants/          # App constants

docs/specs/
├── technical/          # Technical standards (provided)
└── functional/         # Feature specs (create as you work)
```

### Step 6: Use Validation Scripts

Run before committing:
```bash
# Structure validation
node scripts/validation/validate-structure.cjs

# Theme compliance
node scripts/validation/validate-theme-compliance.js

# Documentation check
node scripts/core/check-documentation.js

# Redundancy check
node scripts/core/check-redundancy.js

# Mock data detection
node scripts/core/detect-mock-data.js
```

### Step 7: Commit with Meaningful Messages

```bash
# Feature implementation
git commit -m "feat: implement learning module

- Add GraphemeCard component
- Implement adaptive difficulty
- Add ProgressTracker service
- Include unit tests

Spec: docs/specs/functional/learning-module.md
"

# Follow conventional commits:
# feat: new feature
# fix: bug fix
# refactor: code reorganization
# docs: documentation
# test: test additions
# perf: performance improvements
```

---

## 📋 REFACTORING CHECKLIST

### For Each Feature/Component:

- [ ] **Create Spec** (`docs/specs/functional/`)
  - [ ] Functional requirements listed
  - [ ] Data model defined
  - [ ] Components identified
  - [ ] Testing strategy included

- [ ] **Scout Phase**
  - [ ] Read spec thoroughly
  - [ ] Search codebase for similar patterns
  - [ ] Review technical standards

- [ ] **Plan Phase**
  - [ ] Sketch component tree
  - [ ] Design data flow
  - [ ] Write implementation comments

- [ ] **Build Phase**
  - [ ] Create TypeScript types
  - [ ] Create Zod schemas
  - [ ] Implement services
  - [ ] Build components
  - [ ] Add unit tests
  - [ ] Add E2E tests

- [ ] **Quality Checks**
  - [ ] Run all validation scripts
  - [ ] TypeScript strict mode passes
  - [ ] All tests passing
  - [ ] No console errors
  - [ ] Code follows patterns

- [ ] **Documentation**
  - [ ] Update spec with actual implementation
  - [ ] Add JSDoc comments
  - [ ] Update architecture docs if needed

- [ ] **Commit & Push**
  - [ ] Meaningful commit message
  - [ ] Reference spec in commit
  - [ ] Push to feature branch
  - [ ] Create pull request

---

## 🎯 RECOMMENDED REFACTORING ORDER

1. **Infrastructure** (foundational, no dependencies)
   - Reorganize folder structure
   - Create service layer
   - Add type definitions
   - Set up schemas (Zod)

2. **Learning Module** (core feature)
   - Implement GraphemeCard
   - Build PracticeSession
   - Add ProgressTracker
   - Create schema for Telugu graphemes

3. **Progress Tracking** (depends on learning)
   - ProgressPage refactor
   - Statistics service
   - Progress visualization

4. **Adaptive Practice** (advanced feature)
   - Difficulty algorithm
   - AdaptivePracticeAlert
   - Personalization logic

5. **Theme & UI Polish** (finishing)
   - Implement ThemeContext fully
   - Consistent component styling
   - Accessibility enhancements

---

## 📚 KEY DOCUMENTATION FILES

| File | Purpose |
|------|---------|
| `docs/specs/technical/development-framework/sdd-tac-methodology.md` | Complete SDD-TAC workflow |
| `docs/specs/technical/architecture/system-overview.md` | System architecture |
| `docs/specs/technical/coding-standards/naming-conventions.md` | Naming rules |
| `docs/specs/technical/coding-standards/typescript.md` | TypeScript guidelines |
| `.claude/skills/project-constraints/SKILL.md` | Architecture constraints |
| `.claude/skills/duplication-prevention/SKILL.md` | Pattern matching |
| `FRAMEWORK_INTEGRATION_SUMMARY.md` | Integration summary |

---

## 🤝 Git Workflow

```bash
# You're on: feature/framework-refactor

# Make changes and commit
git add src/
git commit -m "feat: implement learning module"

# Push to feature branch
git push origin feature/framework-refactor

# When ready to merge to main:
# 1. Create pull request on GitHub
# 2. Request review
# 3. Merge to main after approval
```

---

## ⚠️ IMPORTANT NOTES

1. **DO NOT** commit directly to `main` - always use feature branches
2. **DO** run validation scripts before committing
3. **DO** write specs before implementing features
4. **DO** follow the TAC workflow (Phase 0 → 1 → 2 → 3)
5. **DO** reference specs in commit messages
6. **DO NOT** create new patterns - follow existing ones in specs

---

## 🆘 TROUBLESHOOTING

### Validation Scripts Failing?
- Check `docs/specs/technical/coding-standards/` for standards
- Review `.claude/skills/project-constraints/SKILL.md` for constraints
- Run validation scripts individually to isolate issues

### Unsure About Architecture?
- Read `docs/specs/technical/architecture/README.md`
- Check `docs/specs/technical/PROJECT_STRUCTURE_MANIFEST.md`
- Review similar features already implemented

### Component Patterns?
- Check `docs/specs/technical/ui-standards/component-patterns.md`
- Look at existing components in `src/components/`
- Review `.claude/skills/duplication-prevention/SKILL.md`

---

## 📞 SUPPORT

For questions about:
- **Framework**: See `.claude/skills/sdd-tac-workflow/SKILL.md`
- **Architecture**: See `docs/specs/technical/architecture/`
- **Patterns**: See `.claude/skills/duplication-prevention/SKILL.md`
- **Standards**: See `docs/specs/technical/coding-standards/`

---

**Branch**: `feature/framework-refactor`  
**Status**: Ready for development  
**Foundation**: ✅ Complete  
**Next**: Create feature specs and begin refactoring
