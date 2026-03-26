"use client";

import { useState } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProviderFormDialog } from "@/components/settings/provider-form-dialog";
import { PROVIDER_MAP } from "@/lib/provider-catalog";
import type { ProviderConfig } from "@/lib/types";

type Props = {
  provider: ProviderConfig;
  onUpdate: (id: string, patch: Partial<ProviderConfig>) => void;
  onDelete: (id: string) => void;
};

function maskKey(key: string): string {
  if (!key) return "—";
  if (key.length <= 8) return "••••••••";
  return key.slice(0, 4) + "••••••••" + key.slice(-4);
}

export function ProviderCard({ provider, onUpdate, onDelete }: Props) {
  const [showKey, setShowKey] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const meta = PROVIDER_MAP[provider.providerId];

  return (
    <Card className="rounded-2xl shadow-none">
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">{provider.displayName}</p>
            <Badge variant="outline" className="text-[10px]">{meta?.name ?? provider.providerId}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <ProviderFormDialog
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              }
              existing={provider}
              onSave={(data) =>
                onUpdate(provider.id, {
                  ...data,
                  // preserve existing key if blank was submitted
                  apiKey: data.apiKey || provider.apiKey,
                })
              }
            />
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => onDelete(provider.id)}
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* API key row */}
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-xs">
          <span className="font-mono text-muted-foreground">
            {showKey ? (provider.apiKey || "—") : maskKey(provider.apiKey)}
          </span>
          <button
            onClick={() => setShowKey((v) => !v)}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Models */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {provider.enabledModels.length} model{provider.enabledModels.length !== 1 ? "s" : ""} enabled
          </p>
          {provider.enabledModels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {provider.enabledModels.map((m) => (
                <span
                  key={m}
                  className="rounded-md border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
