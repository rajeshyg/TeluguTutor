# Coding Standards Skill

## When This Skill Activates

**Auto-activation triggers**:

- Writing JavaScript/JSX code
- Creating React components
- Defining types or interfaces
- Implementing utilities or hooks

**Manual activation**: When you need to verify code quality standards.

---

## Core Principles

1. **Readability**: Code is read more than written, make it clear
2. **Consistency**: Follow existing patterns in the codebase
3. **Simplicity**: Avoid over-engineering, keep solutions simple
4. **Maintainability**: Future developers should understand your code

---

## JavaScript/JSX Standards

### Variable & Function Naming

**DO**:

```javascript
✓ Use descriptive names
const maxConfidenceThreshold = 0.8;
const calculateGraphemeScore = (attempts, correct) => { };

✓ Use camelCase for variables and functions
const userPracticeSession = null;
const handlePracticeStart = () => { };

✓ Use UPPER_SNAKE_CASE for constants
const MAX_GRAPHEME_LENGTH = 4;
const PRACTICE_TIMEOUT_MS = 30000;
```

**DON'T**:

```javascript
❌ Single letter or cryptic names (except loop indices)
const x = 0.8;
const f = () => { };

❌ Over-abbreviation
const gScore = 0.8; // What is gScore?
const pSess = session; // What is pSess?

❌ Generic names
const data = [];
const result = null;
const value = getUserInput();
```

### Function Structure

**DO**:

```javascript
✓ Pure functions when possible
const calculateMastery = (correct, total) => {
  return total === 0 ? 0 : (correct / total);
};

✓ Single responsibility
const fetchGraphemeData = async (id) => {
  // Only fetch, don't process
  const response = await fetch(`/api/graphemes/${id}`);
  return response.json();
};

✓ Early returns to reduce nesting
const processResponse = (response) => {
  if (!response.ok) return null;
  if (!response.data) return null;
  return response.data;
};

✓ Comments for WHY, not WHAT
// Use exponential backoff to avoid rate limiting
const delay = Math.pow(2, attemptCount) * 1000;
```

**DON'T**:

```javascript
❌ Functions that do too many things
const handlePractice = () => {
  // Fetch data, validate, process, update UI, log... too much
};

❌ Side effects without documentation
const saveAndNotify = (data) => {
  localStorage.setItem('data', JSON.stringify(data));
  window.location.reload(); // Unexpected side effect
};

❌ Deeply nested code (arrow functions/callbacks)
const process = (data) => {
  data.forEach(item => {
    item.results.forEach(result => {
      result.scores.forEach(score => {
        // Too nested
      });
    });
  });
};

❌ Redundant comments
const count = 0; // Set count to 0
// This is bad - the code already says this
```

---

## React Component Standards

### Component Structure

**Functional Components (Always)**:

```javascript
// ✓ Standard pattern
function GraphemeCard({ grapheme, confidence, onPractice }) {
  // 1. Hooks at top
  const [isFlipped, setIsFlipped] = useState(false);

  // 2. Derived values
  const mastery = useMemo(() => {
    return confidence > 0.8 ? 'advanced' : 'learning';
  }, [confidence]);

  // 3. Event handlers
  const handleClick = () => {
    setIsFlipped(!isFlipped);
    onPractice?.(grapheme);
  };

  // 4. Effects
  useEffect(() => {
    console.log('Grapheme mounted:', grapheme.id);
    return () => console.log('Grapheme unmounted:', grapheme.id);
  }, [grapheme.id]);

  // 5. Render
  return (
    <div onClick={handleClick} className="grapheme-card">
      <p>{grapheme.character}</p>
      <div>{mastery}</div>
    </div>
  );
}
```

**DON'T**:

```javascript
❌ Class components (use functional)
class Component extends React.Component { }

❌ Inline prop types (use TypeScript or PropTypes separately)
export function Component({ title }: { title: string }) { }

❌ Default exports for components
export default function Component() { } // Use named exports

❌ Large components (split if > 200 lines)
function LargeComponent() {
  // 500 lines of code - split this up!
}
```

### Hooks Usage

**DO**:

```javascript
✓ Custom hooks start with 'use'
export function usePracticeSession(graphemeId) {
  const [session, setSession] = useState(null);
  const [score, setScore] = useState(0);
  return { session, score, setSession, setScore };
}

✓ Dependency arrays complete and accurate
useEffect(() => {
  loadPracticeData(graphemeId);
}, [graphemeId]); // Include all dependencies

✓ Hooks at top level only
function Component() {
  const [state, setState] = useState(0); // Top level
  const { data } = usePracticeSession('g1'); // Top level

  if (condition) {
    // ❌ NEVER call hooks inside conditions
  }
  return <div>{state}</div>;
}

✓ Extract complex hooks
const usePracticeData = (id) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData(id).then(setData);
  }, [id]);
  return data;
};
```

**DON'T**:

```javascript
❌ Conditional hooks
if (condition) {
  useEffect(() => {}, []); // NEVER conditional
}

❌ Hooks inside loops
for (let i = 0; i < 10; i++) {
  useEffect(() => {}, []); // NEVER in loops
}

❌ Missing or incorrect dependencies
useEffect(() => {
  fetchData(userId);
}, []); // userId missing - will use stale value

❌ Side effects without cleanup
useEffect(() => {
  const listener = () => { };
  window.addEventListener('resize', listener);
  // Missing cleanup - causes memory leaks
}, []);
```

### State Management

**DO**:

```javascript
✓ useState for local state
const [isOpen, setIsOpen] = useState(false);

✓ useReducer for complex state
const [state, dispatch] = useReducer(sessionReducer, initialState);

✓ Derived state with useMemo
const totalScore = useMemo(() => {
  return sessions.reduce((sum, s) => sum + s.score, 0);
}, [sessions]);

✓ Context for shared state
const { user, setUser } = useContext(UserContext);

✓ React Query for remote data
const { data, isLoading } = useQuery({
  queryKey: ['graphemes'],
  queryFn: fetchGraphemes,
});
```

**DON'T**:

```javascript
❌ Unnecessary state
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(items.reduce(...)); // Derived state, use useMemo
}, [items]);

❌ Prop drilling more than 2 levels
<Parent>
  <Child user={user}>
    <GrandChild user={user}>
      <GreatGrand user={user}> // Use Context instead
```

---

## File Organization

### File Naming Conventions

| Type              | Pattern           | Example                              |
| ----------------- | ----------------- | ------------------------------------ |
| **Components**    | PascalCase.jsx    | `GraphemeCard.jsx`, `PracticeForm.jsx` |
| **Pages**         | PascalCase.jsx    | `LearnPage.jsx`, `ProgressPage.jsx` |
| **Hooks**         | use[Name].js      | `usePracticeSession.js`, `useTheme.js` |
| **Utilities**     | [name].js         | `format.js`, `validation.js`         |
| **Data**          | [name]s.js        | `teluguGraphemes.js`, `categories.js` |
| **Entities**      | [Name].js         | `GraphemeMastery.js`, `PracticeSession.js` |
| **Services**      | [name]Service.js  | `APIService.js`, `StorageService.js` |

### Component File Structure

```javascript
// src/components/learning/PracticeCard.jsx

// 1. Imports (React first, then 3rd party, then local)
import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

// 2. Types/Constants
const FLIP_ANIMATION_MS = 300;

// 3. Component
export function PracticeCard({ grapheme, onComplete }) {
  // Implementation...
}

// 4. Exports
export default PracticeCard;
```

---

## Error Handling

**DO**:

```javascript
✓ Try-catch for async operations
try {
  const data = await fetch('/api/graphemes');
  if (!data.ok) throw new Error(`API error: ${data.status}`);
  return await data.json();
} catch (error) {
  console.error('Failed to fetch graphemes:', error);
  return null;
}

✓ User-friendly error messages
throw new Error('Failed to save practice session. Please try again.');

✓ Specific error handling
try {
  // ...
} catch (error) {
  if (error.name === 'ValidationError') {
    // Handle validation
  } else if (error instanceof NetworkError) {
    // Handle network
  } else {
    // Handle unknown
  }
}
```

**DON'T**:

```javascript
❌ Silent failures
try {
  await savePractice();
} catch (error) {
  // Silent - at least log it
}

❌ Vague error messages
throw new Error('Error');
throw new Error('Something went wrong');

❌ Don't throw in render
function Component() {
  throw new Error('Render error'); // Use Error Boundary
}
```

---

## Code Style Guidelines

### Formatting

**DO**:

```javascript
✓ Use 2 spaces for indentation
function calculate() {
  return value * 2;
}

✓ 80-100 character line length target
const verylongvariablename = 'This is a very long line';

✓ Spaces around operators
const result = a + b;
const isTrue = value === 5;

✓ Break long lines
const result = calculateComplexValue(
  param1,
  param2,
  param3,
);
```

**DON'T**:

```javascript
❌ Inconsistent indentation
function calculate() {
    return value * 2; // 4 spaces - inconsistent
}

❌ Very long lines (hard to read)
const result = calculateSomething(param1, param2, param3) + anotherCalculation(x, y, z) * factor;

❌ No spaces
const result=a+b;
```

---

## Testing Standards

**DO**:

```javascript
✓ Test component rendering
test('renders grapheme card', () => {
  const { getByText } = render(<GraphemeCard grapheme={mockGrapheme} />);
  expect(getByText(mockGrapheme.character)).toBeInTheDocument();
});

✓ Test user interactions
test('flips card on click', async () => {
  const { getByRole } = render(<GraphemeCard grapheme={mockGrapheme} />);
  const button = getByRole('button');
  fireEvent.click(button);
  expect(button).toHaveClass('flipped');
});

✓ Test E2E workflows
test('user completes practice session', async () => {
  await page.goto('/learn');
  await page.click('[data-testid="practice-btn"]');
  await page.fill('[data-testid="answer-input"]', 'ka');
  await page.click('[data-testid="submit-btn"]');
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

**DON'T**:

```javascript
❌ Test implementation details
test('state updates', () => {
  const { getByRole } = render(<Component />);
  // Testing internal state is brittle
});

❌ Skip error cases
test('happy path only', () => {
  // Must also test error cases
});

❌ Brittle selectors
getByRole('button'); // Could match wrong button
// Use data-testid for clarity
```

---

## Comments

**DO**:

```javascript
✓ Explain WHY, not WHAT
// Use exponential backoff to prevent rate limiting
const delay = Math.pow(2, retryCount) * 1000;

✓ Document complex algorithms
// Calculate confidence using Bayesian update
// P(mastery|attempts) = (correct * prior) / attempts
const confidence = (correct * PRIOR) / attempts;

✓ TODOs with context
// TODO: Add pagination when grapheme count exceeds 1000
// (requires schema update to include cursor field)
```

**DON'T**:

```javascript
❌ Redundant comments
count++; // Increment count (obvious from code)

❌ Commented-out code (delete it)
// const oldImplementation = () => { };

❌ Vague comments
// Handle case
const result = calculateThing(); // What case?
```

---

## Performance Guidelines

**DO**:

```javascript
✓ Memoize expensive calculations
const score = useMemo(() => {
  return sessions.reduce((sum, s) => sum + s.score, 0);
}, [sessions]);

✓ Lazy load components
const PracticeModal = lazy(() => import('./PracticeModal'));

✓ Use useCallback for stable references
const handlePractice = useCallback((grapheme) => {
  onPractice(grapheme);
}, [onPractice]);
```

**DON'T**:

```javascript
❌ Recalculate on every render
const score = sessions.reduce((sum, s) => sum + s.score, 0); // Every render!

❌ Inline object/array props (causes re-renders)
<Component style={{ color: 'blue' }} /> // New object every render

❌ Missing key prop in lists
list.map(item => <Item data={item} />) // No key, inefficient
```

---

## Related Skills

- `.claude/skills/security-rules/SKILL.md` - Security best practices
- `.claude/skills/duplication-prevention/SKILL.md` - File organization patterns

## Related Commands

- `/prime-ui` - UI component patterns and shadcn/ui usage
- `/prime-learning-domain` - Learning domain patterns
