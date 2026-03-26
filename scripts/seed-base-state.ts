/**
 * Creates the initial active BaseState row using the project's core MD files.
 * Safe to run multiple times — skips if a base state already exists for this version.
 * Usage: npm run seed-base-state
 */
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { randomUUID } from "crypto";
import type { MdFileSnapshot, BaseState } from "../lib/types";

loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL ?? "";
if (!url) throw new Error("DATABASE_URL is not set");

const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
const sql = postgres(url, { ssl: isLocal ? false : "require" });

const now = new Date().toISOString();
const version = "2026-03-25-001";

// Core MD fixtures — the base context loaded into every OpenClaw instance.
// Extend this as the agent's core memory grows.
const files: MdFileSnapshot[] = [
  {
    filename: "AGENT_CORE.md",
    content: `# Agent Core Context

## Role
You are an AI model being evaluated in a controlled benchmark environment.

## Rules
- Complete the assigned task precisely as described
- Do not reference prior runs or external state
- Be concise and accurate
- Return structured output where requested

## Environment
This is a clean isolated session. No prior context exists.
`,
    capturedAt: now,
  },
  {
    filename: "EVAL_PROTOCOL.md",
    content: `# Evaluation Protocol

## Scoring Criteria
- **Accuracy**: Is the answer factually correct and complete?
- **Instruction Following**: Did the agent follow all instructions precisely?
- **Reliability**: Is the output structured, consistent, and usable?

## Run Rules
- Each run starts from a clean base state
- All runs use the same prompt
- No memory carries between runs
- Timeout: 60 seconds per test
`,
    capturedAt: now,
  },
];

const baseState: BaseState = {
  id: `base_${randomUUID().replace(/-/g, "").slice(0, 12)}`,
  version,
  label: "Initial Core MDs — v1",
  files,
  createdAt: now,
  isActive: true,
};

async function main() {
  // Check if this version already exists
  const existing = await sql<{ id: string }[]>`
    SELECT id FROM base_states WHERE version = ${version} LIMIT 1
  `;

  if (existing.length > 0) {
    console.log(`Base state version "${version}" already exists (id: ${existing[0].id}). Skipping.`);
    await sql.end();
    return;
  }

  // Deactivate any currently active base state first
  await sql`
    UPDATE base_states SET is_active = false WHERE is_active = true
  `;

  await sql`
    INSERT INTO base_states (id, version, label, files, is_active, created_at)
    VALUES (
      ${baseState.id},
      ${baseState.version},
      ${baseState.label},
      ${sql.json(baseState.files)},
      true,
      ${baseState.createdAt}
    )
  `;

  console.log(`Base state seeded: ${baseState.label} (${baseState.version})`);
  console.log(`ID: ${baseState.id}`);
  console.log(`Files: ${files.map((f) => f.filename).join(", ")}`);

  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
