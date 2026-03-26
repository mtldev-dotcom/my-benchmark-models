import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { CustomTest } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const sql = getDb();
  const { id } = await params;
  const patch: Partial<CustomTest> = await req.json();

  const rows = await sql<{ data: CustomTest }[]>`
    SELECT data FROM custom_tests WHERE id = ${id}
  `;
  if (!rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated: CustomTest = {
    ...rows[0].data,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await sql`
    UPDATE custom_tests
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
  await sql`DELETE FROM custom_tests WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
