/**
 * Seed script for marketplace plugins (flagship + free fetchers).
 * Run: npx tsx scripts/seed.ts
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Set MONGODB_URI env var");
  process.exit(1);
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

const PLUGINS = [
  {
    slug: "context-engineer",
    title: "Context Engineer Autopilot",
    description:
      "Full-stack context for engineers. Jira, Slack, GitHub, Notion — code, CI, and Slack drafts in one run.",
    category: "engineering",
    priceMonthly: 0,
    isFlagship: true,
    status: "published",
    files: [
      {
        name: "context-engineer.zip",
        url: "https://placeholder.plugsville.dev/context-engineer.zip",
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
    slug: "slack-fetch",
    title: "Slack Fetch",
    description:
      "Pull threads, mentions, and standup context from Slack into Claude — replies drafted from real conversations.",
    category: "integrations",
    priceMonthly: 0,
    isFlagship: false,
    status: "published",
    files: [
      {
        name: "slack-fetch.zip",
        url: "https://placeholder.plugsville.dev/slack-fetch.zip",
        size: 0,
        type: "application/zip",
      },
    ],
    manifest: { name: "Slack Fetch", version: "1.0.0" },
  },
  {
    slug: "notion-fetch",
    title: "Notion Fetch",
    description:
      "Sync specs, sprint notes, and docs from Notion so every prompt starts with the right documentation.",
    category: "integrations",
    priceMonthly: 0,
    isFlagship: false,
    status: "published",
    files: [
      {
        name: "notion-fetch.zip",
        url: "https://placeholder.plugsville.dev/notion-fetch.zip",
        size: 0,
        type: "application/zip",
      },
    ],
    manifest: { name: "Notion Fetch", version: "1.0.0" },
  },
  {
    slug: "jira-fetch",
    title: "Jira Fetch",
    description:
      "Tickets, epics, and acceptance criteria from Jira — attached automatically before any coding task runs.",
    category: "integrations",
    priceMonthly: 0,
    isFlagship: false,
    status: "published",
    files: [
      {
        name: "jira-fetch.zip",
        url: "https://placeholder.plugsville.dev/jira-fetch.zip",
        size: 0,
        type: "application/zip",
      },
    ],
    manifest: { name: "Jira Fetch", version: "1.0.0" },
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  const Plugin = mongoose.models.Plugin || mongoose.model("Plugin", PluginSchema);

  for (const plugin of PLUGINS) {
    await Plugin.findOneAndUpdate({ slug: plugin.slug }, plugin, {
      upsert: true,
      new: true,
    });
    console.log(`✓ ${plugin.title}`);
  }

  await mongoose.disconnect();
}

seed().catch(console.error);
