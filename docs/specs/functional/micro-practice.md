---
title: Micro Practice Functional Spec
created: 2025-11-29
status: draft
version: 1.0
---

# Micro Practice Spec

## Description

The micro practice feature provides a focused, streamlined practice session specifically targeting graphemes that users are struggling with. It presents a sequence of puzzles for adaptive practice graphemes, tracks completion progress, and updates mastery data to help users overcome weak areas. The session is designed to be quick and targeted, helping users recover from struggle patterns.

### Purpose
- Provide focused practice for struggling graphemes only
- Enable quick practice sessions without full learning flow
- Reduce struggle counts through successful repetition
- Build confidence through targeted mastery reinforcement

## Requirements

### Functional

#### Session Initialization
- **F-MP-001**: System SHALL load all graphemes marked with `needs_adaptive_practice = true`

- **F-MP-002**: Session SHALL:
  - Display empty state if no struggling graphemes exist
  - Show "All Caught Up" message with home navigation
  - Proceed to practice flow if struggling graphemes exist

- **F-MP-003**: System SHALL fetch all graphemes for option generation purposes

#### Practice Flow
- **F-MP-004**: Session SHALL present struggling graphemes sequentially (by load order)

- **F-MP-005**: Each practice item SHALL:
  - Display current position (Letter X of Y)
  - Show progress bar (visual percentage)
  - Present appropriate puzzle type
  - Track response time

- **F-MP-006**: Puzzle type selection SHALL be:
  - GraphemeMatch: Default for all graphemes
  - DecomposeRebuild: 50% chance IF grapheme has >1 component AND components differ from glyph
  - Selection made when advancing to next grapheme

#### Answer Options Generation
- **F-MP-007**: Options SHALL be generated with priority:
  1. Target grapheme (always included)
  2. Confusable graphemes (from `confusable_with` array)
  3. Same-module graphemes (as remaining fillers)
  4. Total options: 4

- **F-MP-008**: Options SHALL NOT include:
  - Duplicate graphemes
  - Graphemes from different modules

- **F-MP-009**: Options SHALL be shuffled randomly before display

#### Progress Tracking
- **F-MP-010**: System SHALL track:
  - Current index in struggling graphemes array
  - Completed count (successful answers)
  - Response time per puzzle
  - Puzzle type per attempt

- **F-MP-011**: Progress bar SHALL animate from 0 to current position

#### Mastery Updates
- **F-MP-012**: On successful answer:
  - Decrement `struggle_count` by 1 (minimum 0)
  - Set `needs_adaptive_practice` based on `struggle_count >= 3`
  - Increment `consecutive_successes`
  - Increment `total_attempts` and `successful_attempts`
  - Increment completed count in UI

- **F-MP-013**: On failed answer:
  - Keep `struggle_count` unchanged
  - Reset `consecutive_successes` to 0
  - Increment `total_attempts` only

- **F-MP-014**: Each attempt SHALL create PracticeSession with:
  - `is_adaptive_practice = true`
  - Current `puzzle_type`
  - Recorded `response_time`
  - `attempts_taken = 1`
  - Current timestamp as `session_date`

#### Session Completion
- **F-MP-015**: On completing all struggling graphemes:
  - Display completion alert
  - Navigate to Home page

- **F-MP-016**: Advance delay SHALL be 1000ms after answer feedback

### Non-Functional

#### Performance
- **NF-MP-001**: Initial load SHALL complete within 2 seconds
- **NF-MP-002**: Puzzle transitions SHALL be smooth (<300ms)
- **NF-MP-003**: Mastery updates SHALL not block UI

#### User Experience
- **NF-MP-004**: Progress bar SHALL provide visual motivation
- **NF-MP-005**: Completion count SHALL update immediately on success
- **NF-MP-006**: Empty state SHALL be encouraging, not discouraging
- **NF-MP-007**: Dark mode SHALL be fully supported

#### Accessibility
- **NF-MP-008**: Progress indicator SHALL have text alternative (X of Y)
- **NF-MP-009**: Touch targets SHALL be minimum 48x48px

## Data Model

### Session State
```typescript
interface MicroPracticeSession {
  user: User | null;
  currentIndex: number;          // Position in strugglingGraphemes
  completedCount: number;        // Successful answers
  puzzleType: 'grapheme_match' | 'decompose_rebuild';
  responseTime: number;          // Current puzzle response time (ms)
}
```

### Query: Struggling Graphemes
```typescript
// Query key: ['strugglingForPractice', user.email]
async function fetchStrugglingGraphemes(userEmail: string): Promise<TeluguGrapheme[]> {
  // 1. Get mastery records with needs_adaptive_practice = true
  const struggling = await GraphemeMastery.filter({
    user_email: userEmail,
    needs_adaptive_practice: true
  });
  
  // 2. Get grapheme IDs
  const graphemeIds = struggling.map(m => m.grapheme_id);
  
  // 3. Fetch full grapheme data
  const allGraphemes = await TeluguGrapheme.list();
  return allGraphemes.filter(g => graphemeIds.includes(g.id));
}
```

### Options Generation Algorithm
```typescript
function generateOptions(
  target: TeluguGrapheme, 
  allGraphemes: TeluguGrapheme[]
): TeluguGrapheme[] {
  const options = [target];
  
  // Priority 1: Confusables
  const confusables = target.confusable_with || [];
  for (const id of confusables) {
    if (options.length >= 4) break;
    const g = allGraphemes.find(g => g.id === id);
    if (g) options.push(g);
  }
  
  // Priority 2: Same module
  const sameModule = allGraphemes.filter(g => 
    g.id !== target.id &&
    g.module === target.module &&
    !options.includes(g)
  );
  
  while (options.length < 4 && sameModule.length > 0) {
    const idx = Math.floor(Math.random() * sameModule.length);
    options.push(sameModule[idx]);
    sameModule.splice(idx, 1);
  }
  
  // Shuffle
  return options.sort(() => Math.random() - 0.5);
}
```

## Components

### Page Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `MicroPractice` | `src/pages/MicroPractice.jsx` | Main practice page |

### Puzzle Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `GraphemeMatch` | `src/components/puzzles/GraphemeMatch.jsx` | Match transliteration to glyph |
| `DecomposeRebuild` | `src/components/puzzles/DecomposeRebuild.jsx` | Build character from components |

### UI Components Used
| Component | Source | Purpose |
|-----------|--------|---------|
| `Button` | `src/components/ui/button.jsx` | Navigation buttons |

## User Flows

### Primary: Complete Micro Practice Session
1. User clicks "Start Practice" on AdaptivePracticeAlert
2. System navigates to MicroPractice page
3. System loads struggling graphemes
4. User sees first puzzle with progress indicator
5. User answers puzzle (correct or incorrect)
6. System records attempt and updates mastery
7. System advances to next grapheme after 1s
8. Repeat until all graphemes practiced
9. System shows completion alert
10. User redirected to Home

### Secondary: No Struggling Graphemes
1. User navigates directly to MicroPractice
2. System finds no struggling graphemes
3. System displays "All Caught Up" state
4. User clicks "Return Home"
5. System navigates to Home page

## Visual Design

### Header Layout
```
┌──────────────────────────────────────────────────────────┐
│ ← Back          ⚡ Adaptive Practice          🎯 3/7    │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└──────────────────────────────────────────────────────────┘
```

### Progress Indicator
```
┌────────────────────────┐
│   Focused Practice     │
│ Letter 3 of 7          │
└────────────────────────┘
```

### Empty State
```
┌────────────────────────────────────┐
│         ✅ (large icon)            │
│                                    │
│     All Caught Up!                 │
│                                    │
│ No letters need extra practice     │
│         right now                  │
│                                    │
│      [Return Home]                 │
└────────────────────────────────────┘
```

## Testing Strategy

### Unit Tests
- Options generation with confusables
- Options generation without confusables
- Options limited to same module
- Puzzle type selection logic
- Mastery update on success
- Mastery update on failure

### E2E Tests
- Session loads with struggling graphemes
- Empty state displays when no struggling graphemes
- Progress bar animates correctly
- Puzzle transitions after answer
- Completion alert appears at end
- Navigation to Home works

### Test Scenarios
```javascript
// Scenario: Struggling grapheme loaded
// Given: User has 3 graphemes with needs_adaptive_practice = true
// Expected: MicroPractice shows "Letter 1 of 3"

// Scenario: Options generation
// Given: Target in 'hallulu' module, 2 confusables exist
// Expected: Options include target + 2 confusables + 1 same-module

// Scenario: Success mastery update
// Given: struggle_count = 4
// When: User answers correctly
// Expected: struggle_count = 3, needs_adaptive_practice = true

// Scenario: Recovery from struggling
// Given: struggle_count = 3
// When: User answers correctly
// Expected: struggle_count = 2, needs_adaptive_practice = false
```

## Dependencies

- `@tanstack/react-query`: Data fetching with cache invalidation
- `framer-motion`: Progress bar animation, puzzle transitions
- `lucide-react`: Icons (ArrowLeft, Target, Zap, CheckCircle)
- `react-router-dom`: Navigation

## Open Questions

1. Should there be a minimum number of practice items per session?
2. Should successful graphemes be removed from current session immediately?
3. Should there be a "skip" option for very difficult graphemes?
4. Should practice order be randomized or follow original load order?
5. Should response time affect struggle recovery rate?

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-29 | Initial draft based on existing implementation |
