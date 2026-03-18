"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModuleChart } from "@/components/workspace";
import {
  cn,
  formatCurrency,
  formatRelativeTime,
  getInitials,
} from "@/lib/utils";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Target,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────── */

const monthlyRevenue = [
  { month: "Oct", revenue: 168000 },
  { month: "Nov", revenue: 195000 },
  { month: "Dec", revenue: 224000 },
  { month: "Jan", revenue: 198000 },
  { month: "Feb", revenue: 241000 },
  { month: "Mar", revenue: 284000 },
];

const channelData = [
  { name: "Direct", value: 142200, color: "#7c3aed" },
  { name: "Dealers", value: 98400, color: "#2563eb" },
  { name: "Online", value: 28900, color: "#10b981" },
  { name: "Events", value: 15000, color: "#f59e0b" },
];

const channelTotal = channelData.reduce((s, c) => s + c.value, 0);

const heroMetrics = [
  {
    label: "Revenue",
    value: "$284,500",
    change: "+18.2%",
    positive: true,
    icon: DollarSign,
    gradient: "from-violet-500/15 via-violet-500/5 to-transparent",
    accent: "text-violet-500",
    spark: [3, 5, 4, 7, 6, 9, 8, 11, 10, 14],
  },
  {
    label: "Orders",
    value: "47",
    change: "+12",
    positive: true,
    icon: ShoppingCart,
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    accent: "text-emerald-500",
    spark: [2, 3, 2, 5, 4, 6, 5, 7, 6, 8],
  },
  {
    label: "Avg Order Value",
    value: "$6,053",
    change: "+4.8%",
    positive: true,
    icon: TrendingUp,
    gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
    accent: "text-blue-500",
    spark: [5, 5, 6, 5, 6, 7, 6, 7, 7, 8],
  },
  {
    label: "Conversion",
    value: "3.2%",
    change: "-0.3%",
    positive: false,
    icon: Target,
    gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    accent: "text-amber-500",
    spark: [6, 7, 5, 6, 5, 4, 5, 4, 3, 4],
  },
];

const topProducts = [
  { rank: 1, name: "BRAXX GT Pro", revenue: 156000, units: 24, pct: 55 },
  { rank: 2, name: "BRAXX GT", revenue: 84500, units: 10, pct: 30 },
  { rank: 3, name: "Battery Pack", revenue: 18000, units: 14, pct: 6 },
  { rank: 4, name: "Charger Station", revenue: 14200, units: 8, pct: 5 },
  { rank: 5, name: "Accessories", revenue: 11800, units: 32, pct: 4 },
];

const growthIndicators = [
  { label: "Revenue Target", value: 88, color: "#7c3aed" },
  { label: "Order Growth", value: 72, color: "#10b981" },
  { label: "Market Reach", value: 64, color: "#2563eb" },
];

const activityFeed = [
  {
    actor: "Marcus Chen",
    summary: "closed deal with Empire Electric",
    timestamp: "2026-03-17T14:30:00",
    module: "sales",
    variant: "success" as const,
  },
  {
    actor: "Sarah Kim",
    summary: "onboarded Thunder Road EV as new dealer",
    timestamp: "2026-03-16T14:20:00",
    module: "partners",
    variant: "purple" as const,
  },
  {
    actor: "System",
    summary: "monthly revenue target reached: $250K",
    timestamp: "2026-03-15T08:00:00",
    module: "system",
    variant: "info" as const,
  },
  {
    actor: "Alex Torres",
    summary: "processed PO-2026-018 for GT Pro units",
    timestamp: "2026-03-14T17:00:00",
    module: "inventory",
    variant: "warning" as const,
  },
  {
    actor: "Sarah Kim",
    summary: "converted lead Amanda Foster to order",
    timestamp: "2026-03-13T15:45:00",
    module: "sales",
    variant: "success" as const,
  },
];

const PERF_CHART_DATA = [
  { month: "Oct", revenue: 168, orders: 32, aov: 5250 },
  { month: "Nov", revenue: 195, orders: 35, aov: 5571 },
  { month: "Dec", revenue: 224, orders: 38, aov: 5895 },
  { month: "Jan", revenue: 198, orders: 36, aov: 5500 },
  { month: "Feb", revenue: 241, orders: 42, aov: 5738 },
  { month: "Mar", revenue: 284, orders: 47, aov: 6043 },
];

const PERF_CHART_SERIES = [
  { key: "revenue", label: "Revenue ($K)", color: "#7c3aed" },
  { key: "orders", label: "Orders", color: "#10b981" },
  { key: "aov", label: "AOV ($)", color: "#2563eb" },
];

/* ─── Components ───────────────────────────────────────────── */

function ProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
  color = "hsl(var(--primary))",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg
      width={size}
      height={size}
      className="-rotate-90"
      style={
        {
          "--circumference": circumference,
          "--offset": offset,
        } as React.CSSProperties
      }
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000"
      />
    </svg>
  );
}

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs shadow-lg border border-border/50">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground tabular-nums">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs shadow-lg border border-border/50">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: d.payload.color }}
        />
        <span className="font-medium text-foreground">{d.name}</span>
      </div>
      <p className="text-muted-foreground tabular-nums mt-0.5">
        {formatCurrency(d.value)}
      </p>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function PerformancePage() {
  return (
    <div className="space-y-4">
      {/* ── Hero Header ─────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4 animate-in stagger-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              Live
            </span>
            <span className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
              Executive Overview
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Performance
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded text-xs font-medium h-8">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </Button>
          <span className="inline-flex items-center rounded border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            Last 30 days
          </span>
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {heroMetrics.map((m) => (
          <div key={m.label} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
            <div className="min-w-0">
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">{m.label}</span>
              <div className="flex items-center gap-1.5">
                <span className={cn("text-sm font-mono font-semibold tabular-nums", m.label === "Revenue" ? "text-primary" : "text-foreground")}>{m.value}</span>
                <span className={cn("text-[10px] font-medium", m.positive ? "text-emerald-600" : "text-red-500")}>{m.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModuleChart
        title="Performance Overview"
        subtitle="Revenue, orders and AOV across 6 months"
        data={PERF_CHART_DATA}
        xKey="month"
        series={PERF_CHART_SERIES}
      />

      {/* ── Charts Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="sm:col-span-2 lg:col-span-2 eng-card p-5 animate-in stagger-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Revenue Trend</span>
              <h3 className="text-sm font-medium text-foreground mt-0.5">Monthly Revenue</h3>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              6 months
            </Badge>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyRevenue}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#7c3aed"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor="#7c3aed"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v: number) => `$${v / 1000}K`}
                  dx={-4}
                />
                <Tooltip
                  content={<RevenueTooltip />}
                  cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#7c3aed",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-2 eng-card-dark p-5 animate-in stagger-2">
          <div className="mb-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Channel Mix</span>
            <h3 className="text-sm font-medium text-foreground mt-0.5">Revenue by Channel</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative h-[200px] w-[200px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<PieTooltip />} />
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  >
                    {channelData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-semibold tabular-nums text-foreground">
                  {formatCurrency(channelTotal)}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {channelData.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-muted-foreground truncate">
                    {c.name}
                  </span>
                  <span className="ml-auto tabular-nums font-medium text-foreground">
                    {Math.round((c.value / channelTotal) * 100)}%
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                    {formatCurrency(c.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Channel Performance Section ─────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        <div className="lg:w-[200px] xl:w-[220px] shrink-0 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              Channels
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Breakdown by sales channel. Relative contribution.
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {channelData.map((ch, i) => {
            const pct = Math.round((ch.value / channelTotal) * 100);
            return (
              <div
                key={ch.name}
                className={cn(
                  "eng-card p-5 flex flex-col justify-between gap-4 animate-in",
                  i < 6 && `stagger-${i + 1}`
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    {ch.name}
                  </span>
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: ch.color }}
                  />
                </div>
                <div>
                  <span className="text-2xl font-semibold text-foreground leading-none tabular-nums block">
                    {formatCurrency(ch.value)}
                  </span>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full animate-fill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${ch.color}cc, ${ch.color}88)`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-foreground leading-none tabular-nums">
                    {pct}%
                  </span>
                  <span className="text-xs text-muted-foreground">share</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
        <div className="md:col-span-2 eng-card p-5 animate-in stagger-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Top Products</span>
            <Badge variant="secondary" className="text-[10px] font-mono">
              {topProducts.length} items
            </Badge>
          </div>
          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.rank} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                    p.rank === 1
                      ? "bg-violet-100 text-violet-700"
                      : p.rank === 2
                        ? "bg-blue-100 text-blue-700"
                        : p.rank === 3
                          ? "bg-emerald-100 text-emerald-700"
                          : p.rank === 4
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                  )}
                >
                  {p.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {p.name}
                    </p>
                    <span className="text-[10px] tabular-nums text-muted-foreground shrink-0 ml-2">
                      {formatCurrency(p.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-500/70 animate-fill"
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums text-muted-foreground shrink-0">
                      {p.units} units
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="eng-card-dark p-5 animate-in stagger-2">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-4">
            Growth Indicators
          </span>
          <div className="space-y-5">
            {growthIndicators.map((g) => (
              <div key={g.label} className="flex items-center gap-4">
                <div>
                  <ProgressRing value={g.value} color={g.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {g.label}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {g.value}% achieved
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="eng-card-dark p-5 flex flex-col animate-in stagger-3">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-4">
            Recent Activity
          </span>
          <div className="flex-1 space-y-3">
            {activityFeed.map((item, i) => (
              <div key={i} className="flex gap-3">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-[10px] font-medium bg-secondary text-muted-foreground">
                    {getInitials(item.actor)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] text-foreground leading-snug">
                    <span className="font-medium text-foreground">{item.actor}</span>{" "}
                    <span className="text-muted-foreground">{item.summary}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={item.variant}
                      className="text-[9px] px-1.5 py-0"
                    >
                      {item.module}
                    </Badge>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
