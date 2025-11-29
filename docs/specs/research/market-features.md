---
id: R-003
title: Market Features Research
status: in-progress
priority: medium
created: 2025-11-29
owner: TBD
timeline:
  initial_findings: 2025-12-01
  full_report: 2025-12-04
depends_on: R-002
---

# Market Features Research

## Description

Feature inventory and prioritization based on competitive analysis of leading language-learning apps. Informs TeluguTutor's product backlog with actionable, incremental improvements.

## Objectives

1. Catalog features across competitors
2. Identify gaps in TeluguTutor's current offering
3. Prioritize features for 2–3 week sprint cycles
4. Define KPIs to measure feature success

---

## Feature Inventory by Competitor

### Legend
- ✅ Full implementation
- ⚡ Partial/Basic implementation
- ❌ Not present
- 🔒 Premium only

### Core Learning Features

| Feature | Duolingo | Memrise | Babbel | Busuu | Mondly | Drops | **TeluguTutor** |
|---------|----------|---------|--------|-------|--------|-------|-----------------|
| Structured lessons | ✅ | ✅ | ✅ | ✅ | ✅ | ⚡ | ⚡ |
| Skill tree/modules | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Spaced repetition | ✅ | ✅ | ⚡ | ⚡ | ⚡ | ✅ | ❌ |
| Adaptive difficulty | ✅ | ⚡ | ⚡ | ⚡ | ⚡ | ❌ | ⚡ |
| Placement test | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Review/practice mode | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Exercise Types

| Feature | Duolingo | Memrise | Babbel | Busuu | Mondly | Drops | **TeluguTutor** |
|---------|----------|---------|--------|-------|--------|-------|-----------------|
| Multiple choice | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Typing/spelling | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ⚡ |
| Matching pairs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Listening | ✅ | ✅ | ✅ | ✅ | ✅ | ⚡ | ❌ |
| Speaking/recording | ✅ | ⚡ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Word building | ✅ | ❌ | ⚡ | ❌ | ⚡ | ❌ | ✅ |
| Sentence building | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Image-word association | ✅ | ✅ | ✅ | ⚡ | ✅ | ✅ | ❌ |

### Gamification Features

| Feature | Duolingo | Memrise | Babbel | Busuu | Mondly | Drops | **TeluguTutor** |
|---------|----------|---------|--------|-------|--------|-------|-----------------|
| Streaks | ✅ | ✅ | ⚡ | ✅ | ✅ | ✅ | ❌ |
| XP/Points | ✅ | ✅ | ❌ | ⚡ | ✅ | ❌ | ✅ (Stars) |
| Daily goals | ✅ | ✅ | ⚡ | ✅ | ✅ | ✅ | ❌ |
| Achievements/badges | ✅ | ✅ | ⚡ | ✅ | ✅ | ⚡ | ❌ |
| Leaderboards | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Hearts/lives | ✅ | ❌ | ❌ | ❌ | ⚡ | ❌ | ❌ |
| Streak freeze | ✅ | ⚡ | ❌ | ✅ | ⚡ | ✅ | N/A |
| Level-up celebrations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚡ |

### Progress & Stats

| Feature | Duolingo | Memrise | Babbel | Busuu | Mondly | Drops | **TeluguTutor** |
|---------|----------|---------|--------|-------|--------|-------|-----------------|
| Overall progress bar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Per-module progress | ✅ | ✅ | ✅ | ✅ | ✅ | ⚡ | ✅ |
| Words learned count | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Time practiced | ✅ | ✅ | ⚡ | ✅ | ✅ | ✅ | ✅ |
| Accuracy stats | ✅ | ✅ | ⚡ | ⚡ | ⚡ | ⚡ | ❌ |
| Weak words review | ✅ | ✅ | ⚡ | ⚡ | ⚡ | ⚡ | ❌ |
| Learning history | ✅ | ✅ | ✅ | ✅ | ⚡ | ⚡ | ❌ |

### Social Features

| Feature | Duolingo | Memrise | Babbel | Busuu | Mondly | Drops | **TeluguTutor** |
|---------|----------|---------|--------|-------|--------|-------|-----------------|
| Friend connections | ✅ | ✅ | ❌ | ✅ | ⚡ | ❌ | ❌ |
| Native speaker feedback | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Forum/community | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Share progress | ✅ | ⚡ | ⚡ | ✅ | ⚡ | ⚡ | ❌ |

### UX Features

| Feature | Duolingo | Memrise | Babbel | Busuu | Mondly | Drops | **TeluguTutor** |
|---------|----------|---------|--------|-------|--------|-------|-----------------|
| Onboarding flow | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Dark mode | ✅ | ✅ | ⚡ | ⚡ | ✅ | ✅ | ✅ |
| Offline mode | ✅🔒 | ✅🔒 | ✅ | ✅🔒 | ✅🔒 | ✅🔒 | ✅ (local) |
| Customizable goals | ✅ | ✅ | ⚡ | ✅ | ✅ | ✅ | ❌ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Session length control | ⚡ | ⚡ | ⚡ | ⚡ | ⚡ | ✅ | ❌ |

---

## Gap Analysis: TeluguTutor

### Critical Gaps (No Implementation)

| Gap | Impact | Effort | Priority |
|-----|--------|--------|----------|
| **Streaks** | High retention | Low | Must |
| **Daily goals** | Habit formation | Low | Must |
| **Spaced repetition** | Learning effectiveness | Medium | Must |
| **Onboarding flow** | First-time UX | Low | Must |
| **Achievements** | Motivation | Medium | Should |

### Partial Gaps (Needs Improvement)

| Gap | Current State | Improvement Needed |
|-----|---------------|-------------------|
| Structured lessons | Puzzle-based only | Add lesson scaffolding |
| Adaptive difficulty | Basic confidence tracking | Implement proper SRS algorithm |
| Level-up celebrations | Minimal feedback | Add animations, confetti |
| Typing exercises | Transliteration only | Add full grapheme typing |

---

## Prioritized Feature Backlog

### Tier 1: Must Have (Sprint 1-2)

| Feature | Description | Effort | Justification |
|---------|-------------|--------|---------------|
| **Streak system** | Track consecutive days practiced | 3-5 days | Universal retention driver; all 6 competitors have it |
| **Daily goal widget** | "Practice X minutes today" with progress | 2-3 days | Low effort, high engagement impact |
| **Simple onboarding** | 3-screen intro: welcome, goal, first lesson | 2-3 days | Reduces drop-off, sets expectations |
| **Celebration animations** | Confetti/feedback on module completion | 1-2 days | Emotional reward, all competitors excel here |

**Sprint 1 Total**: ~10-13 days

### Tier 2: Should Have (Sprint 2-3)

| Feature | Description | Effort | Justification |
|---------|-------------|--------|---------------|
| **Spaced repetition (basic)** | Review weak graphemes periodically | 5-7 days | Core to effective learning; Memrise's key differentiator |
| **Achievement badges** | 10-15 unlockable badges | 3-5 days | Motivation loops; Duolingo has 100+ but we start small |
| **Accuracy tracking** | Per-grapheme accuracy percentage | 2-3 days | Informs SRS; shows mastery depth |
| **Weak items review** | "Practice mistakes" button | 2-3 days | Addresses learning gaps directly |

**Sprint 2-3 Total**: ~12-18 days

### Tier 3: Nice to Have (Future)

| Feature | Description | Effort | Justification |
|---------|-------------|--------|---------------|
| Session length picker | "5 min / 10 min / 15 min" toggle | 1-2 days | Drops' core feature; good for busy users |
| Image-grapheme association | Visual mnemonics per character | 5-7 days | Requires asset creation; high retention value |
| Listening exercises | Audio pronunciation matching | 7-10 days | Requires audio files; important for language learning |
| Share progress | "Share to Twitter/WhatsApp" button | 1-2 days | Social proof; depends on user base |
| Friend leaderboard | Compare with connected friends | 5-7 days | Requires user auth first |

---

## Implementation Constraints

Per project documentation:

### Technical Constraints

| Constraint | Source | Impact on Features |
|------------|--------|-------------------|
| Frontend-only | `always-on.md` | No push notifications, server-side SRS |
| No backend | `always-on.md` | All data in localStorage; no sync |
| No user auth (yet) | `REFACTOR_NEXT_STEPS.md` | No leaderboards, friend features until auth added |
| Theme variables only | `theme-system.md` | All UI must use `bg-*`, `text-*` semantic classes |

### Design Constraints

| Constraint | Source | Impact on Features |
|------------|--------|-------------------|
| shadcn/ui components | `always-on.md` | Use existing component library |
| Tailwind CSS | `always-on.md` | No custom CSS where Tailwind suffices |
| No hardcoded colors | `theme-system.md` | Semantic colors only (green/red for feedback OK per F-TG-013) |

---

## Suggested KPIs

### Engagement Metrics

| KPI | Definition | Target | Measurement |
|-----|------------|--------|-------------|
| **DAU** | Daily Active Users | Track baseline first | localStorage visit tracking |
| **Session length** | Average time per session | 5-10 minutes | Track session start/end |
| **Sessions per user per week** | Weekly engagement depth | 3+ sessions | localStorage analytics |
| **Streak length** | Average consecutive days | 3+ days | After streak feature ships |

### Learning Metrics

| KPI | Definition | Target | Measurement |
|-----|------------|--------|-------------|
| **Lesson completion rate** | % of started lessons finished | 80%+ | Track lesson start/complete |
| **Module completion rate** | % of users completing a module | 50%+ | Track per module |
| **First lesson completion** | % of new users finishing lesson 1 | 90%+ | Critical for retention |
| **Accuracy rate** | % of correct answers | 70-85% (learning range) | Per grapheme tracking |

### Retention Metrics

| KPI | Definition | Target | Measurement |
|-----|------------|--------|-------------|
| **Day 1 retention** | % returning next day | 40%+ | Visit timestamp tracking |
| **Day 7 retention** | % returning after 1 week | 20%+ | Visit timestamp tracking |
| **Day 30 retention** | % returning after 1 month | 10%+ | Visit timestamp tracking |

### Implementation Note

All metrics can be tracked client-side with localStorage. Structure:

```javascript
// src/data/analytics.js (proposed)
const analytics = {
  sessions: [{ start: timestamp, end: timestamp, lessons: [] }],
  streaks: { current: 0, longest: 0, lastPractice: date },
  accuracy: { grapheme_id: { correct: 0, attempts: 0 } },
  retention: { firstVisit: date, visits: [dates] }
};
```

---

## Feature Spec Templates

When implementing features from this backlog, create specs in `docs/specs/functional/`:

### Streak System Spec (Example)

```markdown
# Streak System Spec

## Description
Track consecutive days of practice to encourage daily engagement.

## Requirements
### Functional
- Display current streak count on Home page
- Increment streak if practiced today (any completed exercise)
- Reset streak if day missed (no practice yesterday)
- Persist streak data in localStorage

### Non-Functional
- Streak calculation runs on app load
- Visual: flame icon + number (theme-compliant)
- Celebration animation at milestones (7, 30, 100 days)

## Data Model
```javascript
{
  streak: {
    current: number,
    longest: number,
    lastPracticeDate: string // ISO date
  }
}
```

## Components
- `StreakBadge.jsx` - Display component
- Update `Home.jsx` - Integrate badge

## Testing Strategy
- Unit: Streak calculation logic
- E2E: Practice → check streak incremented
```

---

## Next Actions

1. **Assign owner** for R-002 and R-003 research
2. **Complete competitor analysis** (by Dec 3)
3. **Create functional specs** for Tier 1 features
4. **Estimate Sprint 1** scope with team

---

## References

- Project context: `docs/specs/context/always-on.md`
- Theme rules: `docs/specs/technical/ui-standards/theme-system.md`
- Current roadmap: `docs/guides/REFACTOR_NEXT_STEPS.md`
- Validation: `scripts/validation/validate-theme-compliance.js`
- Research template: `docs/specs/research/README.md`
