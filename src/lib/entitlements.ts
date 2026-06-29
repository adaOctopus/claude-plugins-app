import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Subscription } from "@/models/Subscription";
import { Plugin } from "@/models/Plugin";

export async function hasActiveSubscription(userId: string) {
  await connectDB();
  const sub = await Subscription.findOne({
    userId,
    status: { $in: ["active", "trialing"] },
    currentPeriodEnd: { $gt: new Date() },
  });
  return !!sub;
}

export async function getUserSubscription(userId: string) {
  await connectDB();
  return Subscription.findOne({
    userId,
    status: { $in: ["active", "trialing"] },
  }).populate("includedPluginIds addonPluginIds");
}

export async function canDownloadPlugin(userId: string, pluginId: string) {
  await connectDB();
  const plugin = await Plugin.findById(pluginId);
  if (!plugin) return false;

  const sub = await Subscription.findOne({
    userId,
    status: { $in: ["active", "trialing"] },
    currentPeriodEnd: { $gt: new Date() },
  });

  if (!sub) return false;

  if (plugin.isFlagship) {
    return sub.includedPluginIds.some(
      (id: mongoose.Types.ObjectId) => id.toString() === pluginId
    );
  }

  return sub.addonPluginIds.some(
    (id: mongoose.Types.ObjectId) => id.toString() === pluginId
  );
}

export async function canPublishPlugin(userId: string) {
  return hasActiveSubscription(userId);
}

export async function canUploadPlugin(userId: string) {
  return hasActiveSubscription(userId);
}
