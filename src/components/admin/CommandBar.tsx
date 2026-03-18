"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  Command,
  ArrowRight,
  BarChart3,
  Share2,
  Megaphone,
  Handshake,
  Wrench,
  Receipt,
  Warehouse,
  Layers,
  Activity,
  Settings,
  Inbox,
  FileText,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";

interface SearchResult {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: string;
}

const searchIndex: SearchResult[] = [
  { label: "Performance", description: "KPIs, revenue, business intelligence", href: "/performance", icon: BarChart3, category: "Modules" },
  { label: "Social", description: "Social operations & content", href: "/social", icon: Share2, category: "Modules" },
  { label: "Campaign", description: "Campaign planning & execution", href: "/campaign", icon: Megaphone, category: "Modules" },
  { label: "Partners", description: "Partner network & applications", href: "/partners", icon: Handshake, category: "Modules" },
  { label: "Operations", description: "Tasks, workflows, process control", href: "/operations", icon: Wrench, category: "Modules" },
  { label: "Expenses", description: "Expense tracking & approvals", href: "/expenses", icon: Receipt, category: "Modules" },
  { label: "Inventory", description: "Stock management & fulfillment", href: "/inventory", icon: Warehouse, category: "Modules" },
  { label: "Content", description: "Creative & media hub", href: "/content", icon: Layers, category: "Modules" },
  { label: "Inbox", description: "Messages, SMS, Slack, Gmail", href: "/inbox", icon: Inbox, category: "Modules" },
  { label: "App Activity", description: "System-wide activity stream", href: "/activity", icon: Activity, category: "Modules" },
  { label: "Settings", description: "System configuration", href: "/settings", icon: Settings, category: "Modules" },
  { label: "BRAXX GT Pro", description: "Product · $12,999 · Active", href: "/inventory", icon: Zap, category: "Products" },
  { label: "BRAXX GT", description: "Product · $8,499 · Active", href: "/inventory", icon: Zap, category: "Products" },
  { label: "True Motion Cycles", description: "Partner · Los Angeles, CA · Active", href: "/partners", icon: Handshake, category: "Partners" },
  { label: "Empire Electric", description: "Partner · New York, NY · Active", href: "/partners", icon: Handshake, category: "Partners" },
  { label: "Spring 2026 Launch", description: "Campaign · Active · $20K budget", href: "/campaign", icon: Megaphone, category: "Campaigns" },
  { label: "Jordan Lee", description: "Application · EV Moto Works · New", href: "/partners", icon: FileText, category: "Applications" },
  { label: "Marcus Chen", description: "User · Founder Admin", href: "/settings/users", icon: User, category: "Team" },
  { label: "Sarah Kim", description: "User · Sales Manager", href: "/settings/users", icon: User, category: "Team" },
];

export function CommandBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = query.trim()
    ? searchIndex.filter(
        (r) =>
          r.label.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <div className="h-[var(--command-bar-height)] flex items-center gap-3 px-5 border-b border-border bg-card">
        {/* Brand */}
        <Link href="/performance" className="flex items-center gap-2 shrink-0 mr-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
            <span className="text-[9px] font-mono font-bold text-background tracking-wider">BX</span>
          </div>
          <span className="text-xs font-mono font-medium tracking-wider text-foreground hidden sm:block uppercase">BRAXX</span>
        </Link>

        {/* Universal Search trigger */}
        <button
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="flex items-center gap-2 flex-1 max-w-xl mx-auto rounded border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:border-foreground/20 transition-colors"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left text-[11px] font-mono">Search modules, records, people...</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-secondary px-1.5 font-mono text-[10px] text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Notifications */}
          <button className="relative flex items-center justify-center rounded-lg h-8 w-8 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded bg-foreground text-[7px] font-mono font-bold text-background">3</span>
          </button>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-secondary transition-colors ml-1">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-secondary text-foreground text-[10px] font-mono font-medium">
                    {getInitials("Marcus Chen")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px] font-mono font-medium text-foreground hidden sm:block">Marcus</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">Marcus Chen</p>
                <p className="text-xs text-muted-foreground">Founder Admin</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Universal search overlay */}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-foreground/20 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === overlayRef.current) {
              setOpen(false);
              setQuery("");
            }
          }}
        >
          <div className="w-full max-w-lg rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search modules, products, partners, team..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {query.trim() && Object.keys(grouped).length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {!query.trim() && (
                <div className="px-4 py-3">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Quick Navigation</p>
                  <div className="space-y-0.5">
                    {searchIndex.filter(r => r.category === "Modules").map((r) => (
                      <button
                        key={r.href}
                        onClick={() => handleSelect(r.href)}
                        className="flex items-center gap-3 w-full rounded-lg px-2 py-2 text-sm hover:bg-secondary transition-colors text-left"
                      >
                        <r.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{r.label}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{r.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="px-4 py-2">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">{category}</p>
                  <div className="space-y-0.5">
                    {items.map((r) => (
                      <button
                        key={r.label + r.href}
                        onClick={() => handleSelect(r.href)}
                        className="flex items-center gap-3 w-full rounded-lg px-2 py-2 text-sm hover:bg-secondary transition-colors text-left group"
                      >
                        <r.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{r.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">{r.description}</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-secondary/30 text-[10px] text-muted-foreground">
              <span><kbd className="font-mono px-1 py-0.5 rounded border border-border bg-card mr-0.5">↑↓</kbd> Navigate</span>
              <span><kbd className="font-mono px-1 py-0.5 rounded border border-border bg-card mr-0.5">↵</kbd> Open</span>
              <span><kbd className="font-mono px-1 py-0.5 rounded border border-border bg-card mr-0.5">ESC</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
