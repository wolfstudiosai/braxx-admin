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
import { TrendingUp, BarChart3, PieChart as PieIcon } from "lucide-react";

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

export function ModuleChart({
  title,
  subtitle,
  data,
  xKey,
  series,
  height = 260,
  formatValue = (v) => v.toLocaleString(),
}: ModuleChartProps) {
  const [viewMode, setViewMode] = useState<"area" | "bar" | "pie">("area");
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

  const pieData = useMemo(
    () =>
      activeSeries.map((s) => ({
        name: s.label,
        value: data.reduce((sum, d) => sum + (Number(d[s.key]) || 0), 0),
        color: s.color,
      })),
    [activeSeries, data]
  );

  const viewModes = [
    { key: "area" as const, icon: TrendingUp, label: "Line" },
    { key: "bar" as const, icon: BarChart3, label: "Bar" },
    { key: "pie" as const, icon: PieIcon, label: "Circle" },
  ];

  return (
    <div className="bento-card relative overflow-hidden animate-shimmer">
      <div className="bg-dots-pattern absolute inset-0 pointer-events-none opacity-40" />
      <div className="relative p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border overflow-hidden bg-card">
            {viewModes.map((vm) => (
              <button
                key={vm.key}
                onClick={() => setViewMode(vm.key)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium transition-colors",
                  viewMode === vm.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <vm.icon className="h-3 w-3" />
                {vm.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {series.map((s) => (
            <button
              key={s.key}
              onClick={() => toggle(s.key)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all",
                visible.has(s.key)
                  ? "border-transparent text-white shadow-sm"
                  : "border-border text-muted-foreground bg-transparent opacity-50"
              )}
              style={
                visible.has(s.key) ? { backgroundColor: s.color } : undefined
              }
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "area" ? (
              <AreaChart
                data={data}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  {activeSeries.map((s) => (
                    <linearGradient
                      key={s.key}
                      id={`mcgrad-${s.key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={s.color}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor={s.color}
                        stopOpacity={0.02}
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
                    fontSize: 11,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                  tickFormatter={(v) => formatValue(v)}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
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
                    strokeWidth={2}
                    fill={`url(#mcgrad-${s.key})`}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: s.color,
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                ))}
              </AreaChart>
            ) : viewMode === "bar" ? (
              <BarChart
                data={data}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
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
                    fontSize: 11,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                  tickFormatter={(v) => formatValue(v)}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
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
                    radius={[4, 4, 0, 0]}
                    barSize={activeSeries.length > 3 ? 12 : 20}
                  />
                ))}
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={height * 0.2}
                  outerRadius={height * 0.35}
                  dataKey="value"
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                  animationBegin={0}
                  animationDuration={600}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [formatValue(value)]}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
