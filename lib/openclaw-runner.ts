/**
 * Dispatches a single test to the OpenClaw worker (or mock in Phase 3a).
 *
 * Phase 3a: OPENCLAW_WORKER_URL is unset — runs mock inline and POSTs the
 * result back to the dashboard webhook (loopback) so the same result-processing
 * path is exercised end-to-end.
 *
 * Phase 3b: Set OPENCLAW_WORKER_URL to the worker host. The worker receives
 * the request, runs the isolated agent cycle, and calls the webhook itself.
 */
import { randomUUID } from "crypto";
import { runMockModelTest } from "@/lib/mock-model-runner";
import { scoreTest } from "@/lib/scoring";
import type { OpenClawWorkerRequest, OpenClawWorkerResponse } from "@/lib/types";

export async function dispatchTestToWorker(
  request: OpenClawWorkerRequest,
  callbackUrl: string,
): Promise<void> {
  const workerUrl = process.env.OPENCLAW_WORKER_URL;

  if (workerUrl) {
    // Phase 3b — send to real OpenClaw worker
    const res = await fetch(`${workerUrl}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...request, callbackUrl }),
    });
    if (!res.ok) {
      throw new Error(`OpenClaw worker rejected request: ${res.status} ${res.statusText}`);
    }
    // Worker will call callbackUrl when done — nothing more to do here
    return;
  }

  // Phase 3a — mock execution, loopback to webhook
  void runMockAndCallback(request, callbackUrl);
}

async function runMockAndCallback(
  request: OpenClawWorkerRequest,
  callbackUrl: string,
): Promise<void> {
  const bootedAt = new Date().toISOString();
  const workerId = `mock-worker-${randomUUID().slice(0, 8)}`;

  let response: OpenClawWorkerResponse;

  try {
    const output = await runMockModelTest({
      instance: {
        id: request.runId,
        model: request.modelSettings.model,
        provider: request.modelSettings.provider,
        contextWindow: request.modelSettings.contextWindow,
        agentType: "operator",
        name: request.testName,
        testPack: "",
        status: "running",
        score: 0,
        speed: "-",
        tokens: 0,
        createdAt: bootedAt,
        lastRunAt: null,
        runCount: 0,
        results: [],
        latestRunId: null,
        baseStateVersion: request.baseStateVersion,
        openclawEnabled: false,
      },
      test: {
        id: request.testId,
        name: request.testName,
        prompt: request.prompt,
      },
    });

    const scores = scoreTest({ prompt: request.prompt, response: output.response });
    const resetAt = new Date().toISOString();

    // Mock MD snapshots — return base state files unchanged (no mutations in mock)
    const mdSnapshots = request.baseStateFiles.map((f) => ({
      ...f,
      capturedAt: resetAt,
    }));

    // Mock logs
    const logs = [
      `[${bootedAt}] Worker ${workerId} booted`,
      `[${bootedAt}] Base state ${request.baseStateVersion} loaded (${request.baseStateFiles.length} files)`,
      `[${bootedAt}] Running test: ${request.testName}`,
      `[${resetAt}] Test complete — score avg: ${scores.average.toFixed(2)}`,
      `[${resetAt}] Factory reset complete`,
    ];

    response = {
      runId: request.runId,
      testId: request.testId,
      response: output.response,
      tokensIn: output.tokensIn,
      tokensOut: output.tokensOut,
      durationMs: 500 + Math.floor(Math.random() * 1000),
      logs,
      mdSnapshots,
      workerMeta: {
        workerId,
        bootedAt,
        resetAt,
        baseStateVersion: request.baseStateVersion,
      },
    };
  } catch (err) {
    const resetAt = new Date().toISOString();
    response = {
      runId: request.runId,
      testId: request.testId,
      response: "",
      tokensIn: 0,
      tokensOut: 0,
      durationMs: 0,
      logs: [
        `[${bootedAt}] Worker ${workerId} booted`,
        `[${resetAt}] ERROR: ${err instanceof Error ? err.message : String(err)}`,
        `[${resetAt}] Factory reset complete`,
      ],
      mdSnapshots: request.baseStateFiles.map((f) => ({ ...f, capturedAt: resetAt })),
      workerMeta: {
        workerId,
        bootedAt,
        resetAt,
        baseStateVersion: request.baseStateVersion,
      },
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // POST result back to dashboard webhook (loopback)
  await fetch(callbackUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  });
}
