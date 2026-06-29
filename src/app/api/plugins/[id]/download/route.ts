import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canDownloadPlugin } from "@/lib/entitlements";
import { Plugin, type PluginFile } from "@/models/Plugin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowed = await canDownloadPlugin(session.id, id);
    if (!allowed) {
      return NextResponse.json({ error: "No access" }, { status: 403 });
    }

    await connectDB();
    const plugin = await Plugin.findById(id);
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
    console.error("Download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
