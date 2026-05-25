"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Panel } from "@/components/workspace";

export default function NewCampaignPage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
            Build
          </span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Campaign Builder
          </span>
        </div>
        <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
          Add Campaign
        </h1>
      </div>

      <Panel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label className="text-xs">Campaign Name</Label>
            <Input placeholder="Spring Dealer Push" className="h-9 text-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Type</Label>
            <Select>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="launch">Product Launch</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Budget</Label>
            <Input placeholder="$12,000" className="h-9 text-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Owner</Label>
            <Input placeholder="Marcus Chen" className="h-9 text-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Start Date</Label>
            <Input type="date" className="h-9 text-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">End Date</Label>
            <Input type="date" className="h-9 text-sm" />
          </div>
        </div>

        <div className="grid gap-1.5 mt-4">
          <Label className="text-xs">Objective / Brief</Label>
          <Textarea
            placeholder="Outline goals, target channels, required assets and partner involvement."
            className="min-h-[120px] text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Create Campaign</Button>
        </div>
      </Panel>
    </div>
  );
}
