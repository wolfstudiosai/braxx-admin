import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  compact?: boolean;
}

export function MetricCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-muted-foreground",
  className,
  compact = false,
}: MetricCardProps) {
  return (
    <div className={cn("metric-card", compact && "p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={cn("h-8 w-8 rounded-lg bg-secondary flex items-center justify-center", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className={cn("font-semibold text-foreground", compact ? "text-2xl" : "text-3xl leading-none")}>{value}</span>
        {change && (
          <span className={cn(
            "text-xs font-medium mb-1",
            changeType === "positive" && "text-emerald-600",
            changeType === "negative" && "text-red-600",
            changeType === "neutral" && "text-muted-foreground"
          )}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
