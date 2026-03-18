"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspaceHeader } from "@/components/workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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

const roles = [
  { name: "Super Admin", description: "Full system access with all permissions", users: 0, color: "bg-red-500" },
  { name: "Founder Admin", description: "Founder-level access to all operations", users: 1, color: "bg-violet-500" },
  { name: "Operations Manager", description: "Manages inventory, orders, and day-to-day operations", users: 1, color: "bg-blue-500" },
  { name: "Sales Manager", description: "Manages leads, orders, and dealer relationships", users: 1, color: "bg-emerald-500" },
  { name: "Dealer Manager", description: "Manages dealer network and applications", users: 1, color: "bg-amber-500" },
  { name: "Content Manager", description: "Manages site content and media assets", users: 1, color: "bg-pink-500" },
  { name: "Analyst Read Only", description: "View-only access to dashboards and reports", users: 1, color: "bg-zinc-400" },
];

const modules = ["Performance", "Social", "Campaign", "Partners", "Operations", "Expenses", "Inventory", "Content", "Activity", "Settings"];
const actions = ["View", "Create", "Edit", "Delete"];

export default function SettingsRolesPage() {
  return (
    <div className="space-y-6">
      <WorkspaceHeader title="Settings" subtitle="System configuration & preferences" />

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <nav className="space-y-0.5">
            {settingsNav.map((item) => {
              const active = item.href === "/settings/roles";
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
              <h3 className="text-sm font-semibold">Roles</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{roles.length} roles configured</p>
            </div>
            <Button size="sm" variant="outline">Create Role</Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {roles.map((role) => (
              <div key={role.name} className="workspace-panel space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("h-2.5 w-2.5 rounded-full", role.color)} />
                    <div>
                      <p className="text-sm font-medium">{role.name}</p>
                      <p className="text-[11px] text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">{role.users} user{role.users !== 1 ? "s" : ""}</Badge>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Edit Permissions</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Permissions matrix preview */}
          <div className="workspace-panel space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-semibold">Permissions Matrix</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Founder Admin role permissions (read only)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Module</th>
                    {actions.map((a) => (
                      <th key={a} className="text-center py-2 px-3 font-medium text-muted-foreground">{a}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modules.map((mod) => (
                    <tr key={mod} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-4 font-medium">{mod}</td>
                      {actions.map((a) => (
                        <td key={a} className="text-center py-2.5 px-3">
                          <Checkbox defaultChecked disabled className="h-3.5 w-3.5" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
