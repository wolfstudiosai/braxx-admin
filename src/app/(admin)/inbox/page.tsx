"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Hash,
  Mail,
  Phone,
  Paperclip,
  Send,
  Star,
  Archive,
  MoreHorizontal,
  ChevronDown,
  CheckCheck,
  Circle,
  ExternalLink,
  Plus,
} from "lucide-react";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ContentStrip } from "@/components/workspace";

// ─── Types ──────────────────────────────────────────────────────────────────

type Channel = "all" | "sms" | "slack" | "gmail";

interface Message {
  id: string;
  channel: "sms" | "slack" | "gmail";
  from: string;
  fromEmail?: string;
  fromPhone?: string;
  slackChannel?: string;
  subject?: string;
  preview: string;
  body: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  thread?: ThreadMessage[];
}

interface ThreadMessage {
  id: string;
  from: string;
  body: string;
  timestamp: string;
  isOutgoing: boolean;
}

// ─── Static Data ────────────────────────────────────────────────────────────

const messages: Message[] = [
  {
    id: "1",
    channel: "gmail",
    from: "Jake Morrison",
    fromEmail: "jake@truemotion.com",
    subject: "Re: Q2 Inventory Allocation Request",
    preview: "Marcus, following up on our call about the GT Pro allocation for Q2. We're projecting strong demand and would like to secure...",
    body: "Marcus,\n\nFollowing up on our call about the GT Pro allocation for Q2. We're projecting strong demand here in LA and would like to secure at least 8 units of the GT Pro (Stealth Black and Arctic White split) plus 4 GT units.\n\nWe've also had multiple customers asking about the GT Sport — any update on the timeline?\n\nHappy to jump on another call this week.\n\nBest,\nJake Morrison\nTrue Motion Cycles",
    timestamp: "2026-03-17T15:30:00",
    read: false,
    starred: true,
    hasAttachment: false,
    thread: [
      { id: "1a", from: "Marcus Chen", body: "Jake — great to hear about the demand. Let me check with Alex on current allocation and get back to you by EOD tomorrow. GT Sport is still in final testing, targeting April launch.", timestamp: "2026-03-17T16:00:00", isOutgoing: true },
      { id: "1b", from: "Jake Morrison", body: "Sounds good. Also wanted to mention — we hosted a test ride event last weekend and had 40+ attendees. The GT Pro was the star. Would love to share photos for your social channels.", timestamp: "2026-03-17T16:45:00", isOutgoing: false },
    ],
  },
  {
    id: "2",
    channel: "slack",
    from: "Sarah Kim",
    slackChannel: "#sales-pipeline",
    subject: "New lead from EV Expo follow-up",
    preview: "Just got off a call with Amanda Foster from Urban Rides Inc — she's ready to move forward with a fleet order. 15 GT units...",
    body: "Just got off a call with Amanda Foster from Urban Rides Inc — she's ready to move forward with a fleet order. 15 GT units for their Portland delivery fleet. This would be our largest fleet deal yet. 🚀\n\nShe needs a proposal by Friday. @marcus can you review the fleet pricing doc I shared?",
    timestamp: "2026-03-17T14:20:00",
    read: false,
    starred: false,
    hasAttachment: false,
    thread: [
      { id: "2a", from: "Marcus Chen", body: "This is huge. I'll review the pricing tonight. Make sure we include the fleet maintenance package as part of the deal.", timestamp: "2026-03-17T14:35:00", isOutgoing: true },
      { id: "2b", from: "Sarah Kim", body: "Already on it. Also looping in @drew for the Portland logistics angle since Pacific Electric can handle local service.", timestamp: "2026-03-17T14:42:00", isOutgoing: false },
    ],
  },
  {
    id: "3",
    channel: "sms",
    from: "Alex Torres",
    fromPhone: "+1 (512) 555-0167",
    preview: "Heads up — PO-2026-022 shipment just cleared customs. 30 battery packs arriving at warehouse Thursday AM.",
    body: "Heads up — PO-2026-022 shipment just cleared customs. 30 battery packs arriving at warehouse Thursday AM. I'll be there for receiving. Also noticed we're down to 3 units on GT Pro Matte Black — should we flag this for Marcus?",
    timestamp: "2026-03-17T11:05:00",
    read: true,
    starred: false,
    hasAttachment: false,
    thread: [
      { id: "3a", from: "Marcus Chen", body: "Good news on the battery packs. Yes, flag the GT Pro Matte Black — we need to expedite the next PO for that colorway.", timestamp: "2026-03-17T11:20:00", isOutgoing: true },
    ],
  },
  {
    id: "4",
    channel: "gmail",
    from: "Emma Williams",
    fromEmail: "emma@chargepoint.com",
    subject: "Partnership Proposal — ChargePoint x BRAXX",
    preview: "Hi Marcus, great meeting you at EV Expo. As discussed, we'd love to explore a co-branding opportunity between ChargePoint and BRAXX...",
    body: "Hi Marcus,\n\nGreat meeting you at EV Expo last month. As discussed, we'd love to explore a co-branding opportunity between ChargePoint and BRAXX.\n\nSpecifically, we're interested in:\n1. Including BRAXX-branded charging adapters with every ChargePoint home unit\n2. Co-marketing to the urban mobility segment\n3. Cross-promoting at upcoming events\n\nI've attached our standard partnership framework. Would love to set up a call next week to discuss.\n\nBest,\nEmma Williams\nBusiness Development, ChargePoint",
    timestamp: "2026-03-17T09:15:00",
    read: false,
    starred: true,
    hasAttachment: true,
    thread: [],
  },
  {
    id: "5",
    channel: "slack",
    from: "Jamie Foster",
    slackChannel: "#content-team",
    subject: "GT Pro desert shoot — final selects ready",
    preview: "Final selects from the desert shoot are uploaded to the Content hub. 24 images, 3 video clips. @marcus let me know which ones...",
    body: "Final selects from the desert shoot are uploaded to the Content hub. 24 images, 3 video clips. @marcus let me know which ones you want for the Spring Launch campaign hero.\n\nAlso scheduled the Rider Spotlight with Jake Morrison for next Tuesday. Will need drone footage approval.",
    timestamp: "2026-03-16T17:30:00",
    read: true,
    starred: false,
    hasAttachment: true,
    thread: [
      { id: "5a", from: "Marcus Chen", body: "Nice work. I'll review the selects tonight. Let's use the wide-angle sunset shot as the hero — it's incredible. Drone footage approved ✅", timestamp: "2026-03-16T18:15:00", isOutgoing: true },
    ],
  },
  {
    id: "6",
    channel: "sms",
    from: "Drew Patel",
    fromPhone: "+1 (720) 555-0171",
    preview: "Peak Performance EV signed the dealer agreement! They're officially onboarded. First order of 3 GT Pros coming in next week.",
    body: "Peak Performance EV signed the dealer agreement! They're officially onboarded. First order of 3 GT Pros coming in next week. Denver market is GO 🎉",
    timestamp: "2026-03-16T14:20:00",
    read: true,
    starred: true,
    hasAttachment: false,
    thread: [
      { id: "6a", from: "Marcus Chen", body: "Let's go! Great work Drew. Make sure we send them the welcome kit and get them set up in the dealer portal.", timestamp: "2026-03-16T14:30:00", isOutgoing: true },
      { id: "6b", from: "Drew Patel", body: "Already on it. Kit ships tomorrow. Also Rachel (their owner) wants to host a launch event — I'll coordinate with Jamie on content support.", timestamp: "2026-03-16T14:45:00", isOutgoing: false },
    ],
  },
  {
    id: "7",
    channel: "gmail",
    from: "David Chen",
    fromEmail: "david.chen@techfleet.com",
    subject: "Fleet pricing inquiry — 50 units",
    preview: "Hi, following up on my application for a corporate fleet purchase. We're looking at 20-50 BRAXX GT units for our campus...",
    body: "Hi,\n\nFollowing up on my application for a corporate fleet purchase. We're looking at 20-50 BRAXX GT units for our San Jose campus mobility program.\n\nCan you send over fleet pricing and bulk order terms? We'd also need information on:\n- Service/maintenance plans\n- Charging infrastructure recommendations\n- Custom branding options\n\nTimeline: Looking to deploy by Q3 2026.\n\nThanks,\nDavid Chen\nHead of Operations, TechFleet Solutions",
    timestamp: "2026-03-15T10:30:00",
    read: true,
    starred: false,
    hasAttachment: false,
    thread: [],
  },
  {
    id: "8",
    channel: "slack",
    from: "Alex Torres",
    slackChannel: "#ops-alerts",
    subject: "Inventory discrepancy flagged",
    preview: "⚠️ Empire Electric reported 2 GT Pro units unaccounted for in their March audit. Investigating with James now. May be a...",
    body: "⚠️ Empire Electric reported 2 GT Pro units unaccounted for in their March audit. Investigating with James now. May be a shipping manifest error from the Feb delivery.\n\nI've pulled the tracking records and will update by EOD.",
    timestamp: "2026-03-15T08:45:00",
    read: true,
    starred: false,
    hasAttachment: false,
    thread: [
      { id: "8a", from: "Marcus Chen", body: "Keep me posted. If it's a manifest error, loop in the shipping team to prevent this from happening again.", timestamp: "2026-03-15T09:00:00", isOutgoing: true },
      { id: "8b", from: "Alex Torres", body: "Found it — units were logged under the wrong SKU in the shipment. Both units accounted for. Updating records now.", timestamp: "2026-03-15T16:30:00", isOutgoing: false },
    ],
  },
];

const channelConfig = {
  sms: { icon: Phone, label: "SMS", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-l-emerald-500", fill: "#10b981" },
  slack: { icon: Hash, label: "Slack", color: "text-violet-600", bg: "bg-violet-50", border: "border-l-violet-500", fill: "#8b5cf6" },
  gmail: { icon: Mail, label: "Gmail", color: "text-red-500", bg: "bg-red-50", border: "border-l-red-500", fill: "#ef4444" },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function InboxPage() {
  const [channelFilter, setChannelFilter] = useState<Channel>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>("1");

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchChannel = channelFilter === "all" || m.channel === channelFilter;
      const matchSearch =
        !search ||
        m.from.toLowerCase().includes(search.toLowerCase()) ||
        m.preview.toLowerCase().includes(search.toLowerCase()) ||
        (m.subject?.toLowerCase().includes(search.toLowerCase()) ?? false);
      return matchChannel && matchSearch;
    });
  }, [channelFilter, search]);

  const selected = messages.find((m) => m.id === selectedId);
  const unreadCount = messages.filter((m) => !m.read).length;

  const channelTabs: { value: Channel; label: string; count: number; icon: typeof Mail }[] = [
    { value: "all", label: "All", count: messages.length, icon: Mail },
    { value: "sms", label: "SMS", count: messages.filter((m) => m.channel === "sms").length, icon: Phone },
    { value: "slack", label: "Slack", count: messages.filter((m) => m.channel === "slack").length, icon: Hash },
    { value: "gmail", label: "Gmail", count: messages.filter((m) => m.channel === "gmail").length, icon: Mail },
  ];

  return (
    <div className="space-y-4">
      {/* ── Hero Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              UNIFIED
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
              All Channels
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Inbox
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs font-medium rounded h-8 gap-1.5">
            <Archive className="h-3.5 w-3.5" />
            Archive
          </Button>
          <Button size="sm" className="text-xs font-medium rounded h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Compose
          </Button>
        </div>
      </div>

      {/* ── Metric Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Unread</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-primary">{unreadCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Starred</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">{messages.filter(m => m.starred).length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Total</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-foreground">{messages.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Connected</span>
            <span className="text-sm font-mono font-semibold tabular-nums text-emerald-600">All channels</span>
          </div>
        </div>
      </div>

      {/* ── Channel Filter Pills ── */}
      <div className="flex flex-wrap gap-1.5">
        {channelTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setChannelFilter(tab.value)}
            className={cn(
              "px-3 py-1 rounded text-[10px] font-medium uppercase tracking-wider border transition-all flex items-center gap-1.5",
              channelFilter === tab.value
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
            )}
          >
            {tab.label}
            <span className="opacity-60 tabular-nums">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ── Key Contacts ── */}
      <ContentStrip
        label="Key Contacts"
        aspect="square"
        items={[
          { title: "Jake Morrison", subtitle: "True Motion Cycles", tag: "Partner", gradient: "violet" },
          { title: "Emma Williams", subtitle: "ChargePoint", tag: "Prospect", gradient: "midnight" },
          { title: "Sarah Kim", subtitle: "Sales Manager", tag: "Internal", gradient: "carbon" },
          { title: "David Chen", subtitle: "TechFleet Solutions", tag: "Lead", gradient: "forest" },
          { title: "Drew Patel", subtitle: "Partner Ops", tag: "Internal", gradient: "steel" },
        ]}
      />

      {/* ── Main Split: Message List + Detail + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Message List — spans 3 cols */}
        <div className="lg:col-span-3">
          {/* Search bar */}
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0 rounded-xl border border-border bg-card overflow-hidden" style={{ height: "calc(100vh - 420px)", minHeight: "400px" }}>
            {/* Left: Message list */}
            <div className="flex flex-col border-r border-border">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {filtered.map((msg) => {
                  const config = channelConfig[msg.channel];
                  const ChannelIcon = config.icon;
                  const isSelected = msg.id === selectedId;

                  return (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedId(msg.id)}
                      className={cn(
                        "w-full text-left px-3 py-3 border-b border-border transition-colors border-l-2",
                        config.border,
                        isSelected ? "bg-primary/5" : "hover:bg-secondary/50",
                        !msg.read && "bg-primary/[0.02]"
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                          <AvatarFallback className={cn("text-[10px] font-medium", config.bg, config.color)}>
                            {getInitials(msg.from)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {!msg.read && <Circle className="h-2 w-2 fill-primary text-primary shrink-0" />}
                              <span className={cn("text-xs truncate", !msg.read ? "font-semibold" : "font-medium")}>
                                {msg.from}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0">{formatRelativeTime(msg.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <ChannelIcon className={cn("h-3 w-3 shrink-0", config.color)} />
                            {msg.subject ? (
                              <p className={cn("text-xs truncate", !msg.read ? "font-medium text-foreground" : "text-foreground/80")}>
                                {msg.subject}
                              </p>
                            ) : (
                              <span className={cn("text-[10px]", config.color)}>{msg.slackChannel || msg.fromPhone}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5 leading-relaxed">{msg.preview}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Badge variant="ghost" className={cn("text-[9px] px-1.5 py-0 gap-0.5", config.bg, config.color)}>
                              <ChannelIcon className="h-2.5 w-2.5" />
                              {config.label}
                            </Badge>
                            {msg.starred && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                            {msg.hasAttachment && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                            {msg.thread && msg.thread.length > 0 && (
                              <span className="text-[10px] text-muted-foreground">{msg.thread.length + 1} messages</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Message detail */}
            <div className="flex flex-col">
              {selected ? (
                <>
                  {/* Detail header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className={cn("text-xs font-medium", channelConfig[selected.channel].bg, channelConfig[selected.channel].color)}>
                          {getInitials(selected.from)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{selected.from}</span>
                          <Badge variant="ghost" className={cn("text-[9px] px-1.5 py-0 gap-0.5", channelConfig[selected.channel].bg, channelConfig[selected.channel].color)}>
                            {channelConfig[selected.channel].label}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {selected.fromEmail || selected.fromPhone || selected.slackChannel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg h-8 w-8 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                        <Star className={cn("h-4 w-4", selected.starred && "fill-amber-400 text-amber-400")} />
                      </button>
                      <button className="rounded-lg h-8 w-8 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                        <Archive className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg h-8 w-8 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg h-8 w-8 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  {selected.subject && (
                    <div className="px-5 py-3 border-b border-border shrink-0">
                      <h3 className="text-base font-semibold">{selected.subject}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{formatRelativeTime(selected.timestamp)}</p>
                    </div>
                  )}

                  {/* Thread / body */}
                  <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
                    {/* Original message */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className={cn("text-[9px] font-medium", channelConfig[selected.channel].bg, channelConfig[selected.channel].color)}>
                            {getInitials(selected.from)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{selected.from}</span>
                        <span className="text-[10px] text-muted-foreground">{formatRelativeTime(selected.timestamp)}</span>
                        {selected.hasAttachment && (
                          <Badge variant="outline" className="text-[9px] gap-1 px-1.5 py-0">
                            <Paperclip className="h-2.5 w-2.5" /> Attachment
                          </Badge>
                        )}
                      </div>
                      <div className="pl-8 text-[13px] leading-relaxed text-foreground/90 whitespace-pre-line">
                        {selected.body}
                      </div>
                    </div>

                    {/* Thread messages */}
                    {selected.thread?.map((msg) => (
                      <div key={msg.id} className={cn("space-y-2", msg.isOutgoing && "pl-6")}>
                        <Separator className="my-2" />
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={cn("text-[9px] font-medium", msg.isOutgoing ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground")}>
                              {getInitials(msg.from)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{msg.from}</span>
                          {msg.isOutgoing && <Badge variant="ghost" className="text-[9px] text-muted-foreground px-1.5 py-0">You</Badge>}
                          <span className="text-[10px] text-muted-foreground">{formatRelativeTime(msg.timestamp)}</span>
                          {msg.isOutgoing && <CheckCheck className="h-3 w-3 text-primary ml-auto" />}
                        </div>
                        <div className={cn(
                          "text-[13px] leading-relaxed whitespace-pre-line",
                          msg.isOutgoing ? "pl-8 text-foreground/80 bg-primary/[0.03] rounded-lg p-3 ml-4" : "pl-8 text-foreground/90"
                        )}>
                          {msg.body}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply */}
                  <div className="border-t border-border px-5 py-3 shrink-0">
                    <div className="flex items-end gap-2">
                      <div className="flex-1 rounded-lg border border-border bg-background px-3 py-2 min-h-[40px] text-sm text-muted-foreground flex items-center cursor-text" tabIndex={0}>
                        Reply via {channelConfig[selected.channel].label}...
                      </div>
                      <Button size="sm" className="h-9 px-3 rounded">
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        <Paperclip className="h-3 w-3" /> Attach
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        <ChevronDown className="h-3 w-3" /> Reply via {channelConfig[selected.channel].label}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                  Select a message to view
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar — dark cards */}
        <div className="space-y-3">
          {/* Channel Breakdown — dark card */}
          <div className="eng-card-dark p-5 animate-in stagger-1">
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Channel Breakdown</span>
            <div className="space-y-3 mt-3">
              {(["sms", "slack", "gmail"] as const).map((ch) => {
                const config = channelConfig[ch];
                const ChannelIcon = config.icon;
                const count = messages.filter((m) => m.channel === ch).length;
                return (
                  <button
                    key={ch}
                    onClick={() => setChannelFilter(channelFilter === ch ? "all" : ch)}
                    className={cn(
                      "w-full flex items-center gap-2.5 py-1 rounded transition-colors",
                      channelFilter === ch ? "opacity-100" : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-[11px] text-foreground flex-1 text-left">{config.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full animate-fill"
                          style={{
                            width: `${(count / messages.length) * 100}%`,
                            backgroundColor: config.fill,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-foreground tabular-nums w-3 text-right">{count}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Starred Messages — dark card */}
          <div className="eng-card-dark p-5 animate-in stagger-2">
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Starred Messages</span>
            <div className="space-y-2.5 mt-3">
              {messages
                .filter((m) => m.starred)
                .map((m) => {
                  const config = channelConfig[m.channel];
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedId(m.id)}
                      className="w-full text-left flex items-start gap-2 py-1 hover:opacity-100 transition-opacity"
                    >
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-foreground font-medium truncate">{m.from}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{m.subject || m.preview}</p>
                        <span className="text-[9px] text-muted-foreground">{config.label}</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Recent Contacts — dark card */}
          <div className="eng-card-dark p-5 animate-in stagger-3">
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Recent Contacts</span>
            <div className="space-y-2.5 mt-3">
              {Array.from(new Set(messages.map((m) => m.from))).slice(0, 5).map((name) => {
                const msg = messages.find((m) => m.from === name)!;
                const config = channelConfig[msg.channel];
                return (
                  <div key={name} className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="bg-secondary text-[9px] font-medium text-foreground">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-foreground truncate">{name}</p>
                      <p className="text-[10px] text-muted-foreground">{config.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
