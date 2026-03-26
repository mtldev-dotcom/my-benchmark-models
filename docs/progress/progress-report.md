# Progress Report

## 2026-03-25 — Phase 3a: OpenClaw Benchmark Runtime (plumbing complete)

### Goals
Evolve the dashboard from a mock-only runner into a real benchmark pipeline. Each run now moves through a proper server-side lifecycle: trigger → dispatch → webhook → evidence stored → instance updated. The mock execution path is preserved and exercises the full pipeline end-to-end.

### Completed

**New Postgres tables** (`scripts/migrate.ts`)
- `runs` — immutable run records with status, summary, results JSONB.
- `run_evidence` — per-test logs, MD diffs, raw response, worker metadata.
- `base_states` — versioned snapshots of MD context files loaded into each agent instance.

**Base state seeding** (`scripts/seed-base-state.ts`)
- Creates the initial active `BaseState` row (`2026-03-25-001`) with two core MD fixtures: `AGENT_CORE.md` + `EVAL_PROTOCOL.md`.

**New types** (`lib/types.ts`)
- `MdFileSnapshot`, `MdFileDiff`, `RunEvidence`, `RunRecord`, `BaseState`
- `OpenClawWorkerRequest`, `OpenClawWorkerResponse`
- `TestInstance` gains: `latestRunId`, `baseStateVersion`, `openclawEnabled`
- `TestResult` gains: `evidenceId?`

**Server-side execution layer**
- `lib/openclaw-runner.ts` — dispatches tests to OpenClaw worker or mock. Checks `OPENCLAW_WORKER_URL` env var; if unset, runs mock inline and POSTs result to the webhook (loopback, full pipeline exercised).
- `lib/run-orchestrator.ts` — service layer for `startRun()`: loads instance + base state, creates RunRecord, dispatches all tests.

**New API routes**
- `POST /api/instances/[id]/run` — triggers a run, returns 202 + RunRecord.
- `GET /api/instances/[id]/runs` — run history for an instance.
- `GET /api/runs/[runId]` — poll run status.
- `POST /api/runs/[runId]/result` — webhook: processes worker response, computes MD diffs, stores evidence, updates instance on completion.
- `GET /api/runs/[runId]/evidence` — fetch evidence for a run.
- `GET/POST /api/base-states` — list + create base state versions.
- `PATCH /api/base-states/[id]/activate` — set active base state.

**New UI components**
- `LogsViewer` — monospace scrollable log list with copy button.
- `MdDiffViewer` — before/after per tracked MD file, collapsed if unchanged.
- `RunHistoryList` — compact run list with Evidence button per row.
- `RunEvidencePanel` — tabbed: Results | Logs | MD Changes.

**Updated components**
- `InstanceResultsDialog` — now has "Latest Results" + "Run History" tabs. Lazy-loads evidence when a run is selected from history.
- `InstanceCard` — shows "View Results" whenever `latestRunId` is set (even if no legacy results).
- `app/page.tsx` — swapped client-side `runInstance()` for `triggerRun()` + 2s polling loop via `pollRun()`. All mutations now go through the server.

**Build & lint**
- `npm run lint` — clean.
- `npm run build` — clean. All 11 routes registered.

### Current Status
- Full pipeline works end-to-end in mock mode.
- Hitting Run creates a real `RunRecord` in Postgres, dispatches via mock runner, stores `RunEvidence`, and updates the instance on completion.
- Setting `OPENCLAW_WORKER_URL` in `.env.local` switches to real worker — no other code changes needed (Phase 3b).

### Priority Next Actions
1. Build the OpenClaw worker and set `OPENCLAW_WORKER_URL`.
2. Add `openclawEnabled: true` to instances that should use the real worker.
3. Base state admin UI (upload/activate MD files from the dashboard).
4. Real scoring evaluator to replace hash-based mock scores.
5. URL-synced filter state.

---

## 2026-03-25 — Production-Ready Pass

### Goals
Ship the app in a deployable state: real persistence, all UI controls functional, clean build.

### Completed

**Metadata & naming**
- `app/layout.tsx` title/description updated to reflect actual app.
- `package.json` name fixed from `instance-page` to `my-benchmark-models`.

**Postgres persistence**
- `lib/db.ts` — lazy connection with SSL auto-detection (localhost skips SSL).
- `app/api/instances/route.ts` — GET (list all) + POST (create).
- `app/api/instances/[id]/route.ts` — PATCH (update) + DELETE.
- `lib/api.ts` — typed client fetch helpers.
- `scripts/seed.ts` — creates table schema, seeds mock instances.
- `docker-compose.yml` — local Postgres 16 on port 5432.
- `.env.example` updated with both local and Neon examples.

**UI wired to API**
- `app/page.tsx` refactored: fetches on mount, persists all mutations to DB.
- Loading state shown while initial fetch is in progress.
- Live run updates PATCHed to DB on each step.

**Type cleanup**
- `TestInstance.lastRunAt` changed from `string` to `string | null`.
- All `"-"` sentinels replaced with `null` in mock data, runner, and dialog.

**UI controls**
- Edit button: fully wired via `CreateInstanceDialog` in edit mode (pre-fills form, PATCHes DB on save).
- Bulk Action dropdown: removed from UI and `FilterState` type.
- Sync button: removed.
- Results detail dialog: new `InstanceResultsDialog` component — shows per-test name, status, score, duration, tokens, errors. Appears on cards with completed results.

**Build & lint**
- `npm run build` — clean.
- `npm run lint` — clean.

### Current Status
- App is production-deployable to Vercel + Neon.
- All UI controls are functional or intentionally removed.
- Data persists across page refreshes.

### Priority Next Actions
1. Install Docker and run `docker compose up -d` for local DB (pending Docker install).
2. Run `npm run seed` against local DB to verify seed flow.
3. Deploy to Vercel + Neon and smoke test in production.
4. Sticky filters on scroll (UX improvement).
5. URL-synced filter state.

---

## 2026-03-25 — Initial Entry

### Claude Core Workflow Initialized
- Repository workflow core initialized with `.claude/` governance layer and `/docs` memory structure.
- Baseline operating contract established for all incoming agents.

### Audit Completed — Full Repo Pass (Read-only + Documentation Population)
- Completed full structure scan and code-level audit of app/components/lib/docs.
- Populated architecture/product/memory docs with repo-verified content.
- No feature implementation changes made in this pass.

### Findings Summary
- Core manual run flow was implemented and coherent for phase 1.
- Domain split was clean: types → packs → runner → scoring → orchestration.
- Main gaps identified: non-functional controls, metadata/name drift, no persistence, no results detail UI.
