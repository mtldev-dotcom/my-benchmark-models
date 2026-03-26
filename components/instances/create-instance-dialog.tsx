"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AgentType, TestInstance } from "@/lib/types";

type Props = {
  onCreate: (instance: TestInstance) => void;
  instanceToEdit?: TestInstance;
  onEdit?: (instance: TestInstance) => void;
  triggerLabel?: string;
  triggerClassName?: string;
};

const TEST_PACK_BY_AGENT: Record<AgentType, string> = {
  operator: "Operator Locked Pack",
  engineer: "Engineer Locked Pack",
  content: "Content Locked Pack",
};

export function CreateInstanceDialog({
  onCreate,
  instanceToEdit,
  onEdit,
  triggerLabel,
  triggerClassName = "h-10",
}: Props) {
  const isEditing = !!instanceToEdit;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: instanceToEdit?.name ?? "",
    model: instanceToEdit?.model ?? "gpt-4o-mini",
    provider: instanceToEdit?.provider ?? "OpenAI",
    agentType: (instanceToEdit?.agentType ?? "operator") as AgentType,
    notes: instanceToEdit?.notes ?? "",
  });

  const handleOpen = (next: boolean) => {
    if (next && instanceToEdit) {
      setForm({
        name: instanceToEdit.name,
        model: instanceToEdit.model,
        provider: instanceToEdit.provider,
        agentType: instanceToEdit.agentType,
        notes: instanceToEdit.notes ?? "",
      });
    }
    setOpen(next);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    if (isEditing && instanceToEdit && onEdit) {
      onEdit({
        ...instanceToEdit,
        name: form.name,
        model: form.model,
        provider: form.provider,
        agentType: form.agentType,
        testPack: TEST_PACK_BY_AGENT[form.agentType],
        notes: form.notes,
      });
    } else {
      onCreate({
        id: crypto.randomUUID(),
        name: form.name,
        model: form.model,
        provider: form.provider,
        agentType: form.agentType,
        testPack: TEST_PACK_BY_AGENT[form.agentType],
        status: "draft",
        contextWindow: "128k",
        score: 0,
        speed: "-",
        tokens: 0,
        createdAt: new Date().toISOString(),
        lastRunAt: null,
        notes: form.notes,
        runCount: 0,
        lastError: undefined,
        results: [],
        latestRunId: null,
        baseStateVersion: null,
        openclawEnabled: false,
      });
      setForm({ name: "", model: "gpt-4o-mini", provider: "OpenAI", agentType: "operator", notes: "" });
    }

    setOpen(false);
  };

  const label = triggerLabel ?? (isEditing ? "Edit" : "Create New Test");

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger render={<Button className={triggerClassName} variant={isEditing ? "outline" : "default"} />}>
        {label}
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Instance" : "Create New Test"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this test instance configuration." : "Save a new test instance."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Instance name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select value={form.model} onValueChange={(value) => setForm((prev) => ({ ...prev, model: value ?? prev.model }))}>
              <SelectTrigger>
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                <SelectItem value="claude-sonnet-4.5">claude-sonnet-4.5</SelectItem>
                <SelectItem value="gemini-2.0-flash">gemini-2.0-flash</SelectItem>
              </SelectContent>
            </Select>

            <Select value={form.provider} onValueChange={(value) => setForm((prev) => ({ ...prev, provider: value ?? prev.provider }))}>
              <SelectTrigger>
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OpenAI">OpenAI</SelectItem>
                <SelectItem value="Anthropic">Anthropic</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              value={form.agentType}
              onValueChange={(value) => setForm((prev) => ({ ...prev, agentType: (value as AgentType) ?? prev.agentType }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Agent Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
                <SelectItem value="content">Content</SelectItem>
              </SelectContent>
            </Select>

            <Input value={TEST_PACK_BY_AGENT[form.agentType]} readOnly className="bg-muted" />
          </div>

          <Textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
