import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";
import type { BaseState } from "@/lib/types";

export async function GET() {
  const sql = getDb();

  const rows = await sql<{
    id: string;
    version: string;
    label: string;
    files: BaseState["files"];
    is_active: boolean;
    created_at: string;
  }[]>`
    SELECT id, version, label, files, is_active, created_at
    FROM base_states
    ORDER BY created_at DESC
  `;

  const states: BaseState[] = rows.map((r) => ({
    id: r.id,
    version: r.version,
    label: r.label,
    files: r.files,
    isActive: r.is_active,
    createdAt: r.created_at,
  }));

  return NextResponse.json(states);
}

export async function POST(req: Request) {
  const sql = getDb();
  const body: { version: string; label: string; files: BaseState["files"] } = await req.json();

  if (!body.version || !body.label || !Array.isArray(body.files)) {
    return NextResponse.json({ error: "version, label, and files are required" }, { status: 400 });
  }

  const id = `base_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
  const createdAt = new Date().toISOString();

  await sql`
    INSERT INTO base_states (id, version, label, files, is_active, created_at)
    VALUES (${id}, ${body.version}, ${body.label}, ${sql.json(body.files)}, false, ${createdAt})
  `;

  const state: BaseState = {
    id,
    version: body.version,
    label: body.label,
    files: body.files,
    isActive: false,
    createdAt,
  };

  return NextResponse.json(state, { status: 201 });
}
