---
id: R-003
title: Market Features & ROI Analysis
status: active
priority: high
last_updated: 2025-11-30
last_verified: 2025-11-30
---

# Market Features & ROI Analysis

## Description

Feature inventory and prioritization based on competitive analysis of leading language-learning apps. Informs TeluguTutor's product backlog with actionable, incremental improvements.

## Objectives

1. Catalog features across competitors
2. Identify gaps in TeluguTutor's current offering
3. Prioritize features for 2–3 week sprint cycles
4. Define KPIs to measure feature success

---

## Current Implementation Summary

*Verified against codebase on 2025-11-30*

### ✅ Already Implemented
- **Stars/Points System** - Tracked in `user_profiles.total_stars`
- **Module/Skill Tree** - 6 modules: Achchulu, Hallulu, Gunintalu, Hachchulu, Vattulu, Words
- **Puzzle Types** - GraphemeMatch, TransliterationChallenge, DecomposeRebuild
- **Adaptive Practice** - `needs_adaptive_practice` flag + `MicroPractice.jsx` for struggling graphemes
- **Confidence Tracking** - Per-grapheme scores (0-100) with mastery levels
- **Celebration Animations** - Full confetti, stars, emoji bursts in `Celebration.jsx`
- **Sound Effects** - Success/error sounds via Web Audio API (`sounds.js`)
- **Progress Stats** - Mastered count, accuracy %, practice time, per-grapheme details
- **Dark Mode** - Theme toggle with `ThemeContext`
- **Authentication** - Supabase-based user accounts

### ⚡ Partial/Ready for Enhancement
- **Badges** - DB schema exists (`badges_earned` JSON array), no UI or awarding logic
- **Review Mode** - Adaptive practice targets struggles, but no SRS scheduling

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
| Streaks | ✅ | ✅ | ⚡ | ✅ | ✅ | ✅ | ❌ (No daily streaks) |
| XP/Points | ✅ | ✅ | ❌ | ⚡ | ✅ | ❌ | ✅ (Stars) |
| Daily goals | ✅ | ✅ | ⚡ | ✅ | ✅ | ✅ | ❌ |
| Achievements/badges | ✅ | ✅ | ⚡ | ✅ | ✅ | ⚡ | ⚡ (Data model) |
| Leaderboards | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Hearts/lives | ✅ | ❌ | ❌ | ❌ | ⚡ | ❌ | ❌ |
| Streak freeze | ✅ | ⚡ | ❌ | ✅ | ⚡ | ✅ | N/A |
| Level-up celebrations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (Confetti, stars) |

### Progress & Stats

| Feature | Duolingo | Memrise | Babbel | Busuu | Mondly | Drops | **TeluguTutor** |
|---------|----------|---------|--------|-------|--------|-------|-----------------|
| Overall progress bar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Per-module progress | ✅ | ✅ | ✅ | ✅ | ✅ | ⚡ | ✅ |
| Words learned count | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Time practiced | ✅ | ✅ | ⚡ | ✅ | ✅ | ✅ | ✅ |
| Accuracy stats | ✅ | ✅ | ⚡ | ⚡ | ⚡ | ⚡ | ⚡ (Per-grapheme) |
| Weak words review | ✅ | ✅ | ⚡ | ⚡ | ⚡ | ⚡ | ✅ (Adaptive Practice) |
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
| Offline mode | ✅🔒 | ✅🔒 | ✅ | ✅🔒 | ✅🔒 | ✅🔒 | ❌ (Online-first) |
| Customizable goals | ✅ | ✅ | ⚡ | ✅ | ✅ | ✅ | ❌ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Session length control | ⚡ | ⚡ | ⚡ | ⚡ | ⚡ | ✅ | ❌ |

---

## Gap Analysis: TeluguTutor

### Critical Gaps (No Implementation)

| Gap | Impact | Effort | Priority |
|-----|--------|--------|----------|
| **Daily Usage Streaks** | High retention | Low | Must |
| **Daily goals** | Habit formation | Low | Must |
| **Spaced repetition** | Learning effectiveness | Medium | Must |
| **Onboarding flow** | First-time UX | Low | Must |
| **Listening exercises** | Language immersion | High | Should |

### Partial Gaps (Needs Improvement)

| Gap | Current State | Improvement Needed |
|-----|---------------|-------------------|
| **Achievements/Badges** | Data model exists (`badges_earned` in DB) | Build UI to display and award badges |
| Structured lessons | Puzzle-based only | Add lesson scaffolding with explanations |
| Adaptive difficulty | Struggle-based targeting | Implement proper SRS algorithm with review scheduling |
| Sound effects | UI feedback sounds only | Add Telugu pronunciation audio files |
| Typing exercises | Multiple choice only | Add keyboard input for grapheme typing |

---

## ROI-Based Feature Roadmap

Features are prioritized by **ROI Score** = (Impact × Urgency) / Effort.

### 🚨 Tier 1: High ROI (Immediate Wins)
*Low Effort, High Impact. Focus on Retention.*

| Rank | Feature | ROI Score | Effort | Impact | Description |
|------|---------|-----------|--------|--------|-------------|
| 1 | **Daily Streak System** | **9.5** | Low (2d) | Critical | Track consecutive days practiced. **#1 Retention Driver.** Needs DB schema update for `current_streak`, `longest_streak`, `last_practice_date` in `user_profiles`. |
| 2 | **Onboarding Flow** | **9.0** | Low (3d) | Critical | 3-screen welcome: Goal setting -> First win. Reduces bounce rate. |
| 3 | **Daily Goal Widget**| **8.5** | Low (2d) | High | Visual progress bar for daily practice (e.g., "10 mins/day"). |
| 4 | **Session Summary** | **8.0** | Low (2d) | High | "End of session" screen with stats (Stars earned, Accuracy). |

### 🛠️ Tier 2: Strategic Value (Next Sprint)
*Medium Effort, High Impact. Focus on Learning Quality.*

| Rank | Feature | ROI Score | Effort | Impact | Description |
|------|---------|-----------|--------|--------|-------------|
| 5 | **Spaced Repetition**| **7.5** | Med (5d) | High | Implement SM-2 or Leitner system. Currently have struggle-based adaptive practice - needs review scheduling based on `last_practiced` timestamps. |
| 6 | **Achievement UI** | **6.5** | Med (3d) | Med | Visual UI for `badges_earned` (DB field exists, no UI yet). Define badge criteria and display. |
| 7 | **Learning History** | **6.0** | Med (3d) | Med | Timeline view of practice sessions from `practice_sessions` table. |

### 🔮 Tier 3: Long-Term Bets
*High Effort or Lower Immediate Impact.*

| Rank | Feature | ROI Score | Effort | Impact | Description |
|------|---------|-----------|--------|--------|-------------|
| 8 | **Audio Support** | **6.0** | High | High | Native pronunciation audio. High asset cost. |
| 9 | **Leaderboards** | **5.5** | Med | Med | Weekly friend/global rankings. Needs critical mass of users. |
| 10 | **Social Sharing** | **4.0** | Low | Low | "Share my streak" images. |

---

## Implementation Constraints

Per project documentation:

### Technical Constraints

| Constraint | Source | Impact on Features |
|------------|--------|-------------------|
| Frontend-only | `always-on.md` | No push notifications, server-side SRS |
| **Backend** | ✅ **Unlocked** | We CAN do server-side validation, leaderboards, and cross-device sync. |
| **Auth** | ✅ **Unlocked** | We CAN track individual user progress and streaks securely. |
| **Database** | ✅ **Unlocked** | We use PostgreSQL. Complex queries (e.g., "Top 10 users") are now easy. |
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
| **DAU** | Daily Active Users | Track baseline first | DB login tracking |
| **Session length** | Average time per session | 5-10 minutes | Track session start/end |
| **Sessions per user per week** | Weekly engagement depth | 3+ sessions | DB analytics |
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
- Persist streak data in Database

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
