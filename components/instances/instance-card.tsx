import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { TestInstance } from "@/lib/types";

type Props = {
  instance: TestInstance;
  onStart: (id: string) => void;
  onRerun: (id: string) => void;
  onDelete: (id: string) => void;
};

const statusVariant: Record<TestInstance["status"], "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  running: "secondary",
  tested: "default",
  failed: "destructive",
};

const agentTypeLabel: Record<TestInstance["agentType"], string> = {
  operator: "Operator",
  engineer: "Engineer",
  content: "Content",
};

export function InstanceCard({ instance, onStart, onRerun, onDelete }: Props) {
  const isRunning = instance.status === "running";
  const canStart = instance.status === "draft";
  const canRerun = instance.status === "tested" || instance.status === "failed";

  return (
    <Card className="rounded-2xl border shadow-none">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border text-lg">🦞</div>
            <div>
              <p className="text-sm font-semibold leading-tight">{instance.name}</p>
              <p className="text-xs text-muted-foreground">{instance.model}</p>
            </div>
          </div>
          <Badge variant={statusVariant[instance.status]} className="capitalize">
            {instance.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{new Date(instance.createdAt).toLocaleString()}</p>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          <p className="text-muted-foreground">Provider</p>
          <p className="text-right">{instance.provider}</p>
          <p className="text-muted-foreground">Agent Type</p>
          <p className="text-right">{agentTypeLabel[instance.agentType]}</p>
          <p className="text-muted-foreground">Test Pack</p>
          <p className="text-right">{instance.testPack}</p>
          <p className="text-muted-foreground">Last Run</p>
          <p className="text-right">{instance.lastRunAt === "-" ? "Not run yet" : new Date(instance.lastRunAt).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-xl border p-2 text-center text-xs">
          <div>
            <p className="text-muted-foreground">Speed</p>
            <p className="font-medium">{instance.speed}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tokens</p>
            <p className="font-medium">{instance.tokens.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Score</p>
            <p className="font-medium">{instance.score || "-"}</p>
          </div>
        </div>

        {!!instance.lastError && instance.status === "failed" ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/5 px-2 py-1 text-xs text-destructive">
            {instance.lastError}
          </p>
        ) : null}

        <p className="text-xs text-muted-foreground">Runs: {instance.runCount}</p>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button className="h-10" size="sm" onClick={() => onStart(instance.id)} disabled={!canStart || isRunning}>
          {isRunning ? "Running..." : "Start"}
        </Button>
        <Button
          className="h-10"
          size="sm"
          variant="secondary"
          onClick={() => onRerun(instance.id)}
          disabled={!canRerun || isRunning}
        >
          Rerun
        </Button>
        <Button className="h-10" size="sm" variant="outline" disabled={isRunning}>
          Edit
        </Button>
        <Button className="h-10" size="sm" variant="destructive" onClick={() => onDelete(instance.id)} disabled={isRunning}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
