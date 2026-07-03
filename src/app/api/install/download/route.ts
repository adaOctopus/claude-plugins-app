import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canAccessInstallGuide } from "@/lib/install-access";
import { Plugin, type PluginFile } from "@/models/Plugin";

/** Download plugin bundle when install access is granted. */
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowed = await canAccessInstallGuide(session.id, slug);
    if (!allowed) {
      return NextResponse.json({ error: "No access" }, { status: 403 });
    }

    await connectDB();
    const plugin = await Plugin.findOne({ slug, status: "published" });
    if (!plugin || plugin.files.length === 0) {
      return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
    }

    plugin.downloadCount += 1;
    await plugin.save();

    const mainFile =
      plugin.files.find((f: PluginFile) => f.name.endsWith(".zip")) ||
      plugin.files[0];

    return NextResponse.json({ url: mainFile.url, name: mainFile.name });
  } catch (error) {
    console.error("Install download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
