/**
 * Creates Settings tables: provider_configs, custom_tests.
 * Safe to run multiple times (IF NOT EXISTS).
 * Usage: npm run migrate:settings
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
    CREATE TABLE IF NOT EXISTS provider_configs (
      id         TEXT PRIMARY KEY,
      data       JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log("Table ready: provider_configs");

  await sql`
    CREATE TABLE IF NOT EXISTS custom_tests (
      id         TEXT PRIMARY KEY,
      data       JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log("Table ready: custom_tests");

  await sql.end();
  console.log("\nSettings migration complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
