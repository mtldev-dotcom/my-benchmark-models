# Decisions

## 2026-03-25 — Local-first architecture (initial)
- The app initially ran entirely in local state with no backend/API integration.
- Evidence: all state lived in `app/page.tsx`; no API routes or network calls.

## 2026-03-25 — Deterministic mock execution for phase 1
- Execution uses seeded hashing to simulate latency/tokens/failures.
- Purpose: demo consistency and future adapter replacement when real providers are integrated.

## 2026-03-25 — Locked benchmark packs by role
- Test packs are fixed by `agentType` (`operator|engineer|content`) via `getLockedTestPack`.
- Enforces comparable run scenarios per role; prevents drift in benchmark conditions.

## 2026-03-25 — Incremental UI updates during run
- `runInstance` emits intermediate snapshots via `onUpdate`, not only the final result.
- Favors visible run progress over fire-and-forget execution.

## 2026-03-25 — Typed domain model first
- Core entities are strongly typed in `lib/types.ts` and reused across UI + logic.

## 2026-03-25 — Postgres JSONB over ORM or localStorage
- Full `TestInstance` JSON stored in a single JSONB column.
- Rationale: no schema migrations needed as the type evolves; swap to structured columns later when the shape stabilizes.
- Rejected localStorage: not accessible server-side, not shareable, not durable enough for a real tool.
- Rejected ORM (Prisma/Drizzle): premature complexity at current scale.

## 2026-03-25 — Lazy DB connection with SSL auto-detection
- `lib/db.ts` initializes the Postgres connection on first use, not at module load.
- Next.js build-time evaluation would throw if connection was eager and `DATABASE_URL` was absent.
- SSL is skipped automatically for localhost connections to support Docker local dev without config changes.
