import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RunRecord } from "@/lib/types";

type Props = {
  runs: RunRecord[];
  onSelectRun: (run: RunRecord) => void;
};

const statusVariant: Record<RunRecord["status"], "default" | "secondary" | "destructive" | "outline"> = {
  running: "secondary",
  completed: "default",
  failed: "destructive",
  timeout: "destructive",
};

export function RunHistoryList({ runs, onSelectRun }: Props) {
  if (runs.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">No runs yet.</p>
    );
  }

  return (
    <div className="space-y-2">
      {runs.map((run) => (
        <div
          key={run.id}
          className="flex items-center justify-between gap-3 rounded-lg border p-3 text-xs"
        >
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">
                {run.id.slice(-8)}
              </span>
              <Badge variant={statusVariant[run.status]} className="capitalize text-[10px]">
                {run.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {new Date(run.startedAt).toLocaleString()}
              {run.summary.score > 0 && (
                <span className="ml-2 font-medium text-foreground">
                  Score {run.summary.score}
                </span>
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 shrink-0 px-2 text-xs"
            onClick={() => onSelectRun(run)}
            disabled={run.status === "running"}
          >
            Evidence
          </Button>
        </div>
      ))}
    </div>
  );
}
