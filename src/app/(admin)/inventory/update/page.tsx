"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Panel } from "@/components/workspace";

const RECENT_UPDATES = [
  { item: "BRAXX GT Pro - Matte Black", change: "-1", reason: "Damage", by: "Alex Torres" },
  { item: "BRAXX GT - Stealth Black", change: "+10", reason: "PO-2026-020 Received", by: "System" },
  { item: "Battery Pack - Standard", change: "-3", reason: "Dealer Transfer", by: "Sarah Kim" },
];

export default function InventoryUpdatePage() {
  const [qty, setQty] = useState("1");

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
            Inventory
          </span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Stock Update Screen
          </span>
        </div>
        <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
          Update Inventory
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <Panel title="New Inventory Adjustment">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label className="text-xs">Item</Label>
                <Select>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select inventory item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gt-black">BRAXX GT - Stealth Black</SelectItem>
                    <SelectItem value="gtpro-matte">BRAXX GT Pro - Matte Black</SelectItem>
                    <SelectItem value="battery">Battery Pack - Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Action</Label>
                <Select>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Increase or decrease" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Increase Stock</SelectItem>
                    <SelectItem value="remove">Decrease Stock</SelectItem>
                    <SelectItem value="set">Set Exact Quantity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Quantity</Label>
                <Input
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="h-9 text-sm tabular-nums"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Reference</Label>
                <Input placeholder="PO, order, ticket, or note" className="h-9 text-sm" />
              </div>
            </div>

            <div className="grid gap-1.5 mt-4">
              <Label className="text-xs">Reason</Label>
              <Textarea placeholder="Provide a quick reason for the inventory update." className="min-h-[90px] text-sm" />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm">Apply Update</Button>
            </div>
          </Panel>
        </div>

        <Panel title="Recent Updates">
          <div className="space-y-2.5">
            {RECENT_UPDATES.map((entry) => (
              <div key={entry.item + entry.by} className="rounded-lg border border-border bg-secondary/30 p-3">
                <p className="text-xs text-foreground">{entry.item}</p>
                <p className="text-[11px] font-mono mt-1 tabular-nums">{entry.change}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{entry.reason}</p>
                <p className="text-[10px] text-muted-foreground">By {entry.by}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
