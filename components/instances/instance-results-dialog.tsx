"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TestInstance, TestResult } from "@/lib/types";

type Props = {
  instance: TestInstance;
};

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="h-10 w-full" size="sm" variant="outline" />}>
        View Results
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{instance.name} — Results</DialogTitle>
        </DialogHeader>

        {instance.results.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No results yet.</p>
        ) : (
          <div className="space-y-3">
            {instance.results.map((result) => (
              <ResultRow key={result.testId} result={result} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
