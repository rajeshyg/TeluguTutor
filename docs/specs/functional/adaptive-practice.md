---
title: Adaptive Practice Functional Spec
created: 2025-11-29
status: draft
version: 1.0
---

# Adaptive Practice Spec

## Description

The adaptive practice system identifies graphemes where users are struggling and provides targeted micro-practice sessions to reinforce those specific characters. The system uses a multi-factor confidence scoring algorithm to track mastery levels and automatically flags graphemes that need additional attention based on failure patterns.

### Purpose
- Identify struggling graphemes based on performance patterns
- Provide targeted practice for weak areas
- Reduce frustration by adapting difficulty to learner needs
- Accelerate mastery through focused repetition

## Requirements

### Functional

#### Struggle Detection
- **F-AP-001**: System SHALL flag graphemes for adaptive practice when `struggle_count >= 3`

- **F-AP-002**: Struggle count SHALL:
  - Increment by 1 on each failed attempt
  - Reset to 0 on successful attempt during regular learning
  - Decrement by 1 (min 0) on successful adaptive practice attempt

- **F-AP-003**: System SHALL track `needs_adaptive_practice` boolean flag per grapheme mastery record

#### Confidence Score Algorithm
- **F-AP-004**: Confidence score SHALL be calculated using multi-factor formula:
  ```
  confidenceScore = accuracyFactor + consistencyFactor + speedFactor + retentionFactor
  
  Where:
  - accuracyFactor = (successfulAttempts / totalAttempts) * 100 * 0.4  (max 40 points)
  - consistencyFactor = min(consecutiveSuccesses * 5, 30)               (max 30 points)
  - speedFactor = responseTime < 3000ms ? 20 : responseTime < 5000ms ? 10 : 0 (max 20 points)
  - retentionFactor = 10 (placeholder for days-between-practice calculation)
  
  Total max: 100 points
  ```

- **F-AP-005**: Confidence score SHALL be capped at 100

#### Mastery Levels
- **F-AP-006**: System SHALL assign mastery levels based on confidence score:
  | Level | Confidence Range | Description |
  |-------|-----------------|-------------|
  | `learning` | 0-39 | Just started or struggling |
  | `practicing` | 40-69 | Making progress |
  | `proficient` | 70-89 | Solid understanding |
  | `mastered` | 90-100 | Expert level |

- **F-AP-007**: Mastery level SHALL update after each practice attempt

#### Adaptive Practice Alert
- **F-AP-008**: System SHALL display alert when struggling graphemes exist
- **F-AP-009**: Alert SHALL show:
  - Number of struggling graphemes
  - Preview of up to 3 struggling glyphs
  - "Start Practice" action button
  - "Later" dismiss button

- **F-AP-010**: Alert SHALL be dismissible without losing data
- **F-AP-011**: Alert position SHALL be fixed at bottom center of viewport

#### Practice Session Updates
- **F-AP-012**: On adaptive practice success:
  - Decrement `struggle_count` by 1 (minimum 0)
  - Set `needs_adaptive_practice = (struggle_count >= 3)`
  - Increment `consecutive_successes`
  - Increment `total_attempts` and `successful_attempts`

- **F-AP-013**: On adaptive practice failure:
  - Keep `struggle_count` unchanged
  - Set `consecutive_successes = 0`
  - Increment `total_attempts` only

- **F-AP-014**: Each practice attempt SHALL be recorded as a PracticeSession with `is_adaptive_practice = true`

### Non-Functional

#### Performance
- **NF-AP-001**: Struggling grapheme query SHALL complete in <500ms
- **NF-AP-002**: Mastery updates SHALL be atomic (no partial state)

#### User Experience
- **NF-AP-003**: Alert animation SHALL be smooth (spring physics)
- **NF-AP-004**: Alert SHALL not block underlying content interaction
- **NF-AP-005**: Practice flow SHALL feel encouraging, not punitive

#### Data Integrity
- **NF-AP-006**: Confidence scores SHALL be persisted immediately after calculation
- **NF-AP-007**: Struggle counts SHALL be accurate across sessions

## Data Model

### GraphemeMastery Entity
```typescript
interface GraphemeMastery {
  id: string;                    // Record ID
  user_email: string;            // User identifier
  grapheme_id: string;           // TeluguGrapheme.id
  
  // Score metrics
  confidence_score: number;      // 0-100 calculated score
  accuracy_rate: number;         // 0-100 percentage
  average_response_time: number; // milliseconds
  
  // Attempt tracking
  total_attempts: number;
  successful_attempts: number;
  consecutive_successes: number; // Current streak
  
  // Adaptive practice flags
  struggle_count: number;        // Recent failures
  needs_adaptive_practice: boolean;
  
  // Mastery state
  mastery_level: 'not_started' | 'learning' | 'practicing' | 'proficient' | 'mastered';
  last_practiced: string;        // ISO datetime
}
```

### Confidence Calculation
```typescript
function calculateConfidence(mastery: GraphemeMastery, responseTime: number): number {
  const accuracyFactor = mastery.accuracy_rate * 0.4;
  const consistencyFactor = Math.min(mastery.consecutive_successes * 5, 30);
  const speedFactor = responseTime < 3000 ? 20 : responseTime < 5000 ? 10 : 0;
  const retentionFactor = 10; // TODO: implement days-between calculation
  
  return Math.min(100, accuracyFactor + consistencyFactor + speedFactor + retentionFactor);
}

function getMasteryLevel(confidenceScore: number): string {
  if (confidenceScore >= 90) return 'mastered';
  if (confidenceScore >= 70) return 'proficient';
  if (confidenceScore >= 40) return 'practicing';
  return 'learning';
}
```

## Components

### Alert Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `AdaptivePracticeAlert` | `src/components/learning/AdaptivePracticeAlert.jsx` | Floating notification for practice |

### Integration Points
| Component | Integration | Purpose |
|-----------|-------------|---------|
| `Learn.jsx` | Updates mastery after each puzzle | Core mastery tracking |
| `MicroPractice.jsx` | Queries struggling graphemes | Targeted practice flow |
| `Progress.jsx` | Displays mastery levels | User visibility |

## User Flows

### Primary: Trigger Adaptive Practice
1. User completes learning session with some failures
2. System calculates mastery updates for each grapheme
3. Graphemes with `struggle_count >= 3` flagged
4. On next page load, AdaptivePracticeAlert appears
5. User taps "Start Practice"
6. System navigates to MicroPractice page

### Secondary: Complete Adaptive Practice Session
1. User is on MicroPractice page
2. System loads all graphemes with `needs_adaptive_practice = true`
3. User works through each struggling grapheme
4. On success: struggle_count decrements, mastery updates
5. When struggle_count < 3, grapheme removed from adaptive pool
6. Session ends when all struggling graphemes practiced

### Tertiary: Dismiss Alert
1. AdaptivePracticeAlert displays
2. User taps "Later"
3. Alert dismisses with animation
4. Struggling graphemes remain flagged
5. Alert will reappear on next session

## Testing Strategy

### Unit Tests
- Confidence score calculation with various inputs
- Mastery level determination from confidence scores
- Struggle count increment/decrement logic
- `needs_adaptive_practice` flag toggle logic

### E2E Tests
- Alert appears when struggling graphemes exist
- Alert does not appear when no struggling graphemes
- Clicking "Start Practice" navigates to MicroPractice
- Clicking "Later" dismisses alert gracefully
- Successful adaptive practice reduces struggle count
- Grapheme removed from adaptive pool when struggle_count < 3

### Test Scenarios
```javascript
// Scenario: Confidence calculation
// Given: 80% accuracy, 3 consecutive successes, 2500ms response
// Expected: 32 + 15 + 20 + 10 = 77 (proficient)

// Scenario: Struggle detection
// Given: User fails grapheme 3 times consecutively
// Expected: needs_adaptive_practice = true

// Scenario: Recovery from struggle
// Given: User succeeds 3 times in adaptive practice
// Expected: struggle_count = 0, needs_adaptive_practice = false
```

## Dependencies

- `@tanstack/react-query`: Data fetching and cache invalidation
- `framer-motion`: Alert animations
- `lucide-react`: Icons (AlertCircle, Target, Zap)

## Algorithm Details

### Confidence Score Breakdown

| Factor | Weight | Calculation | Max Points |
|--------|--------|-------------|------------|
| Accuracy | 40% | `(successful/total) * 100 * 0.4` | 40 |
| Consistency | 30% | `min(streak * 5, 30)` | 30 |
| Speed | 20% | `<3s: 20, <5s: 10, else: 0` | 20 |
| Retention | 10% | Fixed 10 (placeholder) | 10 |

### Struggle Threshold Rationale
- 3 failures chosen to balance:
  - Not too sensitive (single mistake doesn't trigger)
  - Not too lenient (patterns of struggle caught early)
  - Allows natural learning curve

## Open Questions

1. Should retention factor consider actual days between practice?
2. Should consecutive failures in same session count more heavily?
3. Should there be a "struggling" mastery level distinct from "learning"?
4. Should adaptive practice have different puzzle types than regular learning?

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-29 | Initial draft based on existing implementation |
