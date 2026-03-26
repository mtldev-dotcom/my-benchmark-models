import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sql = getDb();

  const existing = await sql`SELECT id FROM base_states WHERE id = ${id} LIMIT 1`;
  if (existing.length === 0) {
    return NextResponse.json({ error: "Base state not found" }, { status: 404 });
  }

  // Deactivate all, then activate the target
  await sql`UPDATE base_states SET is_active = false`;
  await sql`UPDATE base_states SET is_active = true WHERE id = ${id}`;

  return NextResponse.json({ activated: id });
}
