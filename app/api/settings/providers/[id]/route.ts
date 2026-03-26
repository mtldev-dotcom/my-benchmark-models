import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { ProviderConfig } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const sql = getDb();
  const { id } = await params;
  const patch: Partial<ProviderConfig> = await req.json();

  const rows = await sql<{ data: ProviderConfig }[]>`
    SELECT data FROM provider_configs WHERE id = ${id}
  `;
  if (!rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated: ProviderConfig = {
    ...rows[0].data,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await sql`
    UPDATE provider_configs
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
  await sql`DELETE FROM provider_configs WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
