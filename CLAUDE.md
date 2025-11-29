# TeluguTutor: AI Framework Navigation

> **For Claude & AI Agents**: Navigate using this file. Start here for context mapping.

---

## Quick Navigation

**Get Started**:
1. Read this file for overview
2. Read `.claude/skills/project-constraints/SKILL.md` - understand locked constraints
3. Read `.claude/skills/duplication-prevention/SKILL.md` - before creating any files
4. Read `.claude/skills/sdd-tac-workflow/SKILL.md` - understand Phase 0-3 workflow

**On Every Task**:
1. **Phase 0** (mandatory): Check `.claude/skills/project-constraints/SKILL.md`
2. **Phase 1** (scout): Read relevant spec in `/docs/specs/`
3. **Phase 2** (plan): Write implementation plan as comments
4. **Phase 3** (build): Implement following existing patterns

---

## Project Overview

**TeluguTutor**: Interactive Telugu language learning through grapheme-based practice.

**Tech**: React 18, Vite, Tailwind CSS, shadcn/ui, React Query, React Router

**Frontend Only**: No backend API (state in React hooks + localStorage)

**Port**: 5175 (LOCKED - never change)

---

## Framework Skills

These skills are ALWAYS-ON guardrails:

| Skill | Purpose | When to Use |
| ----- | ------- | ----------- |
| **project-constraints** | Infrastructure, ports, project boundaries, LOCKED items | Before modifying config files or creating new infrastructure |
| **duplication-prevention** | File registry, search patterns, prevent duplicates | Before creating ANY new file |
| **coding-standards** | JavaScript, React, naming conventions, code patterns | When writing code |
| **security-rules** | Input validation, localStorage safety, XSS prevention | When handling user input or external data |
| **sdd-tac-workflow** | Scout-Plan-Build lifecycle, spec-driven development | On every feature request |

---

## Project Structure

```
TeluguTutor/
├── .claude/                          # AI Framework
│   └── skills/                       # Always-on skills
│       ├── project-constraints/
│       ├── duplication-prevention/
│       ├── coding-standards/
│       ├── security-rules/
│       └── sdd-tac-workflow/
├── src/
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── learning/                 # Learning flow components
│   │   ├── puzzles/                  # Interactive puzzles
│   │   ├── Layout.jsx
│   │   └── ThemeToggle.jsx
│   ├── pages/                        # Page components
│   │   ├── Home.jsx
│   │   ├── Learn.jsx
│   │   ├── MicroPractice.jsx
│   │   └── Progress.jsx
│   ├── hooks/                        # Custom React hooks
│   ├── services/                     # API/data services
│   ├── entities/                     # Domain models
│   ├── utils/                        # Utilities (cn.js, etc)
│   ├── data/                         # Static data
│   │   └── teluguGraphemes.js
│   ├── api/                          # API clients
│   ├── index.css                     # Global styles
│   └── main.jsx                      # Entry point
├── docs/
│   └── specs/                        # Feature specifications (if added)
│       └── context/
│           └── always-on.md
├── tests/                            # E2E tests (Playwright)
├── vite.config.js                    # 🔒 LOCKED - port 5175
├── tailwind.config.js                # Theme configuration
├── package.json                      # 🔒 Scripts locked
└── playwright.config.cjs             # Test configuration
```

---

## LOCKED Infrastructure

**NEVER CHANGE**:

1. **Port 5175**: Vite dev server (see `vite.config.js`)
   ```javascript
   server: { port: 5175 }
   ```

2. **Package Scripts**: (see `package.json`)
   - `npm run dev` - Start dev server
   - `npm run build` - Production build
   - `npm run test` - Run Playwright tests

3. **Frontend Stack**: React 18 + Vite + Tailwind CSS + shadcn/ui
   - Don't replace framework
   - Don't remove core dependencies
   - Don't add backend server

---

## Key Patterns

### Components

```javascript
// src/components/learning/MyComponent.jsx
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';

export function MyComponent({ prop1, onAction }) {
  const [state, setState] = useState(false);
  
  return (
    <div className={cn('flex gap-4', className)}>
      {/* Content */}
    </div>
  );
}
```

### Hooks

```javascript
// src/hooks/useMyLogic.js
import { useState, useEffect } from 'react';

export function useMyLogic(dependency) {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Logic
  }, [dependency]);
  
  return { state, setState };
}
```

### Styling

```javascript
// Always use Tailwind CSS + cn() utility
className={cn(
  'base classes',
  variant === 'primary' && 'primary-classes',
  customClass
)}
```

---

## Essential Files Reference

| File | Purpose | When to Access |
| ---- | ------- | -------------- |
| `.claude/skills/project-constraints/SKILL.md` | Understand LOCKED items and file registry | Before modifying config or creating files |
| `.claude/skills/duplication-prevention/SKILL.md` | Check before creating new files | Before ANY file creation |
| `.claude/skills/coding-standards/SKILL.md` | Code quality and naming conventions | While writing code |
| `.claude/skills/security-rules/SKILL.md` | Input validation and security best practices | When handling user input |
| `.claude/skills/sdd-tac-workflow/SKILL.md` | Feature implementation workflow | On feature requests |
| `docs/specs/context/always-on.md` | Minimal essential context | When restarting context |
| `src/data/teluguGraphemes.js` | All grapheme data | When working with graphemes |
| `src/index.css` | Global styles and theme tokens | When styling |

---

## Workflow Summary

### For Every Feature Request:

1. **Phase 0: Constraint Check** (2-5 min)
   - Read `.claude/skills/project-constraints/SKILL.md`
   - Check for LOCKED constraints violations
   - Read `.claude/skills/duplication-prevention/SKILL.md`
   - Search for existing implementations

2. **Phase 1: Scout** (5-10 min)
   - Read feature spec (if exists in `/docs/specs/`)
   - Find similar examples in codebase
   - Understand existing patterns

3. **Phase 2: Plan** (5-10 min)
   - Write implementation plan as comments
   - Identify affected files
   - List test scenarios

4. **Phase 3: Build** (30-60 min)
   - Implement following existing patterns
   - Add tests
   - Add documentation

---

## Quick Commands Reference

```bash
# Development
npm run dev          # Start Vite on port 5175

# Testing
npm run test         # Run Playwright tests

# Linting
npm run lint         # Check code quality

# Building
npm run build        # Production build
npm run preview      # Preview build

# Git
git commit -am "fix: [description]"
git push
```

---

## When You're Stuck

1. **File doesn't exist**: Run search in `.claude/skills/duplication-prevention/SKILL.md`
2. **Port conflicts**: Check `.claude/skills/project-constraints/SKILL.md`
3. **Code style questions**: See `.claude/skills/coding-standards/SKILL.md`
4. **Security concerns**: Review `.claude/skills/security-rules/SKILL.md`
5. **Feature implementation**: Follow `.claude/skills/sdd-tac-workflow/SKILL.md`

---

## Documentation Requests

**To create/update specs**: Follow format in `.claude/skills/sdd-tac-workflow/SKILL.md`

**To create prime commands**: Document patterns that appear in multiple files

---

## Related Resources

- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **shadcn/ui**: https://ui.shadcn.com/
- **Playwright**: https://playwright.dev/

---

## Quick Checklist Before Committing

- [ ] Phase 0 completed (constraints verified)
- [ ] No LOCKED infrastructure changed
- [ ] Follows existing code patterns
- [ ] Tests pass (`npm run test`)
- [ ] No console errors/warnings
- [ ] Documentation updated
- [ ] Spec (if exists) still accurate

---

**Last Updated**: 2025-11-29
**Framework**: SDD-TAC (Spec-Driven Development + Tactical Agentic Coding)
