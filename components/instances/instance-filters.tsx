import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type FilterState = {
  search: string;
  status: string;
  model: string;
  agentType: string;
  sortBy: string;
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
};

function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.search.trim()) count++;
  if (filters.status !== "all") count++;
  if (filters.model !== "all") count++;
  if (filters.agentType !== "all") count++;
  if (filters.sortBy !== "latest") count++;
  return count;
}

export function InstanceFilters({ filters, statuses, models, agentTypes, onChange }: Props) {
  const activeCount = countActiveFilters(filters);

  return (
    <div className="space-y-2">
      {/* Toolbar row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, model, provider…"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="h-9 pl-8 text-sm"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground sm:block" />

          <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v ?? filters.status })}>
            <SelectTrigger className="h-9 w-[120px] text-xs">
              <span className="text-muted-foreground">Status:&nbsp;</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.model} onValueChange={(v) => onChange({ ...filters, model: v ?? filters.model })}>
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <span className="text-muted-foreground">Model:&nbsp;</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {models.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.agentType} onValueChange={(v) => onChange({ ...filters, agentType: v ?? filters.agentType })}>
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <span className="text-muted-foreground">Agent:&nbsp;</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {agentTypes.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(v) => onChange({ ...filters, sortBy: v ?? filters.sortBy })}>
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <span className="text-muted-foreground">Sort:&nbsp;</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="score">Best Score</SelectItem>
              <SelectItem value="tokens">Most Tokens</SelectItem>
            </SelectContent>
          </Select>

          {activeCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 px-2.5 text-xs"
              onClick={() => onChange(initialFilters)}
            >
              <X className="h-3 w-3" />
              Clear
              <Badge variant="secondary" className="h-4 rounded-full px-1.5 text-[10px] font-semibold">
                {activeCount}
              </Badge>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
