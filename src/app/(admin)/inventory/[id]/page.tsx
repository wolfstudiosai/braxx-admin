"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Lock,
  ShoppingCart,
  Truck,
  SlidersHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

// ─── Static Data (BRAXX GT Pro - Matte Black, id: 6) ───────────────────────

const movements = [
  {
    type: "sell",
    quantity: -2,
    reference: "ORD-2026-042",
    performedBy: "Sarah Kim",
    date: "2026-03-15",
  },
  {
    type: "reserve",
    quantity: -1,
    reference: "ORD-2026-039",
    performedBy: "System",
    date: "2026-03-12",
  },
  {
    type: "receive",
    quantity: 4,
    reference: "PO-2026-018",
    performedBy: "Alex Torres",
    date: "2026-03-01",
  },
  {
    type: "adjust",
    quantity: -1,
    reference: "Damage - shipping",
    performedBy: "Alex Torres",
    date: "2026-02-25",
  },
  {
    type: "sell",
    quantity: -3,
    reference: "ORD-2026-031",
    performedBy: "Sarah Kim",
    date: "2026-02-20",
  },
  {
    type: "receive",
    quantity: 6,
    reference: "PO-2026-012",
    performedBy: "Alex Torres",
    date: "2026-02-10",
  },
];

const STOCK = {
  available: 3,
  reserved: 1,
  sold: 6,
  incoming: 0,
  threshold: 10,
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function InventoryDetailPage() {
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustQuantity, setAdjustQuantity] = useState("");
  const [adjustMovementType, setAdjustMovementType] = useState("receive");

  const getMovementBadgeVariant = (type: string) => {
    switch (type) {
      case "receive":
        return "success";
      case "sell":
      case "reserve":
        return "destructive";
      case "adjust":
      case "release":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/inventory">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                BRAXX GT Pro · Matte Black
              </h1>
              <Badge variant="destructive">Critical</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Main Warehouse
            </p>
          </div>
        </div>
      </div>

      {/* Current Stock Card */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Current Stock</CardTitle>
          <p className="text-xs text-muted-foreground">
            Live inventory levels for this SKU
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-xl font-bold">{STOCK.available}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reserved</p>
                <p className="text-xl font-bold">{STOCK.reserved}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-500/10 text-slate-400">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sold</p>
                <p className="text-xl font-bold">{STOCK.sold}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Incoming</p>
                <p className="text-xl font-bold">{STOCK.incoming}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Threshold</p>
                <p className="text-xl font-bold">{STOCK.threshold}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50"
              onClick={() => setAdjustOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Adjust Stock
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Movement History */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Movement History</CardTitle>
          <p className="text-xs text-muted-foreground">
            Recent stock movements for this SKU
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Qty
                </TableHead>
                <TableHead className="text-muted-foreground">Reference</TableHead>
                <TableHead className="text-muted-foreground">
                  Performed By
                </TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((m, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell>
                    <Badge
                      variant={getMovementBadgeVariant(m.type)}
                      className="capitalize"
                    >
                      {m.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      m.quantity > 0 ? "text-emerald-500" : "text-destructive"
                    )}
                  >
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.reference}
                  </TableCell>
                  <TableCell>{m.performedBy}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatDate(m.date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notes</CardTitle>
          <p className="text-xs text-muted-foreground">
            Internal notes for this inventory item
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about stock levels, reorder plans, or special handling..."
            className="min-h-[100px] border-border bg-background resize-none"
            readOnly
          />
        </CardContent>
      </Card>

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="border-border bg-background">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <p className="text-sm text-muted-foreground">
              BRAXX GT Pro · Matte Black · Main Warehouse
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Movement Type</label>
              <Select
                value={adjustMovementType}
                onValueChange={setAdjustMovementType}
              >
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receive">Receive</SelectItem>
                  <SelectItem value="reserve">Reserve</SelectItem>
                  <SelectItem value="release">Release</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="adjust">Adjust</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={adjustQuantity}
                onChange={(e) => setAdjustQuantity(e.target.value)}
                className="border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>
              Cancel
            </Button>
            <Button
              className="border-amber-500/30 hover:bg-amber-500/10"
              onClick={() => {
                setAdjustQuantity("");
                setAdjustOpen(false);
              }}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
