# Project Constraints Skill

## When This Skill Activates

**Auto-activation triggers**:

- Creating or modifying configuration files
- Changing port configurations
- Modifying package.json scripts
- Referencing file paths or external projects
- Before Scout phase in TAC workflow (mandatory Phase 0)

**Manual activation**: When you need to verify architectural constraints.

---

## 🔒 LOCKED Constraints (CANNOT CHANGE)

### Port Configuration

| Service               | Port     | Status    | Purpose          |
| --------------------- | -------- | --------- | ---------------- |
| **Frontend (Vite)**   | **5175** | 🔒 LOCKED | React dev server |

**Configuration Files**:

- `vite.config.js:6-9` - Frontend port with Vite dev server
- `package.json:7` - Dev script launches Vite

**NEVER**:

- ❌ Reassign this port to different services
- ❌ Change port number without explicit user instruction
- ❌ Use different ports in configuration files

### Project Architecture

**This is a STANDALONE React + Vite educational app**. All code lives in:

```
C:\React-Projects\TeluguTutor\
```

**Project Scope**:
- Frontend: React 18, TypeScript, Tailwind CSS, shadcn/ui
- Purpose: Interactive Telugu language learning through grapheme practice
- State: React Query for caching, React Context for theme
- Styling: Tailwind CSS with semantic token system
- No backend server (frontend-only SPA)

**PROHIBITED DIRECT References in code**:

- ❌ `C:\React-Projects\OutreachTracker-v2\` (external project)
- ❌ Any path outside project root
- ❌ Importing code BLINDLY WITHOUT REVIEW from other projects

**When user mentions external paths**: STOP and clarify if they mean:

1. Use as reference for understanding patterns?
2. Mistaken reference (should be this project)?

---

## ⛔ STOP AND ASK Triggers

These actions require explicit user approval:

### 1. Modifying Core Package Scripts

**STOP when**:

- Removing or renaming `dev`, `build`, `preview` scripts
- Changing port numbers in scripts
- Adding new dev server processes

**Action**:

```
STOP: You are modifying critical package.json scripts.
Current: npm run dev launches Vite on port 5175

Impact: [Explain what will break]
Recommendation: [Alternative approach]

Proceed? (requires user approval)
```

### 2. Changing Frontend Framework

**STOP when**:

- Replacing React with another framework
- Removing Vite as bundler
- Removing Tailwind CSS or shadcn/ui

**Action**:

```
STOP: You are changing core framework.
Current: React 18 + Vite + Tailwind CSS + shadcn/ui

This project is designed around React ecosystem.
Did you mean to:
1. Add complementary library?
2. Replace only one component?
3. Actually change framework?
```

---

## File Registry (Technical Infrastructure)

**Before creating ANY file, check this registry first.**

### Frontend Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (button, card, tabs, etc)
│   ├── learning/        # Learning workflow components
│   │   ├── AdaptivePracticeAlert.jsx
│   │   └── ConfidenceIndicator.jsx
│   ├── puzzles/         # Interactive puzzle components
│   │   ├── DecomposeRebuild.jsx
│   │   ├── GraphemeMatch.jsx
│   │   └── TransliterationChallenge.jsx
│   ├── Layout.jsx       # Main layout wrapper
│   └── ThemeToggle.jsx  # Theme switcher
├── pages/               # Page components
│   ├── Home.jsx
│   ├── Learn.jsx
│   ├── MicroPractice.jsx
│   └── Progress.jsx
├── hooks/               # Custom React hooks
├── services/
│   └── APIService.ts    # API client (if needed for future)
├── data/
│   └── teluguGraphemes.js # Grapheme database
├── entities/            # Domain models
│   ├── GraphemeMastery.js
│   ├── PracticeSession.js
│   ├── TeluguGrapheme.js
│   └── UserProfile.js
├── utils/               # Utilities
│   ├── cn.js            # classNames helper
│   └── index.js
├── api/
│   └── base44Client.js  # Base44 API client
├── index.css            # Global styles
└── main.jsx             # Entry point
```

### Configuration Files

```
vite.config.js           # 🔒 Frontend port configuration
package.json             # 🔒 Dev scripts
tailwind.config.js       # Theme configuration
postcss.config.js        # CSS processing
index.html               # HTML entry point
```

### Testing & Documentation

```
tests/                   # E2E tests with Playwright
playwright.config.cjs    # Playwright configuration
playwright-report/       # Test results
docs/                    # Documentation
.claude/                 # AI framework (skills, commands, context)
```

---

## Decision Triggers

**Use these triggers to determine if constraints apply**:

| Question                                      | If YES → Action                          |
| --------------------------------------------- | ---------------------------------------- |
| Am I changing a port number?                  | Check LOCKED Constraints → STOP trigger  |
| Am I modifying package.json scripts?          | Check STOP triggers → Ask user           |
| Am I replacing React or Vite?                 | Check Framework constraints → STOP       |
| Am I creating a component or service?         | Check File Registry → Prevent duplicates |
| Am I referencing a path outside this project? | Check Project Boundaries → STOP trigger  |

---

## Phase 0 Integration (TAC Workflow)

**BEFORE Scout phase, ALWAYS run Phase 0**:

```markdown
## Phase 0: Constraint Check

1. Read this skill file (.claude/skills/project-constraints/SKILL.md)
2. Read duplication-prevention skill
3. Identify files that will be affected by the task
4. Check File Registry for existing implementations
5. Verify no LOCKED constraints are violated
6. Check if any STOP triggers apply
7. If STOP trigger fires → ask user before proceeding

Continue to Scout phase only after Phase 0 completes.
```

---

## Examples

### ✅ Good: Check Before Creating

**User**: "Add a new Telugu grapheme learning feature"

**Agent**:

```
Phase 0: Checking constraints...
- Task affects: src/components/learning/, src/data/
- File Registry: TeluguGrapheme.js exists, check for extension
- STOP triggers: None
- LOCKED constraints: None violated

Proceeding to Scout phase...
```

### ❌ Bad: Create Without Checking

**User**: "Add a new component"

**Agent** (WRONG):

```
Creating src/components/NewLearning.jsx...
```

**Agent** (CORRECT):

```
Phase 0: Checking for duplicates...

Search: src/components/**/*.jsx
Found existing learning components:
- AdaptivePracticeAlert.jsx
- ConfidenceIndicator.jsx
- Learning workflow components

Question: Should I extend existing component or create new?
```

---

## Related Skills

- `.claude/skills/duplication-prevention/SKILL.md` - Search before creating
- `.claude/skills/security-rules/SKILL.md` - Security constraints
- `.claude/skills/coding-standards/SKILL.md` - Code quality rules

## Related Commands

- `/prime-ui` - Frontend component patterns
- `/prime-learning-domain` - Telugu learning domain knowledge
