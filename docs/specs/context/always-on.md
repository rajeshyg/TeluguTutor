# Essential Context (Always Loaded)

> **For AI Agents**: This file contains minimal essentials. Load additional context on-demand via prime commands and skills.

---

## Tech Stack

React 18, JavaScript (no TypeScript currently), Vite, Tailwind CSS, shadcn/ui, React Query, React Router, Playwright

## Project Purpose

**Telugu Tutor**: Interactive learning platform for Telugu language using grapheme-based (Base44) practice exercises.

**Key Features**:
- Interactive puzzle challenges (Decompose/Rebuild, Grapheme Match, Transliteration)
- Adaptive practice with confidence tracking
- Progress visualization
- Micro-practice sessions

## Role-Based Access

**No authentication yet** - Single user experience

Future: Plan for admin features to manage grapheme data and view analytics

## File Structure

- Components: `src/components/` | Pages: `src/pages/` | Hooks: `src/hooks/`
- Data: `src/data/` | Entities: `src/entities/` | Utils: `src/utils/`
- Styling: Tailwind CSS, `src/index.css`
- Skills: `.claude/skills/` | Commands: `.claude/commands/` (if added)
- Specs: `docs/specs/` (if added)
- Tests: `tests/` (E2E with Playwright)

## Critical Rules

1. **No Backend**: This is frontend-only (React SPA)
2. **Port**: Vite runs on **5174** (LOCKED)
3. **State**: Use React hooks + React Query for data
4. **Styling**: Tailwind CSS + shadcn/ui only
5. **Data**: Grapheme data in `src/data/teluguGraphemes.js`
6. **Validation**: Input validation before use
7. **Errors**: Handle gracefully, show user-friendly messages

## Reference Implementations

- **Components**: `src/components/ui/` (shadcn/ui), `src/components/learning/`, `src/components/puzzles/`
- **Hooks**: `src/hooks/` (custom React hooks)
- **Data**: `src/data/teluguGraphemes.js` (grapheme database)
- **Entities**: `src/entities/` (domain models)
- **Styling**: Tailwind CSS classes throughout

## Key Constraints

- Frontend-only (no backend API calls planned initially)
- No authentication required
- No database (localStorage for preferences)
- Vite + React 18 cannot be changed
- Must maintain Tailwind CSS + shadcn/ui pattern

## Skills & Commands

**Skills** (always check first):

- `project-constraints/` - LOCKED infrastructure (port 5174, framework)
- `duplication-prevention/` - Search before creating files
- `coding-standards/` - JavaScript/React patterns
- `security-rules/` - Input validation, localStorage safety
- `sdd-tac-workflow/` - Phase 0-1-2-3 (Constraint-Scout-Plan-Build)

**Prime Commands** (load on-demand):

- `/prime-ui` - shadcn/ui component patterns (if created)
- `/prime-learning-domain` - Telugu learning domain (if created)

**Business Domain**:

- See `docs/specs/` for feature specifications (if created)
- Grapheme data organized in `src/data/`
