import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { RunEvidence } from "@/lib/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params;
  const sql = getDb();

  const rows = await sql<{ data: RunEvidence }[]>`
    SELECT data FROM run_evidence
    WHERE run_id = ${runId}
    ORDER BY created_at ASC
  `;

  return NextResponse.json(rows.map((r) => r.data));
}
