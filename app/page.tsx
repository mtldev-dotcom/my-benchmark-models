"use client";

import { useMemo, useState } from "react";
import { CreateInstanceDialog } from "@/components/instances/create-instance-dialog";
import { InstanceCard } from "@/components/instances/instance-card";
import { InstanceFilters, type FilterState } from "@/components/instances/instance-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockInstances } from "@/lib/mock-instances";
import { runInstance } from "@/lib/run-instance";
import type { TestInstance } from "@/lib/types";

const initialFilters: FilterState = {
  search: "",
  status: "all",
  model: "all",
  agentType: "all",
  sortBy: "latest",
  bulkAction: "none",
};

export default function InstancesPage() {
  const [instances, setInstances] = useState<TestInstance[]>(mockInstances);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

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

  const runInstanceById = async (id: string) => {
    const current = instances.find((i) => i.id === id);
    if (!current || current.status === "running") return;

    await runInstance(current, (live) => {
      setInstances((prev) => prev.map((item) => (item.id === id ? live : item)));
    });
  };

  const startInstance = (id: string) => {
    void runInstanceById(id);
  };

  const rerunInstance = (id: string) => {
    void runInstanceById(id);
  };

  const deleteInstance = (id: string) => {
    setInstances((prev) => prev.filter((i) => i.id !== id));
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
        <CreateInstanceDialog onCreate={(instance) => setInstances((prev) => [instance, ...prev])} />
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
        {instances.length === 0 ? (
          <Card className="rounded-2xl border-dashed shadow-none">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <h2 className="text-lg font-semibold">No instances yet</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Create your first test instance to start evaluating model behavior and performance.
              </p>
              <CreateInstanceDialog onCreate={(instance) => setInstances([instance])} />
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
                onStart={startInstance}
                onRerun={rerunInstance}
                onDelete={deleteInstance}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
