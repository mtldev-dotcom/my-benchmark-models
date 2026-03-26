import { NextResponse } from "next/server";
import { startRun } from "@/lib/run-orchestrator";
import { headers } from "next/headers";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Derive dashboard base URL from the request headers
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const dashboardBaseUrl = `${proto}://${host}`;

  try {
    const run = await startRun(id, dashboardBaseUrl);
    return NextResponse.json(run, { status: 202 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start run";
    const status = message.includes("not found") ? 404 : message.includes("already running") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
