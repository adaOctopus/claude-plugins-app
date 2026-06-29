/**
 * Seed script for flagship Context Engineer plugin.
 * Run: npx tsx scripts/seed.ts
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Set MONGODB_URI env var");
  process.exit(1);
}

const PluginSchema = new mongoose.Schema({
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
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  const Plugin = mongoose.models.Plugin || mongoose.model("Plugin", PluginSchema);

  await Plugin.findOneAndUpdate(
    { slug: "context-engineer" },
    {
      slug: "context-engineer",
      title: "Context Engineer",
      description:
        "The flagship plugin for software engineers. Gathers Jira, Slack, GitHub context and generates code, standup updates, and CI fixes.",
      category: "engineering",
      priceMonthly: 0,
      isFlagship: true,
      status: "published",
      files: [
        {
          name: "context-engineer.zip",
          url: "https://placeholder.projectx.dev/context-engineer.zip",
          size: 0,
          type: "application/zip",
        },
      ],
      manifest: {
        name: "Context Engineer",
        version: "1.0.0",
        commands: [
          {
            name: "context-gather",
            description: "Gather full context from Jira, Slack, GitHub",
          },
          {
            name: "standup-update",
            description: "Generate standup update from recent activity",
          },
          {
            name: "fix-ci",
            description: "Analyze CI failures with full repo context",
          },
        ],
      },
      downloadCount: 0,
    },
    { upsert: true, new: true }
  );

  console.log("✓ Seeded flagship Context Engineer plugin");
  await mongoose.disconnect();
}

seed().catch(console.error);
