import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface WorkspaceHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  tabs?: ReactNode;
  className?: string;
}

export function WorkspaceHeader({
  title,
  subtitle,
  actions,
  tabs,
  className,
}: WorkspaceHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="module-title">{title}</h2>
          {subtitle && <p className="module-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      {tabs && <div>{tabs}</div>}
    </div>
  );
}
