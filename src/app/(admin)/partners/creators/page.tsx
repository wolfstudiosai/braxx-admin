"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Panel, StatusDot } from "@/components/workspace";
import { Plus } from "lucide-react";

const CREATORS = [
  { name: "Jake Morrison", handle: "@jakerides", focus: "Product Reviews", status: "active" as const },
  { name: "Rina Cole", handle: "@rinaroutes", focus: "Lifestyle Content", status: "active" as const },
  { name: "Luca Adams", handle: "@evluca", focus: "Dealer Spotlights", status: "pending" as const },
];

export default function PartnerCreatorsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              Partner
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Creator Network
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Creators
          </h1>
        </div>
        <Button size="sm" className="h-8 rounded text-xs font-medium gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Creator
        </Button>
      </div>

      <Panel flush>
        <div className="divide-y divide-border">
          {CREATORS.map((creator) => (
            <div key={creator.handle} className="px-4 py-3.5 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{creator.name}</p>
                <p className="text-xs text-muted-foreground">{creator.handle}</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">{creator.focus}</Badge>
              <StatusDot status={creator.status} />
              <Button variant="ghost" size="sm" className="h-7 text-xs">Manage</Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
