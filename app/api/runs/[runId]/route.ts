import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { RunRecord } from "@/lib/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params;
  const sql = getDb();

  const rows = await sql<{ data: RunRecord; status: string }[]>`
    SELECT data, status FROM runs WHERE id = ${runId} LIMIT 1
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }

  // Return data with the latest status (status col is the source of truth)
  return NextResponse.json({ ...rows[0].data, status: rows[0].status });
}
