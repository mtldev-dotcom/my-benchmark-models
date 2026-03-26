/**
 * Service layer for run orchestration.
 * No business logic lives in API route handlers — it all lives here.
 */
import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { dispatchTestToWorker } from "@/lib/openclaw-runner";
import { getLockedTestPack } from "@/lib/test-packs";
import type { BaseState, RunRecord, TestInstance } from "@/lib/types";

export async function startRun(
  instanceId: string,
  dashboardBaseUrl: string,
): Promise<RunRecord> {
  const sql = getDb();

  // Load instance
  const instanceRows = await sql<{ data: TestInstance }[]>`
    SELECT data FROM instances WHERE id = ${instanceId} LIMIT 1
  `;
  if (instanceRows.length === 0) {
    throw new Error(`Instance not found: ${instanceId}`);
  }
  const instance = instanceRows[0].data;

  if (instance.status === "running") {
    throw new Error("Instance is already running");
  }

  // Load base state: use pinned version or active fallback
  let baseState: BaseState | null = null;

  if (instance.baseStateVersion) {
    const rows = await sql<{ id: string; version: string; label: string; files: BaseState["files"]; is_active: boolean; created_at: string }[]>`
      SELECT id, version, label, files, is_active, created_at
      FROM base_states WHERE version = ${instance.baseStateVersion} LIMIT 1
    `;
    if (rows.length > 0) {
      const r = rows[0];
      baseState = {
        id: r.id,
        version: r.version,
        label: r.label,
        files: r.files,
        isActive: r.is_active,
        createdAt: r.created_at,
      };
    }
  }

  if (!baseState) {
    const rows = await sql<{ id: string; version: string; label: string; files: BaseState["files"]; is_active: boolean; created_at: string }[]>`
      SELECT id, version, label, files, is_active, created_at
      FROM base_states WHERE is_active = true LIMIT 1
    `;
    if (rows.length === 0) {
      throw new Error("No active base state found. Run npm run seed-base-state first.");
    }
    const r = rows[0];
    baseState = {
      id: r.id,
      version: r.version,
      label: r.label,
      files: r.files,
      isActive: r.is_active,
      createdAt: r.created_at,
    };
  }

  const runId = `run_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const startedAt = new Date().toISOString();

  const run: RunRecord = {
    id: runId,
    instanceId,
    startedAt,
    completedAt: null,
    status: "running",
    baseStateVersion: baseState.version,
    results: [],
    summary: { score: 0, speed: "-", tokens: 0, passed: 0, failed: 0 },
  };

  // Persist the run record
  await sql`
    INSERT INTO runs (id, instance_id, data, started_at, status)
    VALUES (${runId}, ${instanceId}, ${sql.json(run)}, ${startedAt}, 'running')
  `;

  // Mark instance as running
  const updatedInstance: TestInstance = {
    ...instance,
    status: "running",
    lastRunAt: startedAt,
    latestRunId: runId,
    lastError: undefined,
    results: [],
  };
  await sql`
    UPDATE instances
    SET data = ${sql.json(updatedInstance)}, updated_at = now()
    WHERE id = ${instanceId}
  `;

  // Dispatch each test in the pack (fire-and-forget; results come via webhook)
  const pack = getLockedTestPack(instance.agentType);
  for (const test of pack.tests) {
    const callbackUrl = `${dashboardBaseUrl}/api/runs/${runId}/result`;
    void dispatchTestToWorker(
      {
        runId,
        testId: test.id,
        testName: test.name,
        prompt: test.prompt,
        baseStateVersion: baseState.version,
        baseStateFiles: baseState.files,
        timeoutMs: 60_000,
        modelSettings: {
          model: instance.model,
          provider: instance.provider,
          contextWindow: instance.contextWindow,
        },
      },
      callbackUrl,
    );
  }

  return run;
}
