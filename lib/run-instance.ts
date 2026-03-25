import { runMockModelTest } from "@/lib/mock-model-runner";
import { summarizeRun, scoreTest } from "@/lib/scoring";
import { getLockedTestPack } from "@/lib/test-packs";
import type { TestInstance, TestResult } from "@/lib/types";

export async function runInstance(instance: TestInstance, onUpdate?: (next: TestInstance) => void): Promise<TestInstance> {
  const runStartedAt = new Date().toISOString();
  let next: TestInstance = {
    ...instance,
    status: "running",
    lastRunAt: runStartedAt,
    lastError: undefined,
    results: [],
  };

  onUpdate?.(next);

  const pack = getLockedTestPack(instance.agentType);
  const results: TestResult[] = [];
  let criticalFailure = false;

  for (const test of pack.tests) {
    const startedAt = new Date();

    try {
      const output = await runMockModelTest({ instance: next, test });
      const completedAt = new Date();
      const scores = scoreTest({ prompt: test.prompt, response: output.response });

      results.push({
        testId: test.id,
        testName: test.name,
        prompt: test.prompt,
        response: output.response,
        status: "passed",
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs: completedAt.getTime() - startedAt.getTime(),
        tokensIn: output.tokensIn,
        tokensOut: output.tokensOut,
        totalTokens: output.tokensIn + output.tokensOut,
        scores,
        accuracy: scores.accuracy,
        instructionFollowing: scores.instructionFollowing,
        reliability: scores.reliability,
      });
    } catch (error) {
      const completedAt = new Date();
      const errorMessage = error instanceof Error ? error.message : "Unknown test run error";
      const scores = scoreTest({ prompt: test.prompt, response: "", failed: true });

      results.push({
        testId: test.id,
        testName: test.name,
        prompt: test.prompt,
        response: "",
        status: "failed",
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs: completedAt.getTime() - startedAt.getTime(),
        tokensIn: 0,
        tokensOut: 0,
        totalTokens: 0,
        scores,
        accuracy: scores.accuracy,
        instructionFollowing: scores.instructionFollowing,
        reliability: scores.reliability,
        error: errorMessage,
      });

      next.lastError = errorMessage;
      if (test.critical) {
        criticalFailure = true;
      }
    }

    const summary = summarizeRun(results);
    next = {
      ...next,
      results: [...results],
      score: summary.score,
      speed: summary.speed,
      tokens: summary.tokens,
      status: "running",
    };
    onUpdate?.(next);

    if (criticalFailure) {
      break;
    }
  }

  const finalSummary = summarizeRun(results);
  const hasFailure = results.some((result) => result.status === "failed");

  next = {
    ...next,
    testPack: pack.name,
    runCount: instance.runCount + 1,
    results,
    score: finalSummary.score,
    speed: finalSummary.speed,
    tokens: finalSummary.tokens,
    status: hasFailure ? "failed" : "tested",
  };

  onUpdate?.(next);

  return next;
}
