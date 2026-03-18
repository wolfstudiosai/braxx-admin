"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusDot, ModuleChart } from "@/components/workspace";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  SlidersHorizontal,
  Truck,
  AlertTriangle,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings2,
  Bookmark,
} from "lucide-react";

// ─── Stock by Model ─────────────────────────────────────────────────────────

const STOCK_BY_MODEL = [
  {
    name: "BRAXX GT",
    total: 45,
    colorways: [
      { name: "Stealth Black", warehouse: 18, dealer: 0 },
      { name: "Arctic White", warehouse: 12, dealer: 0 },
      { name: "Gunmetal Gray", warehouse: 8, dealer: 7 },
    ],
  },
  {
    name: "BRAXX GT Pro",
    total: 28,
    colorways: [
      { name: "Stealth Black", warehouse: 11, dealer: 0 },
      { name: "Arctic White", warehouse: 8, dealer: 0 },
      { name: "Matte Black", warehouse: 4, dealer: 5 },
    ],
  },
  {
    name: "BRAXX Battery Pack",
    total: 120,
    colorways: [
      { name: "Standard", warehouse: 90, dealer: 30 },
    ],
  },
];

// ─── Chart Data ─────────────────────────────────────────────────────────────

const STOCK_BAR_DATA = [
  { name: "GT", warehouse: 38, dealer: 7 },
  { name: "GT Pro", warehouse: 23, dealer: 5 },
  { name: "Battery", warehouse: 90, dealer: 30 },
];

const DISTRIBUTION_RING = [
  { name: "GT", value: 45, color: "hsl(var(--primary))" },
  { name: "GT Pro", value: 28, color: "hsl(263,70%,58%)" },
  { name: "Battery", value: 120, color: "hsl(160,60%,45%)" },
];

const INV_CHART_DATA = [
  { month: "Oct", warehouse: 110, dealer: 5, sold: 12 },
  { month: "Nov", warehouse: 125, dealer: 6, sold: 18 },
  { month: "Dec", warehouse: 130, dealer: 7, sold: 24 },
  { month: "Jan", warehouse: 135, dealer: 7, sold: 22 },
  { month: "Feb", warehouse: 140, dealer: 8, sold: 28 },
  { month: "Mar", warehouse: 142, dealer: 8, sold: 36 },
];

const INV_CHART_SERIES = [
  { key: "warehouse", label: "Warehouse", color: "#7c3aed" },
  { key: "dealer", label: "Dealer", color: "#2563eb" },
  { key: "sold", label: "Sold", color: "#10b981" },
];

// ─── Ticker Items ───────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  { label: "STOCK MOVEMENT", text: "GT Pro Stealth Black — 2 units sold" },
  { label: "LOW STOCK ALERT", text: "GT Pro Matte Black below threshold" },
  { label: "INCOMING SHIPMENT", text: "PO-2026-020 — 10x GT Stealth Black, ETA Mar 25" },
  { label: "ADJUSTMENT", text: "GT Pro Matte Black — 1 unit damaged" },
  { label: "SHIPMENT UPDATE", text: "Battery Pack order arriving Apr 2" },
  { label: "DEALER TRANSFER", text: "3x GT Arctic White to Pacific Electric" },
];

// ─── Recent Movements ────────────────────────────────────────────────────────

const MOVEMENTS = [
  { type: "sell" as const, product: "GT Pro Stealth Black", qty: -2, ref: "ORD-2026-042", actor: "Sarah Kim", date: "Mar 15" },
  { type: "reserve" as const, product: "GT Pro Matte Black", qty: -1, ref: "ORD-2026-039", actor: "System", date: "Mar 12" },
  { type: "receive" as const, product: "GT Pro Matte Black", qty: 4, ref: "PO-2026-018", actor: "Alex Torres", date: "Mar 1" },
  { type: "adjust" as const, product: "GT Pro Matte Black", qty: -1, ref: "Damage - shipping", actor: "Alex Torres", date: "Feb 25" },
  { type: "sell" as const, product: "GT Stealth Black", qty: -3, ref: "ORD-2026-031", actor: "Sarah Kim", date: "Feb 20" },
  { type: "receive" as const, product: "Battery Pack Standard", qty: 30, ref: "PO-2026-015", actor: "Alex Torres", date: "Feb 18" },
];

const MOVEMENT_ICON_CONFIG: Record<string, { icon: typeof Package; bg: string; text: string }> = {
  receive: { icon: ArrowDownCircle, bg: "bg-emerald-100 dark:bg-emerald-950/30", text: "text-emerald-600" },
  sell: { icon: ArrowUpCircle, bg: "bg-blue-100 dark:bg-blue-950/30", text: "text-blue-600" },
  adjust: { icon: Settings2, bg: "bg-amber-100 dark:bg-amber-950/30", text: "text-amber-600" },
  reserve: { icon: Bookmark, bg: "bg-violet-100 dark:bg-violet-950/30", text: "text-violet-600" },
};

// ─── Low Stock Alerts ───────────────────────────────────────────────────────

const LOW_STOCK_ALERTS = [
  { product: "BRAXX GT — Gunmetal Gray", available: 8, threshold: 10, status: "warning" as const },
  { product: "BRAXX GT Pro — Arctic White", available: 6, threshold: 10, status: "warning" as const },
  { product: "BRAXX GT Pro — Matte Black", available: 3, threshold: 10, status: "critical" as const },
];

// ─── Location Summary ───────────────────────────────────────────────────────

const LOCATIONS = [
  { name: "Main Warehouse", units: 142, pct: 82, color: "hsl(var(--primary))" },
  { name: "True Motion Cycles", units: 3, pct: 2, color: "hsl(263,70%,58%)" },
  { name: "Empire Electric", units: 2, pct: 1, color: "hsl(38,92%,55%)" },
  { name: "Pacific Electric", units: 8, pct: 5, color: "hsl(160,60%,45%)" },
];

// ─── Incoming Shipments ─────────────────────────────────────────────────────

const INCOMING = [
  { ref: "PO-2026-020", items: "10x GT Stealth Black", eta: "Mar 25", daysOut: 8, progress: 65 },
  { ref: "PO-2026-021", items: "5x GT Pro Arctic White", eta: "Mar 28", daysOut: 11, progress: 40 },
  { ref: "PO-2026-022", items: "30x Battery Pack", eta: "Apr 2", daysOut: 16, progress: 20 },
];

// ─── Helper Components ──────────────────────────────────────────────────────

function StockGauge({ available, threshold }: { available: number; threshold: number }) {
  const max = threshold * 2;
  const pct = Math.min((available / max) * 100, 100);
  const threshPct = (threshold / max) * 100;
  const isCritical = available < threshold / 2;
  return (
    <div className="relative h-3 w-full rounded-full bg-secondary overflow-hidden">
      <div
        className="absolute inset-y-0 right-0 rounded-r-full opacity-15"
        style={{
          left: `${threshPct}%`,
          backgroundColor: "hsl(var(--destructive))",
        }}
      />
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full transition-all",
          isCritical ? "bg-red-500" : "bg-amber-500",
        )}
        style={{ width: `${pct}%` }}
      />
      <div
        className="absolute inset-y-0 w-0.5 bg-red-500"
        style={{ left: `${threshPct}%` }}
      />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <p key={p.name} className="text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function InventoryPage() {
  return (
    <div className="space-y-4">
      {/* ── Hero Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-[10px] font-mono font-medium tracking-wider text-primary uppercase">
              Real Time
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              System Tracking
            </span>
          </div>
          <h1 className="text-xl font-light tracking-tight text-foreground">
            Inventory <span className="text-muted-foreground">Grid</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded-full text-xs font-medium h-8 gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Adjust Stock
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs font-medium h-8 gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
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
              <span className="text-primary/30 mx-1">+</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
          <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
            <Package className="h-4 w-4 text-violet-500" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Total Stock</span>
            <span className="text-sm font-semibold tabular-nums text-foreground">150</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl card-gradient-violet px-3 py-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <Package className="h-4 w-4 text-blue-500" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Warehouse</span>
            <span className="text-sm font-semibold tabular-nums text-foreground">142</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Package className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Dealer</span>
            <span className="text-sm font-semibold tabular-nums text-foreground">8</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl card-gradient-rose px-3 py-2.5">
          <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 pulse-live">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Low Stock</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tabular-nums text-primary">3</span>
              <span className="text-[10px] text-red-500 font-medium">alert</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl card-gradient-blue px-3 py-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <Truck className="h-4 w-4 text-blue-500" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Incoming</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tabular-nums text-foreground">62</span>
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 pulse-live" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Module Chart ── */}
      <ModuleChart
        title="Inventory Overview"
        subtitle="Stock levels and sales volume over 6 months"
        data={INV_CHART_DATA}
        xKey="month"
        series={INV_CHART_SERIES}
      />

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Stock Level Bar Chart */}
        <div className="lg:col-span-2 bento-card p-5 animate-in stagger-1 animate-shimmer">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Stock Levels</span>
              <h3 className="text-base font-bold text-foreground mt-0.5">By Model &amp; Location</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
                <span className="text-[10px] text-muted-foreground">Warehouse</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "hsl(263,70%,58%)" }} />
                <span className="text-[10px] text-muted-foreground">Dealer</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STOCK_BAR_DATA} margin={{ top: 10, right: 16, left: 0, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip content={<BarTooltip />} />
                <ReferenceLine
                  y={10} stroke="hsl(var(--destructive))" strokeDasharray="6 4" strokeOpacity={0.5}
                  label={{
                    value: "Low Stock",
                    position: "insideTopRight",
                    fill: "hsl(var(--destructive))",
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="warehouse" name="Warehouse" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dealer" name="Dealer" fill="hsl(263,70%,58%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            {STOCK_BY_MODEL.map((model) => (
              <div key={model.name} className="space-y-2">
                <p className="text-xs font-semibold text-foreground">{model.name}</p>
                {model.colorways.map((cw) => (
                  <div key={cw.name} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{cw.name}</span>
                    <span className="text-foreground tabular-nums">
                      {cw.warehouse}{cw.dealer > 0 && <span className="text-muted-foreground"> + {cw.dealer}d</span>}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Stock Distribution Ring — Dark Card */}
        <div className="bento-card-dark p-5 animate-in stagger-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Distribution Mix</span>
          <div className="relative h-[200px] mt-2 animate-float">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DISTRIBUTION_RING}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={85}
                  paddingAngle={3}
                  strokeWidth={2} stroke="hsl(var(--background))"
                >
                  {DISTRIBUTION_RING.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-semibold text-foreground tabular-nums">193</span>
              <span className="text-xs text-muted-foreground uppercase">Total Units</span>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {DISTRIBUTION_RING.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-foreground">{item.name}</span>
                </div>
                <span className="text-muted-foreground tabular-nums">{item.value} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stock Alerts ── */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-[200px] xl:w-[220px] shrink-0">
          <h2 className="text-sm font-semibold text-foreground">
            Stock Alerts
          </h2>
          <p className="text-xs text-muted-foreground mt-2">
            Items below reorder threshold. Immediate attention.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LOW_STOCK_ALERTS.map((alert, i) => {
            const isCritical = alert.status === "critical";
            return (
              <div
                key={alert.product}
                className={cn(
                  "bento-card p-4 space-y-3 animate-in",
                  i < 3 && `stagger-${i + 1}`,
                  isCritical && "border-red-300 dark:border-red-800/50",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground leading-snug">{alert.product}</p>
                  {isCritical ? (
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 pulse-live" />
                  ) : (
                    <StatusDot status="warning" label="Low" />
                  )}
                </div>
                <StockGauge available={alert.available} threshold={alert.threshold} />
                <div className="flex items-center justify-between text-xs">
                  <span className={cn("font-semibold tabular-nums", isCritical ? "text-red-600" : "text-amber-600")}>
                    {alert.available} available
                  </span>
                  <span className="text-muted-foreground">threshold: {alert.threshold}</span>
                </div>
                <Button variant={isCritical ? "default" : "outline"} size="sm" className="w-full h-7 text-xs font-medium rounded-full">
                  Reorder Now
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Movement Stream — spans 2 cols */}
        <div className="md:col-span-2 bento-card p-5 animate-in stagger-1 bg-mesh-gradient">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Movement Stream</span>
              <h3 className="text-base font-bold text-foreground mt-0.5">Recent Activity</h3>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-0">
              {MOVEMENTS.map((m, i) => {
                const cfg = MOVEMENT_ICON_CONFIG[m.type] ?? MOVEMENT_ICON_CONFIG.adjust;
                const Icon = cfg.icon;
                return (
                  <div key={i} className="relative flex items-start gap-4 py-3.5">
                    <div className={cn("relative z-10 h-[30px] w-[30px] rounded-full flex items-center justify-center shrink-0", cfg.bg)}>
                      <Icon className={cn("h-3.5 w-3.5", cfg.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{m.product}</span>
                        <Badge
                          variant={m.qty > 0 ? "success" : "secondary"}
                          className="text-[10px] tabular-nums"
                        >
                          {m.qty > 0 ? `+${m.qty}` : m.qty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.ref}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{m.date}</p>
                      <p className="text-[10px] text-muted-foreground/70">{m.actor}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location Distribution — Dark Card */}
        <div className="bento-card-dark p-5 animate-in stagger-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-dots-pattern opacity-20 pointer-events-none" />
          <span className="relative text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-3">Location Distribution</span>
          <div className="relative space-y-3">
            <div className="flex h-6 w-full rounded-lg overflow-hidden">
              {LOCATIONS.map((loc) => (
                <div
                  key={loc.name}
                  className="h-full first:rounded-l-lg last:rounded-r-lg"
                  style={{ width: `${loc.pct}%`, backgroundColor: loc.color, minWidth: loc.pct > 3 ? undefined : "8px" }}
                  title={`${loc.name}: ${loc.units} units`}
                />
              ))}
            </div>
            <div className="space-y-2">
              {LOCATIONS.map((loc) => (
                <div key={loc.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: loc.color }} />
                    <span className="text-foreground">{loc.name}</span>
                  </div>
                  <span className="text-muted-foreground tabular-nums">{loc.units} ({loc.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incoming Shipments — Dark Card */}
        <div className="bento-card-dark p-5 animate-in stagger-3 border-blue-500/30">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-3">Incoming Shipments</span>
          <div className="space-y-3">
            {INCOMING.map((ship) => (
              <div key={ship.ref} className="space-y-2 pb-3 border-b border-border last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">{ship.ref}</p>
                    <p className="text-[10px] text-muted-foreground">{ship.items}</p>
                  </div>
                  <Badge variant="info" className="text-[10px] shrink-0 tabular-nums">
                    {ship.daysOut}d
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 animate-fill transition-all"
                      style={{ width: `${ship.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>In transit</span>
                    <span>ETA {ship.eta}</span>
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
