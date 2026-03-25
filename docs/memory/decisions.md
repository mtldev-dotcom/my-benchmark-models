# Decisions (inferred from current code)

## 2026-03-25 — Local-first architecture
- The app intentionally runs entirely in local state with no backend/API integration.
- Evidence: all state lives in `app/page.tsx`; no API routes or network calls.

## 2026-03-25 — Deterministic mock execution for phase 1
- Execution uses seeded hashing to simulate latency/tokens/failures.
- Purpose appears to be demo consistency and future adapter replacement.

## 2026-03-25 — Locked benchmark packs by role
- Test packs are fixed by `agentType` (`operator|engineer|content`) via `getLockedTestPack`.
- This enforces comparable run scenarios per role.

## 2026-03-25 — Incremental UI updates during run
- `runInstance` emits intermediate snapshots via `onUpdate`, not only final result.
- Decision favors visible run progress over fire-and-forget execution.

## 2026-03-25 — Typed domain model first
- Core entities are strongly typed in `lib/types.ts` and reused across UI + logic.
