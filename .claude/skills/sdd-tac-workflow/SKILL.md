# SDD-TAC Workflow Skill

## Overview

**SDD (Spec-Driven Development)** and **TAC (Tactical Agentic Coding)** are complementary methodologies for building high-quality software with AI assistance.

- **SDD**: Features are driven by documented requirements
- **TAC**: Development follows a Scout-Plan-Build cycle with a mandatory Constraint Check phase

---

## SDD (Spec-Driven Development)

### Core Principle

**All code changes start with a spec.** Specs live in `/docs/specs/` and define requirements before implementation.

### Why Specs Matter

1. **Clarity**: Everyone understands what's being built
2. **Quality**: Requirements are captured before coding
3. **Testing**: Acceptance criteria guide test writing
4. **Maintainability**: Future developers understand WHY the code exists

### Spec Structure

Each spec document includes:

1. **Feature Name & Description**
   - What are we building?
   - Why is it needed?

2. **Requirements**
   - Functional: What must it do?
   - Non-functional: Performance, UX, accessibility
   - Edge cases: What happens when things go wrong?

3. **User Workflows**
   - How will users interact with this?
   - What steps do they take?

4. **Component Structure**
   - What components are needed?
   - How do they interact?

5. **Data Model**
   - What data structures are used?
   - How is data validated?

6. **Testing Strategy**
   - Unit tests needed?
   - E2E test scenarios?
   - Edge cases to cover?

### Example Spec Format

````markdown
# Feature: Grapheme Difficulty Adjustment

## Description

Allow learners to adjust grapheme difficulty (basic, intermediate, advanced) to personalize their learning experience.

## Requirements

### Functional

- Users can select difficulty level (basic, intermediate, advanced)
- Different grapheme sets shown based on difficulty
- Progress tracking maintains difficulty preference
- Admin can view difficulty statistics

### Non-Functional

- Difficulty selection loads instantly
- No performance impact when switching levels
- UI is accessible (keyboard navigation, screen reader)

## User Workflows

### Happy Path
1. User opens Learn page
2. Sees difficulty selector in header
3. Selects "intermediate"
4. Grapheme list updates with intermediate-level graphemes
5. Preference saved to localStorage

### Error Case
1. User selects difficulty
2. Network error occurs
3. User sees retry button
4. Can retry or continue with cached data

## Component Structure

- DifficultySelector: Dropdown/tabs for difficulty selection
- GraphemeCard: Displays based on difficulty
- useDifficulty: Hook for difficulty state management

## Data Model

```javascript
const DIFFICULTY_LEVELS = {
  basic: [/* 10 core graphemes */],
  intermediate: [/* 20 common graphemes */],
  advanced: [/* 30+ rare graphemes */],
};
```

## Testing Strategy

- [ ] Difficulty selector renders all options
- [ ] Selecting difficulty updates displayed graphemes
- [ ] Preference persists across page reload
- [ ] E2E: User can change difficulty and see new graphemes
- [ ] Edge case: Invalid difficulty value handled gracefully

## Acceptance Criteria

- [ ] All tests pass
- [ ] UI accessible (WCAG 2.1 AA)
- [ ] Performance < 100ms for difficulty change
- [ ] Difficulty preference persists

````

---

## TAC (Tactical Agentic Coding)

### Four Phases: Constraint-Scout-Plan-Build

The TAC workflow guides development from idea to tested code.

#### Phase 0: Constraint Check (MANDATORY)

**Goal**: Verify architectural constraints and prevent common disasters

**This phase runs BEFORE Scout and is REQUIRED.**

**Actions**:

1. **Load constraint skills**:
   - Read `.claude/skills/project-constraints/SKILL.md`
   - Read `.claude/skills/duplication-prevention/SKILL.md`

2. **Identify affected files**:
   - What files will this task create or modify?
   - What domain does this belong to?

3. **Check for duplicates**:
   - Run Glob/Grep to search for existing implementations
   - Check File Registry in project-constraints skill
   - Verify no duplicate files will be created

4. **Verify constraints**:
   - Check LOCKED constraints (ports, config files, structure)
   - Identify if any STOP triggers apply
   - Verify no prohibited actions

5. **Decision point**:
   - If STOP trigger fires → ask user before proceeding
   - If duplicate found → extend existing instead
   - If constraints violated → refuse and explain why
   - If all clear → proceed to Scout phase

**Output**: Verified task complies with all constraints

**Example**:

```
Phase 0: Checking constraints...

Task: "Add adaptive difficulty selection"
Files affected: src/components/learning/, src/hooks/

Duplicate check:
- Glob: src/components/learning/*.jsx
  Found: AdaptivePracticeAlert.jsx (existing learning component)
- No DifficultySelector component exists

Constraint check:
- No LOCKED constraints violated
- No STOP triggers
- No external references
- Following established patterns

✓ All clear, proceeding to Scout phase...
```

#### Phase 1: Scout

**Goal**: Gather all context before writing code

**Actions**:

1. **Read the spec document** (`/docs/specs/feature-name.md`)
   - Understand requirements completely
   - Note acceptance criteria

2. **Load domain knowledge**
   - Understanding existing components and patterns
   - Review similar features in codebase
   - Understand data models and state management

3. **Find all affected files**:
   - Which existing files need changes?
   - What dependencies exist?
   - What patterns should we follow?

4. **Review code patterns**:
   - Find existing implementation examples
   - Copy exact pattern structure
   - Understand error handling approach
   - Note naming conventions

5. **Identify edge cases**:
   - What can go wrong?
   - How should we handle errors?
   - What validation is needed?

**Output**: Complete context gathered in working memory

**Example Scout Note**:

```
Scout Complete:
✓ Spec: Adding adaptive difficulty is in /docs/specs/learning-features.md
✓ Domain: Learning workflow - similar to existing practice features
✓ Patterns: Components use Tailwind + shadcn/ui
✓ State: React hooks + localStorage for preferences
✓ Similar: AdaptivePracticeAlert.jsx shows how to manage adaptive features
✓ Data: teluguGraphemes.js organizes all grapheme data
✓ Validation: Zod schemas in src/schemas/
✓ Edge cases: Handle invalid difficulty, network errors, missing data
```

#### Phase 2: Plan

**Goal**: Design solution before writing any code

**Actions**:

1. **Sketch out file structure**:
   - What new files do we need?
   - What existing files need changes?
   - In what order should we implement?

2. **Design data flow**:
   - How does data flow from UI → state → storage?
   - What components communicate?
   - Where do we validate?

3. **Write implementation plan as comment blocks**:

   ```javascript
   // PLAN: DifficultySelector component
   // 1. Import: useState, difficulty constants, styling
   // 2. Define DIFFICULTY_LEVELS constant
   // 3. Create component with difficulty prop + onChange callback
   // 4. Render selector UI with Tailwind classes
   // 5. Call onChange when user selects new difficulty
   // 6. Return selected difficulty UI
   ```

4. **Design component API**:
   - What props does it need?
   - What events does it emit?
   - What are error states?

5. **Identify testing needs**:
   - What should unit tests cover?
   - What E2E scenarios?
   - What edge cases?

**Output**: Clear implementation plan with TODO items

**Example Plan**:

```
Implementation Plan:

Files to create:
- [ ] src/hooks/useDifficulty.js (manage difficulty state + localStorage)
- [ ] src/components/learning/DifficultySelector.jsx (UI component)

Files to modify:
- [ ] src/data/teluguGraphemes.js (organize by difficulty)
- [ ] src/pages/Learn.jsx (integrate DifficultySelector)
- [ ] src/components/learning/AdaptivePracticeAlert.jsx (use difficulty)

Data flow:
User selects difficulty → DifficultySelector → useDifficulty →
localStorage + state → GraphemeCard renders correct set

Validation:
- Difficulty must be: 'basic' | 'intermediate' | 'advanced'
- Graphemes must exist for selected difficulty
- Handle missing/invalid graphemes gracefully
```

#### Phase 3: Build

**Goal**: Implement systematically, following established patterns

**Rules**:

1. **Follow existing patterns exactly**
   - Don't invent new patterns
   - Copy working examples and adapt
   - Maintain consistency with codebase

2. **Implement in order**:
   - Types/Constants first
   - Data structures/Models second
   - Hooks/State management third
   - Components fourth
   - Tests last

3. **Use framework utilities**:
   - `cn()` for classNames (from @/utils/cn)
   - Tailwind CSS for styling
   - Custom hooks for state management
   - shadcn/ui for components

4. **Add tests as you go**
   - Unit test hooks and logic
   - Component tests for rendering
   - E2E test user workflows

5. **Document as you go**
   - Add JSDoc comments for functions
   - Keep implementation plan updated
   - Comment complex logic

**Implementation steps**:

```javascript
// Step 1: Define constants and data structure
const DIFFICULTY_LEVELS = {
  basic: [/* ... */],
  intermediate: [/* ... */],
  advanced: [/* ... */],
};

// Step 2: Create hook
export function useDifficulty() {
  const [difficulty, setDifficulty] = useState(
    () => localStorage.getItem('grapheme-difficulty') || 'basic'
  );

  const handleChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    localStorage.setItem('grapheme-difficulty', newDifficulty);
  };

  return { difficulty, setDifficulty: handleChange };
}

// Step 3: Create component
export function DifficultySelector({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {Object.keys(DIFFICULTY_LEVELS).map((level) => (
        <option key={level} value={level}>
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </option>
      ))}
    </select>
  );
}

// Step 4: Test
describe('DifficultySelector', () => {
  it('renders all difficulty options', () => {
    // Test...
  });

  it('calls onChange when selection changes', () => {
    // Test...
  });
});

// Step 5: Integration
export function Learn() {
  const { difficulty, setDifficulty } = useDifficulty();
  return (
    <>
      <DifficultySelector value={difficulty} onChange={setDifficulty} />
      {/* Use difficulty to filter graphemes */}
    </>
  );
}
```

**Output**: Tested, documented code matching spec exactly

---

## Best Practices

### 1. Always Start with Spec

- Don't code without a spec
- If spec doesn't exist, create one first
- Update spec when requirements change

### 2. Follow the Scout-Plan-Build Cycle

- Scout thoroughly before planning
- Plan clearly before building
- Don't skip steps to save time

### 3. Copy, Don't Invent

- Find existing pattern
- Copy it completely
- Adapt only what's necessary
- Maintain consistency

### 4. Validate Early and Often

- Validate at UI boundary
- Type-check with TypeScript
- Add tests before features complete
- Test edge cases, not just happy path

### 5. Handle Errors Explicitly

- Every async operation needs try-catch
- Every error needs clear message
- Show errors appropriately to user
- Log errors for debugging

### 6. Document as You Go

- Comment complex logic
- Update specs when requirements change
- Add JSDoc to public functions
- Keep implementation plan updated

### 7. Test Systematically

- Unit tests for hooks and utilities
- Component tests for rendering
- E2E tests for user workflows
- Maintain test coverage > 80%

---

## Checklist for Feature Implementation

### Before Starting

- [ ] Spec exists and is clear
- [ ] Phase 0: Constraints checked
- [ ] Team agrees this is needed

### Scout Phase

- [ ] Read spec completely
- [ ] Loaded existing pattern examples
- [ ] Found similar features
- [ ] Understood data flow
- [ ] Identified affected files

### Plan Phase

- [ ] Sketched component structure
- [ ] Designed data flow
- [ ] Identified affected files
- [ ] Written implementation plan
- [ ] Listed test scenarios

### Build Phase

- [ ] Implemented constants/types
- [ ] Implemented hooks/logic
- [ ] Implemented components
- [ ] Added unit tests
- [ ] Added E2E tests
- [ ] Added documentation

### Quality Checks

- [ ] All tests pass
- [ ] No console errors/warnings
- [ ] Code follows patterns
- [ ] Spec still accurate
- [ ] Edge cases handled
- [ ] Performance acceptable

### Ready to Merge

- [ ] PR created with spec link
- [ ] All tests passing
- [ ] Code reviewed
- [ ] No unresolved comments
- [ ] Documentation complete

---

## Quick Reference: Phase Summary

| Phase | Goal | Duration | Output |
| ----- | ---- | -------- | ------ |
| **0** | Check constraints | 2-5 min | Verified plan complies |
| **1** | Gather context | 5-10 min | Complete understanding |
| **2** | Design solution | 5-10 min | Implementation plan |
| **3** | Build & test | 30-60 min | Tested, documented code |

**Total**: ~1 hour per feature (varies by complexity)

---

## Related Skills

- `.claude/skills/project-constraints/SKILL.md` - Architecture constraints
- `.claude/skills/duplication-prevention/SKILL.md` - Search before creating
- `.claude/skills/coding-standards/SKILL.md` - Code quality standards
- `.claude/skills/security-rules/SKILL.md` - Security best practices

## Related Commands

- `/prime-ui` - UI component patterns
- `/prime-learning-domain` - Learning domain knowledge
