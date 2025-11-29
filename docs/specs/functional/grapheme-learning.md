---
title: Grapheme Learning Functional Spec
created: 2025-11-29
status: draft
version: 1.0
---

# Grapheme Learning Spec

## Description

The grapheme learning feature is the core educational component of TeluguTutor. It enables users to learn Telugu characters (graphemes) through interactive puzzles that reinforce visual recognition, phonetic association, and character composition. The learning flow progresses through modules of increasing difficulty, presenting graphemes in a structured sequence while adapting puzzle types to the complexity of each character.

### Purpose
- Teach Telugu script systematically through modules (achchulu, hallulu, gunintalu, hachchulu)
- Reinforce learning through varied puzzle types
- Track mastery at the individual grapheme level
- Provide immediate feedback to support learning retention

## Requirements

### Functional

#### Module System
- **F-GL-001**: System SHALL organize graphemes into learning modules:
  - `achchulu` (vowels) - 15 graphemes, difficulty 1-2
  - `hallulu` (consonants) - 36 graphemes, difficulty 1-3  
  - `gunintalu` (vowel signs) - 14 graphemes, difficulty 1-2
  - `hachchulu` (consonant+vowel forms) - multi-component, difficulty 1-2

- **F-GL-002**: Users SHALL be able to select a module from URL parameter (`?module=hallulu`)

- **F-GL-003**: Graphemes within a module SHALL be sorted by difficulty (ascending)

#### Grapheme Display
- **F-GL-004**: Each grapheme SHALL display:
  - Telugu glyph (using 'Noto Sans Telugu' font)
  - Transliteration (IAST romanization, e.g., 'kā', 'ṭa')
  - Simplified transliteration when available
  - Difficulty level (1-5)

- **F-GL-005**: System SHALL support grapheme properties:
  - `id`: unique identifier (v1, c1, gs1, h1, etc.)
  - `glyph`: Telugu character or cluster
  - `type`: vowel | consonant | sign | gunintam
  - `module`: learning module name
  - `difficulty`: 1-5 scale
  - `components`: array of component characters
  - `transliteration`: IAST romanization
  - `confusable_with`: IDs of similar graphemes (optional)

#### Puzzle Types
- **F-GL-006**: System SHALL support three puzzle types:
  1. **GraphemeMatch**: Match transliteration sound to Telugu glyph (4 options)
  2. **DecomposeRebuild**: Build a character from component tiles (multi-component only)
  3. **TransliterationChallenge**: Identify the sound of a displayed Telugu character

- **F-GL-007**: Puzzle type selection SHALL be intelligent:
  - GraphemeMatch: available for ALL graphemes
  - DecomposeRebuild: ONLY for graphemes with >1 component
  - TransliterationChallenge: available for ALL graphemes
  - Selection weighted random (60% chance DecomposeRebuild when eligible)

- **F-GL-008**: Each puzzle SHALL:
  - Display clear instructions
  - Show target (transliteration or glyph depending on puzzle)
  - Provide visual feedback on answer (green/red borders, icons)
  - Auto-advance after 1.5-2 seconds post-answer

#### Session Flow
- **F-GL-009**: Learning session SHALL:
  - Start with first grapheme in selected module
  - Progress sequentially through graphemes by difficulty
  - Track response time for each puzzle
  - Award stars for correct answers
  - Display current progress (puzzle index, total)

- **F-GL-010**: Session state SHALL include:
  - Current module
  - Current puzzle index
  - Current grapheme
  - Selected puzzle type
  - Session start timestamp
  - Stars earned
  - Response time per puzzle

### Non-Functional

#### Performance
- **NF-GL-001**: Grapheme data SHALL load within 2 seconds
- **NF-GL-002**: Puzzle transitions SHALL be smooth (<300ms animation)
- **NF-GL-003**: Response time tracking SHALL be accurate to ±50ms

#### User Experience
- **NF-GL-004**: Telugu glyphs SHALL render clearly at 60px+ size
- **NF-GL-005**: Touch targets SHALL be minimum 48x48px for mobile
- **NF-GL-006**: Visual feedback SHALL be obvious (color, icons, motion)
- **NF-GL-007**: Dark mode SHALL be fully supported

#### Accessibility
- **NF-GL-008**: Color coding SHALL not be sole indicator (use icons)
- **NF-GL-009**: Interactive elements SHALL have clear focus states

## Data Model

### TeluguGrapheme Entity
```typescript
interface TeluguGrapheme {
  id: string;                    // Unique ID (v1, c1, etc.)
  glyph: string;                 // Telugu character(s)
  type: 'vowel' | 'consonant' | 'sign' | 'gunintam';
  module: 'achchulu' | 'hallulu' | 'gunintalu' | 'hachchulu';
  difficulty: 1 | 2 | 3 | 4 | 5;
  components: string[];          // Component characters
  transliteration: string;       // IAST (e.g., 'kā')
  transliteration_simple?: string; // ASCII fallback
  examples?: string[];           // Word IDs containing this grapheme
  confusable_with?: string[];    // Similar grapheme IDs
  prerequisite_components?: string[]; // Dependencies
}
```

### Session State
```typescript
interface LearningSession {
  module: string;
  currentPuzzleIndex: number;
  currentGrapheme: TeluguGrapheme | null;
  puzzleType: 'grapheme_match' | 'decompose_rebuild' | 'transliteration';
  sessionStart: number;          // timestamp
  stars: number;
  responseTime: number;          // ms for current puzzle
}
```

## Components

### Page Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `Learn` | `src/pages/Learn.jsx` | Main learning page, orchestrates puzzles |

### Puzzle Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `GraphemeMatch` | `src/components/puzzles/GraphemeMatch.jsx` | Match sound to glyph |
| `DecomposeRebuild` | `src/components/puzzles/DecomposeRebuild.jsx` | Build character from parts |
| `TransliterationChallenge` | `src/components/puzzles/TransliterationChallenge.jsx` | Identify character sound |

### Supporting Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `ConfidenceIndicator` | `src/components/learning/ConfidenceIndicator.jsx` | Display mastery level |

## User Flows

### Primary: Complete a Learning Session
1. User navigates to Learn page (optionally with `?module=` param)
2. System loads graphemes for selected module, sorted by difficulty
3. First grapheme loaded, puzzle type auto-selected
4. User views puzzle prompt (transliteration or glyph)
5. User selects answer from options or builds from components
6. System displays immediate feedback (correct/incorrect)
7. After delay, system advances to next grapheme
8. System records practice session and updates mastery
9. Repeat until module complete

### Secondary: Puzzle Type Variation
- GraphemeMatch: User sees transliteration, taps matching Telugu glyph
- DecomposeRebuild: User sees transliteration, builds character from tiles
- TransliterationChallenge: User sees Telugu glyph, taps matching sound

## Testing Strategy

### Unit Tests
- Grapheme data validation (all required fields present)
- Puzzle type selection logic (DecomposeRebuild only for multi-component)
- Response time calculation accuracy
- Mastery score calculation

### E2E Tests
- Complete learning flow from module selection to completion
- Each puzzle type renders correctly with valid data
- Answer feedback displays correctly (success/failure states)
- Session progress persists across puzzles
- Navigation back to home works

### Test Data
```javascript
// Sample grapheme for testing
const testGrapheme = {
  id: 'h1',
  glyph: 'కా',
  transliteration: 'kā',
  type: 'gunintam',
  module: 'hachchulu',
  difficulty: 1,
  components: ['క', 'ా']
};
```

## Dependencies

- `@tanstack/react-query`: Data fetching and caching
- `framer-motion`: Animations and transitions
- `lucide-react`: Icons (Star, Trophy, ArrowLeft)
- `react-router-dom`: Navigation and URL params

## Open Questions

1. Should pronunciation audio be added to grapheme display?
2. Should wrong answers show the correct answer highlighted before advancing?
3. Should users be able to skip graphemes they already know?

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-29 | Initial draft based on existing implementation |
