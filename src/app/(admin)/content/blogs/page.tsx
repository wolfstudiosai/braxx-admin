"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  isHero: boolean;
  tag: string | null;
  bikeModel: string | null;
  createdAt: string;
  publishedAt: string | null;
  publishedBy: { fullName: string } | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  engineering: "Engineering",
  design: "Design",
  lifestyle: "Lifestyle",
  community: "Community",
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setBlogs(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteBlog(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    setBlogs(prev => prev.filter(b => b.id !== id));
  }

  async function togglePublish(blog: Blog) {
    const newStatus = blog.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/blogs/${blog.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const updated = await res.json();
    setBlogs(prev => prev.map(b => b.id === updated.id ? updated : b));
  }

  const filtered = blogs.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Link
            href="/content"
            className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Content
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center rounded bg-foreground px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider text-background uppercase">
              CREATIVE
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
              Blog Posts
            </span>
          </div>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            Blog Management
          </h1>
        </div>
        <Link href="/content/blogs/new">
          <Button size="sm" className="text-xs font-medium rounded h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total", value: blogs.length, color: "text-foreground" },
          { label: "Published", value: blogs.filter(b => b.status === "published").length, color: "text-emerald-600" },
          { label: "Draft", value: blogs.filter(b => b.status === "draft").length, color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
            <div className="min-w-0">
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">{s.label}</span>
              <span className={cn("text-sm font-mono font-semibold tabular-nums", s.color)}>{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 border-border bg-background rounded-full"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "published", "draft"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors",
                filter === f
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-xs text-muted-foreground py-8 text-center">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-xs text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">
          {blogs.length === 0
            ? "No blog posts yet. Create your first post."
            : "No posts match your filters."}
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-2.5 font-mono font-medium text-muted-foreground uppercase tracking-wider text-[9px]">Title</th>
                <th className="text-left px-4 py-2.5 font-mono font-medium text-muted-foreground uppercase tracking-wider text-[9px] hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-2.5 font-mono font-medium text-muted-foreground uppercase tracking-wider text-[9px] hidden md:table-cell">Model</th>
                <th className="text-left px-4 py-2.5 font-mono font-medium text-muted-foreground uppercase tracking-wider text-[9px]">Status</th>
                <th className="text-left px-4 py-2.5 font-mono font-medium text-muted-foreground uppercase tracking-wider text-[9px] hidden lg:table-cell">Published</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(blog => (
                <tr key={blog.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground truncate max-w-[200px]">{blog.title}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">{blog.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="secondary" className="text-[9px] capitalize">
                      {CATEGORY_LABELS[blog.category] ?? blog.category}
                    </Badge>
                    {blog.isHero && (
                      <Badge variant="purple" className="text-[9px] ml-1">Hero</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {blog.bikeModel ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={blog.status === "published" ? "success" : "warning"}
                      className="text-[9px] capitalize"
                    >
                      {blog.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                    {blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => togglePublish(blog)}
                        title={blog.status === "published" ? "Unpublish" : "Publish"}
                        className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        {blog.status === "published"
                          ? <EyeOff className="h-3.5 w-3.5" />
                          : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <Link href={`/content/blogs/${blog.id}`}>
                        <button className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteBlog(blog.id, blog.title)}
                        className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
