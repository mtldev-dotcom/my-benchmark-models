import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  logs: string[];
};

export function LogsViewer({ logs }: Props) {
  function handleCopy() {
    void navigator.clipboard.writeText(logs.join("\n"));
  }

  if (logs.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-muted-foreground">No logs captured.</p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{logs.length} lines</p>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs" onClick={handleCopy}>
          <Copy className="h-3 w-3" />
          Copy
        </Button>
      </div>
      <div className="max-h-56 overflow-y-auto rounded-lg border bg-muted/30 p-3">
        {logs.map((line, i) => (
          <p key={i} className="font-mono text-[11px] leading-5 text-muted-foreground">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
