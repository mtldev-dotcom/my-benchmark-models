import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { ProviderConfig } from "@/lib/types";

export async function GET() {
  const sql = getDb();
  const rows = await sql<{ data: ProviderConfig }[]>`
    SELECT data FROM provider_configs ORDER BY created_at ASC
  `;
  return NextResponse.json(rows.map((r) => r.data));
}

export async function POST(req: Request) {
  const sql = getDb();
  const provider: ProviderConfig = await req.json();
  await sql`
    INSERT INTO provider_configs (id, data)
    VALUES (${provider.id}, ${sql.json(provider)})
  `;
  return NextResponse.json(provider, { status: 201 });
}
