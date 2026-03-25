import type { TestInstance } from "@/lib/types";

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
