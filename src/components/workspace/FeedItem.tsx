import { cn, getInitials, formatRelativeTime } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface FeedItemProps {
  actor: string;
  summary: string;
  timestamp: string;
  module?: string;
  moduleColor?: "default" | "secondary" | "success" | "warning" | "info" | "purple";
  className?: string;
}

export function FeedItem({
  actor,
  summary,
  timestamp,
  module,
  moduleColor = "secondary",
  className,
}: FeedItemProps) {
  return (
    <div className={cn("feed-item", className)}>
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarFallback className="bg-secondary text-[10px] font-medium text-muted-foreground">
          {getInitials(actor)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[13px] leading-snug">
          <span className="font-medium text-foreground">{actor}</span>
          <span className="text-muted-foreground"> {summary}</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">{formatRelativeTime(timestamp)}</span>
          {module && (
            <Badge variant={moduleColor} className="text-[10px] px-1.5 py-0">
              {module}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
