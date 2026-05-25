"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Panel, StatusDot } from "@/components/workspace";
import { Plus } from "lucide-react";

const BRIEFS = [
  { id: "B-104", title: "GT Pro Spring Social Launch", owner: "Jamie Foster", status: "active" as const, due: "Apr 12" },
  { id: "B-105", title: "Dealer Co-op Creative Kit", owner: "Marcus Chen", status: "pending" as const, due: "Apr 18" },
  { id: "B-106", title: "Creator Ride Story Batch 02", owner: "Sarah Kim", status: "success" as const, due: "Completed" },
];

export default function CampaignBriefsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              Creative
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Campaign Briefs
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Briefs
          </h1>
        </div>
        <Button size="sm" className="h-8 text-xs font-medium rounded gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Brief
        </Button>
      </div>

      <Panel flush>
        <div className="divide-y divide-border">
          {BRIEFS.map((brief) => (
            <div key={brief.id} className="px-4 py-3.5 flex items-center gap-3">
              <div className="min-w-[72px]">
                <Badge variant="outline" className="text-[10px]">{brief.id}</Badge>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{brief.title}</p>
                <p className="text-xs text-muted-foreground">Owner: {brief.owner}</p>
              </div>
              <StatusDot status={brief.status} />
              <span className="text-[11px] text-muted-foreground tabular-nums">{brief.due}</span>
              <Button variant="ghost" size="sm" className="h-7 text-xs">Open</Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
