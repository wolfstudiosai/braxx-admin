"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search,
  Image,
  Play,
  FileText,
  ChevronRight,
  Pin,
  Eye,
  Download,
  MoreHorizontal,
  Plus,
  Layers,
  Upload,
} from "lucide-react";
import { ModuleChart } from "@/components/workspace";

// ─── Collections ───────────────────────────────────────────────────────────

const COLLECTIONS = [
  { name: "Spring 2026 Launch", count: 24, tag: "Product Launch", color: "bg-violet-500" },
  { name: "Brand Guidelines", count: 12, tag: "Brand", color: "bg-blue-500" },
  { name: "Product Photography", count: 38, tag: "Product", color: "bg-emerald-500" },
  { name: "Social Templates", count: 16, tag: "Social", color: "bg-pink-500" },
  { name: "Dealer Kits", count: 8, tag: "Partners", color: "bg-amber-500" },
  { name: "Rider Stories", count: 14, tag: "Content Series", color: "bg-sky-500" },
  { name: "GT Sport Development", count: 6, tag: "Product", color: "bg-emerald-500" },
  { name: "Trade Show Materials", count: 10, tag: "Events", color: "bg-orange-500" },
];

// ─── Recent Assets ──────────────────────────────────────────────────────────

type AssetType = "image" | "video" | "document";

const ASSETS = [
  { title: "GT Pro Hero Shot", type: "image" as AssetType, size: "4.2 MB", date: "Mar 17", uploader: "Marcus Chen" },
  { title: "Spring Launch Video", type: "video" as AssetType, size: "248 MB", date: "Mar 16", uploader: "Jamie Foster" },
  { title: "Dealer Onboarding Guide", type: "document" as AssetType, size: "2.1 MB", date: "Mar 15", uploader: "Drew Patel" },
  { title: "GT Pro Desert B-Roll", type: "video" as AssetType, size: "180 MB", date: "Mar 14", uploader: "Jamie Foster" },
  { title: "Brand Logo Package", type: "image" as AssetType, size: "12 MB", date: "Mar 12", uploader: "Marcus Chen" },
  { title: "GT Sport Concept Renders", type: "image" as AssetType, size: "18 MB", date: "Mar 11", uploader: "Marcus Chen" },
  { title: "Social Media Templates Pack", type: "image" as AssetType, size: "8.4 MB", date: "Mar 10", uploader: "Jamie Foster" },
  { title: "Rider Spotlight: Jake Morrison", type: "video" as AssetType, size: "320 MB", date: "Mar 9", uploader: "Jamie Foster" },
  { title: "Warranty Policy Document", type: "document" as AssetType, size: "540 KB", date: "Mar 8", uploader: "Alex Torres" },
  { title: "GT Performance Data Sheet", type: "document" as AssetType, size: "1.2 MB", date: "Mar 7", uploader: "Alex Torres" },
  { title: "Factory Tour Footage", type: "video" as AssetType, size: "1.2 GB", date: "Mar 5", uploader: "Jamie Foster" },
  { title: "Product Comparison Chart", type: "image" as AssetType, size: "2.8 MB", date: "Mar 3", uploader: "Marcus Chen" },
];

// ─── Pinned Assets ─────────────────────────────────────────────────────────

const PINNED = [
  { title: "Brand Guidelines v3.2", type: "document" as AssetType, pinnedBy: "Marcus Chen" },
  { title: "GT Pro Hero Shot", type: "image" as AssetType, pinnedBy: "Jamie Foster" },
  { title: "Dealer Kit Template", type: "document" as AssetType, pinnedBy: "Drew Patel" },
];

// ─── Type config ───────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  AssetType,
  {
    icon: typeof Image;
    bg: string;
    gradient: string;
    badge: "info" | "purple" | "warning";
    strip: string;
    color: string;
  }
> = {
  image: {
    icon: Image,
    bg: "bg-violet-50",
    gradient: "from-violet-100 to-violet-50",
    badge: "purple",
    strip: "bg-violet-500",
    color: "#8b5cf6",
  },
  video: {
    icon: Play,
    bg: "bg-blue-50",
    gradient: "from-blue-100 to-blue-50",
    badge: "info",
    strip: "bg-blue-500",
    color: "#3b82f6",
  },
  document: {
    icon: FileText,
    bg: "bg-amber-50",
    gradient: "from-amber-100 to-amber-50",
    badge: "warning",
    strip: "bg-amber-500",
    color: "#f59e0b",
  },
};

const FILTER_CHIPS = ["All Types", "Images", "Videos", "Documents", "Brand"];

const TYPE_DISTRIBUTION = [
  { name: "Images", value: 68, color: "#8b5cf6" },
  { name: "Videos", value: 42, color: "#3b82f6" },
  { name: "Documents", value: 46, color: "#f59e0b" },
];

const CONTENT_CHART_DATA = [
  { month: "Oct", images: 8, videos: 3, documents: 5 },
  { month: "Nov", images: 12, videos: 5, documents: 4 },
  { month: "Dec", images: 10, videos: 8, documents: 6 },
  { month: "Jan", images: 14, videos: 6, documents: 8 },
  { month: "Feb", images: 11, videos: 10, documents: 7 },
  { month: "Mar", images: 13, videos: 10, documents: 16 },
];

const CONTENT_CHART_SERIES = [
  { key: "images", label: "Images", color: "#8b5cf6" },
  { key: "videos", label: "Videos", color: "#3b82f6" },
  { key: "documents", label: "Documents", color: "#f59e0b" },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function ContentPage() {
  return (
    <div className="space-y-4">
      {/* ── Hero Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              CREATIVE
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
              Asset Management
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Content
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs font-medium rounded h-8 gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
          <Button size="sm" className="text-xs font-medium rounded h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Collection
          </Button>
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Total Assets</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-primary">156</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Published</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-emerald-600">89</span>
              <span className="text-[10px] text-emerald-600 font-medium">57%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Collections</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">8</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Storage</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">2.4 GB</span>
              <span className="text-[10px] text-muted-foreground">of 10 GB</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Featured</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">{"Spring '26"}</span>
          </div>
        </div>
      </div>

      <ModuleChart
        title="Content Overview"
        subtitle="Asset uploads by type per month"
        data={CONTENT_CHART_DATA}
        xKey="month"
        series={CONTENT_CHART_SERIES}
      />

      {/* ── Search + Pinned Section ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-9 border-border bg-background rounded-full"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_CHIPS.map((chip, i) => (
              <button
                key={chip}
                className={cn(
                  "rounded px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors",
                  i === 0
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                )}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Assets */}
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin -mx-1 px-1 rounded-lg py-3 border border-border">
          {PINNED.map((asset) => {
            const config = TYPE_CONFIG[asset.type];
            const Icon = config.icon;
            return (
              <div
                key={asset.title}
                className="eng-card p-3 min-w-[200px] shrink-0 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all"
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                    config.bg
                  )}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">
                    {asset.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Pin className="h-2.5 w-2.5" />
                    {asset.pinnedBy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Collections Section ── */}
      <div className="flex flex-col lg:flex-row gap-4 rounded-lg border border-border p-4">
        <div className="lg:w-[200px] xl:w-[220px] shrink-0 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              Collections
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Organized groups.<br />
              Campaign-linked.<br />
              {COLLECTIONS.length} active sets.
            </p>
          </div>
        </div>

        <div className="flex-1 flex gap-3 overflow-x-auto pb-2 scrollbar-thin -mx-1 px-1">
          {COLLECTIONS.map((col, i) => {
            const maxCount = Math.max(...COLLECTIONS.map((c) => c.count));
            return (
              <div
                key={col.name}
                className={cn(
                  "eng-card p-4 min-w-[200px] shrink-0 cursor-pointer transition-all duration-300",
                  "hover:shadow-md hover:-translate-y-1",
                  "animate-in",
                  i < 6 && `stagger-${i + 1}`
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("h-2 w-2 rounded-full", col.color)} />
                  <p className="text-sm font-medium text-foreground truncate">
                    {col.name}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {col.count} assets
                </p>
                <div className="h-1 rounded-full bg-secondary overflow-hidden mb-3">
                  <div
                    className={cn("h-full rounded-full animate-fill", col.color)}
                    style={{ width: `${(col.count / maxCount) * 100}%` }}
                  />
                </div>
                <Badge
                  variant={
                    col.tag === "Product Launch" ? "purple" :
                    col.tag === "Brand" ? "info" :
                    col.tag === "Product" ? "success" :
                    col.tag === "Social" ? "warning" :
                    "secondary"
                  }
                  className="text-[10px]"
                >
                  {col.tag}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Asset Grid ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Recent Assets</span>
          <span className="text-xs text-muted-foreground">{ASSETS.length} items</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ASSETS.map((asset, i) => {
            const config = TYPE_CONFIG[asset.type];
            const Icon = config.icon;
            return (
              <div
                key={asset.title}
                className={cn(
                  "eng-card group cursor-pointer transition-all duration-300",
                  "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
                  "animate-in overflow-hidden relative",
                  i < 6 && `stagger-${i + 1}`
                )}
              >
                <div className={cn("h-1 w-full", config.strip)} />

                <div
                  className={cn(
                    "h-36 flex items-center justify-center relative",
                    "bg-gradient-to-br", config.gradient
                  )}
                >
                  <Icon className="h-10 w-10 text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors" />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button className="h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors">
                      <Eye className="h-3.5 w-3.5 text-foreground" />
                    </button>
                    <button className="h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors">
                      <Download className="h-3.5 w-3.5 text-foreground" />
                    </button>
                    <button className="h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors">
                      <MoreHorizontal className="h-3.5 w-3.5 text-foreground" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {asset.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={config.badge} className="text-[10px] capitalize">
                      {asset.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {asset.size}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {asset.date} &middot; {asset.uploader}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
