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

interface MediaBannerProps {
  title: string;
  subtitle?: string;
  tag?: string;
  gradient?: keyof typeof GRADIENTS;
  aspect?: "cinematic" | "wide" | "standard";
  align?: "bottom" | "center";
  children?: React.ReactNode;
}

export function MediaBanner({
  title,
  subtitle,
  tag,
  gradient = "carbon",
  aspect = "wide",
  align = "bottom",
  children,
}: MediaBannerProps) {
  const aspectClass =
    aspect === "cinematic"
      ? "aspect-[21/9]"
      : aspect === "wide"
        ? "aspect-[16/9]"
        : "aspect-[4/3]";

  return (
    <div className="eng-card overflow-hidden group">
      <div
        className={cn(
          "relative bg-gradient-to-br",
          GRADIENTS[gradient] ?? GRADIENTS.carbon,
          aspectClass
        )}
      >
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, currentColor 1px, currentColor 2px)",
          backgroundSize: "100% 4px",
        }} />

        <div
          className={cn(
            "absolute inset-0 flex p-5",
            align === "bottom" ? "items-end" : "items-center justify-center text-center"
          )}
        >
          <div>
            {tag && (
              <span className="inline-flex items-center rounded bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-white/70 uppercase mb-2">
                {tag}
              </span>
            )}
            <h3 className="text-base font-medium text-white leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] font-mono text-white/50 mt-1 tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {children}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-white/[0.02] transition-colors duration-300" />
      </div>
    </div>
  );
}
