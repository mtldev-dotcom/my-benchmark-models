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
  evidenceId?: string;
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
  lastRunAt: string | null;
  notes?: string;
  runCount: number;
  lastError?: string;
  results: TestResult[];
  // Phase 3 additions
  latestRunId: string | null;
  baseStateVersion: string | null;
  openclawEnabled: boolean;
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

// ── Phase 3: OpenClaw runtime types ──────────────────────────────────────────

export type MdFileSnapshot = {
  filename: string;
  content: string;
  capturedAt: string;
};

export type MdFileDiff = {
  filename: string;
  before: string;
  after: string;
  changed: boolean;
};

export type RunEvidence = {
  runId: string;
  testId: string;
  logs: string[];
  mdDiffs: MdFileDiff[];
  rawResponse: string;
  workerMeta: {
    workerId: string;
    bootedAt: string;
    resetAt: string;
    baseStateVersion: string;
  };
};

export type RunRecord = {
  id: string;
  instanceId: string;
  startedAt: string;
  completedAt: string | null;
  status: "running" | "completed" | "failed" | "timeout";
  baseStateVersion: string;
  results: TestResult[];
  summary: {
    score: number;
    speed: string;
    tokens: number;
    passed: number;
    failed: number;
  };
  lastError?: string;
};

export type BaseState = {
  id: string;
  version: string;
  label: string;
  files: MdFileSnapshot[];
  createdAt: string;
  isActive: boolean;
};

export type OpenClawWorkerRequest = {
  runId: string;
  testId: string;
  testName: string;
  prompt: string;
  baseStateVersion: string;
  baseStateFiles: MdFileSnapshot[];
  timeoutMs: number;
  modelSettings: {
    model: string;
    provider: string;
    contextWindow: string;
  };
};

export type OpenClawWorkerResponse = {
  runId: string;
  testId: string;
  response: string;
  tokensIn: number;
  tokensOut: number;
  durationMs: number;
  logs: string[];
  mdSnapshots: MdFileSnapshot[];
  workerMeta: {
    workerId: string;
    bootedAt: string;
    resetAt: string;
    baseStateVersion: string;
  };
  error?: string;
};

// ── Settings ──────────────────────────────────────────────────────────────────

export type ProviderId =
  | "openai"
  | "anthropic"
  | "openrouter"
  | "google"
  | "moonshot"
  | "zai";

export type ProviderConfig = {
  id: string;
  providerId: ProviderId;
  displayName: string;
  apiKey: string;
  enabledModels: string[];
  createdAt: string;
  updatedAt: string;
};

export type CustomTest = {
  id: string;
  name: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
};
