# Data Flow

## 1) Initial Load
1. `mockInstances` is imported into `app/page.tsx`.
2. `useState` initializes `instances` from that static array.
3. Derived values (`statuses`, `models`, `agentTypes`, stats) are computed with `useMemo`.

## 2) Filtering & Sorting
1. `InstanceFilters` updates `filters` state.
2. `filtered` list is recalculated in `useMemo`:
   - text search over `name/model/provider/testPack`
   - status/model/agentType filters
   - sort by latest/oldest/score/tokens

## 3) Create Instance
1. User submits `CreateInstanceDialog`.
2. Dialog emits a full `TestInstance` object (status `draft`, run fields initialized).
3. Page prepends it to `instances` state.

## 4) Start / Rerun Execution
1. Card action calls `startInstance` or `rerunInstance`.
2. Page resolves target instance by `id` and calls `runInstance(current, onUpdate)`.
3. `runInstance`:
   - sets status to `running`
   - selects locked test pack by `agentType`
   - executes tests sequentially via `runMockModelTest`
   - computes per-test scores
   - updates interim aggregate score/speed/tokens
   - emits each intermediate state through `onUpdate`
4. Page callback patches matching instance in local state.
5. Final status becomes `tested` or `failed`.

## 5) Error Path
- Runner throws -> result entry marked `failed` with `error`.
- `lastError` is updated on instance.
- If failed test is marked `critical`, loop breaks early.
- Run still returns a final instance snapshot with partial results.

## Persistence Note
All state is volatile. Refreshing page resets to seed data.
