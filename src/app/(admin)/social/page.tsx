"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModuleChart } from "@/components/workspace";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Calendar } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const AUDIENCE_GROWTH = [
  { week: "W1", ig: 9800, tt: 5400, yt: 2200, x: 1050 },
  { week: "W2", ig: 10000, tt: 5700, yt: 2250, x: 1070 },
  { week: "W3", ig: 10200, tt: 5900, yt: 2300, x: 1090 },
  { week: "W4", ig: 10500, tt: 6200, yt: 2350, x: 1110 },
  { week: "W5", ig: 10800, tt: 6500, yt: 2400, x: 1140 },
  { week: "W6", ig: 11000, tt: 6800, yt: 2450, x: 1170 },
  { week: "W7", ig: 11200, tt: 7000, yt: 2520, x: 1200 },
  { week: "W8", ig: 11500, tt: 7200, yt: 2580, x: 1230 },
  { week: "W9", ig: 11700, tt: 7500, yt: 2640, x: 1260 },
  { week: "W10", ig: 11900, tt: 7700, yt: 2700, x: 1300 },
  { week: "W11", ig: 12100, tt: 7900, yt: 2750, x: 1350 },
  { week: "W12", ig: 12400, tt: 8200, yt: 2800, x: 1400 },
];

const SOCIAL_CHART_SERIES = [
  { key: "ig", label: "Instagram", color: "#ec4899" },
  { key: "tt", label: "TikTok", color: "#3f3f46" },
  { key: "yt", label: "YouTube", color: "#ef4444" },
  { key: "x", label: "X", color: "#64748b" },
];

const CONTENT_QUEUE = [
  {
    title: "GT Pro Desert Shoot",
    platform: "Instagram",
    date: "Mar 20",
    time: "10:00 AM",
    status: "scheduled" as const,
  },
  {
    title: "Factory Tour BTS",
    platform: "TikTok",
    date: "Mar 21",
    time: "2:00 PM",
    status: "draft" as const,
  },
  {
    title: "Rider Spotlight: Jake Morrison",
    platform: "YouTube",
    date: "Mar 22",
    time: "6:00 PM",
    status: "scheduled" as const,
  },
  {
    title: "Spring Launch Teaser",
    platform: "Instagram",
    date: "Mar 23",
    time: "11:00 AM",
    status: "draft" as const,
  },
  {
    title: "GT Sport Reveal",
    platform: "TikTok",
    date: "Mar 25",
    time: "9:00 AM",
    status: "draft" as const,
  },
];

const RECENT_POSTS = [
  {
    platform: "Instagram",
    caption: "The road doesn't end. It evolves. #BRAXXGT",
    likes: 2400,
    comments: 186,
    time: "2 days ago",
  },
  {
    platform: "TikTok",
    caption: "POV: Your daily commute just got an upgrade",
    likes: 890,
    comments: 124,
    time: "3 days ago",
  },
  {
    platform: "YouTube",
    caption: "BRAXX GT Pro: Full Review",
    likes: 340,
    comments: 58,
    time: "5 days ago",
  },
  {
    platform: "Instagram",
    caption: "Built different. Ride different.",
    likes: 1800,
    comments: 94,
    time: "1 week ago",
  },
];

const PLATFORM_BG: Record<string, string> = {
  Instagram: "bg-pink-500",
  TikTok: "bg-zinc-700",
  YouTube: "bg-red-500",
  "X (Twitter)": "bg-slate-500",
};

const FILTER_PLATFORMS = ["All", "Instagram", "TikTok", "YouTube"];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function SocialPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredQueue =
    activeFilter === "All"
      ? CONTENT_QUEUE
      : CONTENT_QUEUE.filter((item) => item.platform === activeFilter);

  return (
    <div className="space-y-4">
      {/* ── Hero Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              MULTI PLATFORM
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
              Content &amp; Engagement
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Social
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="text-xs font-medium rounded h-8 gap-1.5"
          >
            <Calendar className="h-3.5 w-3.5" />
            Schedule Post
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-medium rounded h-8"
          >
            Analytics
          </Button>
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Instagram</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">12.4K</span>
              <span className="text-[10px] text-emerald-600 font-medium">5.2%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">TikTok</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">8.2K</span>
              <span className="text-[10px] text-emerald-600 font-medium">7.8%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">YouTube</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">2.8K</span>
              <span className="text-[10px] text-emerald-600 font-medium">3.1%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">X (Twitter)</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">1.4K</span>
              <span className="text-[10px] text-emerald-600 font-medium">2.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Audience Growth Chart ── */}
      <div>
        <ModuleChart
          title="Audience Growth"
          subtitle="Total followers across all platforms — 12 weeks"
          data={AUDIENCE_GROWTH}
          xKey="week"
          series={SOCIAL_CHART_SERIES}
          formatValue={(v) => `${(v / 1000).toFixed(1)}K`}
        />
      </div>

      {/* ── Content Queue Section ── */}
      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        <div className="lg:w-[200px] xl:w-[220px] shrink-0 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              Content Queue
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Upcoming scheduled content across all platforms.
            </p>
          </div>
          <div className="flex flex-row lg:flex-col flex-wrap gap-1.5 mt-3">
            {FILTER_PLATFORMS.map((plat) => (
              <button
                key={plat}
                onClick={() => setActiveFilter(plat)}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-mono font-medium uppercase tracking-wider border transition-all",
                  activeFilter === plat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                )}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredQueue.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                "eng-card group cursor-pointer hover:shadow-md transition-all",
                "animate-in",
                i < 6 && `stagger-${i + 1}`
              )}
            >
              <div
                className={cn(
                  "px-4 py-2 border-b border-border flex items-center justify-between",
                  item.platform === "Instagram" && "bg-pink-500/10",
                  item.platform === "TikTok" && "bg-zinc-500/10",
                  item.platform === "YouTube" && "bg-red-500/10"
                )}
              >
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {item.platform}
                </span>
                {item.status === "scheduled" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[40px]">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {item.date} &middot; {item.time}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  {item.status === "scheduled" ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-blue-600 uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 pulse-live" />
                      Scheduled
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-amber-600 uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Draft
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Posts Strip ── */}
      <div className="eng-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
            Recent Posts
          </span>
          <button className="text-[10px] font-mono text-primary hover:underline flex items-center gap-1 uppercase tracking-wider">
            View All <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {RECENT_POSTS.map((post, i) => {
            const total = post.likes + post.comments;
            const likesPct = Math.round((post.likes / total) * 100);

            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg border border-border bg-secondary/20 p-3",
                  "animate-in",
                  i < 4 && `stagger-${i + 1}`
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      PLATFORM_BG[post.platform] ?? "bg-zinc-400"
                    )}
                  />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {post.platform}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {post.time}
                  </span>
                </div>
                <p className="text-[12px] font-medium text-foreground line-clamp-2 leading-snug mb-3">
                  {post.caption}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden flex">
                    <div
                      className={cn(
                        "h-full rounded-l-full",
                        PLATFORM_BG[post.platform] ?? "bg-zinc-400"
                      )}
                      style={{ width: `${likesPct}%` }}
                    />
                    <div className="h-full flex-1 bg-muted-foreground/20" />
                  </div>
                  <span className="text-[9px] tabular-nums text-muted-foreground whitespace-nowrap font-mono">
                    {post.likes.toLocaleString()} ♥ · {post.comments} 💬
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
