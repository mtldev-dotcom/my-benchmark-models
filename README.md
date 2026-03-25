# Instance Page

A clean, mobile-first **Next.js + TypeScript + shadcn/ui** front-end demo for managing AI model test instances.

## ⚡ New Agent Quick Start

1. Read `.claude/CLAUDE.md` بالكامل (rules are mandatory)
2. Scan `/docs/architecture/overview.md` + `/docs/progress/progress-report.md`
3. Do a quick repo audit (structure, key flows, gaps)
4. Plan BEFORE coding (small, safe iteration)
5. After changes → update docs + log progress

👉 Rule: If it's not documented, it's not complete.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Local mock JSON data (no backend)

## Current Scope

- Instances page header + CTA
- Summary stats row
- Filter/control bar
- Responsive instance card gallery
- Create New Test dialog (local state)
- Empty states
- **Manual run flow (phase 1): Start/Rerun executes locked test packs with mock sequential execution, scoring, and live status updates**

## Agent Workflow Core (.claude + docs)

### What `.claude/` is for

`.claude/` is the repo's AI operating layer. It defines behavior, safety, and execution standards for any agent entering this codebase.

- `CLAUDE.md` = core operating rules
- `settings.json` = guardrails/permissions
- `rules/` = domain constraints (frontend/backend)
- `agents/` = role definitions (architect/developer/reviewer)
- `commands/` = repeatable execution playbooks

### What `docs/` is for

`docs/` is the persistent project memory and source of operational truth.

- `architecture/` = system shape and data flow
- `product/` = vision/features/roadmap
- `progress/` = chronological implementation log
- `memory/` = decisions, patterns, known issues

### Mandatory workflow before coding

Any agent must do this before implementation:

1. Read project structure and current docs
2. Review `.claude/CLAUDE.md`
3. Update onboarding context in:
   - `docs/architecture/overview.md`
   - `docs/progress/progress-report.md`
4. Only then begin coding

### Documentation contract after changes

After meaningful code changes, update (when relevant):

- `docs/progress/progress-report.md`
- `docs/architecture/components.md`
- `docs/product/features.md`

If no doc update is needed, explicitly state why in the task/PR summary.

### Workflow Tree (short)

```txt
.claude/
  CLAUDE.md
  settings.json
  rules/
  commands/
  agents/

docs/
  architecture/
  product/
  progress/
  memory/
```

## Project Structure

```txt
app/
  page.tsx
components/
  instances/
    create-instance-dialog.tsx
    instance-card.tsx
    instance-filters.tsx
  ui/
lib/
  mock-instances.ts
  types.ts
  test-packs.ts
  mock-model-runner.ts
  scoring.ts
  run-instance.ts
```

## Run Locally

```bash
cd ~/git-dev/model-testing
npm install
npm run dev
```

Open: http://localhost:3000

## Quality Checks

```bash
npm run lint
```

## UI Principles (current)

- Default shadcn black/white theme
- Mobile-first layouts
- Minimal, production-clean visuals
- Large tap targets and strong spacing
- No branding, no custom colors, no gradients

## Next Iterations (placeholder)

- [ ] Bulk selection/actions behavior
- [ ] Sticky controls on mobile
- [ ] Collapsible advanced filters
- [ ] URL-synced filter state
- [ ] Better card action states/loading

## Notes

This file is intentionally short and practical. We’ll update it continuously as the project evolves.
