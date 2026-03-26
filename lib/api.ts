import type { BaseState, CustomTest, ProviderConfig, RunEvidence, RunRecord, TestInstance } from "@/lib/types";

export async function fetchInstances(): Promise<TestInstance[]> {
  const res = await fetch("/api/instances");
  if (!res.ok) throw new Error("Failed to fetch instances");
  return res.json() as Promise<TestInstance[]>;
}

export async function createInstance(instance: TestInstance): Promise<TestInstance> {
  const res = await fetch("/api/instances", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(instance),
  });
  if (!res.ok) throw new Error("Failed to create instance");
  return res.json() as Promise<TestInstance>;
}

export async function updateInstance(
  id: string,
  patch: Partial<TestInstance>,
): Promise<TestInstance> {
  const res = await fetch(`/api/instances/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update instance");
  return res.json() as Promise<TestInstance>;
}

export async function deleteInstance(id: string): Promise<void> {
  const res = await fetch(`/api/instances/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete instance");
}

// ── Phase 3: Run + Evidence helpers ──────────────────────────────────────────

export async function triggerRun(instanceId: string): Promise<RunRecord> {
  const res = await fetch(`/api/instances/${instanceId}/run`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger run");
  return res.json() as Promise<RunRecord>;
}

export async function pollRun(runId: string): Promise<RunRecord> {
  const res = await fetch(`/api/runs/${runId}`);
  if (!res.ok) throw new Error("Failed to poll run");
  return res.json() as Promise<RunRecord>;
}

export async function fetchRunHistory(instanceId: string): Promise<RunRecord[]> {
  const res = await fetch(`/api/instances/${instanceId}/runs`);
  if (!res.ok) throw new Error("Failed to fetch run history");
  return res.json() as Promise<RunRecord[]>;
}

export async function fetchRunEvidence(runId: string): Promise<RunEvidence[]> {
  const res = await fetch(`/api/runs/${runId}/evidence`);
  if (!res.ok) throw new Error("Failed to fetch run evidence");
  return res.json() as Promise<RunEvidence[]>;
}

export async function fetchBaseStates(): Promise<BaseState[]> {
  const res = await fetch("/api/base-states");
  if (!res.ok) throw new Error("Failed to fetch base states");
  return res.json() as Promise<BaseState[]>;
}

// ── Settings: Providers ───────────────────────────────────────────────────────

export async function fetchProviders(): Promise<ProviderConfig[]> {
  const res = await fetch("/api/settings/providers");
  if (!res.ok) throw new Error("Failed to fetch providers");
  return res.json() as Promise<ProviderConfig[]>;
}

export async function createProvider(p: ProviderConfig): Promise<ProviderConfig> {
  const res = await fetch("/api/settings/providers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
  if (!res.ok) throw new Error("Failed to create provider");
  return res.json() as Promise<ProviderConfig>;
}

export async function updateProvider(id: string, patch: Partial<ProviderConfig>): Promise<ProviderConfig> {
  const res = await fetch(`/api/settings/providers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update provider");
  return res.json() as Promise<ProviderConfig>;
}

export async function deleteProvider(id: string): Promise<void> {
  const res = await fetch(`/api/settings/providers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete provider");
}

// ── Settings: Custom Tests ────────────────────────────────────────────────────

export async function fetchCustomTests(): Promise<CustomTest[]> {
  const res = await fetch("/api/settings/tests");
  if (!res.ok) throw new Error("Failed to fetch custom tests");
  return res.json() as Promise<CustomTest[]>;
}

export async function createCustomTest(t: CustomTest): Promise<CustomTest> {
  const res = await fetch("/api/settings/tests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t),
  });
  if (!res.ok) throw new Error("Failed to create custom test");
  return res.json() as Promise<CustomTest>;
}

export async function updateCustomTest(id: string, patch: Partial<CustomTest>): Promise<CustomTest> {
  const res = await fetch(`/api/settings/tests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update custom test");
  return res.json() as Promise<CustomTest>;
}

export async function deleteCustomTest(id: string): Promise<void> {
  const res = await fetch(`/api/settings/tests/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete custom test");
}
