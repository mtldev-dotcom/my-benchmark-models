"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LogsViewer } from "@/components/instances/logs-viewer";
import { MdDiffViewer } from "@/components/instances/md-diff-viewer";
import type { RunEvidence, RunRecord, TestResult } from "@/lib/types";
import { Badge as BadgeUI } from "@/components/ui/badge";

type Tab = "results" | "logs" | "md";

type Props = {
  run: RunRecord;
  evidence: RunEvidence[];
  loading: boolean;
};

const statusVariant: Record<RunRecord["status"], "default" | "secondary" | "destructive" | "outline"> = {
  running: "secondary",
  completed: "default",
  failed: "destructive",
  timeout: "destructive",
};

function ResultRow({ result }: { result: TestResult }) {
  return (
    <div className="space-y-2 rounded-xl border p-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{result.testName}</p>
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

export function RunEvidencePanel({ run, evidence, loading }: Props) {
  const [tab, setTab] = useState<Tab>("results");

  const allLogs = evidence.flatMap((e) => e.logs);
  const allDiffs = evidence.flatMap((e) => e.mdDiffs);
  // Deduplicate diffs by filename — take last occurrence (most recent state)
  const uniqueDiffs = allDiffs.filter(
    (d, i, arr) => arr.findLastIndex((x) => x.filename === d.filename) === i,
  );

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "results", label: "Results", count: run.results.length },
    { key: "logs", label: "Logs", count: allLogs.length },
    { key: "md", label: "MD Changes", count: uniqueDiffs.filter((d) => d.changed).length },
  ];

  return (
    <div className="space-y-3">
      {/* Run summary bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono">{run.id.slice(-12)}</span>
        <BadgeUI variant={statusVariant[run.status]} className="capitalize text-[10px]">
          {run.status}
        </BadgeUI>
        <span>{new Date(run.startedAt).toLocaleString()}</span>
        <span className="font-mono text-[10px] rounded border px-1.5 py-0.5">
          base: {run.baseStateVersion}
        </span>
        {run.summary.score > 0 && (
          <span className="font-medium text-foreground">Score {run.summary.score}</span>
        )}
      </div>

      {/* Tab strip */}
      <div className="flex gap-1 border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors",
              tab === t.key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {loading ? (
        <p className="py-6 text-center text-xs text-muted-foreground">Loading evidence…</p>
      ) : (
        <div>
          {tab === "results" && (
            <div className="space-y-2">
              {run.results.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">No results yet.</p>
              ) : (
                run.results.map((r) => <ResultRow key={r.testId} result={r} />)
              )}
            </div>
          )}
          {tab === "logs" && <LogsViewer logs={allLogs} />}
          {tab === "md" && <MdDiffViewer diffs={uniqueDiffs} />}
        </div>
      )}
    </div>
  );
}
