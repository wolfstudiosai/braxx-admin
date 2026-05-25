"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Panel, StatusDot, ModuleChart } from "@/components/workspace";
import { getInitials, formatDateTime } from "@/lib/utils";
import { Search, UserPlus, ShieldCheck } from "lucide-react";

const TEAM = [
  { id: "u1", name: "Marcus Chen", email: "marcus@braxxusa.com", role: "Founder Admin", status: "active" as const, login: "2026-03-17T14:30:00" },
  { id: "u2", name: "Sarah Kim", email: "sarah@braxxusa.com", role: "Sales Manager", status: "active" as const, login: "2026-03-17T12:15:00" },
  { id: "u3", name: "Alex Torres", email: "alex@braxxusa.com", role: "Operations Manager", status: "active" as const, login: "2026-03-17T10:00:00" },
  { id: "u4", name: "Jamie Foster", email: "jamie@braxxusa.com", role: "Content Manager", status: "active" as const, login: "2026-03-16T09:00:00" },
  { id: "u5", name: "Robin Nakamura", email: "robin@braxxusa.com", role: "Analyst Read Only", status: "inactive" as const, login: "2026-02-20T14:00:00" },
];

const ACCESS_REQUESTS = [
  { name: "Taylor Brooks", email: "taylor@dealerhub.co", requestedRole: "Dealer Manager", source: "Partner Request" },
  { name: "Naomi Rivera", email: "naomi@creatorstudio.io", requestedRole: "Content Manager", source: "Creator Request" },
];

const USER_CHART_DATA = [
  { period: "Oct", active: 8, invites: 3, approvals: 2 },
  { period: "Nov", active: 9, invites: 2, approvals: 3 },
  { period: "Dec", active: 10, invites: 4, approvals: 4 },
  { period: "Jan", active: 10, invites: 1, approvals: 1 },
  { period: "Feb", active: 11, invites: 3, approvals: 2 },
  { period: "Mar", active: 12, invites: 4, approvals: 4 },
];

const USER_CHART_SERIES = [
  { key: "active", label: "Active Users", color: "#2563eb" },
  { key: "invites", label: "Invites", color: "#7c3aed" },
  { key: "approvals", label: "Approvals", color: "#10b981" },
];

export default function UsersPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      TEAM.filter(
        (user) =>
          !query ||
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.role.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              Access
            </span>
            <span className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
              User Management
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Users
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 rounded text-xs font-medium gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Permissions
          </Button>
          <Button size="sm" className="h-8 rounded text-xs font-medium gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="rounded-lg border border-border bg-card px-3 py-2.5">
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Total</span>
          <span className="text-sm font-mono font-semibold tabular-nums text-foreground">12</span>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2.5">
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Active</span>
          <span className="text-sm font-mono font-semibold tabular-nums text-emerald-600">11</span>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2.5">
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Pending Access</span>
          <span className="text-sm font-mono font-semibold tabular-nums text-amber-500">{ACCESS_REQUESTS.length}</span>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2.5">
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">2FA Enabled</span>
          <span className="text-sm font-mono font-semibold tabular-nums text-primary">100%</span>
        </div>
      </div>

      <ModuleChart
        title="User Access Overview"
        subtitle="Active users, invites and approvals"
        data={USER_CHART_DATA}
        xKey="period"
        series={USER_CHART_SERIES}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <Panel flush>
            <div className="p-4 border-b border-border">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, role or email"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <div className="divide-y divide-border">
              {filtered.map((user) => (
                <div key={user.id} className="px-4 py-3.5 flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-[10px] font-mono text-muted-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {user.role}
                  </Badge>
                  <StatusDot status={user.status === "active" ? "active" : "inactive"} />
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {formatDateTime(user.login)}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Incoming Access Requests">
          <div className="space-y-3">
            {ACCESS_REQUESTS.map((req) => (
              <div key={req.email} className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1.5">
                <p className="text-sm font-medium text-foreground">{req.name}</p>
                <p className="text-xs text-muted-foreground">{req.email}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">{req.requestedRole}</Badge>
                  <span className="text-[10px] text-muted-foreground">{req.source}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" className="h-7 text-xs">Approve</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
