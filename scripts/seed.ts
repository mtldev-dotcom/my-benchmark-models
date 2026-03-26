/**
 * Run once to create the table and seed mock data.
 * Usage: npx tsx scripts/seed.ts
 */
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { mockInstances } from "../lib/mock-instances";

loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL ?? "";
if (!url) throw new Error("DATABASE_URL is not set");

const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
const sql = postgres(url, { ssl: isLocal ? false : "require" });

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS instances (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  console.log("Table ready.");

  for (const instance of mockInstances) {
    await sql`
      INSERT INTO instances (id, data)
      VALUES (${instance.id}, ${sql.json(instance)})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`Seeded ${mockInstances.length} instances.`);

  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
