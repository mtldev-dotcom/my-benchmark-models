# Data Flow

## 1) Initial Load

1. `app/page.tsx` mounts → calls `fetchInstances()` → `GET /api/instances`.
2. Postgres returns all instance rows (JSONB); Phase 3 fields (`latestRunId`, etc.) are backfilled with defaults for seeded records.
3. `useState` initializes `instances`.
4. Derived values (`statuses`, `models`, `agentTypes`, stats) are computed with `useMemo`.

## 2) Filtering & Sorting

1. `InstanceFilters` updates `filters` state on any control change.
2. `filtered` list is recalculated in `useMemo`:
   - Text search over `name / model / provider / testPack`
   - Dropdown filters: status, model, agentType
   - Sort: latest / oldest / score / tokens
3. Active filter count badge on "Clear" button.

## 3) Create / Edit / Delete Instance

- **Create**: `CreateInstanceDialog` emits a full `TestInstance` → `POST /api/instances` → prepended to local state.
- **Edit**: same dialog in edit mode → `PATCH /api/instances/[id]` → local state updated.
- **Delete**: `DELETE /api/instances/[id]` → removed from local state. Any active poll for this instance is cancelled.

## 4) Run Lifecycle (Phase 3a — server-side pipeline)

```
User clicks Start / Rerun
  │
  ▼
page.tsx: optimistic status → "running"
  │
  ▼
triggerRun(instanceId) → POST /api/instances/[id]/run
  │
  ▼
run-orchestrator.ts (server):
  1. Load instance from DB
  2. Load active BaseState (or pinned version)
  3. INSERT into `runs` table (status: "running")
  4. UPDATE instance: status = "running", latestRunId = runId
  5. For each test in pack:
     dispatchTestToWorker(OpenClawWorkerRequest, callbackUrl)
  │
  ▼
Returns 202 + RunRecord to client
  │
  ▼
page.tsx: stores runId in activePolls ref
```

### Worker Execution (Phase 3a mock)

```
openclaw-runner.ts:
  - OPENCLAW_WORKER_URL not set → mock path
  - runMockModelTest() executes with simulated latency
  - Builds OpenClawWorkerResponse (mock logs, mock MD snapshots)
  - POST /api/runs/[runId]/result (loopback to own webhook)
```

### Webhook Processing

```
POST /api/runs/[runId]/result:
  1. Load RunRecord from DB
  2. Load BaseState files for diffing
  3. Compute MdFileDiff[] (before = base state, after = worker snapshot)
  4. INSERT into run_evidence table
  5. Upsert TestResult into run.results
  6. Count evidence rows vs expected test count
  7. If all done:
     - UPDATE runs: status = "completed" | "failed", completed_at
     - UPDATE instances: status, score, speed, tokens, results
  8. Return { received: true }
```

### Client Polling

```
useEffect interval (2000ms):
  - For each [instanceId, runId] in activePolls:
    GET /api/runs/[runId]
    - If status === "running": skip
    - If terminal (completed | failed | timeout):
      - Remove from activePolls
      - Update instance state (status, score, speed, tokens, results, latestRunId)
```

## 5) Viewing Evidence

1. User opens "View Results" dialog → switches to "Run History" tab.
2. `fetchRunHistory(instanceId)` → `GET /api/instances/[id]/runs` → list of `RunRecord[]`.
3. User clicks "Evidence" on a run → `fetchRunEvidence(runId)` → `GET /api/runs/[runId]/evidence`.
4. `RunEvidencePanel` renders three tabs:
   - **Results** — per-test score, duration, tokens.
   - **Logs** — all log lines merged from evidence entries.
   - **MD Changes** — before/after diff per tracked MD file.

## 6) Settings

- Providers: `GET /api/settings/providers` on mount → `ProviderConfig[]` displayed as cards.
- CRUD via `POST / PATCH / DELETE /api/settings/providers/[id]`.
- Custom tests: same pattern via `/api/settings/tests`.
- No cross-linking between settings and run pipeline yet (Phase 3b will use stored API keys for real model calls).

## 7) Error Path

- **Run trigger fails**: optimistic "running" status reverted to original on the client.
- **Individual test fails**: `RunEvidence` still stored, `TestResult.status = "failed"`.
- **Critical test fails**: run continues until all tests dispatched (failure is recorded, not fatal to dispatch).
- **Worker timeout** (Phase 3b): worker returns `error: "timeout"` in response; treated as failed test.
