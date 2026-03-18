"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Users,
  Shield,
  Key,
  Bell,
  HardDrive,
  Globe,
  SlidersHorizontal,
  UserPlus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspaceHeader, Panel } from "@/components/workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime, getInitials } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusDot } from "@/components/workspace";

const settingsNav = [
  { label: "General", href: "/settings", icon: Settings },
  { label: "Users", href: "/settings/users", icon: Users },
  { label: "Roles", href: "/settings/roles", icon: Shield },
  { label: "Permissions", href: "/settings/permissions", icon: Key },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Storage", href: "/settings/storage", icon: HardDrive },
  { label: "Site Controls", href: "/settings/site-controls", icon: Globe },
  { label: "Preferences", href: "/settings/preferences", icon: SlidersHorizontal },
];

const users = [
  { id: "1", fullName: "Marcus Chen", email: "marcus@braxxusa.com", role: "Founder Admin", isActive: true, lastLogin: "2026-03-17T14:30:00" },
  { id: "2", fullName: "Sarah Kim", email: "sarah@braxxusa.com", role: "Sales Manager", isActive: true, lastLogin: "2026-03-17T12:15:00" },
  { id: "3", fullName: "Alex Torres", email: "alex@braxxusa.com", role: "Operations Manager", isActive: true, lastLogin: "2026-03-17T10:00:00" },
  { id: "4", fullName: "Jamie Foster", email: "jamie@braxxusa.com", role: "Content Manager", isActive: true, lastLogin: "2026-03-16T09:00:00" },
  { id: "5", fullName: "Drew Patel", email: "drew@braxxusa.com", role: "Dealer Manager", isActive: true, lastLogin: "2026-03-15T16:30:00" },
  { id: "6", fullName: "Robin Nakamura", email: "robin@braxxusa.com", role: "Analyst Read Only", isActive: false, lastLogin: "2026-02-20T14:00:00" },
];

const roleBadgeVariant = (role: string) => {
  if (role.includes("Founder") || role.includes("Super")) return "purple" as const;
  if (role.includes("Manager")) return "info" as const;
  return "secondary" as const;
};

export default function SettingsUsersPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <WorkspaceHeader title="Settings" subtitle="System configuration & preferences" />

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <nav className="space-y-0.5">
            {settingsNav.map((item) => {
              const active = item.href === "/settings/users";
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-primary/8 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}>
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Team Members</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{users.length} users in the system</p>
            </div>
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Invite User
            </Button>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>

          <Panel flush>
            <div className="divide-y divide-border">
              {filtered.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/30 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/8 text-primary text-[11px] font-medium">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{user.fullName}</p>
                      {!user.isActive && <StatusDot status="inactive" label="Inactive" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant={roleBadgeVariant(user.role)} className="text-[11px]">{user.role}</Badge>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-muted-foreground">Last login</p>
                    <p className="text-xs">{formatDateTime(user.lastLogin)}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input placeholder="Enter name" className="h-9 text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" placeholder="name@braxxusa.com" className="h-9 text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Role</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="founder">Founder Admin</SelectItem>
                  <SelectItem value="ops">Operations Manager</SelectItem>
                  <SelectItem value="sales">Sales Manager</SelectItem>
                  <SelectItem value="dealer">Dealer Manager</SelectItem>
                  <SelectItem value="content">Content Manager</SelectItem>
                  <SelectItem value="analyst">Analyst Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setInviteOpen(false)}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
