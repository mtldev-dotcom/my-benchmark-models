import type { ScoreBreakdown, TestResult } from "@/lib/types";

function clampScore(value: number): number {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function scoreTest(input: { prompt: string; response: string; failed?: boolean }): ScoreBreakdown {
  if (input.failed) {
    return {
      accuracy: 1,
      instructionFollowing: 1,
      reliability: 1,
      average: 1,
    };
  }

  const seed = hashString(`${input.prompt}::${input.response}`);
  const accuracy = clampScore(2 + (seed % 4));
  const instructionFollowing = clampScore(2 + ((seed >> 2) % 4));
  const reliability = clampScore(2 + ((seed >> 4) % 4));
  const average = Number(((accuracy + instructionFollowing + reliability) / 3).toFixed(2));

  return {
    accuracy,
    instructionFollowing,
    reliability,
    average,
  };
}

export function summarizeRun(results: TestResult[]) {
  if (results.length === 0) {
    return {
      score: 0,
      speed: "-",
      tokens: 0,
      averagePerTest: 0,
      passed: 0,
      failed: 0,
    };
  }

  const totalDuration = results.reduce((sum, result) => sum + result.durationMs, 0);
  const totalTokens = results.reduce((sum, result) => sum + result.totalTokens, 0);
  const averagePerTest =
    results.reduce((sum, result) => sum + result.scores.average, 0) / Math.max(1, results.length);
  const passed = results.filter((result) => result.status === "passed").length;
  const failed = results.length - passed;

  return {
    score: Math.round((averagePerTest / 5) * 100),
    speed: `${(totalDuration / results.length / 1000).toFixed(2)}s`,
    tokens: totalTokens,
    averagePerTest: Number(averagePerTest.toFixed(2)),
    passed,
    failed,
  };
}
