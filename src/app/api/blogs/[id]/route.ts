import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const blog = await db.blog.findUnique({
    where: { id },
    include: { publishedBy: { select: { fullName: true } } },
  });
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
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

  const existing = await db.blog.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const wasUnpublished = existing.status !== "published";
  const becomingPublished = status === "published";

  const blog = await db.blog.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(excerpt !== undefined && { excerpt }),
      ...(coverImageUrl !== undefined && { coverImageUrl }),
      ...(postBody !== undefined && { body: postBody }),
      ...(gallery !== undefined && { gallery }),
      ...(extendedHeading !== undefined && { extendedHeading }),
      ...(extendedBody !== undefined && { extendedBody }),
      ...(tag !== undefined && { tag }),
      ...(bikeModel !== undefined && { bikeModel }),
      ...(category !== undefined && { category }),
      ...(isHero !== undefined && { isHero }),
      ...(status !== undefined && { status }),
      ...(becomingPublished && wasUnpublished && { publishedAt: new Date() }),
      ...(publishedById !== undefined && { publishedById }),
    },
  });

  return NextResponse.json(blog);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await db.blog.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.blog.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
