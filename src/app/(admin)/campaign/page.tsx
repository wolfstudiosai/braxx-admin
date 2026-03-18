"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusDot, ModuleChart } from "@/components/workspace";
import { cn, formatCurrency, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
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

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const CAMPAIGNS = [
  {
    id: "spring-2026",
    name: "Spring 2026 Launch",
    type: "Product Launch",
    status: "active" as const,
    owner: "Marcus Chen",
    dateRange: "Mar 1 – Apr 15",
    startMonth: 2,
    endMonth: 3.5,
    budget: 20000,
    spent: 14200,
    reach: 86000,
    contentPieces: 8,
    partners: 3,
  },
  {
    id: "rider-stories",
    name: "Rider Stories Series",
    type: "Content Series",
    status: "active" as const,
    owner: "Jamie Foster",
    dateRange: "Feb 15 – ongoing",
    startMonth: 1.5,
    endMonth: 5,
    budget: 8000,
    spent: 5800,
    reach: 62000,
    contentPieces: 12,
    partners: 0,
  },
  {
    id: "gt-sport-teaser",
    name: "GT Sport Teaser",
    type: "Product Teaser",
    status: "planning" as const,
    owner: "Marcus Chen",
    dateRange: "Apr 1 – Apr 30",
    startMonth: 3,
    endMonth: 4,
    budget: 12000,
    spent: 0,
    reach: 0,
    contentPieces: 2,
    partners: 0,
  },
  {
    id: "dealer-expansion",
    name: "Dealer Network Expansion",
    type: "Partnership",
    status: "active" as const,
    owner: "Drew Patel",
    dateRange: "Jan 15 – Jun 30",
    startMonth: 0.5,
    endMonth: 5.5,
    budget: 5000,
    spent: 3400,
    reach: 38000,
    contentPieces: 0,
    partners: 4,
  },
  {
    id: "holiday-2025",
    name: "Holiday 2025 Promo",
    type: "Seasonal",
    status: "completed" as const,
    owner: "Sarah Kim",
    dateRange: "Nov 15 – Dec 31",
    startMonth: -2.5,
    endMonth: -1,
    budget: 15000,
    spent: 14800,
    reach: 124000,
    contentPieces: 15,
    partners: 0,
  },
  {
    id: "ambassador-launch",
    name: "Ambassador Program",
    type: "Brand",
    status: "completed" as const,
    owner: "Jamie Foster",
    dateRange: "Oct 1 – Dec 15",
    startMonth: -3,
    endMonth: -1.5,
    budget: 10000,
    spent: 9200,
    reach: 95000,
    contentPieces: 0,
    partners: 6,
  },
];

const TOTAL_BUDGET = 70000;
const TOTAL_SPENT = 47400;

const BUDGET_DONUT = CAMPAIGNS.map((c) => ({
  name: c.name,
  value: c.budget,
}));

const BUDGET_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#8b5cf6", "#10b981", "#06b6d4"];

const TOP_PERFORMING = CAMPAIGNS
  .filter((c) => c.reach > 0)
  .sort((a, b) => b.reach - a.reach)
  .slice(0, 5);

const TOP_BAR_DATA = TOP_PERFORMING.map((c) => ({
  name: c.name.length > 18 ? c.name.slice(0, 18) + "…" : c.name,
  reach: c.reach,
}));

const TIMELINE_MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const TIMELINE_OFFSET = 3;
const CURRENT_MONTH_IDX = 4;

const TYPE_CHIPS: Record<string, string> = {
  "Product Launch": "chip-primary",
  "Content Series": "chip-info",
  "Product Teaser": "chip-info",
  Partnership: "chip-purple",
  Seasonal: "chip-warning",
  Brand: "chip-success",
};

const STATUS_MAP: Record<string, "active" | "pending" | "success"> = {
  active: "active",
  planning: "pending",
  completed: "success",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  planning: "Planning",
  completed: "Completed",
};

const GANTT_COLORS: Record<string, string> = {
  active: "bg-primary",
  planning: "bg-amber-500",
  completed: "bg-emerald-500",
};

const PIPELINE_FILTERS = ["All", "Active", "Planning", "Completed"];

const CAMP_CHART_DATA = [
  { name: "Spring Launch", budget: 20000, spent: 14200, reach: 86 },
  { name: "Rider Stories", budget: 8000, spent: 5800, reach: 62 },
  { name: "GT Sport", budget: 12000, spent: 0, reach: 0 },
  { name: "Dealer Expand", budget: 5000, spent: 3400, reach: 38 },
  { name: "Holiday '25", budget: 15000, spent: 14800, reach: 124 },
  { name: "Ambassador", budget: 10000, spent: 9200, reach: 95 },
];

const CAMP_CHART_SERIES = [
  { key: "budget", label: "Budget ($)", color: "#6366f1" },
  { key: "spent", label: "Spent ($)", color: "#ec4899" },
  { key: "reach", label: "Reach (K)", color: "#10b981" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function budgetBarColor(pct: number) {
  if (pct >= 90) return "from-red-500 to-red-400";
  if (pct >= 70) return "from-amber-500 to-amber-400";
  return "from-emerald-500 to-emerald-400";
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function CampaignPage() {
  const [pipelineFilter, setPipelineFilter] = useState("All");

  const filteredCampaigns =
    pipelineFilter === "All"
      ? CAMPAIGNS
      : CAMPAIGNS.filter(
          (c) => c.status === pipelineFilter.toLowerCase()
        );

  return (
    <div className="space-y-4">
      {/* ── Hero Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              Active
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Planning &amp; Execution
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Campaign
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded text-xs font-medium h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Active</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-primary">3</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Planning</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">1</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Completed</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-emerald-600">2</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Total Reach</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">186K</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Budget</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">$70K</span>
              <span className="text-[10px] text-muted-foreground">68% used</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Module Chart ── */}
      <ModuleChart
        title="Campaign Overview"
        subtitle="Budget, spend and reach across all campaigns"
        data={CAMP_CHART_DATA}
        xKey="name"
        series={CAMP_CHART_SERIES}
        formatValue={(v) => v >= 1000 ? `$${(v/1000).toFixed(0)}K` : v.toLocaleString()}
      />

      {/* ── Campaign Pipeline Section ── */}
      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        {/* Section Header — Left Column */}
        <div className="lg:w-[200px] xl:w-[220px] shrink-0 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              Pipeline
            </h2>
            <p className="text-xs text-muted-foreground mt-2">
              All campaigns. Track progress &amp; budget allocation.
            </p>
          </div>
          <div className="flex flex-row lg:flex-col flex-wrap gap-1.5 mt-3">
            {PIPELINE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setPipelineFilter(f)}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-medium uppercase tracking-wider border transition-all",
                  pipelineFilter === f
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredCampaigns.map((campaign, i) => {
            const pct = campaign.budget > 0 ? Math.round((campaign.spent / campaign.budget) * 100) : 0;
            const colorIdx = CAMPAIGNS.indexOf(campaign);

            return (
              <div
                key={campaign.id}
                className={cn(
                  "eng-card group cursor-pointer hover:shadow-md transition-all",
                  "animate-in",
                  i < 6 && `stagger-${i + 1}`
                )}
                style={{ borderTopWidth: 3, borderTopColor: BUDGET_COLORS[colorIdx % BUDGET_COLORS.length] }}
              >
                {/* Header strip */}
                <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                  <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider", TYPE_CHIPS[campaign.type] ?? "chip-neutral")}>
                    {campaign.type}
                  </span>
                  {campaign.status === "active" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  {campaign.status === "planning" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  )}
                  {campaign.status === "completed" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {/* Campaign name */}
                  <Link href={`/campaign/${campaign.id}`} className="text-sm font-bold text-foreground leading-snug hover:underline line-clamp-2 min-h-[40px] block">
                    {campaign.name}
                  </Link>

                  {/* Budget progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn("h-full rounded-full bg-gradient-to-r transition-all animate-fill", budgetBarColor(pct))}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">{pct}%</span>
                  </div>

                  {/* Spend info */}
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-secondary text-[8px] font-bold text-muted-foreground">
                          {getInitials(campaign.owner)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-muted-foreground">{campaign.owner.split(" ")[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{campaign.dateRange}</span>
                      {campaign.reach > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="inline-block h-2.5 rounded-sm bg-primary/20" style={{ width: `${Math.min(campaign.reach / 1400, 60)}px` }} />
                          <span className="text-[9px] tabular-nums text-muted-foreground">{(campaign.reach / 1000).toFixed(0)}K</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center justify-between">
                    <StatusDot
                      status={STATUS_MAP[campaign.status]}
                      label={STATUS_LABEL[campaign.status]}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/campaign/${campaign.id}`}>View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Campaign Timeline (Gantt) ── */}
      <div className="eng-card p-5 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider block">Timeline</span>
            <h3 className="text-sm font-medium text-foreground mt-0.5">Campaign Gantt</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Month headers */}
            <div className="grid grid-cols-8 gap-0 mb-3 border-b border-border pb-2">
              {TIMELINE_MONTHS.map((m, i) => (
                <div key={m} className="text-center">
                  <span className={cn(
                    "text-[11px] font-medium",
                    i === CURRENT_MONTH_IDX ? "text-primary" : "text-muted-foreground"
                  )}>
                    {m}
                  </span>
                </div>
              ))}
            </div>

            {/* Gantt rows */}
            <div className="space-y-2 relative">
              {/* Current date marker */}
              <div
                className="absolute top-0 bottom-0 w-px bg-primary/40 z-10"
                style={{ left: `${((CURRENT_MONTH_IDX + 0.55) / 8) * 100}%` }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary" />
              </div>

              {CAMPAIGNS.map((campaign) => {
                const startPct = ((campaign.startMonth + TIMELINE_OFFSET) / 8) * 100;
                const endPct = ((campaign.endMonth + TIMELINE_OFFSET) / 8) * 100;
                const widthPct = endPct - startPct;

                return (
                  <div key={campaign.id} className="flex items-center gap-3 h-8">
                    <span className="text-xs text-muted-foreground w-[140px] truncate shrink-0">{campaign.name}</span>
                    <div className="relative flex-1 h-full">
                      <div
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 h-5 rounded-md opacity-80",
                          GANTT_COLORS[campaign.status]
                        )}
                        style={{
                          left: `${Math.max(startPct, 0)}%`,
                          width: `${Math.min(widthPct, 100 - Math.max(startPct, 0))}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Insights Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Budget Overview Donut — Dark Card */}
        <div className="eng-card-dark p-5">
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Budget Overview</span>
          <div className="flex flex-col items-center mt-2">
            <div className="relative">
              <PieChart width={200} height={200}>
                <Pie
                  data={BUDGET_DONUT}
                  dataKey="value"
                  cx={100}
                  cy={100}
                  innerRadius={60}
                  outerRadius={90}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                  paddingAngle={2}
                >
                  {BUDGET_DONUT.map((_, i) => (
                    <Cell key={i} fill={BUDGET_COLORS[i % BUDGET_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 4, fontFamily: "monospace", border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }}
                  formatter={(value: number) => [formatCurrency(value)]}
                />
              </PieChart>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground tabular-nums">{formatCurrency(TOTAL_BUDGET)}</p>
                  <p className="text-xs text-muted-foreground">Total Budget</p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-1.5 mt-2">
              {BUDGET_DONUT.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: BUDGET_COLORS[i % BUDGET_COLORS.length] }} />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                  </div>
                  <span className="tabular-nums font-medium text-foreground ml-2">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing — spans 2 cols */}
        <div className="md:col-span-2 eng-card p-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider block">Top Performing</span>
                <h3 className="text-sm font-medium text-foreground mt-0.5">Campaigns by Reach</h3>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_BAR_DATA} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={140}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 4, fontFamily: "monospace", border: "1px solid var(--border)", background: "var(--background)" }}
                    formatter={(value: number) => [`${(value / 1000).toFixed(0)}K reach`]}
                  />
                  <Bar dataKey="reach" radius={[0, 4, 4, 0]} barSize={18}>
                    {TOP_BAR_DATA.map((_, i) => (
                      <Cell key={i} fill={BUDGET_COLORS[i % BUDGET_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
