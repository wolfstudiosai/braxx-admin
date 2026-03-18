"use client";

import { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import { ModuleChart } from "@/components/workspace";

// ─── Data ───────────────────────────────────────────────────────────────────

const activities = [
  { id: "1", actor: "Marcus Chen", action: "published", module: "content", summary: "Published GT Pro Hero Shot to Spring 2026 Launch collection", date: "2026-03-17T14:30:00" },
  { id: "2", actor: "Sarah Kim", action: "approved", module: "partners", summary: "Approved dealer application from Priya Patel — Green Wheel Motors", date: "2026-03-17T12:15:00" },
  { id: "3", actor: "Alex Torres", action: "received", module: "inventory", summary: "Received PO-2026-018: 4x GT Pro Matte Black to Main Warehouse", date: "2026-03-17T10:00:00" },
  { id: "4", actor: "Jamie Foster", action: "created", module: "content", summary: "Uploaded Spring Launch Video (248 MB) to campaign assets", date: "2026-03-16T16:45:00" },
  { id: "5", actor: "Marcus Chen", action: "updated", module: "campaign", summary: "Updated budget allocation for Spring 2026 Launch campaign", date: "2026-03-16T14:20:00" },
  { id: "6", actor: "Drew Patel", action: "completed", module: "operations", summary: "Completed task: Ship dealer sample kits to 3 partners", date: "2026-03-16T11:00:00" },
  { id: "7", actor: "Sarah Kim", action: "created", module: "expenses", summary: "Submitted expense request: Social Media Ad Spend — $2,800", date: "2026-03-16T09:30:00" },
  { id: "8", actor: "System", action: "flagged", module: "inventory", summary: "Low stock alert triggered: GT Pro Matte Black at 3 units (threshold: 10)", date: "2026-03-15T08:00:00" },
  { id: "9", actor: "Jordan Lee", action: "submitted", module: "partners", summary: "New dealer application received from EV Moto Works, Seattle WA", date: "2026-03-15T09:30:00" },
  { id: "10", actor: "Marcus Chen", action: "approved", module: "expenses", summary: "Approved expense: GT Pro Photo Shoot — Desert Location ($4,200)", date: "2026-03-15T07:00:00" },
  { id: "11", actor: "Jamie Foster", action: "scheduled", module: "social", summary: "Scheduled Instagram post: GT Pro Desert Shoot for Mar 20", date: "2026-03-14T17:00:00" },
  { id: "12", actor: "Alex Torres", action: "adjusted", module: "inventory", summary: "Inventory adjustment: -1 GT Pro Matte Black (shipping damage)", date: "2026-03-14T11:30:00" },
  { id: "13", actor: "Sarah Kim", action: "converted", module: "partners", summary: "Converted lead Amanda Foster (Urban Rides Inc) to active partner", date: "2026-03-13T15:45:00" },
  { id: "14", actor: "Marcus Chen", action: "launched", module: "campaign", summary: "Launched Rider Stories Series campaign across all channels", date: "2026-03-13T10:15:00" },
  { id: "15", actor: "Drew Patel", action: "onboarded", module: "partners", summary: "Completed onboarding for Peak Performance EV in Denver, CO", date: "2026-03-12T14:00:00" },
  { id: "16", actor: "System", action: "generated", module: "performance", summary: "Weekly performance report generated: Revenue +18.2% vs prior period", date: "2026-03-12T06:00:00" },
  { id: "17", actor: "Jamie Foster", action: "published", module: "social", summary: "Published TikTok: POV commute upgrade — 12K views in first 24h", date: "2026-03-11T16:30:00" },
  { id: "18", actor: "Alex Torres", action: "received", module: "inventory", summary: "Received PO-2026-015: 30x Battery Pack Standard to Main Warehouse", date: "2026-03-10T09:00:00" },
  { id: "19", actor: "Marcus Chen", action: "updated", module: "content", summary: "Updated Brand Guidelines to v3.2 — added GT Sport preliminary assets", date: "2026-03-09T13:20:00" },
  { id: "20", actor: "Sarah Kim", action: "rejected", module: "partners", summary: "Declined dealer application from Kim's Motors — insufficient qualifications", date: "2026-03-08T16:00:00" },
];

const actorOptions = [
  { value: "all", label: "All Actors" },
  { value: "Marcus Chen", label: "Marcus Chen" },
  { value: "Sarah Kim", label: "Sarah Kim" },
  { value: "Alex Torres", label: "Alex Torres" },
  { value: "Jamie Foster", label: "Jamie Foster" },
  { value: "Drew Patel", label: "Drew Patel" },
  { value: "System", label: "System" },
];

const MODULE_COLORS: Record<string, { dot: string; bg: string; border: string; fill: string }> = {
  content:     { dot: "bg-violet-500", bg: "bg-violet-50",  border: "border-l-violet-500",  fill: "#8b5cf6" },
  partners:    { dot: "bg-blue-500",   bg: "bg-blue-50",    border: "border-l-blue-500",     fill: "#3b82f6" },
  inventory:   { dot: "bg-amber-500",  bg: "bg-amber-50",   border: "border-l-amber-500",    fill: "#f59e0b" },
  campaign:    { dot: "bg-emerald-500", bg: "bg-emerald-50", border: "border-l-emerald-500",  fill: "#10b981" },
  expenses:    { dot: "bg-zinc-400",   bg: "bg-zinc-50",    border: "border-l-zinc-400",     fill: "#a1a1aa" },
  operations:  { dot: "bg-zinc-600",   bg: "bg-zinc-100",   border: "border-l-zinc-600",     fill: "#52525b" },
  social:      { dot: "bg-sky-500",    bg: "bg-sky-50",     border: "border-l-sky-500",      fill: "#0ea5e9" },
  performance: { dot: "bg-green-500",  bg: "bg-green-50",   border: "border-l-green-500",    fill: "#22c55e" },
};

const moduleColors: Record<string, "success" | "warning" | "info" | "purple" | "secondary" | "default"> = {
  content: "purple",
  partners: "info",
  inventory: "warning",
  campaign: "success",
  expenses: "secondary",
  operations: "default",
  social: "info",
  performance: "success",
};

const moduleCounts = activities.reduce<Record<string, number>>((acc, a) => {
  acc[a.module] = (acc[a.module] || 0) + 1;
  return acc;
}, {});

const MOST_ACTIVE = [
  { name: "Marcus Chen", count: 6, role: "Founder Admin" },
  { name: "Sarah Kim", count: 4, role: "Sales Manager" },
  { name: "Alex Torres", count: 3, role: "Operations" },
  { name: "Jamie Foster", count: 3, role: "Content" },
  { name: "Drew Patel", count: 2, role: "Partners" },
];

const maxUserCount = 6;

const ACTIVITY_CHART_DATA = [
  { day: "Mon", content: 2, partners: 3, inventory: 1, campaign: 2, social: 1, other: 1 },
  { day: "Tue", content: 1, partners: 2, inventory: 3, campaign: 1, social: 2, other: 0 },
  { day: "Wed", content: 3, partners: 1, inventory: 2, campaign: 2, social: 1, other: 1 },
  { day: "Thu", content: 2, partners: 4, inventory: 1, campaign: 1, social: 2, other: 0 },
  { day: "Fri", content: 1, partners: 2, inventory: 3, campaign: 1, social: 1, other: 1 },
  { day: "Sat", content: 0, partners: 1, inventory: 0, campaign: 0, social: 1, other: 0 },
  { day: "Sun", content: 0, partners: 0, inventory: 1, campaign: 0, social: 0, other: 0 },
];

const ACTIVITY_CHART_SERIES = [
  { key: "content", label: "Content", color: "#8b5cf6" },
  { key: "partners", label: "Partners", color: "#3b82f6" },
  { key: "inventory", label: "Inventory", color: "#f59e0b" },
  { key: "campaign", label: "Campaign", color: "#10b981" },
  { key: "social", label: "Social", color: "#0ea5e9" },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function AppActivityPage() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      const matchSearch = !search ||
        a.actor.toLowerCase().includes(search.toLowerCase()) ||
        a.summary.toLowerCase().includes(search.toLowerCase());
      const matchModule = moduleFilter === "all" || a.module === moduleFilter;
      const matchActor = actorFilter === "all" || a.actor === actorFilter;
      return matchSearch && matchModule && matchActor;
    });
  }, [search, moduleFilter, actorFilter]);

  return (
    <div className="space-y-4">
      {/* ── Hero Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              SYSTEM
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
              All Modules
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Activity
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs font-medium rounded h-8 gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export Log
          </Button>
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Total Events</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-primary">{activities.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Modules</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">{Object.keys(moduleCounts).length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">System</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-emerald-600">{activities.filter(a => a.actor === "System").length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Active Users</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">{actorOptions.length - 1}</span>
          </div>
        </div>
      </div>

      <ModuleChart
        title="Activity Overview"
        subtitle="Events by module across the week"
        data={ACTIVITY_CHART_DATA}
        xKey="day"
        series={ACTIVITY_CHART_SERIES}
      />

      {/* ── Module Filter Pills ── */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setModuleFilter("all")}
          className={cn(
            "px-3 py-1 rounded text-[10px] font-medium uppercase tracking-wider border transition-all",
            moduleFilter === "all"
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
          )}
        >
          All
        </button>
        {Object.entries(moduleCounts)
          .sort(([, a], [, b]) => b - a)
          .map(([mod, count]) => (
            <button
              key={mod}
              onClick={() => setModuleFilter(moduleFilter === mod ? "all" : mod)}
              className={cn(
                "px-3 py-1 rounded text-[10px] font-medium uppercase tracking-wider border transition-all flex items-center gap-1.5",
                moduleFilter === mod
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", MODULE_COLORS[mod]?.dot ?? "bg-zinc-400")} />
              {mod}
              <span className="opacity-60 tabular-nums">{count}</span>
            </button>
          ))}
      </div>

      {/* ── Main Feed + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Timeline Feed — spans 3 cols */}
        <div className="lg:col-span-3 space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select value={actorFilter} onValueChange={setActorFilter}>
              <SelectTrigger className="w-40 h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {actorOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeline Card */}
          <div className="rounded-xl border border-border bg-card overflow-hidden transition-shadow">
            <div className="divide-y divide-border">
              {filtered.map((activity) => {
                const modColor = MODULE_COLORS[activity.module];
                return (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-3 px-5 py-4 hover:bg-secondary/30 transition-colors",
                      "border-l-2",
                      modColor?.border ?? "border-l-zinc-300"
                    )}
                  >
                    <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                      <AvatarFallback className={cn(
                        "text-[10px] font-medium",
                        activity.actor === "System"
                          ? "bg-secondary text-muted-foreground"
                          : "bg-primary/8 text-primary"
                      )}>
                        {getInitials(activity.actor)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-[13px] leading-snug">
                        <span className="font-semibold text-foreground">{activity.actor}</span>
                        {" "}
                        <span className="font-semibold text-foreground/80">{activity.action}</span>
                        {" "}
                        <span className="text-muted-foreground">
                          {activity.summary.replace(new RegExp(`^.*?${activity.action}\\s*`, "i"), "") || activity.summary}
                        </span>
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">{formatRelativeTime(activity.date)}</span>
                        <Badge variant={moduleColors[activity.module] ?? "secondary"} className="text-[10px] px-1.5 py-0">
                          {activity.module}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                No activity matching your filters
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <span className="text-xs text-muted-foreground">
                Showing {filtered.length} of {activities.length} events
              </span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 text-xs" disabled>Previous</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs" disabled>Next</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Activity by Module — dark card */}
          <div className="eng-card-dark p-5 animate-in stagger-1">
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Activity By Module</span>
            <div className="space-y-2.5 mt-3">
              {Object.entries(moduleCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([mod, count]) => (
                  <button
                    key={mod}
                    onClick={() => setModuleFilter(moduleFilter === mod ? "all" : mod)}
                    className={cn(
                      "w-full flex items-center gap-2.5 py-1 rounded transition-colors",
                      moduleFilter === mod ? "opacity-100" : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", MODULE_COLORS[mod]?.dot ?? "bg-zinc-400")} />
                    <span className="text-[11px] text-foreground capitalize flex-1 text-left">{mod}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full animate-fill"
                          style={{
                            width: `${(count / activities.length) * 100}%`,
                            backgroundColor: MODULE_COLORS[mod]?.fill ?? "#a1a1aa",
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-foreground tabular-nums w-4 text-right">{count}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Most Active — dark card */}
          <div className="eng-card-dark p-5 animate-in stagger-2">
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Most Active</span>
            <div className="space-y-3 mt-3">
              {MOST_ACTIVE.map((user) => (
                <div key={user.name} className="flex items-center gap-2.5">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-secondary text-[9px] font-medium text-foreground">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-foreground truncate">{user.name}</p>
                      <span className="text-[11px] tabular-nums text-muted-foreground">{user.count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60 animate-fill"
                        style={{ width: `${(user.count / maxUserCount) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Events — dark card */}
          <div className="eng-card-dark p-5 animate-in stagger-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">System Events</span>
              <span className="text-xs text-muted-foreground">Automated</span>
            </div>
            <div className="space-y-2.5">
              {activities
                .filter((a) => a.actor === "System")
                .map((a) => (
                  <div key={a.id} className="flex items-start gap-2 py-1">
                    <div className="h-4 w-4 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[11px] text-foreground leading-relaxed">{a.summary}</p>
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(a.date)}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
