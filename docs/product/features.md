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
- Sequential test execution with intermediate UI updates (live PATCH to DB on each step).
- Final status resolution to `tested` or `failed`.

## Test Execution & Results

- Locked packs per `agentType`: operator, engineer, content.
- Deterministic mock execution latency/tokens/failure simulation.
- Per-test result capture (timestamps, duration, tokens, scores, error).
- Aggregated summary: score (%), average speed, total tokens.
- Last error displayed on failed cards.
- **Results detail dialog**: shows per-test name, status, score, duration, tokens, errors.

## Persistence

- All instance state stored in Postgres (JSONB).
- Data survives page refresh.
- `scripts/seed.ts` initializes table and seeds mock data.
- Local dev via Docker Compose; production via Neon.

## Visual/UI

- Mobile-first responsive card grid.
- Stats header for total/running/tested/failed.
- Empty states for no instances / no filter matches.
