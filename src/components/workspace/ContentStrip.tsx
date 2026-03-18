"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const GRADIENTS: Record<string, string> = {
  carbon: "from-zinc-900 via-zinc-800 to-zinc-900",
  steel: "from-slate-800 via-slate-700 to-slate-800",
  obsidian: "from-neutral-900 via-stone-800 to-neutral-900",
  midnight: "from-slate-900 via-blue-950/40 to-slate-900",
  ember: "from-zinc-900 via-amber-950/30 to-zinc-900",
  forest: "from-zinc-900 via-emerald-950/30 to-zinc-900",
  violet: "from-zinc-900 via-violet-950/30 to-zinc-900",
  rose: "from-zinc-900 via-rose-950/30 to-zinc-900",
};

export interface ContentStripItem {
  title: string;
  subtitle?: string;
  tag?: string;
  gradient?: keyof typeof GRADIENTS;
}

interface ContentStripProps {
  label: string;
  actionLabel?: string;
  items: ContentStripItem[];
  aspect?: "square" | "landscape";
}

export function ContentStrip({
  label,
  actionLabel = "View All",
  items,
  aspect = "landscape",
}: ContentStripProps) {
  const aspectClass =
    aspect === "square" ? "aspect-square w-40" : "aspect-[3/2] w-52";

  return (
    <div className="eng-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <button className="flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
          {actionLabel}
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-thin p-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="shrink-0 group cursor-pointer"
          >
            <div
              className={cn(
                "rounded-lg overflow-hidden relative bg-gradient-to-br",
                GRADIENTS[item.gradient ?? "carbon"],
                aspectClass
              )}
            >
              {item.tag && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center rounded bg-white/10 backdrop-blur-sm px-1.5 py-0.5 text-[8px] font-mono font-medium tracking-wider text-white/60 uppercase">
                    {item.tag}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-white/[0.03] transition-colors duration-300" />
            </div>
            <p className="text-[11px] font-medium text-foreground mt-1.5 truncate max-w-[160px]">
              {item.title}
            </p>
            {item.subtitle && (
              <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[160px]">
                {item.subtitle}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
