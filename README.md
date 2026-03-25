# Model Benchmark

A clean, mobile-first **Next.js + TypeScript + shadcn/ui** dashboard for managing and running AI model test instances.

## ⚡ New Agent Quick Start

1. Read `.claude/CLAUDE.md` in full (rules are mandatory)
2. Scan `/docs/architecture/overview.md` + `/docs/progress/progress-report.md`
3. Do a quick repo audit (structure, key flows, gaps)
4. Plan BEFORE coding (small, safe iteration)
5. After changes → update docs + log progress

👉 Rule: If it's not documented, it's not complete.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui (base-nova)
- Postgres (Neon in production, Docker locally)

## Current Scope

- Instances page header + CTA
- Summary stats row (total / running / tested / failed)
- Filter/control bar (search, status, model, agent type, sort)
- Responsive instance card gallery
- Create / Edit / Delete instance dialogs
- Results detail dialog (per-test scores, duration, tokens)
- Manual run flow: Start/Rerun executes locked test packs with mock sequential execution, scoring, and live status updates
- Full persistence via Postgres API routes

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
  api/
    instances/
      route.ts
      [id]/route.ts
components/
  instances/
    create-instance-dialog.tsx
    instance-card.tsx
    instance-filters.tsx
    instance-results-dialog.tsx
  ui/
lib/
  api.ts
  db.ts
  mock-instances.ts
  types.ts
  test-packs.ts
  mock-model-runner.ts
  scoring.ts
  run-instance.ts
scripts/
  seed.ts
```

## Run Locally

```bash
# 1. Start local Postgres
docker compose up -d

# 2. Configure env
cp .env.example .env.local
# Set DATABASE_URL to: postgresql://postgres:postgres@localhost:5432/benchmark

# 3. Install deps and seed DB
npm install
npm run seed

# 4. Start dev server
npm run dev
```

Open: http://localhost:3000

## Quality Checks

```bash
npm run lint
npm run build
```

## Deploy (Vercel + Neon)

1. Create a [Neon](https://neon.tech) free project
2. Copy the connection string into Vercel env as `DATABASE_URL`
3. Push to GitHub → connect to Vercel → deploy
4. Run `npm run seed` once against the Neon DB to initialize the table

## Notes

This file is intentionally short and practical. Updated continuously as the project evolves.
