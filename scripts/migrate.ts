/**
 * Creates Phase 3 tables: runs, run_evidence, base_states.
 * Safe to run multiple times (IF NOT EXISTS).
 * Usage: npm run migrate
 */
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";

loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL ?? "";
if (!url) throw new Error("DATABASE_URL is not set");

const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
const sql = postgres(url, { ssl: isLocal ? false : "require" });

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS base_states (
      id TEXT PRIMARY KEY,
      version TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL,
      files JSONB NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log("Table ready: base_states");

  // Enforce only one active base state at a time
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS base_states_active_unique
    ON base_states (is_active)
    WHERE is_active = true
  `;
  console.log("Index ready: base_states_active_unique");

  await sql`
    CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      instance_id TEXT NOT NULL,
      data JSONB NOT NULL,
      started_at TIMESTAMPTZ NOT NULL,
      completed_at TIMESTAMPTZ,
      status TEXT NOT NULL DEFAULT 'running',
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log("Table ready: runs");

  await sql`
    CREATE INDEX IF NOT EXISTS runs_instance_id_idx ON runs (instance_id)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS runs_started_at_idx ON runs (started_at DESC)
  `;
  console.log("Indexes ready: runs");

  await sql`
    CREATE TABLE IF NOT EXISTS run_evidence (
      id TEXT PRIMARY KEY,
      run_id TEXT NOT NULL,
      test_id TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log("Table ready: run_evidence");

  await sql`
    CREATE INDEX IF NOT EXISTS run_evidence_run_id_idx ON run_evidence (run_id)
  `;
  console.log("Index ready: run_evidence");

  await sql.end();
  console.log("\nMigration complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
