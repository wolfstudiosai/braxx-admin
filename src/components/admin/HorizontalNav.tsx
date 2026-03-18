"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Share2,
  Megaphone,
  Handshake,
  Wrench,
  Receipt,
  Warehouse,
  Layers,
  Inbox,
  Activity,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Performance", href: "/performance", icon: BarChart3 },
  { label: "Inbox", href: "/inbox", icon: Inbox },
  { label: "Social", href: "/social", icon: Share2 },
  { label: "Campaign", href: "/campaign", icon: Megaphone },
  { label: "Partners", href: "/partners", icon: Handshake },
  { label: "Operations", href: "/operations", icon: Wrench },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Inventory", href: "/inventory", icon: Warehouse },
  { label: "Content", href: "/content", icon: Layers },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function HorizontalNav() {
  const pathname = usePathname();

  return (
    <nav className="h-[var(--nav-height)] flex items-end px-5 border-b border-border bg-card overflow-x-auto scrollbar-thin">
      <div className="flex items-end gap-0 min-w-max">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 pb-2 pt-2 text-[11px] font-mono uppercase tracking-wider transition-colors border-b -mb-[1px]",
                isActive
                  ? "border-foreground text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3 w-3 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
              {item.label === "Inbox" && (
                <span className="flex h-3.5 min-w-3.5 items-center justify-center rounded bg-foreground text-background text-[8px] font-mono font-bold px-0.5">
                  5
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
