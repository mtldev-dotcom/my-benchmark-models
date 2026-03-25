import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { TestInstance } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const sql = getDb();
  const { id } = await params;
  const patch: Partial<TestInstance> = await req.json();

  const rows = await sql<{ data: TestInstance }[]>`
    SELECT data FROM instances WHERE id = ${id}
  `;
  if (!rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = { ...rows[0].data, ...patch };
  await sql`
    UPDATE instances
    SET data = ${sql.json(updated)}, updated_at = now()
    WHERE id = ${id}
  `;
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const sql = getDb();
  const { id } = await params;
  await sql`DELETE FROM instances WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
