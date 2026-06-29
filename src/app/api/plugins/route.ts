import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { put } from "@vercel/blob";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canUploadPlugin } from "@/lib/entitlements";
import { Plugin } from "@/models/Plugin";
import { User } from "@/models/User";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  priceMonthly: z.number().min(2).max(10).default(2.5),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canUpload = await canUploadPlugin(session.id);
    if (!canUpload) {
      return NextResponse.json(
        { error: "Active subscription required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const priceMonthly = parseFloat(formData.get("priceMonthly") as string) || 2.5;
    const slug = slugify((formData.get("slug") as string) || title);

    schema.parse({ title, description, category, priceMonthly, slug });

    const files: { name: string; url: string; size: number; type: string }[] = [];
    const fileEntries = formData.getAll("files");

    for (const entry of fileEntries) {
      if (entry instanceof File && entry.size > 0) {
        const blob = await put(`plugins/${slug}/${entry.name}`, entry, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        files.push({
          name: entry.name,
          url: blob.url,
          size: entry.size,
          type: entry.type,
        });
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "At least one file required" }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(session.id, { role: "creator" });

    const plugin = await Plugin.create({
      slug,
      title,
      description,
      category,
      priceMonthly,
      creatorId: session.id,
      status: "pending_review",
      files,
      isFlagship: false,
    });

    return NextResponse.json({ plugin: { id: plugin._id, slug: plugin.slug } });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const plugins = await Plugin.find({ status: "published" }).sort({ createdAt: -1 });
    return NextResponse.json({ plugins });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
