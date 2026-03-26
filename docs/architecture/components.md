# Components & Modules

## App Shell
- `app/layout.tsx`
  - Global HTML/body shell, Geist fonts, metadata.
  - Metadata is still default scaffold text.
- `app/globals.css`
  - Tailwind + design tokens (light/dark variables), global base styles.

## Page Orchestrator
- `app/page.tsx`
  - Owns `instances` and `filters` state.
  - Computes derived stats (total/running/tested/failed).
  - Filters/sorts data in-memory.
  - Triggers runs via `triggerRun()` (server-side) and polls status via `pollRun()` every 2s.
  - `activePolls` ref maps instanceId → runId for concurrent polling.

## Feature Components (`components/instances`)
- `create-instance-dialog.tsx` — creates/edits instance, maps agent type to test pack.
- `instance-filters.tsx` — compact toolbar: search + 4 labeled dropdowns, active filter count badge.
- `instance-card.tsx` — instance summary, Start/Rerun/Edit/Delete actions, View Results when run data exists.
- `instance-results-dialog.tsx` — tabbed dialog: Latest Results + Run History. Lazy-loads evidence per run.
- `run-history-list.tsx` — compact list of past RunRecords with Evidence button per row.
- `run-evidence-panel.tsx` — tabbed panel: Results | Logs | MD Changes for a single RunRecord.
- `logs-viewer.tsx` — monospace scrollable log list with Copy button.
- `md-diff-viewer.tsx` — before/after per MdFileDiff, collapsed when unchanged.

## UI Primitives (`components/ui`)
- `button`, `card`, `badge`, `input`, `textarea`, `select`, `dialog`
- These are reusable presentational primitives; no business logic.

## Domain / Logic Modules (`lib`)
- `types.ts` — all domain types: `TestInstance`, `TestResult`, `RunRecord`, `RunEvidence`, `BaseState`, `OpenClawWorkerRequest/Response`, etc.
- `mock-instances.ts` — seed dataset.
- `test-packs.ts` — locked test definitions per agent type.
- `mock-model-runner.ts` — deterministic mock execution (used by openclaw-runner in Phase 3a).
- `scoring.ts` — per-test scoring and run summary aggregation.
- `run-instance.ts` — legacy client-side executor (kept for reference; no longer called by page.tsx).
- `openclaw-runner.ts` — server-side dispatcher: sends `OpenClawWorkerRequest` to real worker or runs mock and posts result via loopback webhook.
- `run-orchestrator.ts` — service layer: `startRun()` loads instance + base state, creates RunRecord, dispatches all tests.
- `api.ts` — typed client fetch helpers including Phase 3 additions: `triggerRun`, `pollRun`, `fetchRunHistory`, `fetchRunEvidence`, `fetchBaseStates`.
- `db.ts` — lazy postgres connection with SSL auto-detection.
- `utils.ts` — `cn()` class merge helper.

## API Routes (`app/api`)
- `GET/POST /api/instances` — list + create instances.
- `PATCH/DELETE /api/instances/[id]` — update + delete.
- `POST /api/instances/[id]/run` — trigger a run (202, creates RunRecord).
- `GET /api/instances/[id]/runs` — run history.
- `GET /api/runs/[runId]` — poll run status.
- `POST /api/runs/[runId]/result` — webhook: receives worker result, stores evidence, updates instance.
- `GET /api/runs/[runId]/evidence` — fetch RunEvidence array.
- `GET/POST /api/base-states` — list + create base state versions.
- `PATCH /api/base-states/[id]/activate` — set active base state.

## Scripts
- `scripts/seed.ts` — creates instances table + seeds mock data.
- `scripts/migrate.ts` — creates Phase 3 tables: `runs`, `run_evidence`, `base_states`.
- `scripts/seed-base-state.ts` — seeds the initial active BaseState row.
