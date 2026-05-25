"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "community", label: "Community" },
];

const BIKE_MODELS = ["GT", "GT Pro", "Both"];

type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  body: string[];
  gallery: string[];
  extendedHeading: string;
  extendedBody: string[];
  tag: string;
  bikeModel: string;
  category: string;
  isHero: boolean;
  status: "draft" | "published";
};

const EMPTY_FORM: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  coverImageUrl: "",
  body: [""],
  gallery: [],
  extendedHeading: "",
  extendedBody: [],
  tag: "",
  bikeModel: "",
  category: "engineering",
  isHero: false,
  status: "draft",
};

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";

  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/blogs/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          coverImageUrl: data.coverImageUrl ?? "",
          body: (data.body as string[]) ?? [""],
          gallery: (data.gallery as string[]) ?? [],
          extendedHeading: data.extendedHeading ?? "",
          extendedBody: (data.extendedBody as string[]) ?? [],
          tag: data.tag ?? "",
          bikeModel: data.bikeModel ?? "",
          category: data.category ?? "engineering",
          isHero: data.isHero ?? false,
          status: data.status ?? "draft",
        });
        setLoading(false);
      })
      .catch(() => { setError("Failed to load post"); setLoading(false); });
  }, [id, isNew]);

  function set<K extends keyof BlogForm>(key: K, value: BlogForm[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === "title" && isNew) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function setParagraph(arr: "body" | "extendedBody", idx: number, val: string) {
    setForm(prev => {
      const copy = [...prev[arr]];
      copy[idx] = val;
      return { ...prev, [arr]: copy };
    });
  }

  function addParagraph(arr: "body" | "extendedBody") {
    setForm(prev => ({ ...prev, [arr]: [...prev[arr], ""] }));
  }

  function removeParagraph(arr: "body" | "extendedBody", idx: number) {
    setForm(prev => {
      const copy = prev[arr].filter((_, i) => i !== idx);
      return { ...prev, [arr]: copy.length ? copy : [""] };
    });
  }

  function addGalleryUrl() {
    setForm(prev => ({ ...prev, gallery: [...prev.gallery, ""] }));
  }

  function setGalleryUrl(idx: number, val: string) {
    setForm(prev => {
      const copy = [...prev.gallery];
      copy[idx] = val;
      return { ...prev, gallery: copy };
    });
  }

  function removeGalleryUrl(idx: number) {
    setForm(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));
  }

  async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    return url;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      set("coverImageUrl", url);
    } catch {
      alert("Upload failed. Make sure BLOB_READ_WRITE_TOKEN is configured.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        body: form.body.filter(p => p.trim()),
        gallery: form.gallery.filter(u => u.trim()),
        extendedBody: form.extendedBody.filter(p => p.trim()),
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt || null,
        coverImageUrl: form.coverImageUrl || null,
        extendedHeading: form.extendedHeading || null,
        tag: form.tag || null,
        bikeModel: form.bikeModel || null,
      };

      const url = isNew ? "/api/blogs" : `/api/blogs/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Save failed");
      }

      const saved = await res.json();
      if (isNew) router.push(`/content/blogs/${saved.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    const newStatus = form.status === "published" ? "draft" : "published";
    set("status", newStatus);
    if (!isNew) {
      await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/content/blogs"
            className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Blog Posts
          </Link>
          <h1 className="text-sm font-mono font-medium uppercase tracking-wider text-foreground">
            {isNew ? "New Post" : "Edit Post"}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={togglePublish}
            className={cn(
              "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[10px] font-medium border transition-colors",
              form.status === "published"
                ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-50"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            )}
          >
            {form.status === "published"
              ? <><EyeOff className="h-3 w-3" /> Unpublish</>
              : <><Eye className="h-3 w-3" /> Publish</>}
          </button>
          <Button onClick={save} disabled={saving} size="sm" className="text-xs font-medium rounded h-8 gap-1.5">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center gap-2">
        <Badge variant={form.status === "published" ? "success" : "warning"} className="text-[9px] capitalize">
          {form.status}
        </Badge>
        {form.isHero && <Badge variant="purple" className="text-[9px]">Hero</Badge>}
      </div>

      {/* Basic info */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h2 className="text-[9px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Basic Info</h2>

        <div className="space-y-1">
          <label className="text-[10px] font-medium text-foreground">Title *</label>
          <Input
            value={form.title}
            onChange={e => set("title", e.target.value)}
            placeholder="Post title"
            className="text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-medium text-foreground">Slug</label>
          <Input
            value={form.slug}
            onChange={e => set("slug", e.target.value)}
            placeholder="url-friendly-slug"
            className="text-sm font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-medium text-foreground">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={e => set("excerpt", e.target.value)}
            placeholder="Short description shown in listings..."
            rows={2}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-foreground">Category *</label>
            <select
              value={form.category}
              onChange={e => set("category", e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-foreground">Bike Model</label>
            <select
              value={form.bikeModel}
              onChange={e => set("bikeModel", e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Any</option>
              {BIKE_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-foreground">Tag</label>
            <Input
              value={form.tag}
              onChange={e => set("tag", e.target.value)}
              placeholder="e.g. Deep Dive"
              className="text-sm"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isHero}
                onChange={e => set("isHero", e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-[10px] font-medium text-foreground">Hero post for this category</span>
            </label>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h2 className="text-[9px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Cover Image</h2>

        {form.coverImageUrl && (
          <div className="rounded-lg overflow-hidden border border-border aspect-video max-w-sm bg-muted">
            <img src={form.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={form.coverImageUrl}
            onChange={e => set("coverImageUrl", e.target.value)}
            placeholder="https://... or upload below"
            className="text-sm flex-1"
          />
          <input type="file" accept="image/*,video/*" ref={fileRef} className="hidden" onChange={handleCoverUpload} />
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5 text-xs h-9"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Upload
          </Button>
        </div>
      </section>

      {/* Body */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h2 className="text-[9px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Body Paragraphs</h2>

        {form.body.map((p, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={p}
              onChange={e => setParagraph("body", i, e.target.value)}
              placeholder={`Paragraph ${i + 1}…`}
              rows={3}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
            <button
              onClick={() => removeParagraph("body", i)}
              disabled={form.body.length === 1}
              className="h-8 w-8 mt-0.5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addParagraph("body")} className="gap-1.5 text-xs h-8">
          <Plus className="h-3.5 w-3.5" /> Add Paragraph
        </Button>
      </section>

      {/* Gallery */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h2 className="text-[9px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Gallery URLs</h2>
        <p className="text-[10px] text-muted-foreground">Paste URLs for additional images shown in the gallery strip on the post detail page.</p>

        {form.gallery.map((url, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={url}
              onChange={e => setGalleryUrl(i, e.target.value)}
              placeholder="https://..."
              className="text-sm flex-1"
            />
            <button
              onClick={() => removeGalleryUrl(i)}
              className="h-9 w-8 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addGalleryUrl} className="gap-1.5 text-xs h-8">
          <Plus className="h-3.5 w-3.5" /> Add Image URL
        </Button>
      </section>

      {/* Extended content */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h2 className="text-[9px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Extended Section (Optional)</h2>

        <div className="space-y-1">
          <label className="text-[10px] font-medium text-foreground">Section Heading</label>
          <Input
            value={form.extendedHeading}
            onChange={e => set("extendedHeading", e.target.value)}
            placeholder="Section heading…"
            className="text-sm"
          />
        </div>

        {form.extendedBody.map((p, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={p}
              onChange={e => setParagraph("extendedBody", i, e.target.value)}
              placeholder={`Paragraph ${i + 1}…`}
              rows={3}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
            <button
              onClick={() => removeParagraph("extendedBody", i)}
              className="h-8 w-8 mt-0.5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addParagraph("extendedBody")} className="gap-1.5 text-xs h-8">
          <Plus className="h-3.5 w-3.5" /> Add Paragraph
        </Button>
      </section>

      {/* Save footer */}
      <div className="flex items-center justify-between pt-2 pb-6">
        <Link href="/content/blogs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to list
        </Link>
        <div className="flex gap-2">
          <button
            onClick={togglePublish}
            className={cn(
              "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[10px] font-medium border transition-colors",
              form.status === "published"
                ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-50"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {form.status === "published" ? "Unpublish" : "Publish"}
          </button>
          <Button onClick={save} disabled={saving} size="sm" className="text-xs font-medium rounded h-8 gap-1.5">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save Post
          </Button>
        </div>
      </div>
    </div>
  );
}
