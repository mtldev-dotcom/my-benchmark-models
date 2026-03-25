# Known Issues / Tech Debt

## Active

### Unclear areas
- No explicit acceptance criteria or tests in repo for run correctness.
- No run history — each run overwrites the instance; no audit trail.
- `testPack` is a free string on instance but locked packs are derived by `agentType` during run.
  - Potential mismatch risk between displayed pack label and actual pack source at runtime.

## Resolved (2026-03-25 production pass)

- ~~`Edit` button had no handler~~ → Edit dialog implemented, PATCHes DB.
- ~~`Bulk Action` selector was non-functional~~ → Removed from UI and FilterState type.
- ~~`Sync` button had no behavior~~ → Removed from UI.
- ~~No UI to inspect `results[]`~~ → Results detail dialog added.
- ~~`package.json` name was `instance-page`~~ → Fixed to `my-benchmark-models`.
- ~~`app/layout.tsx` metadata was default scaffold text~~ → Updated to "Model Benchmark".
- ~~All state was in-memory; refresh wiped data~~ → Postgres persistence via API routes.
- ~~`lastRunAt` mixed ISO timestamp and `"-"` sentinel~~ → Type is now `string | null`.
