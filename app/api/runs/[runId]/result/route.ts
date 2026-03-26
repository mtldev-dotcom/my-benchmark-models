import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { scoreTest, summarizeRun } from "@/lib/scoring";
import { randomUUID } from "crypto";
import type {
  MdFileDiff,
  MdFileSnapshot,
  OpenClawWorkerResponse,
  RunEvidence,
  RunRecord,
  TestInstance,
  TestResult,
} from "@/lib/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params;
  const sql = getDb();

  const body: OpenClawWorkerResponse = await req.json();

  // Load run
  const runRows = await sql<{ data: RunRecord; status: string }[]>`
    SELECT data, status FROM runs WHERE id = ${runId} LIMIT 1
  `;
  if (runRows.length === 0) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }
  if (runRows[0].status !== "running") {
    return NextResponse.json({ error: "Run is not in running state" }, { status: 409 });
  }

  const run: RunRecord = { ...runRows[0].data, status: runRows[0].status as RunRecord["status"] };

  // Load base state files for diffing
  const baseStateRows = await sql<{ files: MdFileSnapshot[] }[]>`
    SELECT files FROM base_states WHERE version = ${run.baseStateVersion} LIMIT 1
  `;
  const baseFiles: MdFileSnapshot[] = baseStateRows[0]?.files ?? [];

  // Compute MD diffs
  const mdDiffs: MdFileDiff[] = body.mdSnapshots.map((snapshot) => {
    const base = baseFiles.find((f) => f.filename === snapshot.filename);
    const before = base?.content ?? "";
    return {
      filename: snapshot.filename,
      before,
      after: snapshot.content,
      changed: before !== snapshot.content,
    };
  });

  // Build evidence record
  const evidence: RunEvidence = {
    runId,
    testId: body.testId,
    logs: body.logs,
    mdDiffs,
    rawResponse: body.response,
    workerMeta: body.workerMeta,
  };

  await sql`
    INSERT INTO run_evidence (id, run_id, test_id, data)
    VALUES (
      ${`ev_${randomUUID().replace(/-/g, "").slice(0, 12)}`},
      ${runId},
      ${body.testId},
      ${sql.json(evidence)}
    )
  `;

  // Build TestResult from worker response
  const scores = body.error
    ? { accuracy: 1, instructionFollowing: 1, reliability: 1, average: 1 }
    : scoreTest({ prompt: "", response: body.response });

  const result: TestResult = {
    testId: body.testId,
    testName: body.workerMeta?.workerId
      ? `Test ${body.testId}`
      : body.testId,
    prompt: "",
    response: body.response,
    status: body.error ? "failed" : "passed",
    startedAt: body.workerMeta.bootedAt,
    completedAt: body.workerMeta.resetAt,
    durationMs: body.durationMs,
    tokensIn: body.tokensIn,
    tokensOut: body.tokensOut,
    totalTokens: body.tokensIn + body.tokensOut,
    scores,
    accuracy: scores.accuracy,
    instructionFollowing: scores.instructionFollowing,
    reliability: scores.reliability,
    error: body.error,
    evidenceId: `${runId}:${body.testId}`,
  };

  // Merge result into run (upsert by testId)
  const updatedResults = [
    ...run.results.filter((r) => r.testId !== body.testId),
    result,
  ];

  // Load the instance to know the total expected test count
  const instanceRows = await sql<{ data: TestInstance }[]>`
    SELECT data FROM instances WHERE id = ${run.instanceId} LIMIT 1
  `;
  const instance = instanceRows[0]?.data;

  // Determine if all tests are done
  // We check run_evidence count against the number of tests in the pack
  const evidenceCountRows = await sql<{ count: string }[]>`
    SELECT COUNT(*) as count FROM run_evidence WHERE run_id = ${runId}
  `;
  const evidenceCount = parseInt(evidenceCountRows[0].count, 10);

  // Estimate expected tests from the pack (3 per pack based on current packs)
  const expectedTestCount = instance
    ? (await import("@/lib/test-packs")).getLockedTestPack(instance.agentType).tests.length
    : 3;

  const allDone = evidenceCount >= expectedTestCount;
  const summary = summarizeRun(updatedResults);
  const hasFailed = updatedResults.some((r) => r.status === "failed");
  const finalStatus: RunRecord["status"] = allDone ? (hasFailed ? "failed" : "completed") : "running";

  const updatedRun: RunRecord = {
    ...run,
    results: updatedResults,
    status: finalStatus,
    completedAt: allDone ? new Date().toISOString() : null,
    summary: {
      score: summary.score,
      speed: summary.speed,
      tokens: summary.tokens,
      passed: summary.passed,
      failed: summary.failed,
    },
  };

  await sql`
    UPDATE runs
    SET
      data = ${sql.json(updatedRun)},
      status = ${finalStatus},
      completed_at = ${allDone ? new Date().toISOString() : null}
    WHERE id = ${runId}
  `;

  // If run is complete, update the instance
  if (allDone && instance) {
    const updatedInstance: TestInstance = {
      ...instance,
      status: hasFailed ? "failed" : "tested",
      score: summary.score,
      speed: summary.speed,
      tokens: summary.tokens,
      runCount: instance.runCount + 1,
      lastError: hasFailed ? updatedResults.find((r) => r.error)?.error : undefined,
      results: updatedResults,
    };

    await sql`
      UPDATE instances
      SET data = ${sql.json(updatedInstance)}, updated_at = now()
      WHERE id = ${run.instanceId}
    `;
  }

  return NextResponse.json({ received: true });
}
