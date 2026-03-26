import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { RunRecord } from "@/lib/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sql = getDb();

  const rows = await sql<{ data: RunRecord }[]>`
    SELECT data FROM runs
    WHERE instance_id = ${id}
    ORDER BY started_at DESC
    LIMIT 50
  `;

  return NextResponse.json(rows.map((r) => r.data));
}
