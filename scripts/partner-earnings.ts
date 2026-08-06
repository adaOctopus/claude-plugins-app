/**
 * Partner promo earnings report — terminal table.
 *
 * Run from project root:
 *   npm run partners
 *
 * Uses MONGODB_URI (+ optional MONGODB_DB_NAME) from .env.local.
 * Production earnings (live data in `test` db):
 *   MONGODB_DB_NAME=test npm run partners
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import mongoose from "mongoose";
import { getMongoConfig } from "../src/lib/mongo-config";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

type Column = {
  key: string;
  header: string;
  align: "left" | "right";
  width: number;
  value: (row: PartnerRow) => string;
};

type PartnerRow = {
  partnerName: string;
  partnerEmail: string;
  code: string;
  source: string;
  active: boolean;
  discountPercent: number;
  revenueSharePercent: number;
  redemptionCount: number;
  totalNetRevenue: number;
  totalPartnerShare: number;
};

function renderTable(rows: PartnerRow[], columns: Column[]): string[] {
  const header = columns.map((col) => {
    const text = col.header.padEnd(col.width, " ");
    return col.align === "right" ? text.slice(-col.width) : text.slice(0, col.width);
  });

  const divider = columns
    .map((col) => (col.align === "right" ? "─".repeat(col.width) : "─".repeat(col.width)))
    .join("─┼─");

  const body = rows.map((row) =>
    columns
      .map((col) => {
        const raw = col.value(row);
        const clipped = truncate(raw, col.width);
        return col.align === "right"
          ? clipped.padStart(col.width, " ")
          : clipped.padEnd(col.width, " ");
      })
      .join(" │ ")
  );

  return [
    header.join(" │ "),
    divider,
    ...(body.length > 0 ? body : [columns.map((col) => " ".repeat(col.width)).join(" │ ")]),
  ];
}

const PartnerPromoSchema = new mongoose.Schema(
  {
    code: String,
    partnerName: String,
    partnerEmail: String,
    discountPercent: Number,
    revenueSharePercent: Number,
    active: Boolean,
    source: String,
  },
  { timestamps: true }
);

const PartnerPromoRedemptionSchema = new mongoose.Schema(
  {
    partnerPromoId: mongoose.Schema.Types.ObjectId,
    netAmount: Number,
    partnerShareAmount: Number,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

async function main() {
  loadEnvLocal();

  let uri: string;
  let dbName: string;
  try {
    ({ uri, dbName } = getMongoConfig());
  } catch {
    console.error("MONGODB_URI is not set. Add it to .env.local or pass it in the shell.");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName });

  const PartnerPromo =
    mongoose.models.PartnerPromo || mongoose.model("PartnerPromo", PartnerPromoSchema);
  const PartnerPromoRedemption =
    mongoose.models.PartnerPromoRedemption ||
    mongoose.model("PartnerPromoRedemption", PartnerPromoRedemptionSchema);

  const promos = await PartnerPromo.find().sort({ createdAt: -1 }).lean();
  const statsRows = await PartnerPromoRedemption.aggregate<{
    _id: unknown;
    redemptionCount: number;
    totalNetRevenue: number;
    totalPartnerShare: number;
  }>([
    {
      $group: {
        _id: "$partnerPromoId",
        redemptionCount: { $sum: 1 },
        totalNetRevenue: { $sum: "$netAmount" },
        totalPartnerShare: { $sum: "$partnerShareAmount" },
      },
    },
  ]);

  const statsByPromo = new Map(statsRows.map((row) => [String(row._id), row]));

  const rows: PartnerRow[] = promos.map((promo) => {
    const stats = statsByPromo.get(String(promo._id));
    return {
      partnerName: promo.partnerName ?? "—",
      partnerEmail: promo.partnerEmail ?? "—",
      code: promo.code ?? "—",
      source: promo.source ?? "admin",
      active: promo.active !== false,
      discountPercent: promo.discountPercent ?? 0,
      revenueSharePercent: promo.revenueSharePercent ?? 0,
      redemptionCount: stats?.redemptionCount ?? 0,
      totalNetRevenue: stats?.totalNetRevenue ?? 0,
      totalPartnerShare: stats?.totalPartnerShare ?? 0,
    };
  });

  const totals = rows.reduce(
    (acc, row) => {
      acc.redemptionCount += row.redemptionCount;
      acc.totalNetRevenue += row.totalNetRevenue;
      acc.totalPartnerShare += row.totalPartnerShare;
      return acc;
    },
    { redemptionCount: 0, totalNetRevenue: 0, totalPartnerShare: 0 }
  );

  const columns: Column[] = [
    {
      key: "partner",
      header: "Partner",
      align: "left",
      width: 18,
      value: (row) => row.partnerName,
    },
    {
      key: "email",
      header: "Email",
      align: "left",
      width: 26,
      value: (row) => row.partnerEmail,
    },
    {
      key: "code",
      header: "Promo code",
      align: "left",
      width: 20,
      value: (row) => row.code,
    },
    {
      key: "source",
      header: "Source",
      align: "left",
      width: 12,
      value: (row) => row.source,
    },
    {
      key: "active",
      header: "Active",
      align: "left",
      width: 6,
      value: (row) => (row.active ? "yes" : "no"),
    },
    {
      key: "terms",
      header: "Disc/Share",
      align: "left",
      width: 10,
      value: (row) => `${row.discountPercent}/${row.revenueSharePercent}%`,
    },
    {
      key: "redemptions",
      header: "Sales",
      align: "right",
      width: 5,
      value: (row) => String(row.redemptionCount),
    },
    {
      key: "net",
      header: "Net revenue",
      align: "right",
      width: 11,
      value: (row) => formatUsd(row.totalNetRevenue),
    },
    {
      key: "share",
      header: "Owed",
      align: "right",
      width: 11,
      value: (row) => formatUsd(row.totalPartnerShare),
    },
  ];

  const connectedDb = mongoose.connection.name || dbName;
  const generatedAt = new Date().toLocaleString();

  console.log("");
  console.log("  CoolPlugz — Partner earnings");
  console.log(`  Database: ${connectedDb}   Generated: ${generatedAt}`);
  console.log(`  Partners: ${rows.length}   Total owed: ${formatUsd(totals.totalPartnerShare)}`);
  console.log("");
  console.log("  " + renderTable(rows, columns).join("\n  "));
  console.log("");
  console.log(
    `  Totals — sales: ${totals.redemptionCount}   net revenue: ${formatUsd(totals.totalNetRevenue)}   owed: ${formatUsd(totals.totalPartnerShare)}`
  );
  console.log("");

  if (rows.length === 0) {
    console.log("  No partner promos found yet.");
    console.log("");
  }

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Partner earnings report failed:", error);
  process.exit(1);
});
