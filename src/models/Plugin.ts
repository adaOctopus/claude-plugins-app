import mongoose, { Schema, models, model } from "mongoose";

export type PluginStatus = "draft" | "pending_review" | "published";

export interface PluginFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface IPlugin {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  category: string;
  priceMonthly: number;
  isFlagship: boolean;
  creatorId?: mongoose.Types.ObjectId;
  status: PluginStatus;
  files: PluginFile[];
  manifest?: Record<string, unknown>;
  builderConfig?: Record<string, unknown>;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PluginFileSchema = new Schema<PluginFile>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { _id: false }
);

const PluginSchema = new Schema<IPlugin>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: "engineering" },
    priceMonthly: { type: Number, required: true, default: 2.5 },
    isFlagship: { type: Boolean, default: false },
    creatorId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["draft", "pending_review", "published"],
      default: "draft",
    },
    files: [PluginFileSchema],
    manifest: Schema.Types.Mixed,
    builderConfig: Schema.Types.Mixed,
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Plugin = models.Plugin || model<IPlugin>("Plugin", PluginSchema);
