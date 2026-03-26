import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomTestFormDialog } from "@/components/settings/custom-test-form-dialog";
import { CustomTestRow } from "@/components/settings/custom-test-row";
import type { CustomTest } from "@/lib/types";

type Props = {
  tests: CustomTest[];
  onCreate: (data: Pick<CustomTest, "name" | "prompt">) => void;
  onUpdate: (id: string, patch: Pick<CustomTest, "name" | "prompt">) => void;
  onDelete: (id: string) => void;
};

export function TestsSection({ tests, onCreate, onUpdate, onDelete }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Test Library</h2>
          <p className="text-xs text-muted-foreground">
            Custom tasks sent to the model during benchmark runs.
          </p>
        </div>
        <CustomTestFormDialog
          trigger={
            <Button size="sm" className="h-9 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add Test
            </Button>
          }
          onSave={onCreate}
        />
      </div>

      {tests.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <p className="text-sm font-medium">No custom tests yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add tests to supplement or replace the locked test packs.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tests.map((t) => (
            <CustomTestRow
              key={t.id}
              test={t}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
