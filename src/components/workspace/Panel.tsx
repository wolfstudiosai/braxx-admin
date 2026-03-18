import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface PanelProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  flush?: boolean;
  className?: string;
  contentClassName?: string;
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  flush = false,
  className,
  contentClassName,
}: PanelProps) {
  return (
    <div className={cn(flush ? "workspace-panel-flush" : "workspace-panel", className)}>
      {(title || actions) && (
        <div className={cn("flex items-center justify-between", flush && "px-5 pt-5", title && !flush && "pb-4")}>
          <div>
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(flush && "px-5 pb-5", contentClassName)}>{children}</div>
    </div>
  );
}
