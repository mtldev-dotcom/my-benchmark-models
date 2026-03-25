import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { TestInstance } from "@/lib/types";

export async function GET() {
  const sql = getDb();
  const rows = await sql<{ data: TestInstance }[]>`
    SELECT data FROM instances ORDER BY created_at DESC
  `;
  return NextResponse.json(rows.map((r) => r.data));
}

export async function POST(req: Request) {
  const sql = getDb();
  const instance: TestInstance = await req.json();
  await sql`
    INSERT INTO instances (id, data)
    VALUES (${instance.id}, ${sql.json(instance)})
  `;
  return NextResponse.json(instance, { status: 201 });
}
