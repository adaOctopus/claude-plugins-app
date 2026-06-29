import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canPublishPlugin } from "@/lib/entitlements";
import { Plugin } from "@/models/Plugin";
import { User } from "@/models/User";

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().default("engineering"),
  integrations: z.array(z.string()).default([]),
  commands: z.array(z.object({
    name: z.string(),
    description: z.string(),
    prompt: z.string(),
  })).default([]),
});

const publishSchema = z.object({
  draftId: z.string(),
  priceMonthly: z.number().min(2).max(10).default(2.5),
});

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action as string;

    await connectDB();

    if (action === "create") {
      const data = createSchema.parse(body);
      const slug = slugify(data.title) + "-" + Date.now().toString(36);

      const plugin = await Plugin.create({
        slug,
        title: data.title,
        description: data.description,
        category: data.category,
        creatorId: session.id,
        status: "draft",
        builderConfig: {
          integrations: data.integrations,
          commands: data.commands,
        },
        manifest: {
          name: data.title,
          description: data.description,
          commands: data.commands,
        },
        priceMonthly: 2.5,
        isFlagship: false,
        files: [],
      });

      return NextResponse.json({ draftId: plugin._id, slug: plugin.slug });
    }

    if (action === "publish") {
      const canPublish = await canPublishPlugin(session.id);
      if (!canPublish) {
        return NextResponse.json(
          { error: "Active subscription required to publish" },
          { status: 403 }
        );
      }

      const { draftId, priceMonthly } = publishSchema.parse(body);
      const plugin = await Plugin.findOne({
        _id: draftId,
        creatorId: session.id,
        status: "draft",
      });

      if (!plugin) {
        return NextResponse.json({ error: "Draft not found" }, { status: 404 });
      }

      plugin.status = "published";
      plugin.priceMonthly = priceMonthly;
      await plugin.save();
      await User.findByIdAndUpdate(session.id, { role: "creator" });

      return NextResponse.json({ plugin: { id: plugin._id, slug: plugin.slug } });
    }

    if (action === "update") {
      const { draftId, ...updates } = body;
      const data = createSchema.partial().parse(updates);

      const plugin = await Plugin.findOneAndUpdate(
        { _id: draftId, creatorId: session.id, status: "draft" },
        {
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(data.category && { category: data.category }),
          builderConfig: {
            integrations: data.integrations,
            commands: data.commands,
          },
          manifest: {
            name: data.title,
            description: data.description,
            commands: data.commands,
          },
        },
        { new: true }
      );

      if (!plugin) {
        return NextResponse.json({ error: "Draft not found" }, { status: 404 });
      }

      return NextResponse.json({ draftId: plugin._id });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Builder error:", error);
    return NextResponse.json({ error: "Builder action failed" }, { status: 500 });
  }
}
