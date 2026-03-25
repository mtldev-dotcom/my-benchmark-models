# Current Implemented Features (code-verified)

## Instance Management
- List instance cards from local seed data.
- Create new instance via dialog.
- Delete instance from local state.
- Edit button exists in UI but has no behavior.

## Filtering / Discovery
- Search by `name`, `model`, `provider`, `testPack`.
- Filter by status, model, agent type.
- Sort by latest, oldest, score, tokens.
- Bulk action selector and Sync button are present but currently non-functional.

## Run Lifecycle
- Start allowed from `draft`.
- Rerun allowed from `tested` or `failed`.
- Running state disables mutating actions on card.
- Sequential test execution with intermediate UI updates.
- Final status resolution to `tested` or `failed`.

## Test Execution & Results
- Locked packs per `agentType`: operator, engineer, content.
- Deterministic mock execution latency/tokens/failure simulation.
- Per-test result capture (timestamps, duration, tokens, scores, error).
- Aggregated summary: score (%), average speed, total tokens.
- Last error displayed on failed cards.

## Visual/UI
- Mobile-first responsive card grid.
- Stats header for total/running/tested/failed.
- Empty states for no instances / no filter matches.
