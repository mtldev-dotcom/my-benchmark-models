"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProvidersSection } from "@/components/settings/providers-section";
import { TestsSection } from "@/components/settings/tests-section";
import {
  fetchProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  fetchCustomTests,
  createCustomTest,
  updateCustomTest,
  deleteCustomTest,
} from "@/lib/api";
import type { CustomTest, ProviderConfig } from "@/lib/types";

export default function SettingsPage() {
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [tests, setTests] = useState<CustomTest[]>([]);

  useEffect(() => {
    void fetchProviders().then(setProviders).catch(console.error);
    void fetchCustomTests().then(setTests).catch(console.error);
  }, []);

  // ── Providers ──────────────────────────────────────────────────────────────

  const handleCreateProvider = async (
    data: Omit<ProviderConfig, "id" | "createdAt" | "updatedAt">,
  ) => {
    const now = new Date().toISOString();
    const next: ProviderConfig = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await createProvider(next);
    setProviders((prev) => [...prev, next]);
  };

  const handleUpdateProvider = async (id: string, patch: Partial<ProviderConfig>) => {
    const updated = await updateProvider(id, patch);
    setProviders((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const handleDeleteProvider = async (id: string) => {
    await deleteProvider(id);
    setProviders((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Tests ──────────────────────────────────────────────────────────────────

  const handleCreateTest = async (data: Pick<CustomTest, "name" | "prompt">) => {
    const now = new Date().toISOString();
    const next: CustomTest = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    await createCustomTest(next);
    setTests((prev) => [...prev, next]);
  };

  const handleUpdateTest = async (id: string, patch: Pick<CustomTest, "name" | "prompt">) => {
    const updated = await updateCustomTest(id, patch);
    setTests((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDeleteTest = async (id: string) => {
    await deleteCustomTest(id);
    setTests((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 p-4 sm:p-6">
      {/* Header */}
      <section className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="Back to dashboard"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Providers, API keys, and test library.</p>
        </div>
      </section>

      <div className="h-px bg-border" />

      <ProvidersSection
        providers={providers}
        onCreate={(data) => void handleCreateProvider(data)}
        onUpdate={(id, patch) => void handleUpdateProvider(id, patch)}
        onDelete={(id) => void handleDeleteProvider(id)}
      />

      <div className="h-px bg-border" />

      <TestsSection
        tests={tests}
        onCreate={(data) => void handleCreateTest(data)}
        onUpdate={(id, patch) => void handleUpdateTest(id, patch)}
        onDelete={(id) => void handleDeleteTest(id)}
      />
    </main>
  );
}
