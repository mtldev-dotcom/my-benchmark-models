# Current Implemented Features (code-verified)

## Instance Management

- List instance cards fetched from Postgres on mount.
- Create new instance via dialog — persisted to DB.
- Edit instance via dialog (pre-filled, PATCH on save) — persisted to DB.
- Delete instance — removed from DB.
- Loading state while initial fetch is in progress.

## Filtering / Discovery

- Search by `name`, `model`, `provider`, `testPack`.
- Filter by status, model, agent type.
- Sort by latest, oldest, score, tokens.
- Reset filters button.

## Run Lifecycle

- Start allowed from `draft`.
- Rerun allowed from `tested` or `failed`.
- Running state disables mutating actions on card.
- Run triggered server-side via `POST /api/instances/[id]/run` (202 response).
- Client polls `GET /api/runs/[runId]` every 2s until terminal status.
- Final status resolution to `tested` or `failed`.

## Test Execution — OpenClaw Pipeline

- Every run starts from a clean base state (versioned MD files).
- Each test dispatched to `lib/openclaw-runner.ts`:
  - **Phase 3a (mock)**: runs mock inline, posts result to webhook loopback.
  - **Phase 3b (live)**: sends `OpenClawWorkerRequest` to `OPENCLAW_WORKER_URL`.
- Worker lifecycle: boot → load base MD → run prompt → capture evidence → reset.
- Results delivered via webhook `POST /api/runs/[runId]/result`.

## Run Evidence

- Per-test evidence stored in Postgres (`run_evidence` table).
- Evidence includes: logs, MD file diffs (before/after), raw response, worker metadata.
- Accessible from Results dialog → Run History tab → Evidence button.
- **Logs Viewer**: scrollable monospace log list, copy-all button.
- **MD Diff Viewer**: before/after split for each tracked MD file, collapsed if unchanged.
- **Run History**: list of all past runs for an instance with score + status.

## Base States

- Versioned snapshots of core MD context files (`base_states` table).
- Loaded into every OpenClaw instance before a test run (ensures fairness).
- Active base state used by default; instances can be pinned to a specific version.
- Initial version `2026-03-25-001` seeded with `AGENT_CORE.md` + `EVAL_PROTOCOL.md`.

## Test Execution (Legacy Mock)
- Locked packs per `agentType`: operator, engineer, content.
- Deterministic mock execution latency/tokens/failure simulation.
- Per-test result capture (timestamps, duration, tokens, scores, error).
- Aggregated summary: score (%), average speed, total tokens.
- Last error displayed on failed cards.

## Persistence

- All instance state stored in Postgres (JSONB).
- Data survives page refresh.
- `scripts/seed.ts` initializes table and seeds mock data.
- Local dev via Docker Compose; production via Neon.

## Visual/UI

- Mobile-first responsive card grid.
- Stats header for total/running/tested/failed.
- Empty states for no instances / no filter matches.
