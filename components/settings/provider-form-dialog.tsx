"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROVIDER_CATALOG, PROVIDER_MAP } from "@/lib/provider-catalog";
import type { ProviderId, ProviderConfig } from "@/lib/types";

type Props = {
  trigger: React.ReactNode;
  existing?: ProviderConfig;
  onSave: (data: Omit<ProviderConfig, "id" | "createdAt" | "updatedAt">) => void;
};

type FormState = {
  providerId: ProviderId;
  displayName: string;
  apiKey: string;
  enabledModels: string[];
};

export function ProviderFormDialog({ trigger, existing, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [form, setForm] = useState<FormState>({
    providerId: "openai",
    displayName: "",
    apiKey: "",
    enabledModels: [],
  });

  useEffect(() => {
    if (!open) return;
    function reset() {
      setForm(
        existing
          ? {
              providerId: existing.providerId,
              displayName: existing.displayName,
              apiKey: existing.apiKey,
              enabledModels: existing.enabledModels,
            }
          : { providerId: "openai", displayName: "OpenAI", apiKey: "", enabledModels: [] },
      );
      setShowKey(false);
    }
    reset();
  }, [open, existing]);

  const catalogEntry = PROVIDER_MAP[form.providerId];

  function handleProviderChange(id: ProviderId) {
    setForm((f) => ({
      ...f,
      providerId: id,
      displayName: PROVIDER_MAP[id].name,
      enabledModels: [],
    }));
  }

  function toggleModel(model: string) {
    setForm((f) => ({
      ...f,
      enabledModels: f.enabledModels.includes(model)
        ? f.enabledModels.filter((m) => m !== model)
        : [...f.enabledModels, model],
    }));
  }

  function selectAll() {
    setForm((f) => ({ ...f, enabledModels: catalogEntry.models.slice() }));
  }

  function deselectAll() {
    setForm((f) => ({ ...f, enabledModels: [] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      providerId: form.providerId,
      displayName: form.displayName.trim() || catalogEntry.name,
      apiKey: form.apiKey,
      enabledModels: form.enabledModels,
    });
    setOpen(false);
  }

  const allSelected = form.enabledModels.length === catalogEntry.models.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)} className="contents">{trigger}</span>
      <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Provider" : "Add Provider"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Provider selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Provider</label>
            <Select
              value={form.providerId}
              onValueChange={(v) => v && handleProviderChange(v as ProviderId)}
              disabled={!!existing}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDER_CATALOG.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Display name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Display name</label>
            <Input
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              placeholder={catalogEntry.name}
              className="h-9"
            />
          </div>

          {/* API key */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium">API Key</label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={form.apiKey}
                onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                placeholder={existing ? "Leave blank to keep existing key" : "sk-..."}
                className="h-9 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Model selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">
                Models{" "}
                <span className="font-normal text-muted-foreground">
                  ({form.enabledModels.length}/{catalogEntry.models.length} selected)
                </span>
              </label>
              <button
                type="button"
                onClick={allSelected ? deselectAll : selectAll}
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                {allSelected ? "Deselect all" : "Select all"}
              </button>
            </div>
            <div className="max-h-44 overflow-y-auto rounded-lg border divide-y">
              {catalogEntry.models.map((model) => (
                <label
                  key={model}
                  className="flex cursor-pointer items-center gap-3 px-3 py-2 text-xs hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    checked={form.enabledModels.includes(model)}
                    onChange={() => toggleModel(model)}
                    className="h-3.5 w-3.5 accent-foreground"
                  />
                  <span className="font-mono">{model}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {existing ? "Save changes" : "Add provider"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
