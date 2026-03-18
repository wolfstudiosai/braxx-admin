"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeedItem, StatusDot, ModuleChart } from "@/components/workspace";
import { formatCurrency, cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  ArrowUpRight,
  Users,
  Plus,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Data ───────────────────────────────────────────────────────────────────

const PARTNERS = [
  {
    name: "True Motion Cycles",
    location: "Los Angeles, CA",
    status: "active" as const,
    products: ["GT", "GT Pro"],
    revenue: 52000,
    accent: "from-violet-500 to-indigo-500",
  },
  {
    name: "Empire Electric",
    location: "New York, NY",
    status: "active" as const,
    products: ["GT", "GT Pro", "Accessories"],
    revenue: 48200,
    accent: "from-blue-500 to-cyan-500",
  },
  {
    name: "Pacific Electric",
    location: "Portland, OR",
    status: "active" as const,
    products: ["GT", "GT Pro", "Accessories"],
    revenue: 28900,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    name: "Volt City Motors",
    location: "San Francisco, CA",
    status: "active" as const,
    products: ["GT"],
    revenue: 18400,
    accent: "from-amber-500 to-orange-500",
  },
  {
    name: "Sunset Riders",
    location: "Miami, FL",
    status: "active" as const,
    products: ["GT"],
    revenue: 12600,
    accent: "from-pink-500 to-rose-500",
  },
  {
    name: "Thunder Road EV",
    location: "Austin, TX",
    status: "pending" as const,
    products: ["GT", "GT Pro"],
    revenue: null,
    accent: "from-zinc-400 to-zinc-500",
  },
];

const RECENT_ACTIVITY = [
  {
    actor: "Drew Patel",
    summary: "onboarded Peak Performance EV in Denver",
    timestamp: "2026-03-16T14:20:00",
  },
  {
    actor: "Sarah Kim",
    summary: "processed $18,400 quarterly payout for Volt City",
    timestamp: "2026-03-15T09:30:00",
  },
  {
    actor: "Marcus Chen",
    summary: "approved dealer application from Green Wheel Motors",
    timestamp: "2026-03-14T11:30:00",
  },
  {
    actor: "System",
    summary: "Thunder Road EV completed onboarding documents",
    timestamp: "2026-03-13T10:15:00",
  },
];

const PENDING_APPLICATIONS = [
  {
    name: "Jordan Lee",
    business: "EV Moto Works",
    location: "Seattle, WA",
    type: "Dealer",
    badge: "new" as const,
    date: "Mar 15",
  },
  {
    name: "Sarah Thompson",
    business: "Rider's Den",
    location: "Charlotte, NC",
    type: "Dealer",
    badge: "new" as const,
    date: "Mar 17",
  },
  {
    name: "Tyler Brooks",
    business: null,
    location: "Nashville, TN",
    type: "Ambassador",
    badge: "new" as const,
    date: "Mar 14",
  },
  {
    name: "David Chen",
    business: "TechFleet Solutions",
    location: null,
    type: "Corporate",
    badge: "follow up" as const,
    date: "Mar 10",
  },
];

const GEO_COVERAGE = [
  { region: "California", count: 3, prospect: false },
  { region: "New York", count: 1, prospect: false },
  { region: "Oregon", count: 1, prospect: false },
  { region: "Texas", count: 1, prospect: false },
  { region: "Florida", count: 1, prospect: false },
  { region: "Colorado", count: 1, prospect: false },
  { region: "Illinois", count: 1, prospect: true },
];

const REVENUE_CHART_DATA = [
  { name: "True Motion", revenue: 52000 },
  { name: "Empire", revenue: 48200 },
  { name: "Pacific", revenue: 28900 },
  { name: "Volt City", revenue: 18400 },
  { name: "Sunset", revenue: 12600 },
];

const PARTNER_CHART_SERIES = [
  { key: "revenue", label: "Revenue", color: "#8b5cf6" },
];

const maxGeoCount = 3;
const maxRevenue = 52000;

const REGION_FILTERS = ["All", "West Coast", "East Coast", "South", "Midwest"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusDotStatus(status: "active" | "pending"): "active" | "pending" {
  return status;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PartnersPage() {
  const [regionFilter, setRegionFilter] = useState("All");

  return (
    <div className="space-y-4">
      {/* ── Hero Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs font-medium tracking-wider text-primary uppercase">
              NETWORK
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
              Relationship Mgmt
            </span>
          </div>
          <h1 className="text-xl font-light tracking-tight text-foreground">
            Partner <span className="text-muted-foreground">Network</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs font-medium rounded-full h-8 gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" className="text-xs font-medium rounded-full h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Partner
          </Button>
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div className="flex items-center gap-3 rounded-xl card-gradient-violet px-3 py-2.5">
          <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-violet-500" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Total</span>
            <span className="text-sm font-semibold tabular-nums text-primary">12</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl card-gradient-emerald px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Active</span>
            <span className="text-sm font-semibold tabular-nums text-emerald-600">8</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl card-gradient-amber px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Onboarding</span>
            <span className="text-sm font-semibold tabular-nums text-amber-500">3</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Pending</span>
            <span className="text-sm font-semibold tabular-nums text-foreground">4</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl card-gradient-blue px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Revenue QTD</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tabular-nums text-foreground">$186K</span>
              <span className="text-[10px] text-emerald-600 font-medium">+24%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Partner Revenue Chart ── */}
      <div className="animate-shimmer">
        <ModuleChart
          title="Partner Revenue"
          subtitle="Quarterly revenue by partner"
          data={REVENUE_CHART_DATA}
          xKey="name"
          series={PARTNER_CHART_SERIES}
          formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
        />
      </div>

      {/* ── Partner Network Section ── */}
      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        <div className="lg:w-[200px] xl:w-[220px] shrink-0 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Network
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Active dealers &amp; partner locations. Revenue tracking.
            </p>
          </div>
          <div className="flex flex-row lg:flex-col flex-wrap gap-1.5 mt-3">
            {REGION_FILTERS.map((region) => (
              <button
                key={region}
                onClick={() => setRegionFilter(region)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider border transition-all",
                  regionFilter === region
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                )}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {PARTNERS.map((partner, i) => (
            <div
              key={partner.name}
              className={cn(
                "bento-card group cursor-pointer hover:shadow-md transition-all",
                "animate-in",
                i < 6 && `stagger-${i + 1}`
              )}
            >
              <div className={cn("h-1.5 w-full bg-gradient-to-r", partner.accent)} />
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-snug">{partner.name}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {partner.location}
                    </p>
                  </div>
                  <StatusDot
                    status={getStatusDotStatus(partner.status)}
                    label={partner.status === "active" ? "Active" : "Onboarding"}
                    className={partner.status === "pending" ? "pulse-live" : ""}
                  />
                </div>

                {partner.revenue && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground tabular-nums">{formatCurrency(partner.revenue)}</span>
                      <span className="text-[10px] text-muted-foreground">this quarter</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn("h-full rounded-full bg-gradient-to-r animate-fill", partner.accent)}
                        style={{ width: `${(partner.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {!partner.revenue && (
                  <p className="text-[11px] text-muted-foreground italic">Onboarding — no revenue yet</p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {partner.products.map((p) => (
                    <Badge key={p} variant="secondary" className="text-[10px]">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
        {/* Revenue Chart — spans 2 cols */}
        <div className="md:col-span-2 bento-card p-5 bg-mesh-gradient">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Partner Revenue</span>
              <h3 className="text-base font-bold text-foreground mt-0.5">Quarterly by Partner</h3>
            </div>
            <button className="text-[10px] font-mono text-primary hover:underline flex items-center gap-1 uppercase tracking-wider">
              Details <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={REVENUE_CHART_DATA}
                margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
                barSize={32}
              >
                <XAxis
                  dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {REVENUE_CHART_DATA.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#f472b6"][idx]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Coverage — Dark Card */}
        <div className="bento-card-dark p-5 bg-dots-pattern">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Geo Coverage</span>
          <div className="space-y-2.5 mt-4">
            {GEO_COVERAGE.map((item) => (
              <div key={item.region} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[12px] text-foreground">{item.region}</span>
                    {item.prospect && (
                      <span className="text-[9px] font-mono text-muted-foreground border border-border rounded px-1">prospect</span>
                    )}
                  </div>
                  <span className="text-[11px] tabular-nums text-muted-foreground font-mono">{item.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full animate-fill",
                      item.prospect
                        ? "border border-dashed border-border bg-transparent"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500"
                    )}
                    style={{ width: `${(item.count / maxGeoCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Center + Activity — Dark Card */}
        <div className="bento-card-dark p-5 flex flex-col animate-border-glow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Approval Center</span>
            <Badge variant="outline" className="text-[9px] h-5 px-1.5 border-border text-muted-foreground">
              {PENDING_APPLICATIONS.length} pending
            </Badge>
          </div>
          <div className="space-y-2.5 flex-1">
            {PENDING_APPLICATIONS.map((app) => (
              <div
                key={app.name + (app.business ?? "")}
                className="rounded-lg border border-border bg-secondary/30 p-2.5 space-y-1.5 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarFallback className="bg-secondary text-muted-foreground text-[9px] font-bold">
                        {getInitials(app.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[12px] font-medium text-foreground leading-snug">
                        {app.name}
                      </p>
                      {app.business && (
                        <p className="text-[10px] text-muted-foreground">{app.business}</p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={app.badge === "follow up" ? "warning" : "info"}
                    className="text-[9px] shrink-0"
                  >
                    {app.badge}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pl-8">
                  <div className="flex items-center gap-2">
                    {app.location && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        {app.location}
                      </span>
                    )}
                    <span className="text-[9px] font-mono text-muted-foreground border border-border rounded px-1">
                      {app.type}
                    </span>
                  </div>
                  <button className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5 uppercase tracking-wider">
                    Review <ArrowUpRight className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Inline Activity */}
          <div className="mt-4 pt-3 border-t border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Recent Activity</span>
            <div className="space-y-0">
              {RECENT_ACTIVITY.map((item, i) => (
                <FeedItem
                  key={i}
                  actor={item.actor}
                  summary={item.summary}
                  timestamp={item.timestamp}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
