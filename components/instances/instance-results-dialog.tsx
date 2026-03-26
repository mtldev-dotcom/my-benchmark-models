"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RunEvidencePanel } from "@/components/instances/run-evidence-panel";
import { RunHistoryList } from "@/components/instances/run-history-list";
import { fetchRunEvidence, fetchRunHistory } from "@/lib/api";
import type { RunEvidence, RunRecord, TestInstance, TestResult } from "@/lib/types";

type Props = {
  instance: TestInstance;
};

type MainTab = "results" | "history";

function ResultRow({ result }: { result: TestResult }) {
  return (
    <div className="rounded-xl border p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-sm">{result.testName}</p>
        <Badge variant={result.status === "passed" ? "default" : "destructive"} className="capitalize">
          {result.status}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-muted-foreground">Score</p>
          <p className="font-medium">{result.scores.average.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Duration</p>
          <p className="font-medium">{(result.durationMs / 1000).toFixed(1)}s</p>
        </div>
        <div>
          <p className="text-muted-foreground">Tokens</p>
          <p className="font-medium">{result.totalTokens.toLocaleString()}</p>
        </div>
      </div>
      {result.error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-2 py-1 text-destructive">
          {result.error}
        </p>
      )}
    </div>
  );
}

export function InstanceResultsDialog({ instance }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<MainTab>("results");
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [selectedRun, setSelectedRun] = useState<RunRecord | null>(null);
  const [evidence, setEvidence] = useState<RunEvidence[]>([]);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Load run history when switching to history tab
  useEffect(() => {
    if (!open || tab !== "history") return;
    async function load() {
      setHistoryLoading(true);
      try {
        const data = await fetchRunHistory(instance.id);
        setRuns(data);
      } catch (err) {
        console.error(err);
      } finally {
        setHistoryLoading(false);
      }
    }
    void load();
  }, [open, tab, instance.id]);

  // Load evidence when a run is selected
  useEffect(() => {
    if (!selectedRun) return;
    async function load() {
      setEvidenceLoading(true);
      try {
        const data = await fetchRunEvidence(selectedRun!.id);
        setEvidence(data);
      } catch (err) {
        console.error(err);
      } finally {
        setEvidenceLoading(false);
      }
    }
    void load();
  }, [selectedRun]);

  function handleSelectRun(run: RunRecord) {
    setSelectedRun(run);
    setEvidence([]);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setTab("results");
      setSelectedRun(null);
      setEvidence([]);
    }
  }

  const tabs: { key: MainTab; label: string }[] = [
    { key: "results", label: "Latest Results" },
    { key: "history", label: "Run History" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button className="h-10 w-full" size="sm" variant="outline" />}>
        View Results
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{instance.name} — Results</DialogTitle>
        </DialogHeader>

        {/* Main tab strip */}
        <div className="flex gap-1 border-b">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelectedRun(null); }}
              className={[
                "border-b-2 px-3 py-2 text-xs font-medium transition-colors",
                tab === t.key
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="pt-1">
          {/* Latest Results tab */}
          {tab === "results" && (
            instance.results.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No results yet.</p>
            ) : (
              <div className="space-y-3">
                {instance.results.map((result) => (
                  <ResultRow key={result.testId} result={result} />
                ))}
              </div>
            )
          )}

          {/* Run History tab */}
          {tab === "history" && (
            selectedRun ? (
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedRun(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ← Back to history
                </button>
                <RunEvidencePanel
                  run={selectedRun}
                  evidence={evidence}
                  loading={evidenceLoading}
                />
              </div>
            ) : (
              historyLoading ? (
                <p className="py-6 text-center text-xs text-muted-foreground">Loading history…</p>
              ) : (
                <RunHistoryList runs={runs} onSelectRun={handleSelectRun} />
              )
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
