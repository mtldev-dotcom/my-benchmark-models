# Model Benchmark

A clean, mobile-first **Next.js + TypeScript + shadcn/ui** dashboard for benchmarking AI model agent runtimes under controlled conditions.

Each test run is an isolated agent cycle: boot → load base context → run prompt → capture evidence (logs, MD diffs, scores) → reset. Results are stored per run in Postgres.

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
- shadcn/ui (base-nova via `@base-ui/react`)
- Postgres (Neon in production, Docker locally)

## What it does now

- **Instances dashboard** — create, edit, delete model test instances
- **Run pipeline** — server-side: trigger → isolated agent cycle → webhook result → evidence stored
- **Run evidence** — per-run logs, MD file diffs (before/after), token counts, scores
- **Run history** — every run is stored; browse and inspect past runs per instance
- **Filters & search** — status, model, agent type, sort; active filter count badge
- **Settings page** — provider API keys + enabled model selection; custom test library
- **Help dialog** — in-app instruction manual

## Run Locally

```bash
# 1. Start local Postgres
docker compose up -d

# 2. Configure env
cp .env.example .env.local
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/benchmark

# 3. Install deps
npm install

# 4. Run all migrations and seeds
npm run seed              # instances table + mock data
npm run migrate           # runs, run_evidence, base_states tables
npm run migrate:settings  # provider_configs, custom_tests tables
npm run seed-base-state   # initial active base state

# 5. Start dev server
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Connect a Real Worker (Phase 3b)

Add to `.env.local`:

```
OPENCLAW_WORKER_URL=http://your-worker-host
```

The worker receives `POST /run` with a test request and calls back `POST /api/runs/[runId]/result` when done. No other code changes needed.

## Quality Checks

```bash
npm run lint
npm run build
```

## Deploy (Vercel + Neon)

1. Create a [Neon](https://neon.tech) free project
2. Copy the connection string into Vercel env as `DATABASE_URL`
3. Push to GitHub → connect to Vercel → deploy
4. Run all four setup scripts once against the Neon DB

## Project Structure

```
app/
  page.tsx                  — instances dashboard (state + polling)
  settings/page.tsx         — providers + test library
  api/
    instances/              — instance CRUD + run trigger + run history
    runs/                   — poll, webhook result, evidence
    base-states/            — base state versioning
    settings/               — providers + custom tests

components/
  instances/                — instance cards, filters, dialogs, evidence UI
  settings/                 — provider cards, test rows, form dialogs
  ui/                       — shadcn primitives

lib/
  api.ts                    — all typed client fetch helpers
  db.ts                     — lazy Postgres connection
  types.ts                  — all domain types
  run-orchestrator.ts       — service layer: startRun()
  openclaw-runner.ts        — dispatch to worker or mock loopback
  provider-catalog.ts       — static provider/model metadata
  test-packs.ts             — locked benchmark sets
  scoring.ts                — per-test + run aggregation
  mock-model-runner.ts      — deterministic mock execution
  mock-instances.ts         — seed data

scripts/
  seed.ts                   — instances table + mock data
  migrate.ts                — runs, run_evidence, base_states tables
  migrate-settings.ts       — provider_configs, custom_tests tables
  seed-base-state.ts        — initial active base state
```

## Agent Workflow Core (.claude + docs)

`.claude/` is the AI operating layer — rules, safety, and execution standards for any agent entering this codebase. `docs/` is the persistent project memory.

### Mandatory workflow before coding

1. Read project structure and current docs
2. Review `.claude/CLAUDE.md`
3. Update `docs/architecture/overview.md` + `docs/progress/progress-report.md`
4. Only then begin coding

### Documentation contract after changes

Update when relevant:
- `docs/progress/progress-report.md`
- `docs/architecture/components.md`
- `docs/product/features.md`
