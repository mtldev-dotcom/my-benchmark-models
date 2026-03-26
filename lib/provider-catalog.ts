import type { ProviderId } from "@/lib/types";

export type ProviderMeta = {
  id: ProviderId;
  name: string;
  models: string[];
};

export const PROVIDER_CATALOG: ProviderMeta[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
      "o1",
      "o1-mini",
      "o3-mini",
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      "claude-opus-4-6",
      "claude-sonnet-4-6",
      "claude-haiku-4-5",
      "claude-3-opus-20240229",
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    models: [
      "openrouter/auto",
      "meta-llama/llama-3.1-405b-instruct",
      "mistralai/mixtral-8x7b-instruct",
      "microsoft/phi-3-medium-128k-instruct",
      "nousresearch/hermes-3-llama-3.1-405b",
      "qwen/qwen-2.5-72b-instruct",
    ],
  },
  {
    id: "google",
    name: "Google",
    models: [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
    ],
  },
  {
    id: "moonshot",
    name: "Moonshot",
    models: [
      "moonshot-v1-8k",
      "moonshot-v1-32k",
      "moonshot-v1-128k",
    ],
  },
  {
    id: "zai",
    name: "Z.ai",
    models: [
      "glm-4",
      "glm-4-flash",
      "glm-4-air",
      "glm-4-airx",
      "glm-4v",
      "glm-5-turbo",
    ],
  },
];

export const PROVIDER_MAP = Object.fromEntries(
  PROVIDER_CATALOG.map((p) => [p.id, p]),
) as Record<ProviderId, ProviderMeta>;
