"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MdFileDiff } from "@/lib/types";

type Props = {
  diffs: MdFileDiff[];
};

function FileDiff({ diff }: { diff: MdFileDiff }) {
  const [open, setOpen] = useState(diff.changed);

  return (
    <div className="rounded-lg border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className="font-mono text-xs font-medium">{diff.filename}</span>
        </div>
        {diff.changed ? (
          <Badge variant="secondary" className="text-[10px]">changed</Badge>
        ) : (
          <Badge variant="outline" className="text-[10px] text-muted-foreground">unchanged</Badge>
        )}
      </button>

      {open && (
        <div className="border-t">
          {diff.changed ? (
            <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="p-3">
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Before</p>
                <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-[11px] leading-5">
                  {diff.before || <span className="italic text-muted-foreground">(empty)</span>}
                </pre>
              </div>
              <div className="p-3">
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">After</p>
                <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-[11px] leading-5">
                  {diff.after || <span className="italic text-muted-foreground">(empty)</span>}
                </pre>
              </div>
            </div>
          ) : (
            <p className="px-3 py-2 text-xs text-muted-foreground">No changes to this file.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function MdDiffViewer({ diffs }: Props) {
  if (diffs.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-muted-foreground">No MD files tracked.</p>
    );
  }

  const changedCount = diffs.filter((d) => d.changed).length;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {changedCount > 0
          ? `${changedCount} of ${diffs.length} files changed`
          : `${diffs.length} files — no changes`}
      </p>
      {diffs.map((diff) => (
        <FileDiff key={diff.filename} diff={diff} />
      ))}
    </div>
  );
}
