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
};

const TEST_PACK_BY_AGENT: Record<AgentType, string> = {
  operator: "Operator Locked Pack",
  engineer: "Engineer Locked Pack",
  content: "Content Locked Pack",
};

export function CreateInstanceDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    model: "gpt-4o-mini",
    provider: "OpenAI",
    agentType: "operator" as AgentType,
    notes: "",
  });

  const handleSave = () => {
    if (!form.name.trim()) return;

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
      lastRunAt: "-",
      notes: form.notes,
      runCount: 0,
      lastError: undefined,
      results: [],
    });

    setForm({
      name: "",
      model: "gpt-4o-mini",
      provider: "OpenAI",
      agentType: "operator",
      notes: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="h-10" />}>Create New Test</DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
          <DialogDescription>Save a new test instance to local mock state.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Settings name"
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
