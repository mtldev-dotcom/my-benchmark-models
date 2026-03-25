import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FilterState = {
  search: string;
  status: string;
  model: string;
  agentType: string;
  sortBy: string;
  bulkAction: string;
};

type Props = {
  filters: FilterState;
  statuses: string[];
  models: string[];
  agentTypes: string[];
  onChange: (next: FilterState) => void;
};

const initialFilters: FilterState = {
  search: "",
  status: "all",
  model: "all",
  agentType: "all",
  sortBy: "latest",
  bulkAction: "none",
};

export function InstanceFilters({ filters, statuses, models, agentTypes, onChange }: Props) {
  return (
    <section className="rounded-2xl border p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Instance Controls</p>
          <p className="text-xs text-muted-foreground">Search, filter, sort, and sync your test runs.</p>
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => onChange(initialFilters)}>
          Reset
        </Button>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="Search instances"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="h-11"
        />

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
          <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v ?? filters.status })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.model} onValueChange={(v) => onChange({ ...filters, model: v ?? filters.model })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {models.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.agentType}
            onValueChange={(v) => onChange({ ...filters, agentType: v ?? filters.agentType })}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Agent Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agent Types</SelectItem>
              {agentTypes.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(v) => onChange({ ...filters, sortBy: v ?? filters.sortBy })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="score">Best Score</SelectItem>
              <SelectItem value="tokens">Most Tokens</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.bulkAction}
            onValueChange={(v) => onChange({ ...filters, bulkAction: v ?? filters.bulkAction })}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Bulk Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Bulk Action</SelectItem>
              <SelectItem value="start">Start Selected</SelectItem>
              <SelectItem value="rerun">Rerun Selected</SelectItem>
              <SelectItem value="delete">Delete Selected</SelectItem>
            </SelectContent>
          </Select>

          <Button className="h-11 w-full" variant="outline">
            Sync
          </Button>
        </div>
      </div>
    </section>
  );
}
