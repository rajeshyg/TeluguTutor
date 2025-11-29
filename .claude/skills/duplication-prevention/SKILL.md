# Duplication Prevention Skill

## When This Skill Activates

**Auto-activation triggers**:

- Creating ANY new file (component, hook, page, utility, etc.)
- Implementing functionality that "might already exist"
- User requests feature without specifying file location
- Before Scout phase in TAC workflow (Phase 0 requirement)

**Manual activation**: When you're unsure if code/file already exists.

---

## Core Rule

**NEVER create a new file without searching for existing implementations first.**

Every file creation requires this 3-step workflow:

1. **Search**: Check if functionality already exists
2. **Analyze**: If found, can we extend it instead of duplicating?
3. **Create or Extend**: Either modify existing or create new (with different name)

---

## Search-Before-Create Workflow

### Step 1: Identify What You're Creating

Map your task to a file type:

| Task Description         | File Type     | Search Pattern                   |
| ------------------------ | ------------- | -------------------------------- |
| "Add component for X"    | Component     | `src/components/**/*.jsx`        |
| "Create hook for X"      | Hook          | `src/hooks/use*.js`              |
| "Add page for X"         | Page          | `src/pages/*.jsx`                |
| "Add utility for X"      | Utility       | `src/utils/*.js`                 |
| "Add grapheme data"      | Data          | `src/data/*.js`                  |
| "Add styling for X"      | Styles        | `src/index.css`                  |

### Step 2: Search Using Glob/Grep

**Before creating**, run these checks:

```bash
# Example: Creating a GraphemeDetail component
Glob: src/components/**/*.jsx
Grep: "export.*Grapheme" in src/components/

# Example: Creating a progress hook
Glob: src/hooks/use*.js
Grep: "Progress" in src/hooks/

# Example: Creating a formatting utility
Glob: src/utils/*.js
Grep: "export.*format" in src/utils/
```

### Step 3: Decision Matrix

| Search Result                                                                     | Action |
| ------------------------------------------------------------------------------------- | ---------------------------------------- |
| ✓ Exact match found (e.g., `GraphemeCard.jsx` exists)                             | **EXTEND EXISTING** - Add features to existing file |
| ✓ Similar match found (e.g., `PracticeCard.jsx` exists, creating `GraphemeCard.jsx`) | **CREATE NEW** - Pattern exists, follow same structure |
| ✓ Multiple similar components exist (e.g., 5+ puzzle components)                  | **CREATE NEW** - Follow established naming pattern |
| ❌ No match found                                                                   | **CREATE NEW** - Establish new pattern |
| ⚠️ Case variation found (e.g., `grapheme.js` vs `Grapheme.js`)                   | **STOP AND ASK** - Clarify naming convention |

---

## File Registry (Search Targets)

**These locations MUST be searched before creating files in these categories.**

### Frontend Files

| Category       | Search Location   | Naming Pattern                   |
| -------------- | ----------------- | -------------------------------- |
| **Components** | `src/components/` | `[Name].jsx` (PascalCase)        |
| **Pages**      | `src/pages/`      | `[Name]Page.jsx` OR `[Name].jsx` |
| **Hooks**      | `src/hooks/`      | `use[Name].js` (camelCase start) |
| **Utilities**  | `src/utils/`      | `[name].js` (lowercase)          |
| **Data**       | `src/data/`       | `[name]s.js` (lowercase, plural) |
| **Entities**   | `src/entities/`   | `[Name].js` (PascalCase classes) |
| **Services**   | `src/services/`   | `[Name]Service.js`               |

### Configuration & Testing

| Category    | Search Location        | Naming Pattern |
| ----------- | ---------------------- | -------------- |
| **Tests**   | `tests/` or `__tests__` | `*.spec.js`    |
| **Config**  | Root directory         | `*.config.js`  |
| **API**     | `src/api/`             | `*.js`         |

---

## Common Duplication Scenarios

### Scenario 1: "Create a new puzzle component"

**WRONG Approach**:

```javascript
// Directly creates src/components/puzzles/NewPuzzle.jsx
export function NewPuzzle() {
  // new component
}
```

**CORRECT Approach**:

```bash
1. Glob: src/components/puzzles/*.jsx
   Found:
   - DecomposeRebuild.jsx
   - GraphemeMatch.jsx
   - TransliterationChallenge.jsx

2. Check if my puzzle is new: YES (different concept)

3. Read one existing puzzle to understand pattern:
   - DecomposeRebuild.jsx uses hooks, Tailwind classes
   - Takes grapheme prop, calls onComplete callback
   - Follows consistent structure

4. Create new component following existing pattern
   File: src/components/puzzles/MyPuzzle.jsx
```

### Scenario 2: "Add a visualization hook"

**WRONG Approach**:

```javascript
// Creates src/hooks/useVisualization.js
export function useVisualization() {
  // new hook
}
```

**CORRECT Approach**:

```bash
1. Glob: src/hooks/use*.js
   (Check if visualization logic exists elsewhere)

2. Grep: "visualization" in src/
   Found: Some visualization in components/ConfidenceIndicator.jsx

3. Decision: New hook that visualization components use
   File: src/hooks/useVisualization.js
   (Pattern: extract reusable logic)
```

### Scenario 3: "Add grapheme data"

**WRONG Approach**:

```javascript
// Creates src/data/newGraphemes.js
export const newGraphemes = [ /* ... */ ];
```

**CORRECT Approach**:

```bash
1. Glob: src/data/*.js
   Found: src/data/teluguGraphemes.js

2. Decision: Extend existing file instead of creating new
   File: Modify src/data/teluguGraphemes.js
   (All grapheme data should be in one place)
```

---

## Anti-Patterns to Block

### ❌ Case Variation Duplicates

**Triggers**:

- Creating `Grapheme.js` when `grapheme.js` exists
- Creating `useTheme.js` when `useTheme.js` exists
- Creating `GraphemeCard.jsx` when `graphemecard.jsx` exists

**Action**: STOP and ask which naming convention to follow.

### ❌ Naming Variation Duplicates

**Triggers**:

- Creating `use-auth-hook.js` when `useAuth.js` exists (kebab vs camelCase)
- Creating `ApiService.js` when `APIService.js` exists (casing)
- Creating `grapheme-helper.js` when `GraphemeHelper.js` exists

**Action**: Follow established naming pattern in that directory.

### ❌ Structural Duplicates

**Triggers**:

- Creating new components directory when one exists
- Creating new pages directory when one exists
- Creating multiple data files for same domain

**Action**: Use established directory structure.

### ❌ Functional Duplicates

**Triggers**:

- User asks to "create theme system" but `ThemeToggle.jsx` exists
- User asks to "add grapheme data" but `teluguGraphemes.js` exists
- User asks to "create practice hook" but `usePracticeSession` exists

**Action**:

```
STOP: This functionality may already exist.
Found: [file path]
Should I:
1. Extend existing implementation?
2. Create separate implementation (explain why)?
```

---

## Search Commands (Quick Reference)

**Use these before creating files**:

```bash
# Find all components
Glob: src/components/**/*.jsx

# Find specific type of component
Glob: src/components/learning/*.jsx

# Find if functionality exists
Grep: "export.*[FunctionName]" in src/

# Find hooks
Glob: src/hooks/use*.js

# Find utilities
Glob: src/utils/*.js

# Find data files
Glob: src/data/*.js

# Find tests
Glob: tests/*.spec.js
```

---

## Phase 0 Integration (TAC Workflow)

**This skill is MANDATORY in Phase 0**:

```markdown
## Phase 0: Constraint Check (before Scout)

1. Read project-constraints skill
2. Read duplication-prevention skill ← YOU ARE HERE
3. Identify files to be created/modified
4. Run search commands for each file
5. Check for duplicates or similar implementations
6. Decide: extend existing OR create new
7. If creating new: verify naming follows existing pattern

Continue to Scout only after Phase 0 completes.
```

---

## Examples

### ✅ Good: Search First

**User**: "Add a new practice puzzle"

**Agent**:

```
Phase 0: Checking for duplicates...

Search: src/components/puzzles/*.jsx
Found:
- DecomposeRebuild.jsx
- GraphemeMatch.jsx
- TransliterationChallenge.jsx

My puzzle is new (different puzzle type).

Decision: CREATE NEW following existing pattern
File: src/components/puzzles/[MyPuzzle].jsx
```

### ❌ Bad: Create Without Searching

**User**: "Add a new practice puzzle"

**Agent** (WRONG):

```
Creating src/components/puzzles/NewPuzzle.jsx...
```

**Why wrong**: Didn't check if similar puzzle exists or what pattern to follow.

### ✅ Good: Extend Existing

**User**: "Add more Telugu graphemes"

**Agent**:

```
Phase 0: Checking structure...

Search: src/data/*.js
Found: src/data/teluguGraphemes.js

Decision: EXTEND existing file
(All grapheme data should be centralized, not scattered)
```

### ✅ Good: Clarify Duplication

**User**: "Create useProgress hook"

**Agent**:

```
Phase 0: Checking for existing progress logic...

Search: src/hooks/use*.js
Found: src/hooks/usePracticeSession.js (handles session progress)

Search: src/pages/Progress.jsx
Found: Existing progress tracking page

Question: Should I:
1. Extend usePracticeSession.js with progress calculation?
2. Create new useProgress.js for page-level progress?
```

---

## Related Skills

- `.claude/skills/project-constraints/SKILL.md` - File registry and structure
- `.claude/skills/coding-standards/SKILL.md` - Naming conventions
- `.claude/skills/sdd-tac-workflow/SKILL.md` - Phase 0 workflow

## Related Commands

- `/prime-ui` - Existing frontend components
- `/prime-learning-domain` - Existing learning domain patterns
