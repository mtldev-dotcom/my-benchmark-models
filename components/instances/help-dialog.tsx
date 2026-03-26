"use client";

import { useState } from "react";
import { HelpCircle, Zap, FlaskConical, Database, BarChart3, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Section = {
  icon: React.ReactNode;
  title: string;
  steps: { label: string; detail: string }[];
};

const sections: Section[] = [
  {
    icon: <FlaskConical className="h-4 w-4" />,
    title: "Creating a Test Instance",
    steps: [
      { label: 'Click "Create New Test"', detail: "Opens the creation form in the top-right corner." },
      { label: "Fill in the fields", detail: "Name, model (e.g. gpt-4o-mini), provider, and agent type. Agent type controls which locked test pack runs." },
      { label: "Save", detail: "Instance is saved to the database with status Draft and appears in the grid." },
    ],
  },
  {
    icon: <Zap className="h-4 w-4" />,
    title: "Running a Test",
    steps: [
      { label: "Hit Start on a Draft card", detail: "Triggers a server-side run. The card switches to Running immediately." },
      { label: "Wait for results", detail: "The dashboard polls every 2 seconds. When all tests in the pack finish, status updates to Tested or Failed." },
      { label: "Rerun anytime", detail: "Tested and Failed cards have a Rerun button. Each run is stored separately in history." },
    ],
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    title: "Reading Results",
    steps: [
      { label: "Open View Results", detail: "Appears on any card that has run data. Shows the latest test scores, duration, and token counts per test." },
      { label: "Check Run History", detail: "Switch to the Run History tab to see every past run with its score and status." },
      { label: "Inspect Evidence", detail: "Click Evidence on any completed run to see full logs, the raw model response, and MD file diffs from that run." },
    ],
  },
  {
    icon: <SlidersHorizontal className="h-4 w-4" />,
    title: "Filtering & Search",
    steps: [
      { label: "Search bar", detail: "Matches against name, model, provider, and test pack — live as you type." },
      { label: "Dropdowns", detail: "Filter by Status, Model, or Agent Type. Sort by Latest, Oldest, Best Score, or Most Tokens." },
      { label: "Clear button", detail: "Appears with a count badge when any filter is active. Resets everything in one click." },
    ],
  },
  {
    icon: <Database className="h-4 w-4" />,
    title: "How Runs Work Internally",
    steps: [
      { label: "Clean base state", detail: "Every run loads the same versioned MD context files into a fresh agent instance — no memory from prior runs." },
      { label: "Test pack execution", detail: "Each agent type has a locked set of 3 tests. All must complete before the run is marked done." },
      { label: "Evidence capture", detail: "Logs, MD file diffs, token counts, and scores are stored per test and viewable in the Evidence panel." },
    ],
  },
];

export function HelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground" aria-label="Open help" />}>
        <HelpCircle className="h-5 w-5" />
      </DialogTrigger>

      <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How to use Model Benchmark</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground -mt-1">
          A controlled environment for testing AI model behaviour under repeatable conditions.
        </p>

        <div className="mt-2 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border text-foreground">
                  {section.icon}
                </span>
                <h3 className="text-sm font-semibold">{section.title}</h3>
              </div>

              <ol className="space-y-2.5 pl-1">
                {section.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-medium">{step.label}</span>
                      <span className="text-muted-foreground"> — {step.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Tip: </span>
          Set <code className="rounded bg-muted px-1 py-0.5 font-mono">OPENCLAW_WORKER_URL</code> in{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono">.env.local</code> to connect a real
          OpenClaw worker instead of the mock runner.
        </div>
      </DialogContent>
    </Dialog>
  );
}
