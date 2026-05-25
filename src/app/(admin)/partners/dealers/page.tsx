"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Panel, StatusDot } from "@/components/workspace";
import { Plus } from "lucide-react";

const DEALERS = [
  { name: "True Motion Cycles", region: "Los Angeles, CA", tier: "Platinum", status: "active" as const },
  { name: "Empire Electric", region: "New York, NY", tier: "Gold", status: "active" as const },
  { name: "Pacific Electric", region: "Portland, OR", tier: "Gold", status: "active" as const },
  { name: "Thunder Road EV", region: "Austin, TX", tier: "Onboarding", status: "pending" as const },
];

export default function PartnerDealersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              Partner
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Dealer Directory
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Dealers
          </h1>
        </div>
        <Button size="sm" className="h-8 rounded text-xs font-medium gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Dealer
        </Button>
      </div>

      <Panel flush>
        <div className="divide-y divide-border">
          {DEALERS.map((dealer) => (
            <div key={dealer.name} className="px-4 py-3.5 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{dealer.name}</p>
                <p className="text-xs text-muted-foreground">{dealer.region}</p>
              </div>
              <Badge variant="outline" className="text-[10px]">{dealer.tier}</Badge>
              <StatusDot status={dealer.status} />
              <Button variant="ghost" size="sm" className="h-7 text-xs">Manage</Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
