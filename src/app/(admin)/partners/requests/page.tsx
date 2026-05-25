"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/workspace";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const INCOMING_REQUESTS = [
  { id: "REQ-221", name: "Jordan Lee", business: "EV Moto Works", type: "Dealer", location: "Seattle, WA" },
  { id: "REQ-222", name: "Tyler Brooks", business: "Brooks Creative", type: "Creator", location: "Nashville, TN" },
  { id: "REQ-223", name: "Dani Chen", business: "Next Mile Garage", type: "Dealer", location: "Chicago, IL" },
];

export default function PartnerRequestsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              Partner
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Approval Center
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Incoming Requests
          </h1>
        </div>
        <Button size="sm" className="h-8 rounded text-xs font-medium gap-1.5" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add New Partner
        </Button>
      </div>

      <Panel flush>
        <div className="divide-y divide-border">
          {INCOMING_REQUESTS.map((request) => (
            <div key={request.id} className="px-4 py-3.5 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{request.name}</p>
                  <Badge variant="outline" className="text-[10px]">{request.id}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{request.business} · {request.location}</p>
              </div>
              <Badge variant={request.type === "Dealer" ? "info" : "purple"} className="text-[10px]">
                {request.type}
              </Badge>
              <Button variant="outline" size="sm" className="h-7 text-xs">Reject</Button>
              <Button size="sm" className="h-7 text-xs">Approve</Button>
            </div>
          ))}
        </div>
      </Panel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New BRAXX Partner</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="grid gap-1.5">
              <Label className="text-xs">Contact Name</Label>
              <Input placeholder="Enter contact name" className="h-9 text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Business / Creator Name</Label>
              <Input placeholder="Enter partner business" className="h-9 text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Email</Label>
              <Input placeholder="name@business.com" className="h-9 text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setOpen(false)}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
