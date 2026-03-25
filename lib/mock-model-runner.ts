import type { MockRunnerInput, MockRunnerOutput } from "@/lib/types";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runMockModelTest({ instance, test }: MockRunnerInput): Promise<MockRunnerOutput> {
  const seed = hashString(`${instance.id}:${instance.model}:${test.id}:${instance.runCount}`);
  const delayMs = 500 + (seed % 1000);
  await sleep(delayMs);

  const shouldFail = seed % 11 === 0;
  if (shouldFail) {
    throw new Error(`Mock runner transient failure on ${test.id}`);
  }

  const tokensIn = 120 + (seed % 260);
  const tokensOut = 180 + (seed % 420);

  return {
    response: `[mock:${instance.provider}/${instance.model}] ${test.name} completed with structured output and implementation-ready detail.`,
    tokensIn,
    tokensOut,
  };
}
