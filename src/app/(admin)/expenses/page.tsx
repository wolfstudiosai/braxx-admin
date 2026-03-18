"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModuleChart, ContentStrip } from "@/components/workspace";
import { formatCurrency, getInitials, cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Plus,
  Download,
  Check,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";

// ─── Data ───────────────────────────────────────────────────────────────────

const EXPENSES = [
  {
    id: "1",
    title: "GT Pro Photo Shoot — Desert Location",
    vendor: "RedFrame Studios",
    amount: 4200,
    category: "Marketing",
    requester: "Marcus Chen",
    status: "Approved" as const,
    date: "Mar 15",
  },
  {
    id: "2",
    title: "Q1 Dealer Sample Kits (x8)",
    vendor: "PackRight Co",
    amount: 3600,
    category: "Sales",
    requester: "Drew Patel",
    status: "Approved" as const,
    date: "Mar 12",
  },
  {
    id: "3",
    title: "Social Media Ad Spend — March",
    vendor: "Meta Ads",
    amount: 2800,
    category: "Marketing",
    requester: "Jamie Foster",
    status: "Pending" as const,
    date: "Mar 16",
  },
  {
    id: "4",
    title: "Warehouse Shelving System",
    vendor: "Industrial Supply Co",
    amount: 1850,
    category: "Operations",
    requester: "Alex Torres",
    status: "Approved" as const,
    date: "Mar 10",
  },
  {
    id: "5",
    title: "Ambassador Welcome Packages (x4)",
    vendor: "BrandBox",
    amount: 1200,
    category: "Marketing",
    requester: "Jamie Foster",
    status: "Pending" as const,
    date: "Mar 17",
  },
  {
    id: "6",
    title: "Trade Show Booth — EV Expo 2026",
    vendor: "ExpoDesign Inc",
    amount: 4400,
    category: "Marketing",
    requester: "Marcus Chen",
    status: "Pending" as const,
    date: "Mar 17",
  },
  {
    id: "7",
    title: "Shipping Insurance — March",
    vendor: "ShipGuard",
    amount: 890,
    category: "Operations",
    requester: "Alex Torres",
    status: "Approved" as const,
    date: "Mar 8",
  },
  {
    id: "8",
    title: "Office Supplies — Q1 Restock",
    vendor: "Staples",
    amount: 340,
    category: "Operations",
    requester: "Alex Torres",
    status: "Approved" as const,
    date: "Mar 5",
  },
  {
    id: "9",
    title: "Legal Review — Partner Agreements",
    vendor: "Morrison & Associates",
    amount: 2200,
    category: "Legal",
    requester: "Marcus Chen",
    status: "Approved" as const,
    date: "Mar 3",
  },
  {
    id: "10",
    title: "CRM Software — Annual License",
    vendor: "HubSpot",
    amount: 4800,
    category: "Software",
    requester: "Marcus Chen",
    status: "Approved" as const,
    date: "Feb 28",
  },
];

const SPEND_BY_CATEGORY = [
  { label: "Marketing", amount: 14600, pct: 42, color: "hsl(263,70%,58%)" },
  { label: "Sales", amount: 3600, pct: 10, color: "hsl(160,60%,45%)" },
  { label: "Operations", amount: 3080, pct: 9, color: "hsl(38,92%,55%)" },
  { label: "Software", amount: 4800, pct: 14, color: "hsl(217,91%,60%)" },
  { label: "Legal", amount: 2200, pct: 6, color: "hsl(215,14%,52%)" },
];

const TOTAL_CATEGORY_SPEND = SPEND_BY_CATEGORY.reduce((s, c) => s + c.amount, 0);

const APPROVAL_QUEUE = [
  { title: "Social Media Ad Spend", amount: 2800, requester: "Jamie Foster", category: "Marketing" },
  { title: "Ambassador Welcome Packages", amount: 1200, requester: "Jamie Foster", category: "Marketing" },
  { title: "Trade Show Booth", amount: 4400, requester: "Marcus Chen", category: "Marketing" },
];

const MONTHLY_TREND = [
  { month: "Oct", amount: 22000 },
  { month: "Nov", amount: 26000 },
  { month: "Dec", amount: 31000 },
  { month: "Jan", amount: 28000 },
  { month: "Feb", amount: 31000 },
  { month: "Mar", amount: 35000 },
];

const EXPENSE_CHART_DATA = [
  { month: "Oct", marketing: 8000, operations: 5000, sales: 4000, software: 2500, legal: 2500 },
  { month: "Nov", marketing: 10000, operations: 5500, sales: 4500, software: 3000, legal: 3000 },
  { month: "Dec", marketing: 12000, operations: 6000, sales: 5000, software: 4000, legal: 4000 },
  { month: "Jan", marketing: 10000, operations: 5500, sales: 5000, software: 4000, legal: 3500 },
  { month: "Feb", marketing: 11000, operations: 6000, sales: 5500, software: 4500, legal: 4000 },
  { month: "Mar", marketing: 14600, operations: 3080, sales: 3600, software: 4800, legal: 2200 },
];

const EXPENSE_CHART_SERIES = [
  { key: "marketing", label: "Marketing", color: "#8b5cf6" },
  { key: "operations", label: "Operations", color: "#f59e0b" },
  { key: "sales", label: "Sales", color: "#10b981" },
  { key: "software", label: "Software", color: "#3b82f6" },
  { key: "legal", label: "Legal", color: "#6b7280" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Marketing: "hsl(263,70%,58%)",
  Operations: "hsl(38,92%,55%)",
  Sales: "hsl(160,60%,45%)",
  Software: "hsl(217,91%,60%)",
  Legal: "hsl(215,14%,52%)",
};

const CATEGORY_BORDER: Record<string, string> = {
  Marketing: "border-l-violet-500",
  Operations: "border-l-amber-500",
  Sales: "border-l-emerald-500",
  Software: "border-l-blue-500",
  Legal: "border-l-slate-400",
};

const CATEGORY_DOT: Record<string, string> = {
  Marketing: "bg-violet-500",
  Operations: "bg-amber-500",
  Sales: "bg-emerald-500",
  Software: "bg-blue-500",
  Legal: "bg-slate-400",
};

const STATUS_BADGE_VARIANT = {
  Approved: "success" as const,
  Pending: "warning" as const,
  Rejected: "destructive" as const,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-4">
      {/* ── Hero Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              MONTHLY
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
              Expense Tracking
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Expense
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs font-medium rounded h-8">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button size="sm" className="text-xs font-medium rounded h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Expense
          </Button>
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Total</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">{formatCurrency(34820)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Pending</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-primary">{formatCurrency(8400)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Approved</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-emerald-600">{formatCurrency(22420)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Budget</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">$50,000</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Remaining</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">{formatCurrency(15180)}</span>
          </div>
        </div>
      </div>

      {/* ── Expense Overview Chart ── */}
      <div>
        <ModuleChart
          title="Expense Overview"
          subtitle="Monthly spend by category"
          data={EXPENSE_CHART_DATA}
          xKey="month"
          series={EXPENSE_CHART_SERIES}
          formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
        />
      </div>

      {/* ── Recent Receipts ── */}
      <ContentStrip
        label="Recent Receipts"
        items={[
          { title: "Photo Shoot Invoice", subtitle: "Mar 15 · $4,200", tag: "Approved", gradient: "carbon" },
          { title: "Dealer Sample Kits", subtitle: "Mar 12 · $3,600", tag: "Approved", gradient: "steel" },
          { title: "Meta Ad Spend", subtitle: "Mar 16 · $2,800", tag: "Pending", gradient: "ember" },
          { title: "Warehouse Shelving", subtitle: "Mar 10 · $1,850", tag: "Approved", gradient: "obsidian" },
          { title: "Ambassador Packages", subtitle: "Mar 17 · $1,200", tag: "Pending", gradient: "violet" },
        ]}
      />

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Category Breakdown — Dark Card */}
        <div className="eng-card-dark p-5 animate-in stagger-1">
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Category Breakdown</span>
          <div className="flex flex-col items-center mt-2">
            <div className="relative animate-scale-in">
              <PieChart width={200} height={200}>
                <Pie
                  data={SPEND_BY_CATEGORY}
                  dataKey="amount"
                  nameKey="label"
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={85}
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {SPEND_BY_CATEGORY.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                </Pie>
                <text
                  x="50%" y="46%" textAnchor="middle" dominantBaseline="central"
                  className="fill-foreground text-lg font-semibold"
                >
                  {formatCurrency(TOTAL_CATEGORY_SPEND)}
                </text>
                <text
                  x="50%" y="58%" textAnchor="middle" dominantBaseline="central"
                  className="fill-muted-foreground text-[10px]"
                >
                  total spend
                </text>
              </PieChart>
            </div>
            <div className="w-full space-y-2 mt-2">
              {SPEND_BY_CATEGORY.map((cat) => (
                <div key={cat.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-foreground text-[12px]">{cat.label}</span>
                  </div>
                  <span className="text-muted-foreground tabular-nums text-[12px] font-mono">{formatCurrency(cat.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Spend Trend — spans 2 cols */}
        <div className="lg:col-span-2 eng-card p-5 animate-in stagger-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider block">Monthly Trend</span>
              <h3 className="text-sm font-medium text-foreground mt-0.5">Spend Over Time</h3>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono h-5 px-1.5">6 Months</Badge>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="month" axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => `$${v / 1000}K`}
                  domain={[0, 50000]}
                />
                <Tooltip content={<TrendTooltip />} />
                <ReferenceLine
                  y={40000} stroke="hsl(var(--destructive))" strokeDasharray="6 4"
                  strokeOpacity={0.5}
                  label={{
                    value: "Budget $40K",
                    position: "insideTopRight",
                    fill: "hsl(var(--destructive))",
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone" dataKey="amount"
                  stroke="hsl(var(--primary))" strokeWidth={2}
                  fill="url(#spendGradient)" dot={{ r: 3, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Expense List Section ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center gap-2">
          <TabsList className="bg-transparent p-0 h-auto gap-1.5">
            {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  "rounded px-3 py-1 text-[10px] font-mono font-medium uppercase tracking-wider border transition-all",
                  "data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:border-border data-[state=inactive]:hover:border-foreground/30",
                )}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {(["all", "pending", "approved", "rejected"] as const).map((tab) => {
          const filtered =
            tab === "all"
              ? EXPENSES
              : EXPENSES.filter((e) => e.status.toLowerCase() === tab);
          return (
            <TabsContent key={tab} value={tab} className="mt-4">
              <div className="grid lg:grid-cols-3 gap-3">
                {/* Expense List */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
                      Expense Requests
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {filtered.length} {filtered.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                  {filtered.map((expense, i) => (
                    <div
                      key={expense.id}
                      className={cn(
                        "eng-card p-4 border-l-[3px] transition-all hover:-translate-y-0.5 hover:shadow-md",
                        "flex flex-col sm:flex-row sm:items-center gap-4",
                        CATEGORY_BORDER[expense.category] ?? "border-l-muted",
                        "animate-in",
                        i < 6 && `stagger-${i + 1}`,
                      )}
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-1.5 w-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                          />
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {expense.category}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{expense.title}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          {expense.vendor} &middot; {expense.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-secondary text-[10px] font-medium text-muted-foreground">
                            {getInitials(expense.requester)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] font-mono text-muted-foreground">{expense.requester}</span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="text-lg font-semibold text-foreground tabular-nums">
                          {formatCurrency(expense.amount)}
                        </span>
                        <Badge
                          variant={STATUS_BADGE_VARIANT[expense.status as keyof typeof STATUS_BADGE_VARIANT] ?? "secondary"}
                          className="text-[10px] font-mono"
                        >
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className="eng-card p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No expenses match this filter.
                      </p>
                    </div>
                  )}
                </div>

                {/* Approval Queue Sidebar — Dark */}
                <div className="space-y-3">
                  <div className="eng-card-dark p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider block">Approval Queue</span>
                        <h3 className="text-sm font-medium text-foreground mt-0.5">Awaiting Review</h3>
                      </div>
                      <div className="h-7 w-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {APPROVAL_QUEUE.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-lg border border-border p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 space-y-1">
                              <p className="text-[12px] font-medium text-foreground truncate">
                                {item.title}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{item.requester}</span>
                              </div>
                            </div>
                            <span
                              className="text-base font-semibold tabular-nums shrink-0"
                              style={{ color: CATEGORY_COLORS[item.category] }}
                            >
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="h-7 text-xs font-medium flex-1 rounded">
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs font-medium flex-1 rounded text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300">
                              <X className="h-3.5 w-3.5 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget Overview — compact */}
                  <div className="eng-card p-5">
                    <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider block mb-3">Budget Overview</span>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-muted-foreground">Monthly Budget</span>
                        <span className="text-[11px] font-mono font-bold text-foreground tabular-nums">$50,000</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/80 animate-fill transition-all"
                          style={{ width: "69.6%" }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                        <span>$34,820 spent</span>
                        <span>$15,180 remaining</span>
                      </div>
                      <div className="pt-2 border-t border-border flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="text-[10px] font-mono text-muted-foreground">
                          $8,400 pending will bring total to $43,220
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
