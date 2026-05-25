import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  const blogs = await db.blog.findMany({
    where: {
      ...(status && { status }),
      ...(category && { category }),
    },
    orderBy: [{ isHero: "desc" }, { createdAt: "desc" }],
    include: { publishedBy: { select: { fullName: true } } },
  });

  return NextResponse.json(blogs);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title,
    slug,
    excerpt,
    coverImageUrl,
    body: postBody,
    gallery,
    extendedHeading,
    extendedBody,
    tag,
    bikeModel,
    category,
    isHero,
    status,
    publishedById,
  } = body;

  if (!title || !category) {
    return NextResponse.json(
      { error: "title and category are required" },
      { status: 400 }
    );
  }

  const resolvedSlug = slug?.trim() || slugify(title);

  const blog = await db.blog.create({
    data: {
      title,
      slug: resolvedSlug,
      excerpt: excerpt ?? null,
      coverImageUrl: coverImageUrl ?? null,
      body: postBody ?? [],
      gallery: gallery ?? null,
      extendedHeading: extendedHeading ?? null,
      extendedBody: extendedBody ?? null,
      tag: tag ?? null,
      bikeModel: bikeModel ?? null,
      category,
      isHero: isHero ?? false,
      status: status ?? "draft",
      publishedAt: status === "published" ? new Date() : null,
      publishedById: publishedById ?? null,
    },
  });

  return NextResponse.json(blog, { status: 201 });
}
