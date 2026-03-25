export type InstanceStatus = "draft" | "running" | "tested" | "failed";
export type AgentType = "operator" | "engineer" | "content";

export type ScoreBreakdown = {
  accuracy: number;
  instructionFollowing: number;
  reliability: number;
  average: number;
};

export type TestResultStatus = "passed" | "failed";

export type TestResult = {
  testId: string;
  testName: string;
  prompt: string;
  response: string;
  status: TestResultStatus;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  tokensIn: number;
  tokensOut: number;
  totalTokens: number;
  scores: ScoreBreakdown;
  accuracy: number;
  instructionFollowing: number;
  reliability: number;
  error?: string;
};

export type TestDefinition = {
  id: string;
  name: string;
  prompt: string;
  critical?: boolean;
};

export type TestPack = {
  id: string;
  name: string;
  agentType: AgentType;
  tests: TestDefinition[];
};

export type TestInstance = {
  id: string;
  name: string;
  model: string;
  provider: string;
  agentType: AgentType;
  testPack: string;
  status: InstanceStatus;
  contextWindow: string;
  score: number;
  speed: string;
  tokens: number;
  createdAt: string;
  lastRunAt: string;
  notes?: string;
  runCount: number;
  lastError?: string;
  results: TestResult[];
};

export type MockRunnerInput = {
  instance: TestInstance;
  test: TestDefinition;
};

export type MockRunnerOutput = {
  response: string;
  tokensIn: number;
  tokensOut: number;
};
