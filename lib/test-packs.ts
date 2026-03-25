import type { AgentType, TestPack } from "@/lib/types";

const OPERATOR_PACK: TestPack = {
  id: "operator-locked-v1",
  name: "Operator Locked Pack",
  agentType: "operator",
  tests: [
    {
      id: "op-01",
      name: "Priority Triage",
      prompt: "Given 8 incoming ops tasks, return a ranked top-3 with one-line reasons and execution order.",
      critical: true,
    },
    {
      id: "op-02",
      name: "Failure Recovery Plan",
      prompt: "A webhook pipeline failed twice. Propose a safe retry plan with guardrails and rollback checks.",
    },
    {
      id: "op-03",
      name: "Status Summary",
      prompt: "Summarize current system status in a concise update for stakeholders with clear next actions.",
    },
  ],
};

const ENGINEER_PACK: TestPack = {
  id: "engineer-locked-v1",
  name: "Engineer Locked Pack",
  agentType: "engineer",
  tests: [
    {
      id: "eng-01",
      name: "Refactor Safety",
      prompt: "Refactor a multi-module TypeScript flow while preserving behavior. Return a minimal migration plan.",
      critical: true,
    },
    {
      id: "eng-02",
      name: "API Contract Guard",
      prompt: "Given request/response examples, identify potential API contract breaks and propose type-safe fixes.",
    },
    {
      id: "eng-03",
      name: "Regression Strategy",
      prompt: "Design a fast regression test strategy for a Next.js App Router feature with edge cases.",
    },
  ],
};

const CONTENT_PACK: TestPack = {
  id: "content-locked-v1",
  name: "Content Locked Pack",
  agentType: "content",
  tests: [
    {
      id: "cnt-01",
      name: "Hook Variants",
      prompt: "Generate 5 high-performing social hooks for a premium product launch in concise brand-safe tone.",
      critical: true,
    },
    {
      id: "cnt-02",
      name: "Bilingual Tone",
      prompt: "Rewrite a product snippet in EN and FR while preserving premium tone and clarity.",
    },
    {
      id: "cnt-03",
      name: "CTA Precision",
      prompt: "Create 4 CTA variants for conversion without sounding aggressive or spammy.",
    },
  ],
};

export const TEST_PACKS: Record<AgentType, TestPack> = {
  operator: OPERATOR_PACK,
  engineer: ENGINEER_PACK,
  content: CONTENT_PACK,
};

export function getLockedTestPack(agentType: AgentType): TestPack {
  return TEST_PACKS[agentType];
}
