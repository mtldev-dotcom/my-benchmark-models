import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { CustomTest } from "@/lib/types";

export async function GET() {
  const sql = getDb();
  const rows = await sql<{ data: CustomTest }[]>`
    SELECT data FROM custom_tests ORDER BY created_at ASC
  `;
  return NextResponse.json(rows.map((r) => r.data));
}

export async function POST(req: Request) {
  const sql = getDb();
  const test: CustomTest = await req.json();
  await sql`
    INSERT INTO custom_tests (id, data)
    VALUES (${test.id}, ${sql.json(test)})
  `;
  return NextResponse.json(test, { status: 201 });
}
