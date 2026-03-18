"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Panel, StatusDot } from "@/components/workspace";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

const CONTENT_ITEMS = [
  {
    title: "GT Pro Hero Video",
    type: "Video",
    status: "success" as const,
    platforms: ["Instagram", "YouTube"],
  },
  {
    title: "Spring Lineup Announcement",
    type: "Post",
    status: "success" as const,
    platforms: ["All Platforms"],
  },
  {
    title: "GT Pro Feature Breakdown",
    type: "Carousel",
    status: "success" as const,
    platforms: ["Instagram"],
  },
  {
    title: "Desert Ride Footage",
    type: "Video",
    status: "pending" as const,
    platforms: ["TikTok", "YouTube"],
  },
  {
    title: "Dealer Launch Kit",
    type: "Document",
    status: "warning" as const,
    platforms: ["Internal"],
  },
];

const TIMELINE = [
  { date: "Feb 20", label: "Campaign created" },
  { date: "Mar 1", label: "Launch day — first content published" },
  { date: "Mar 10", label: "Dealer kit distributed" },
  { date: "Mar 17", label: "Mid-campaign review" },
  { date: "Apr 15", label: "Campaign end date (upcoming)" },
];

const LINKED_PARTNERS = [
  { name: "True Motion Cycles", status: "active" as const },
  { name: "Empire Electric", status: "active" as const },
  { name: "Pacific Electric", status: "active" as const },
];

const BUDGET_BREAKDOWN = [
  { label: "Content Production", amount: 8400 },
  { label: "Paid Media", amount: 4200 },
  { label: "Partner Incentives", amount: 1600 },
];

function getStatusDotStatus(
  status: "success" | "pending" | "warning"
): "success" | "pending" | "warning" {
  return status;
}

export default function CampaignDetailPage() {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/campaign"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Campaign
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="module-title">Spring 2026 Launch</h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="success">Active</Badge>
            <span className="chip chip-primary">Product Launch</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Edit Campaign
          </Button>
          <Button variant="outline" size="sm" className="text-muted-foreground">
            Archive
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - wider */}
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Overview">
            <p className="text-sm text-muted-foreground mb-6">
              Major product launch campaign for Spring 2026 lineup. Focus on
              GT Pro positioning and new GT Sport teaser content across all
              channels.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="content-rail">
                <span className="content-rail-label">Owner</span>
                <span className="content-rail-value">Marcus Chen</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Date Range</span>
                <span className="content-rail-value">Mar 1 - Apr 15, 2026</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Budget</span>
                <span className="content-rail-value">$20,000</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Spent</span>
                <span className="content-rail-value">$14,200</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Status</span>
                <span className="content-rail-value">Active</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Created</span>
                <span className="content-rail-value">Feb 20, 2026</span>
              </div>
            </div>
          </Panel>

          <Panel title="Linked Content">
            <div className="space-y-3">
              {CONTENT_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 py-3 border-b border-border last:border-0"
                >
                  <StatusDot status={getStatusDotStatus(item.status)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        {item.type}
                      </Badge>
                      {item.platforms.map((p) => (
                        <span
                          key={p}
                          className="text-xs text-muted-foreground"
                        >
                          {p}
                          {item.platforms.indexOf(p) < item.platforms.length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Timeline">
            <div className="space-y-4">
              {TIMELINE.map((item, i) => (
                <div key={item.date} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 min-h-[20px] bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-foreground">
                      {item.date}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <Panel title="Performance Snapshot">
            <div className="space-y-4">
              <div className="content-rail">
                <span className="content-rail-label">Total Reach</span>
                <span className="content-rail-value">86K</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Impressions</span>
                <span className="content-rail-value">210K</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Engagement</span>
                <span className="content-rail-value">12.4K</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Link Clicks</span>
                <span className="content-rail-value">1,840</span>
              </div>
              <div className="content-rail">
                <span className="content-rail-label">Conversion Rate</span>
                <span className="content-rail-value">2.8%</span>
              </div>
            </div>
          </Panel>

          <Panel title="Linked Partners">
            <div className="space-y-2">
              {LINKED_PARTNERS.map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm font-medium text-foreground">
                    {partner.name}
                  </span>
                  <StatusDot status="active" />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Budget Breakdown">
            <div className="space-y-2">
              {BUDGET_BREAKDOWN.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3 pt-4">
                <span className="text-sm font-medium text-foreground">
                  Total Spent
                </span>
                <span className="text-sm font-semibold text-foreground">
                  $14,200 / $20,000
                </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
