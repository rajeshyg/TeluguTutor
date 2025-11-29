---
id: R-002
title: Market Quality Research
status: in-progress
priority: medium
created: 2025-11-29
owner: TBD
timeline:
  initial_findings: 2025-12-01
  full_report: 2025-12-04
---

# Market Quality Research

## Description

Competitive product research analyzing leading general language-learning apps to inform TeluguTutor's feature roadmap and UX improvements. This research focuses on quality benchmarks, not Telugu-specific implementations.

## Objectives

1. Benchmark TeluguTutor's UX against industry leaders
2. Identify quality gaps in learning progression, gamification, and accessibility
3. Document best practices for retention and engagement
4. Provide actionable recommendations scoped for 2–3 week sprints

## Competitors to Analyze

| App | Focus | Key Strength | Platform |
|-----|-------|--------------|----------|
| **Duolingo** | Gamified courses | Gamification, streaks | Mobile + Web |
| **Memrise** | Vocabulary & SRS | Spaced repetition, video | Mobile + Web |
| **Babbel** | Conversational | Structured courses | Mobile + Web |
| **Busuu** | Community-driven | Social feedback | Mobile + Web |
| **Mondly** | AR/VR integration | Interactive tech | Mobile + Web |
| **Drops** | Visual vocab | 5-min sessions, design | Mobile + Web |

---

## Evaluation Criteria

### 1. Learning Progression Design

| Metric | What to Evaluate |
|--------|------------------|
| Lesson structure | Module length, pacing, review cycles |
| Skill trees | Branching vs linear, prerequisites |
| Difficulty curve | How quickly complexity ramps up |
| Mastery gates | What unlocks next content |
| Review integration | When/how review is triggered |

**TeluguTutor Context**: Current modules (Achchulu, Hallulu, Gunintalu) are linear. Evaluate if branching or unlockable paths improve engagement.

### 2. Gamification Effectiveness

| Element | What to Evaluate |
|---------|------------------|
| Streaks | Duration tracking, recovery mechanics |
| XP/Points | Earning rate, spending options |
| Badges/Achievements | Variety, difficulty, display |
| Leaderboards | Scope (friends, global, leagues) |
| Rewards | Daily goals, bonus content, cosmetics |
| Progress bars | Module, lesson, session level |

**TeluguTutor Context**: Currently has Stars (216 earned in test), Minutes Practiced, Letters Mastered. Evaluate if streaks and achievements increase retention.

### 3. UI/UX Patterns

| Pattern | What to Evaluate |
|---------|------------------|
| Onboarding | Steps to first lesson, personalization |
| Navigation | Tab structure, breadcrumbs, back flows |
| Microcopy | Button labels, encouragement, error messages |
| Visual hierarchy | Font sizes, spacing, color usage |
| Animations | Feedback animations, transitions |
| Empty states | What shows when no data exists |

**TeluguTutor Constraints**: 
- Must use theme variables (no hardcoded colors per `theme-system.md`)
- shadcn/ui component library
- Tailwind CSS utilities only

### 4. Accessibility Standards

| Check | WCAG 2.1 Reference |
|-------|-------------------|
| Color contrast | AA: 4.5:1 text, 3:1 UI elements |
| Focus indicators | Visible keyboard focus states |
| Screen reader labels | aria-labels on interactive elements |
| Touch targets | Minimum 44x44px |
| Text scaling | Content readable at 200% zoom |
| Reduced motion | Respects prefers-reduced-motion |

**TeluguTutor Context**: No current accessibility audit. This research establishes baseline requirements.

### 5. Assessment Methods

| Method | What to Evaluate |
|--------|------------------|
| Exercise types | Multiple choice, typing, matching, audio |
| Error feedback | Immediate vs delayed, explanation depth |
| Scoring | Binary vs partial credit |
| Hints | Availability, cost, helpfulness |
| Retry mechanics | Unlimited vs limited attempts |

**TeluguTutor Context**: Current puzzles (GraphemeMatch, DecomposeRebuild, TransliterationChallenge) need comparison.

### 6. Content Types

| Type | What to Evaluate |
|------|------------------|
| Text | Static content, dynamic tips |
| Audio | Pronunciation, listening exercises |
| Images | Character visuals, mnemonics |
| Video | Lessons, cultural content |
| Interactive | Drag-drop, tap sequences |

**TeluguTutor Constraints**: Frontend-only (no backend per `always-on.md`). Audio/video must be static assets or external links.

### 7. Onboarding Flow

| Stage | What to Evaluate |
|-------|------------------|
| Goal setting | Learning motivation, time commitment |
| Level assessment | Placement test presence |
| Personalization | Native language, interests |
| First lesson | Time to value, complexity |
| Account creation | Timing (before/after first lesson) |

**TeluguTutor Context**: Currently no onboarding — direct to Home page. Research should recommend minimal viable onboarding.

### 8. Retention Hooks

| Hook | What to Evaluate |
|------|------------------|
| Notifications | Push timing, content, opt-out |
| Daily goals | Customizable, achievable |
| Streak protection | Freeze mechanics, cost |
| Social features | Leaderboards, friend challenges |
| Progress reminders | Email/in-app summary |

**TeluguTutor Constraints**: Frontend-only — no push notifications. Focus on in-app retention hooks.

---

## Methodology

### Sample Screens to Capture

For each competitor, capture and annotate:

1. **Onboarding sequence** (3-5 screens)
2. **Home/Dashboard** (logged in state)
3. **Lesson list/skill tree view**
4. **Active lesson** (mid-exercise)
5. **Feedback screen** (correct + incorrect)
6. **Progress/stats page**
7. **Settings/accessibility options**

### Flow Analysis

Document user flows for:

| Flow | Steps to Document |
|------|-------------------|
| First-time user → first lesson complete | Screen count, time estimate |
| Return user → resume learning | Tap count, friction points |
| User completes module | Celebration, next steps |
| User makes mistake | Error handling, recovery |

### Device Sizes

Test on:

| Device | Viewport |
|--------|----------|
| Mobile (primary) | 375x812 (iPhone X) |
| Tablet | 768x1024 (iPad) |
| Desktop | 1440x900 (Laptop) |

**TeluguTutor Note**: Current implementation is responsive but not mobile-optimized. Findings should inform mobile-first improvements.

### Accessibility Quick Checks

For sampled screens, run:

1. **Chrome DevTools Lighthouse** - Accessibility audit
2. **Color Contrast Analyzer** - Manual spot checks
3. **Keyboard navigation** - Tab through all interactive elements
4. **VoiceOver/TalkBack** - Screen reader test (mobile)

---

## Findings Template

For each competitor, document:

```markdown
## [App Name]

### Learning Progression
- Structure: [Linear/Branching/Adaptive]
- Lesson length: [X minutes average]
- Review trigger: [After N lessons / SRS-based / Manual]
- Notable: [Standout feature]

### Gamification
- Streak: [Yes/No] - [Details]
- XP system: [Yes/No] - [How earned/spent]
- Achievements: [Count] categories
- Leaderboards: [Scope]
- Notable: [Standout feature]

### UI/UX
- Onboarding: [X screens to first lesson]
- Navigation: [Tab/Drawer/Other]
- Design system: [Observations]
- Notable microcopy: "[Example]"

### Accessibility
- Contrast: [Pass/Fail on sampled screens]
- Focus states: [Visible/Hidden]
- Touch targets: [Adequate/Small]
- Notable: [Good/bad examples]

### Assessment
- Exercise types: [List]
- Error feedback: [Immediate/Delayed] + [Explanation quality]
- Hints: [Available/Cost]

### Screenshots
- [Link or embed key screenshots]
```

---

## Deliverables

| Deliverable | Due Date | Status |
|-------------|----------|--------|
| Initial findings memo | Dec 1, 2025 | Not started |
| Competitor analysis (all 6) | Dec 3, 2025 | Not started |
| Quality gap analysis | Dec 4, 2025 | Not started |
| Recommendations for TeluguTutor | Dec 4, 2025 | Not started |

---

## Constraints Reminder

Per project documentation:

1. **Theme compliance**: All UI suggestions must use theme variables (see `docs/specs/technical/ui-standards/theme-system.md`)
2. **No backend**: Frontend-only React SPA (see `docs/specs/context/always-on.md`)
3. **Simplicity principle**: Avoid large architectural changes, prefer incremental experiments
4. **Validation**: Run `validate-theme-compliance.js` before implementing any UI changes
5. **Sprint scope**: Recommendations should be achievable in 2–3 weeks

---

## References

- Project context: `docs/specs/context/always-on.md`
- Theme rules: `docs/specs/technical/ui-standards/theme-system.md`
- Current roadmap: `docs/guides/REFACTOR_NEXT_STEPS.md`
- Validation: `scripts/validation/validate-theme-compliance.js`
