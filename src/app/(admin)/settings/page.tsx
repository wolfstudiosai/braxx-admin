"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const settingsNav = [
  { label: "General", href: "/settings", icon: Settings, description: "Company info and configuration" },
  { label: "Users", href: "/settings/users", icon: Users, description: "Team members and access" },
  { label: "Roles", href: "/settings/roles", icon: Shield, description: "Role definitions and assignments" },
  { label: "Permissions", href: "/settings/permissions", icon: Key, description: "Module access controls" },
  { label: "Notifications", href: "/settings/notifications", icon: Bell, description: "Alert preferences" },
  { label: "Storage", href: "/settings/storage", icon: HardDrive, description: "Media and file storage" },
  { label: "Site Controls", href: "/settings/site-controls", icon: Globe, description: "Public site settings" },
  { label: "Preferences", href: "/settings/preferences", icon: SlidersHorizontal, description: "System preferences" },
];

export default function SettingsPage() {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <WorkspaceHeader title="Settings" subtitle="System configuration & preferences" />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings nav */}
        <div className="lg:col-span-1">
          <nav className="space-y-0.5">
            {settingsNav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-primary/8 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* General settings content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="workspace-panel space-y-6">
            <div>
              <h3 className="text-sm font-semibold">Company Information</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Basic details about your organization</p>
            </div>
            <div className="grid gap-4 max-w-lg">
              <div className="grid gap-1.5">
                <Label className="text-xs text-muted-foreground">Company Name</Label>
                <Input defaultValue="BRAXX USA" className="h-9 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs text-muted-foreground">Support Email</Label>
                <Input defaultValue="support@braxxusa.com" className="h-9 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs text-muted-foreground">Public Site URL</Label>
                <Input defaultValue="https://braxxusa.com" className="h-9 text-sm" />
              </div>
            </div>
          </div>

          <div className="workspace-panel space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Notifications</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Configure alert preferences</p>
            </div>
            {[
              { label: "New application alerts", enabled: true },
              { label: "Low stock alerts", enabled: true },
              { label: "Order status updates", enabled: true },
              { label: "Campaign milestone notifications", enabled: true },
              { label: "Weekly summary report", enabled: false },
              { label: "Partner activity digest", enabled: false },
            ].map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between py-1">
                <span className="text-sm">{toggle.label}</span>
                <Switch defaultChecked={toggle.enabled} />
              </div>
            ))}
          </div>

          <div className="workspace-panel space-y-4">
            <div>
              <h3 className="text-sm font-semibold">System Information</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Platform details</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="content-rail">
                <span className="content-rail-label">Platform</span>
                <span className="content-rail-value">Project Silo v0.2.0</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Environment</span>
                <Badge variant="outline" className="text-[10px]">Development</Badge>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Database</span>
                <span className="content-rail-value">PostgreSQL (Neon)</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Hosting</span>
                <span className="content-rail-value">Vercel</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">Danger Zone</p>
              <p className="text-xs text-muted-foreground">Irreversible system actions</p>
            </div>
            <Button variant="destructive" size="sm" disabled>Reset System</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
