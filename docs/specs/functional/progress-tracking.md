---
title: Progress Tracking Functional Spec
created: 2025-11-29
status: draft
version: 1.0
---

# Progress Tracking Spec

## Description

The progress tracking feature provides users with visibility into their Telugu learning journey. It aggregates mastery data across all practiced graphemes, displays statistics and trends, and enables users to filter their progress by mastery level. The system persists all practice data to enable long-term tracking and analysis.

### Purpose
- Give users clear visibility into their learning progress
- Motivate continued practice through achievement display
- Help users identify areas needing more attention
- Provide historical context for learning journey

## Requirements

### Functional

#### Statistics Dashboard
- **F-PT-001**: Dashboard SHALL display aggregate statistics:
  - Total graphemes mastered (confidence ≥90)
  - Total graphemes proficient (confidence 70-89)
  - Total graphemes practicing (confidence 40-69)
  - Total graphemes learning (confidence <40)
  - Average confidence score across all practiced graphemes
  - Total practice attempts
  - Total successful attempts
  - Overall accuracy percentage

- **F-PT-002**: Statistics SHALL be calculated from GraphemeMastery records only

- **F-PT-003**: Statistics SHALL update in real-time when navigating to Progress page

#### Mastery Visualization
- **F-PT-004**: Each grapheme mastery SHALL display:
  - Telugu glyph (large, readable)
  - Circular progress indicator showing confidence score
  - Color-coded by confidence level
  - Mastery level label and icon
  - Attempt statistics (total, successful, streak)

- **F-PT-005**: Progress circle SHALL:
  - Animate from 0 to current value on load
  - Use color scheme based on confidence:
    - Green (80-100): Excellent
    - Blue (60-79): Good
    - Yellow (40-59): Developing
    - Gray (0-39): Beginning

- **F-PT-006**: Mastery icons SHALL represent level:
  - Trophy: Mastered
  - Star: Proficient
  - TrendingUp: Practicing
  - Sparkles: Learning

#### Filtering System
- **F-PT-007**: Users SHALL be able to filter by mastery level:
  - All (default): Show all practiced graphemes
  - Mastered: Show only mastered graphemes
  - Proficient: Show only proficient graphemes
  - Practicing: Show only practicing graphemes
  - Learning: Show only learning graphemes

- **F-PT-008**: Filter tabs SHALL display count for each category

- **F-PT-009**: Empty state SHALL display:
  - Message indicating no graphemes in category
  - "Start Learning" call-to-action button

#### Data Persistence
- **F-PT-010**: All mastery data SHALL persist across sessions via localStorage/API

- **F-PT-011**: PracticeSession records SHALL include:
  - User identifier (email)
  - Grapheme ID
  - Puzzle type used
  - Success/failure status
  - Response time in milliseconds
  - Number of attempts
  - Whether adaptive practice
  - Session timestamp

- **F-PT-012**: GraphemeMastery records SHALL include:
  - User identifier (email)
  - Grapheme ID
  - Confidence score (0-100)
  - Accuracy rate (0-100)
  - Total and successful attempts
  - Consecutive success streak
  - Struggle count
  - Adaptive practice flag
  - Mastery level
  - Last practiced timestamp
  - Average response time

#### Recent Activity
- **F-PT-013**: System SHOULD display recent practice sessions (up to 20)
- **F-PT-014**: Recent sessions SHOULD show grapheme, result, and timestamp

### Non-Functional

#### Performance
- **NF-PT-001**: Progress page SHALL load within 3 seconds
- **NF-PT-002**: Mastery animations SHALL not cause frame drops
- **NF-PT-003**: Filter switching SHALL be instant (<100ms)

#### User Experience
- **NF-PT-004**: Statistics SHALL use gradient backgrounds for visual appeal
- **NF-PT-005**: Progress indicators SHALL animate smoothly
- **NF-PT-006**: Dark mode SHALL be fully supported with appropriate contrast
- **NF-PT-007**: Grid layout SHALL be responsive (2 cols on mobile, more on desktop)

#### Accessibility
- **NF-PT-008**: Confidence scores SHALL be readable (text in center of circle)
- **NF-PT-009**: Color SHALL not be sole indicator (labels included)
- **NF-PT-010**: Tab navigation SHALL work with keyboard

## Data Model

### GraphemeMastery Entity (Reference)
```typescript
interface GraphemeMastery {
  id: string;
  user_email: string;
  grapheme_id: string;
  confidence_score: number;      // 0-100
  accuracy_rate: number;         // 0-100
  total_attempts: number;
  successful_attempts: number;
  consecutive_successes: number;
  struggle_count: number;
  needs_adaptive_practice: boolean;
  mastery_level: 'not_started' | 'learning' | 'practicing' | 'proficient' | 'mastered';
  last_practiced: string;        // ISO datetime
  average_response_time: number; // ms
}
```

### PracticeSession Entity (Reference)
```typescript
interface PracticeSession {
  id: string;
  user_email: string;
  grapheme_id: string;
  puzzle_type: 'grapheme_match' | 'decompose_rebuild' | 'transliteration' | 'sequence_sort' | 'spot_difference';
  was_successful: boolean;
  response_time: number;         // ms
  attempts_taken: number;
  is_adaptive_practice: boolean;
  session_date: string;          // ISO datetime
}
```

### Statistics Calculation
```typescript
interface ProgressStats {
  mastered: number;      // count of mastery_level === 'mastered'
  proficient: number;    // count of mastery_level === 'proficient'
  practicing: number;    // count of mastery_level === 'practicing'
  learning: number;      // count of mastery_level === 'learning'
  avgConfidence: number; // average of all confidence_scores
  totalAttempts: number; // sum of all total_attempts
  totalSuccessful: number; // sum of all successful_attempts
  overallAccuracy: number; // (totalSuccessful / totalAttempts) * 100
}
```

## Components

### Page Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `Progress` | `src/pages/Progress.jsx` | Main progress dashboard |

### Visualization Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `ConfidenceIndicator` | `src/components/learning/ConfidenceIndicator.jsx` | Circular progress with stats |

### UI Components Used
| Component | Source | Purpose |
|-----------|--------|---------|
| `Card` | `src/components/ui/card.jsx` | Statistics cards |
| `Tabs` | `src/components/ui/tabs.jsx` | Filter tabs |
| `Button` | `src/components/ui/button.jsx` | Navigation actions |

## User Flows

### Primary: View Overall Progress
1. User navigates to Progress page from Home
2. System fetches user's mastery data and grapheme data
3. System calculates aggregate statistics
4. Dashboard displays stat cards with totals and averages
5. Grid displays all grapheme mastery records with progress circles

### Secondary: Filter by Mastery Level
1. User views Progress page with "All" tab selected
2. User clicks "Mastered" tab
3. System filters to show only mastered graphemes
4. Tab counts update to reflect filtered state
5. Grid updates to show filtered results

### Tertiary: Navigate to Learning
1. User sees empty state (e.g., no mastered graphemes)
2. User clicks "Start Learning" button
3. System navigates to Home page
4. User can begin learning session

## Visual Design

### Statistics Cards Layout
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 🏆 Mastered │ │ 🎯 Avg Conf │ │ 📈 Accuracy │ │ 🏅 Practice │
│     12      │ │     67      │ │    78%      │ │    156      │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### Confidence Indicator
```
┌──────────────────────────────────────────────┐
│ [గ]  [═══○═══]  Proficient ★               │
│       67                                     │
│      Attempts: 23  Success: 18  Streak: 5   │
└──────────────────────────────────────────────┘
```

### Color Scheme by Confidence
| Range | Background | Border | Icon Color |
|-------|------------|--------|------------|
| 80-100 | green-50 | green-200 | green-600 |
| 60-79 | blue-50 | blue-200 | blue-600 |
| 40-59 | yellow-50 | yellow-200 | yellow-600 |
| 0-39 | gray-50 | gray-200 | gray-600 |

## Testing Strategy

### Unit Tests
- Statistics calculation from mastery data
- Color scheme selection by confidence score
- Mastery level filtering logic
- Empty state detection

### E2E Tests
- Progress page loads with user data
- Statistics display correctly
- Filter tabs filter content correctly
- Empty state displays when appropriate
- Navigation to Home works from empty state
- Dark mode displays correctly

### Test Scenarios
```javascript
// Scenario: Statistics calculation
// Given: 3 mastered, 2 proficient, 5 practicing, 10 learning
// Expected: counts match, avgConfidence calculated correctly

// Scenario: Empty filter
// Given: No graphemes at 'mastered' level
// Expected: "No graphemes in this category" message + CTA

// Scenario: Confidence color
// Given: confidence_score = 75
// Expected: Blue color scheme applied
```

## Dependencies

- `@tanstack/react-query`: Data fetching with caching
- `framer-motion`: Progress circle animation
- `lucide-react`: Icons (Trophy, Star, TrendingUp, Sparkles)
- `react-router-dom`: Navigation

## Open Questions

1. Should there be date-range filtering (week, month, all-time)?
2. Should recent activity show individual puzzle attempts?
3. Should there be a streak counter (days of consecutive practice)?
4. Should progress be exportable (e.g., download report)?

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-29 | Initial draft based on existing implementation |
