# Known Issues / Tech Debt (code-audit based)

## Functional gaps
1. `Edit` button has no handler.
2. `Bulk Action` selector has no execution logic.
3. `Sync` button has no behavior.
4. No UI to inspect `results[]` test-level output despite data being collected.

## Product consistency gaps
1. Repo renamed to `model-testing`, but `package.json` name remains `instance-page`.
2. `app/layout.tsx` metadata still default (`Create Next App`).

## Data lifecycle limitations
1. All state is in-memory; refresh wipes created instances and run outputs.
2. No run history persistence; latest state only.

## Modeling clarity gaps
1. `testPack` is a free string on instance but locked packs are derived by `agentType` during run.
   - Potential mismatch risk between displayed pack label and actual pack source.
2. `lastRunAt` mixes ISO timestamp and `"-"` sentinel string.
   - Weak type semantics; encourages conditionals around string sentinel.

## Unclear areas
- No explicit acceptance criteria/tests in repo for run correctness.
- No README section documenting known non-functional controls (can confuse new contributors).
