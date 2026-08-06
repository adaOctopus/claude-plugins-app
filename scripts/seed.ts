/**
 * Seed script for marketplace plugins (flagship + free prompt builder).
 * Run: npx tsx scripts/seed.ts
 */
import mongoose from "mongoose";
import { getMongoConfig } from "../src/lib/mongo-config";

function requireMongoConfig() {
  try {
    return getMongoConfig();
  } catch {
    console.error("Set MONGODB_URI env var");
    process.exit(1);
  }
}

const PluginSchema = new mongoose.Schema(
  {
    slug: String,
    title: String,
    description: String,
    category: String,
    priceMonthly: Number,
    isFlagship: Boolean,
    status: String,
    files: Array,
    manifest: Object,
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const REMOVED_SLUGS = ["slack-fetch", "notion-fetch", "jira-fetch"];

const PLUGINS = [
  {
    slug: "context-engineer",
    title: "Best Claude Code Orchestrator for DEVS",
    description:
      "Full-stack context for engineers. Jira, Slack, GitHub, Notion - code, CI, and Slack drafts in one run.",
    category: "engineering",
    priceMonthly: 0,
    isFlagship: true,
    status: "published",
    files: [
      {
        name: "context-engineer.zip",
        url: "https://placeholder.coolplugz.dev/context-engineer.zip",
        size: 0,
        type: "application/zip",
      },
    ],
    manifest: {
      name: "Context Engineer",
      version: "1.0.0",
    },
  },
  {
    slug: "context-prompts",
    title: "Context Prompt Builder",
    description:
      "Connect Jira, Slack & Notion — fetches your context and returns fully engineered CRISPE prompts. No GitHub, no code execution, no dashboard.",
    category: "integrations",
    priceMonthly: 0,
    isFlagship: false,
    status: "published",
    files: [
      {
        name: "context-prompts.zip",
        url: "https://placeholder.coolplugz.dev/context-prompts.zip",
        size: 0,
        type: "application/zip",
      },
    ],
    manifest: { name: "Context Prompt Builder", version: "1.0.0" },
  },
];

async function seed() {
  const { uri, dbName } = requireMongoConfig();
  await mongoose.connect(uri, { dbName });
  const Plugin = mongoose.models.Plugin || mongoose.model("Plugin", PluginSchema);

  for (const slug of REMOVED_SLUGS) {
    const removed = await Plugin.deleteOne({ slug });
    if (removed.deletedCount) console.log(`✗ removed ${slug}`);
  }

  for (const plugin of PLUGINS) {
    await Plugin.findOneAndUpdate({ slug: plugin.slug }, plugin, {
      upsert: true,
      returnDocument: "after",
    });
    console.log(`✓ ${plugin.title}`);
  }

  await mongoose.disconnect();
}

seed().catch(console.error);
