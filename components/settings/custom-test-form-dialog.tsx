"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CustomTest } from "@/lib/types";

type Props = {
  trigger: React.ReactNode;
  existing?: CustomTest;
  onSave: (data: Pick<CustomTest, "name" | "prompt">) => void;
};

export function CustomTestFormDialog({ trigger, existing, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (!open) return;
    function reset() {
      setName(existing?.name ?? "");
      setPrompt(existing?.prompt ?? "");
    }
    reset();
  }, [open, existing]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !prompt.trim()) return;
    onSave({ name: name.trim(), prompt: prompt.trim() });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)} className="contents">{trigger}</span>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Test" : "Add Test"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Test name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summarise long document"
              className="h-9"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the full prompt that will be sent to the model…"
              className="min-h-32 resize-y text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!name.trim() || !prompt.trim()}>
              {existing ? "Save changes" : "Add test"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
