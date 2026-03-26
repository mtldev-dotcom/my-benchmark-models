import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProviderCard } from "@/components/settings/provider-card";
import { ProviderFormDialog } from "@/components/settings/provider-form-dialog";
import type { ProviderConfig } from "@/lib/types";

type Props = {
  providers: ProviderConfig[];
  onCreate: (data: Omit<ProviderConfig, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate: (id: string, patch: Partial<ProviderConfig>) => void;
  onDelete: (id: string) => void;
};

export function ProvidersSection({ providers, onCreate, onUpdate, onDelete }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Providers</h2>
          <p className="text-xs text-muted-foreground">API keys and enabled models per provider.</p>
        </div>
        <ProviderFormDialog
          trigger={
            <Button size="sm" className="h-9 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add Provider
            </Button>
          }
          onSave={onCreate}
        />
      </div>

      {providers.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <p className="text-sm font-medium">No providers yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your first API key to start running real benchmarks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {providers.map((p) => (
            <ProviderCard
              key={p.id}
              provider={p}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
