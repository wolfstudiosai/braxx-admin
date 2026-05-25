"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

interface ModuleChartProps {
  title: string;
  subtitle?: string;
  data: Record<string, unknown>[];
  xKey: string;
  series: ChartSeries[];
  height?: number;
  formatValue?: (value: number) => string;
}

type TimeRange = "day" | "week" | "month" | "quarter" | "year";

export function ModuleChart({
  title,
  subtitle,
  data,
  xKey,
  series,
  height = 240,
  formatValue = (v) => v.toLocaleString(),
}: ModuleChartProps) {
  const [viewMode, setViewMode] = useState<"area" | "bar" | "pie">("area");
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [visible, setVisible] = useState<Set<string>>(
    () => new Set(series.map((s) => s.key))
  );

  const toggle = (key: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const activeSeries = series.filter((s) => visible.has(s.key));

  const rangeData = useMemo(() => {
    if (!data.length) return data;
    if (timeRange === "day") return data.slice(-1);
    if (timeRange === "week") return data.slice(-7);
    if (timeRange === "month") return data.slice(-30);
    if (timeRange === "quarter") return data.slice(-90);
    return data;
  }, [data, timeRange]);

  const pieData = useMemo(
    () =>
      activeSeries.map((s) => ({
        name: s.label,
        value: rangeData.reduce((sum, d) => sum + (Number(d[s.key]) || 0), 0),
        color: s.color,
      })),
    [activeSeries, rangeData]
  );

  const modes = [
    { key: "area" as const, label: "LINE" },
    { key: "bar" as const, label: "BAR" },
    { key: "pie" as const, label: "ARC" },
  ];

  const ranges = [
    { key: "day" as const, label: "Day" },
    { key: "week" as const, label: "Week" },
    { key: "month" as const, label: "Month" },
    { key: "quarter" as const, label: "Quarter" },
    { key: "year" as const, label: "Year" },
  ];

  const metricCards = activeSeries.slice(0, 4).map((s) => {
    const total = rangeData.reduce((sum, d) => sum + (Number(d[s.key]) || 0), 0);
    const first = Number(rangeData[0]?.[s.key]) || 0;
    const last = Number(rangeData[rangeData.length - 1]?.[s.key]) || 0;
    const trend = first > 0 ? ((last - first) / first) * 100 : last > 0 ? 100 : 0;
    return {
      ...s,
      total,
      trend,
    };
  });

  return (
    <div className="eng-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-mono font-medium uppercase tracking-wider text-foreground">
            {title}
          </h3>
          {subtitle && <span className="hidden xl:inline text-[10px] text-muted-foreground">{subtitle}</span>}
        </div>
        <div className="hidden lg:flex items-center gap-1 rounded border border-border p-0.5 bg-background">
          {ranges.map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={cn(
                "px-2 py-1 rounded text-[9px] font-mono uppercase tracking-wider transition-colors",
                timeRange === range.key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {metricCards.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-border">
          {metricCards.map((m) => (
            <div key={m.key} className="px-4 py-2.5 border-r border-border last:border-r-0">
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground block">
                {m.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-mono tabular-nums text-foreground">{formatValue(m.total)}</span>
                <span className={cn("text-[10px] font-medium", m.trend >= 0 ? "text-emerald-600" : "text-red-500")}>
                  {m.trend >= 0 ? "+" : ""}
                  {m.trend.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-px rounded border border-border overflow-hidden">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setViewMode(m.key)}
              className={cn(
                "px-2.5 py-1 text-[9px] font-mono font-medium tracking-wider transition-colors",
                viewMode === m.key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-[9px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          View Records
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-b border-border/50">
        {series.map((s) => (
          <button
            key={s.key}
            onClick={() => toggle(s.key)}
            className={cn(
              "flex items-center gap-1.5 text-[10px] font-mono tracking-wider transition-opacity",
              visible.has(s.key) ? "opacity-100" : "opacity-30"
            )}
          >
            <span
              className="h-2 w-2 rounded-sm shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-muted-foreground uppercase">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === "area" ? (
            <AreaChart
              data={rangeData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                {activeSeries.map((s) => (
                  <linearGradient
                    key={s.key}
                    id={`mcg-${s.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.15} />
                    <stop
                      offset="100%"
                      stopColor={s.color}
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                  fontFamily: "monospace",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                  fontFamily: "monospace",
                }}
                tickFormatter={(v) => formatValue(v)}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                }}
                formatter={(value: number, name: string) => [
                  formatValue(value),
                  name,
                ]}
              />
              {activeSeries.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={1.5}
                  fill={`url(#mcg-${s.key})`}
                  dot={false}
                  activeDot={{
                    r: 3,
                    fill: s.color,
                    stroke: "hsl(var(--card))",
                    strokeWidth: 2,
                  }}
                />
              ))}
            </AreaChart>
          ) : viewMode === "bar" ? (
            <BarChart
              data={rangeData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                  fontFamily: "monospace",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                  fontFamily: "monospace",
                }}
                tickFormatter={(v) => formatValue(v)}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                }}
                formatter={(value: number, name: string) => [
                  formatValue(value),
                  name,
                ]}
              />
              {activeSeries.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  fill={s.color}
                  radius={[2, 2, 0, 0]}
                  barSize={activeSeries.length > 3 ? 10 : 18}
                />
              ))}
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={height * 0.22}
                outerRadius={height * 0.38}
                dataKey="value"
                paddingAngle={2}
                strokeWidth={1}
                stroke="hsl(var(--card))"
                animationBegin={0}
                animationDuration={400}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                }}
                formatter={(value: number) => [formatValue(value)]}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
