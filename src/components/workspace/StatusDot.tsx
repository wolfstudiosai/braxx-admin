import { cn } from "@/lib/utils";

interface StatusDotProps {
  status: "active" | "inactive" | "warning" | "critical" | "pending" | "success";
  label?: string;
  className?: string;
}

const dotColors = {
  active: "bg-emerald-500",
  success: "bg-emerald-500",
  inactive: "bg-zinc-300",
  warning: "bg-amber-500",
  critical: "bg-red-500",
  pending: "bg-blue-500",
};

export function StatusDot({ status, label, className }: StatusDotProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("h-1.5 w-1.5 rounded-full", dotColors[status])} />
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}
