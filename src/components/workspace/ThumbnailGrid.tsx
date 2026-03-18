"use client";

import { cn } from "@/lib/utils";

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

export interface ThumbnailItem {
  title: string;
  subtitle?: string;
  tag?: string;
  gradient?: keyof typeof GRADIENTS;
  metric?: string;
}

interface ThumbnailGridProps {
  items: ThumbnailItem[];
  cols?: 2 | 3 | 4;
  aspect?: "square" | "landscape" | "portrait";
  label?: string;
}

export function ThumbnailGrid({
  items,
  cols = 3,
  aspect = "landscape",
  label,
}: ThumbnailGridProps) {
  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "portrait"
        ? "aspect-[3/4]"
        : "aspect-[4/3]";

  const colClass =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-3";

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {items.length} items
          </span>
        </div>
      )}
      <div className={cn("grid grid-cols-1 gap-3", colClass)}>
        {items.map((item) => (
          <div
            key={item.title}
            className="eng-card overflow-hidden group cursor-pointer"
          >
            <div
              className={cn(
                "relative bg-gradient-to-br",
                GRADIENTS[item.gradient ?? "carbon"],
                aspectClass
              )}
            >
              {/* Cross-hair overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
                <div className="h-px w-8 bg-white absolute" />
                <div className="w-px h-8 bg-white absolute" />
              </div>

              {item.tag && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center rounded bg-white/10 backdrop-blur-sm px-1.5 py-0.5 text-[8px] font-mono font-medium tracking-wider text-white/60 uppercase">
                    {item.tag}
                  </span>
                </div>
              )}

              {item.metric && (
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-mono font-medium text-white/50 tabular-nums">
                    {item.metric}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-white/[0.03] transition-colors duration-300" />
            </div>
            <div className="px-3 py-2.5">
              <p className="text-xs font-medium text-foreground truncate">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
