"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { CreateInstanceDialog } from "@/components/instances/create-instance-dialog";
import { HelpDialog } from "@/components/instances/help-dialog";
import { InstanceCard } from "@/components/instances/instance-card";
import { InstanceFilters, type FilterState } from "@/components/instances/instance-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  fetchInstances,
  createInstance,
  updateInstance,
  deleteInstance,
  triggerRun,
  pollRun,
} from "@/lib/api";
import type { TestInstance } from "@/lib/types";

const initialFilters: FilterState = {
  search: "",
  status: "all",
  model: "all",
  agentType: "all",
  sortBy: "latest",
};

export default function InstancesPage() {
  const [instances, setInstances] = useState<TestInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Map of instanceId -> runId being polled
  const activePolls = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    fetchInstances()
      .then((data) =>
        // Backfill Phase 3 fields for seeded records that predate them
        data.map((i) => ({
          ...i,
          latestRunId: i.latestRunId ?? null,
          baseStateVersion: i.baseStateVersion ?? null,
          openclawEnabled: i.openclawEnabled ?? false,
        })),
      )
      .then(setInstances)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Polling loop — checks all actively running instances every 2s
  useEffect(() => {
    const interval = setInterval(async () => {
      const polls = Array.from(activePolls.current.entries());
      if (polls.length === 0) return;

      await Promise.all(
        polls.map(async ([instanceId, runId]) => {
          try {
            const run = await pollRun(runId);
            if (run.status === "running") return; // still in progress

            // Terminal state — update instance and stop polling
            activePolls.current.delete(instanceId);
            setInstances((prev) =>
              prev.map((i) => {
                if (i.id !== instanceId) return i;
                return {
                  ...i,
                  status: run.status === "completed" ? "tested" : run.status === "failed" ? "failed" : i.status,
                  score: run.summary.score,
                  speed: run.summary.speed,
                  tokens: run.summary.tokens,
                  results: run.results,
                  latestRunId: runId,
                };
              }),
            );
          } catch {
            // Silently ignore transient poll errors
          }
        }),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const statuses = useMemo(() => [...new Set(instances.map((i) => i.status))], [instances]);
  const models = useMemo(() => [...new Set(instances.map((i) => i.model))], [instances]);
  const agentTypes = useMemo(() => [...new Set(instances.map((i) => i.agentType))], [instances]);

  const stats = useMemo(
    () => ({
      total: instances.length,
      running: instances.filter((i) => i.status === "running").length,
      tested: instances.filter((i) => i.status === "tested").length,
      failed: instances.filter((i) => i.status === "failed").length,
    }),
    [instances],
  );

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    const next = instances.filter((i) => {
      const matchesSearch = !q || [i.name, i.model, i.provider, i.testPack].join(" ").toLowerCase().includes(q);
      const matchesStatus = filters.status === "all" || i.status === filters.status;
      const matchesModel = filters.model === "all" || i.model === filters.model;
      const matchesAgent = filters.agentType === "all" || i.agentType === filters.agentType;
      return matchesSearch && matchesStatus && matchesModel && matchesAgent;
    });
    return [...next].sort((a, b) => {
      if (filters.sortBy === "latest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (filters.sortBy === "oldest") return +new Date(a.createdAt) - +new Date(b.createdAt);
      if (filters.sortBy === "score") return b.score - a.score;
      if (filters.sortBy === "tokens") return b.tokens - a.tokens;
      return 0;
    });
  }, [instances, filters]);

  const handleCreate = async (instance: TestInstance) => {
    const withDefaults: TestInstance = {
      ...instance,
      latestRunId: instance.latestRunId ?? null,
      baseStateVersion: instance.baseStateVersion ?? null,
      openclawEnabled: instance.openclawEnabled ?? false,
    };
    await createInstance(withDefaults);
    setInstances((prev) => [withDefaults, ...prev]);
  };

  const handleRunInstance = async (id: string) => {
    const current = instances.find((i) => i.id === id);
    if (!current || current.status === "running") return;

    // Optimistically mark as running
    setInstances((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "running", lastRunAt: new Date().toISOString() } : i)),
    );

    try {
      const run = await triggerRun(id);
      // Register for polling
      activePolls.current.set(id, run.id);
      setInstances((prev) =>
        prev.map((i) => (i.id === id ? { ...i, latestRunId: run.id } : i)),
      );
    } catch (err) {
      // Revert optimistic update on failure
      setInstances((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: current.status } : i)),
      );
      console.error("Failed to trigger run:", err);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteInstance(id);
    activePolls.current.delete(id);
    setInstances((prev) => prev.filter((i) => i.id !== id));
  };

  const handleEdit = async (updated: TestInstance) => {
    await updateInstance(updated.id, updated);
    setInstances((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Instances</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Create, manage, and run model test instances for your evaluation workflow.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <HelpDialog />
          <Link
            href="/settings"
            aria-label="Settings"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <CreateInstanceDialog onCreate={handleCreate} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Total Instances", stats.total],
          ["Running", stats.running],
          ["Tested", stats.tested],
          ["Failed", stats.failed],
        ].map(([label, value]) => (
          <Card key={label as string} className="rounded-2xl shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
              <p className="mt-1 text-xl font-semibold sm:text-2xl">{value as number}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <InstanceFilters
        filters={filters}
        statuses={statuses}
        models={models}
        agentTypes={agentTypes}
        onChange={setFilters}
      />

      <section>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">Loading instances…</p>
          </div>
        ) : instances.length === 0 ? (
          <Card className="rounded-2xl border-dashed shadow-none">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <h2 className="text-lg font-semibold">No instances yet</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Create your first test instance to start evaluating model behavior and performance.
              </p>
              <CreateInstanceDialog onCreate={handleCreate} />
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="rounded-2xl border-dashed shadow-none">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <h2 className="text-lg font-semibold">No matching instances</h2>
              <p className="max-w-md text-sm text-muted-foreground">Try adjusting your search or filters.</p>
              <Button variant="outline" onClick={() => setFilters(initialFilters)}>
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((instance) => (
              <InstanceCard
                key={instance.id}
                instance={instance}
                onStart={(id) => void handleRunInstance(id)}
                onRerun={(id) => void handleRunInstance(id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
