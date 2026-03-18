"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusDot, ModuleChart } from "@/components/workspace";
import { getInitials, cn } from "@/lib/utils";
import {
  CheckCircle2,
  Package,
  FileText,
  Users,
  Clock,
  Plus,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Data ───────────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  { label: "INVENTORY AUDIT", text: "Empire Electric — 2 units unaccounted" },
  { label: "Q1 REVIEW", text: "Dealer performance reports overdue" },
  { label: "SHIPPING DELAY", text: "5-7 days on next GT Pro batch" },
  { label: "PARTNER REQUEST", text: "Empire Electric Q2 priority allocation" },
  { label: "PROTOTYPE", text: "GT Sport chassis weight reduction feedback" },
  { label: "TASK CLOSED", text: "GT Pro pricing update finalized" },
];

const ACTIVE_WORKFLOWS = [
  {
    title: "Review Q1 dealer performance reports",
    assignee: "Alex Torres",
    status: "In Progress",
    due: "Mar 20",
    module: "Partners",
    priority: "high" as const,
  },
  {
    title: "Process GT Sport pre-production checklist",
    assignee: "Marcus Chen",
    status: "In Progress",
    due: "Mar 22",
    module: "Products",
    priority: "high" as const,
  },
  {
    title: "Audit inventory discrepancy at Empire Electric",
    assignee: "Alex Torres",
    status: "Open",
    due: "Mar 19",
    module: "Inventory",
    priority: "urgent" as const,
  },
  {
    title: "Prepare Spring Launch dealer kits",
    assignee: "Drew Patel",
    status: "In Progress",
    due: "Mar 25",
    module: "Partners",
    priority: "normal" as const,
  },
  {
    title: "Update BRAXX warranty documentation",
    assignee: "Jamie Foster",
    status: "Open",
    due: "Mar 28",
    module: "Content",
    priority: "normal" as const,
  },
  {
    title: "Schedule Q2 partner onboarding calls",
    assignee: "Sarah Kim",
    status: "Open",
    due: "Apr 1",
    module: "Partners",
    priority: "low" as const,
  },
  {
    title: "Reconcile March shipping manifests",
    assignee: "Alex Torres",
    status: "Open",
    due: "Apr 3",
    module: "Inventory",
    priority: "normal" as const,
  },
  {
    title: "Review ambassador content guidelines",
    assignee: "Jamie Foster",
    status: "Open",
    due: "Apr 5",
    module: "Content",
    priority: "low" as const,
  },
];

const RECENTLY_COMPLETED = [
  { title: "Finalize GT Pro pricing update", assignee: "Marcus Chen", date: "Mar 16" },
  { title: "Process PO-2026-018 delivery", assignee: "Alex Torres", date: "Mar 15" },
  { title: "Approve Green Wheel Motors application", assignee: "Sarah Kim", date: "Mar 14" },
  { title: "Update dealer locator coordinates", assignee: "Drew Patel", date: "Mar 13" },
  { title: "Ship dealer sample kits to 3 partners", assignee: "Alex Torres", date: "Mar 12" },
];

const FLAGGED_ITEMS = [
  {
    text: "Inventory discrepancy: GT Pro Matte Black at Empire Electric — 2 units unaccounted",
    status: "critical" as const,
  },
  {
    text: "Overdue: Q1 dealer performance reports — was due Mar 15",
    status: "warning" as const,
  },
];

const TEAM_WORKLOAD = [
  { name: "Alex Torres", inProgress: 2, open: 2 },
  { name: "Marcus Chen", inProgress: 1, open: 1 },
  { name: "Drew Patel", inProgress: 1, open: 1 },
  { name: "Jamie Foster", inProgress: 0, open: 2 },
  { name: "Sarah Kim", inProgress: 0, open: 1 },
];

const OPS_NOTES = [
  { text: "March shipping delays from supplier — expect 5-7 day delay on next GT Pro batch", author: "Alex Torres", date: "Mar 16" },
  { text: "Empire Electric requesting priority allocation for Q2", author: "Sarah Kim", date: "Mar 15" },
  { text: "GT Sport prototype feedback: chassis weight needs reduction", author: "Marcus Chen", date: "Mar 14" },
];

const PRIORITY_CONFIG = {
  urgent: { border: "border-l-red-500", pill: "chip-danger", color: "#ef4444", label: "Urgent" },
  high: { border: "border-l-amber-500", pill: "chip-warning", color: "#f59e0b", label: "High" },
  normal: { border: "border-l-blue-500", pill: "chip-info", color: "#3b82f6", label: "Normal" },
  low: { border: "border-l-zinc-300", pill: "chip-neutral", color: "#a1a1aa", label: "Low" },
};

const MODULE_ICONS: Record<string, typeof Package> = {
  Partners: Users,
  Products: Package,
  Inventory: Package,
  Content: FileText,
};

const PRIORITY_DONUT = [
  { name: "Urgent", value: 1, color: "#ef4444" },
  { name: "High", value: 2, color: "#f59e0b" },
  { name: "Normal", value: 3, color: "#3b82f6" },
  { name: "Low", value: 2, color: "#a1a1aa" },
];

const OPS_CHART_DATA = [
  { day: "Mon", open: 8, inProgress: 3, completed: 2 },
  { day: "Tue", open: 7, inProgress: 4, completed: 1 },
  { day: "Wed", open: 9, inProgress: 3, completed: 3 },
  { day: "Thu", open: 8, inProgress: 2, completed: 2 },
  { day: "Fri", open: 7, inProgress: 3, completed: 1 },
  { day: "Sat", open: 7, inProgress: 1, completed: 0 },
  { day: "Sun", open: 10, inProgress: 2, completed: 3 },
];

const OPS_CHART_SERIES = [
  { key: "open", label: "Open", color: "#3b82f6" },
  { key: "inProgress", label: "In Progress", color: "#8b5cf6" },
  { key: "completed", label: "Completed", color: "#10b981" },
];

const FILTER_MODULES = ["All", "Partners", "Inventory", "Content", "Products"];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDueColor(due: string): string {
  const dueDate = new Date(`${due}, 2026`);
  const now = new Date();
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return "text-red-600 font-semibold";
  if (diffDays <= 3) return "text-amber-600 font-medium";
  return "text-muted-foreground";
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function OperationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredWorkflows = activeFilter === "All"
    ? ACTIVE_WORKFLOWS
    : ACTIVE_WORKFLOWS.filter((w) => w.module === activeFilter);

  return (
    <div className="space-y-4">
      {/* ── Hero Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              Q1 2026
            </span>
            <span className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
              System Active
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Operations
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded text-xs font-medium h-8">
            View Archive
          </Button>
          <Button size="sm" className="rounded text-xs font-medium h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Task
          </Button>
        </div>
      </div>

      {/* ── Live Ticker ── */}
      <div className="ops-ticker py-2.5">
        <div className="ops-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-5 text-[11px] tracking-wide"
            >
              <span className="font-mono font-medium text-primary/70 uppercase">{item.label}</span>
              <span className="text-muted-foreground">{item.text}</span>
              <span className="text-border mx-1">+</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Open</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">8</span>
              <span className="text-[10px] text-muted-foreground">tasks</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Active</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">3</span>
              <span className="text-[10px] text-emerald-600 font-medium">in progress</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Flagged</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-primary">2</span>
              <span className="text-[10px] text-red-500 font-medium">critical</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">In Progress</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">3</span>
              <span className="text-[10px] text-muted-foreground">of 8</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Done/Week</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-emerald-600">12</span>
              <span className="text-[10px] text-emerald-600 font-medium">+4</span>
            </div>
          </div>
        </div>
      </div>

      <ModuleChart
        title="Operations Overview"
        subtitle="Weekly task distribution across all workflows"
        data={OPS_CHART_DATA}
        xKey="day"
        series={OPS_CHART_SERIES}
      />

      {/* ── Workflow Feed Section ── */}
      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        <div className="lg:w-[200px] xl:w-[220px] shrink-0 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              Workflows
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Active tasks &amp; assignments. Real-time tracking.
            </p>
          </div>
          <div className="flex flex-row lg:flex-col flex-wrap gap-1.5 mt-3">
            {FILTER_MODULES.map((mod) => (
              <button
                key={mod}
                onClick={() => setActiveFilter(mod)}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-mono font-medium uppercase tracking-wider border transition-all",
                  activeFilter === mod
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                )}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {filteredWorkflows.map((item, i) => {
            const prioConfig = PRIORITY_CONFIG[item.priority];
            const ModuleIcon = MODULE_ICONS[item.module] ?? Package;
            const progress = item.status === "In Progress" ? 50 : 0;
            return (
              <div
                key={item.title}
                className={cn(
                  "eng-card group cursor-pointer hover:shadow-md transition-all",
                  "animate-in",
                  i < 6 && `stagger-${i + 1}`
                )}
              >
                <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                    <ModuleIcon className="h-3 w-3" />
                    {item.module}
                  </span>
                  {item.status === "In Progress" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[40px]">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={cn("inline-flex rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider", prioConfig.pill)}>
                      {prioConfig.label}
                    </span>
                    <span className={cn("text-[10px] flex items-center gap-1 font-mono", getDueColor(item.due))}>
                      <Clock className="h-2.5 w-2.5" />
                      {item.due}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all animate-fill"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: progress > 0 ? "hsl(var(--primary))" : "transparent",
                        }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground tabular-nums">
                      {progress}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-secondary text-[8px] font-bold text-muted-foreground">
                          {getInitials(item.assignee)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-muted-foreground">
                        {item.assignee.split(" ")[0]}
                      </span>
                    </div>
                    <StatusDot
                      status={item.status === "In Progress" ? "active" : "pending"}
                      label={item.status === "In Progress" ? "Active" : "Open"}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Insights Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
        <div className="md:col-span-2 eng-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Team Pulse</span>
              <h3 className="text-sm font-medium text-foreground mt-0.5">Workload Distribution</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
                <span className="text-[10px] text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-zinc-300" />
                <span className="text-[10px] text-muted-foreground">Open</span>
              </div>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={TEAM_WORKLOAD}
                layout="vertical"
                margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                barSize={14}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category" dataKey="name"
                  axisLine={false} tickLine={false}
                  width={100}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
                <Bar dataKey="inProgress" stackId="a" fill="hsl(var(--primary))" name="In Progress" />
                <Bar dataKey="open" stackId="a" fill="#d4d4d8" radius={[0, 4, 4, 0]} name="Open" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="eng-card-dark p-5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Priority Mix</span>
          <div className="relative h-[150px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PRIORITY_DONUT}
                  cx="50%" cy="50%"
                  innerRadius={42} outerRadius={60}
                  dataKey="value" strokeWidth={2} stroke="hsl(var(--background))"
                  animationBegin={0} animationDuration={800}
                >
                  {PRIORITY_DONUT.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-semibold text-foreground tabular-nums">8</span>
              <span className="text-[9px] text-muted-foreground uppercase">Tasks</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
            {PRIORITY_DONUT.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-[10px] text-muted-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="eng-card-dark p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Ops Notes</span>
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-3">
            {OPS_NOTES.map((note) => (
              <div key={note.text} className="space-y-1 pb-3 border-b border-border last:border-0">
                <p className="text-[12px] text-foreground leading-snug line-clamp-2">{note.text}</p>
                <p className="text-[10px] font-medium text-muted-foreground">{note.author} &middot; {note.date}</p>
              </div>
            ))}
          </div>
          <button className="mt-3 flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
            <Plus className="h-3 w-3" />
            Add Note
          </button>
        </div>
      </div>

      {/* ── Recently Completed Strip ── */}
      <div className="eng-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Recently Completed</span>
          <button className="text-[10px] font-medium text-primary hover:underline flex items-center gap-1 uppercase tracking-wider">
            View All <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {RECENTLY_COMPLETED.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                "flex items-start gap-2.5 rounded-lg border border-border bg-secondary/20 p-3",
                "animate-in",
                i < 5 && `stagger-${i + 1}`
              )}
            >
              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-foreground line-clamp-2 leading-snug">{item.title}</p>
                <p className="text-[10px] font-medium text-muted-foreground mt-1">
                  {item.assignee.split(" ")[0]} &middot; {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
