# Architecture Overview

## Snapshot (updated: 2026-03-25 — v3)

A Next.js App Router dashboard for benchmarking AI model agent runtimes under controlled conditions. Each test run is a full isolated agent cycle: boot → load base context → run prompt → capture evidence → reset. Results, logs, and MD file diffs are stored per run in Postgres.

## Actual Stack in Repo

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + `tw-animate-css`
- shadcn-style UI components built on `@base-ui/react`
- Postgres (Neon in prod, Docker locally) via `postgres` npm package
- OpenClaw worker integration (Phase 3b) or mock loopback (Phase 3a)

## Runtime Architecture

### Client
- `app/page.tsx` — orchestration: fetches instances on mount, triggers runs via API, polls run status every 2s, updates state on completion
- `app/settings/page.tsx` — settings orchestration: provider configs + custom test CRUD
- `lib/api.ts` — all typed fetch helpers (instances, runs, evidence, base states, providers, tests)

### Server
- `app/api/instances/route.ts` — GET (list) + POST (create)
- `app/api/instances/[id]/route.ts` — PATCH + DELETE
- `app/api/instances/[id]/run/route.ts` — POST: triggers a run via `run-orchestrator.ts`, returns 202
- `app/api/instances/[id]/runs/route.ts` — GET: run history for an instance
- `app/api/runs/[runId]/route.ts` — GET: poll run status
- `app/api/runs/[runId]/result/route.ts` — POST: webhook — receives worker result, computes MD diffs, stores evidence, updates instance
- `app/api/runs/[runId]/evidence/route.ts` — GET: fetch RunEvidence array
- `app/api/base-states/route.ts` — GET + POST
- `app/api/base-states/[id]/activate/route.ts` — PATCH: set active base state
- `app/api/settings/providers/route.ts` + `[id]/route.ts` — provider config CRUD
- `app/api/settings/tests/route.ts` + `[id]/route.ts` — custom test CRUD

### Service Layer
- `lib/run-orchestrator.ts` — `startRun()`: loads instance + base state, creates RunRecord, dispatches tests
- `lib/openclaw-runner.ts` — `dispatchTestToWorker()`: sends to real worker (if `OPENCLAW_WORKER_URL` set) or runs mock and posts loopback webhook

### Domain
- `lib/db.ts` — lazy Postgres connection, SSL auto-detect
- `lib/types.ts` — all domain types
- `lib/test-packs.ts` — locked benchmark sets by `agentType`
- `lib/mock-model-runner.ts` — deterministic mock execution
- `lib/scoring.ts` — per-test scoring and run aggregation
- `lib/provider-catalog.ts` — static provider/model metadata
- `lib/mock-instances.ts` — seed data

## Postgres Tables

| Table | Purpose |
|---|---|
| `instances` | Instance configs + latest run summary (JSONB) |
| `runs` | Immutable run records with status, results, summary (JSONB) |
| `run_evidence` | Per-test logs, MD diffs, raw response, worker metadata (JSONB) |
| `base_states` | Versioned MD context files loaded into each agent instance (JSONB) |
| `provider_configs` | API keys + enabled models per provider (JSONB) |
| `custom_tests` | User-defined test prompts (JSONB) |

## External Boundaries

| Boundary | Status |
|---|---|
| Postgres (Neon or Docker) | ✅ Active |
| OpenClaw worker (`OPENCLAW_WORKER_URL`) | ⏳ Phase 3b — mock loopback in use |
| Provider APIs (OpenAI, Anthropic, etc.) | ⏳ Keys stored, not yet called |
| Auth | Not implemented — single-user tool |

## Run Pipeline (Phase 3a)

```
Client: POST /api/instances/[id]/run
  → run-orchestrator: load instance + base state, create RunRecord
  → openclaw-runner: dispatchTestToWorker() × N tests (fire-and-forget)
    → mock runner executes inline
    → POST /api/runs/[runId]/result (loopback webhook)
      → compute MD diffs, store RunEvidence
      → when all tests done: update RunRecord status, patch instance
Client: polls GET /api/runs/[runId] every 2s until terminal status
```
