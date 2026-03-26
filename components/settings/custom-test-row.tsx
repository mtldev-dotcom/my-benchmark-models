"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomTestFormDialog } from "@/components/settings/custom-test-form-dialog";
import type { CustomTest } from "@/lib/types";

type Props = {
  test: CustomTest;
  onUpdate: (id: string, patch: Pick<CustomTest, "name" | "prompt">) => void;
  onDelete: (id: string) => void;
};

export function CustomTestRow({ test, onUpdate, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border p-3 space-y-2 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-left font-medium hover:underline underline-offset-2"
          >
            {test.name}
          </button>
          {!expanded && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{test.prompt}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <CustomTestFormDialog
            trigger={
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Pencil className="h-3 w-3" />
              </Button>
            }
            existing={test}
            onSave={(data) => onUpdate(test.id, data)}
          />
          {confirmDelete ? (
            <>
              <Button
                variant="destructive"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onDelete(test.id)}
              >
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {expanded && (
        <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground font-mono leading-5">
          {test.prompt}
        </pre>
      )}
    </div>
  );
}
