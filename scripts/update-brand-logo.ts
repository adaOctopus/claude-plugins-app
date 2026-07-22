/**
 * Back up legacy logo/favicon assets and install the new CoolPlugz mark.
 * White background inside the logo; transparent outside rounded favicon corners.
 * Run: npx tsx scripts/update-brand-logo.ts [optional-source-path]
 */
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import toIco from "to-ico";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEGACY_DIR = join(ROOT, "public/legacy");

const SOURCE_CANDIDATES = [
  process.argv[2],
  join(ROOT, "public/coolplugz-mark-hq.png"),
  join(ROOT, "src/assets/coolplugz-mark.png"),
  join(ROOT, "public/coolplugz-mark.png"),
].filter(Boolean) as string[];

function resolveSource() {
  for (const path of SOURCE_CANDIDATES) {
    if (existsSync(path)) return path;
  }
  throw new Error("Logo source image not found");
}

function backupIfExists(from: string, to: string) {
  if (!existsSync(from)) return;
  copyFileSync(from, to);
  console.log(`Backed up → ${to}`);
}

function roundedRectPath(
  ctx: ReturnType<ReturnType<typeof createCanvas>["getContext"]>,
  size: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
}

/** Full square logo — white background, no transparency. */
function renderLogo(image: Awaited<ReturnType<typeof loadImage>>, size: number) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(image, 0, 0, size, size);
  return canvas.toBuffer("image/png");
}

/** Favicon — white inside rounded rect, transparent outside. */
function renderRoundedIcon(
  image: Awaited<ReturnType<typeof loadImage>>,
  size: number,
  cornerRadius: number
) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);

  ctx.save();
  roundedRectPath(ctx, size, cornerRadius);
  ctx.clip();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(image, 0, 0, size, size);
  ctx.restore();

  return canvas.toBuffer("image/png");
}

async function main() {
  mkdirSync(LEGACY_DIR, { recursive: true });

  const stamp = "v2-bad-bg";
  backupIfExists(join(ROOT, "public/coolplugz-mark.png"), join(LEGACY_DIR, `coolplugz-mark-${stamp}.png`));
  backupIfExists(join(ROOT, "public/icon.png"), join(LEGACY_DIR, `icon-${stamp}.png`));
  backupIfExists(join(ROOT, "src/app/icon.png"), join(LEGACY_DIR, `app-icon-${stamp}.png`));
  backupIfExists(join(ROOT, "src/app/apple-icon.png"), join(LEGACY_DIR, `apple-icon-${stamp}.png`));
  backupIfExists(join(ROOT, "src/app/favicon.ico"), join(LEGACY_DIR, `favicon-${stamp}.ico`));

  const sourcePath = resolveSource();
  console.log(`Source: ${sourcePath}`);
  const image = await loadImage(sourcePath);

  const mark512 = renderLogo(image, 512);
  const mark1024 = renderLogo(image, 1024);
  const icon512 = renderRoundedIcon(image, 512, 112);
  const apple180 = renderRoundedIcon(image, 180, 40);

  writeFileSync(join(ROOT, "public/coolplugz-mark.png"), mark512);
  writeFileSync(join(ROOT, "public/coolplugz-mark-hq.png"), mark1024);
  writeFileSync(join(ROOT, "public/icon.png"), icon512);
  writeFileSync(join(ROOT, "public/apple-icon.png"), apple180);
  writeFileSync(join(ROOT, "src/app/icon.png"), icon512);
  writeFileSync(join(ROOT, "src/app/apple-icon.png"), apple180);

  // favicon.ico embeds 48–192px sizes for Google Search (no extra public PNG URLs needed)
  const iconSource = await loadImage(icon512);
  const icoSizes = [16, 32, 48, 96, 192];
  const icoPngs = icoSizes.map((size) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(iconSource, 0, 0, size, size);
    return canvas.toBuffer("image/png");
  });
  const ico = await toIco(icoPngs, { resize: false });
  writeFileSync(join(ROOT, "src/app/favicon.ico"), ico);
  writeFileSync(join(ROOT, "public/favicon.ico"), ico);

  const manifest = {
    name: "coolplugz",
    short_name: "coolplugz",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
  writeFileSync(
    join(ROOT, "public/site.webmanifest"),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  // Sanity check: favicon corners must be transparent, logo corners white
  const check = createCanvas(512, 512);
  const c = check.getContext("2d");
  const iconImg = await loadImage(icon512);
  c.drawImage(iconImg, 0, 0);
  const corner = c.getImageData(0, 0, 1, 1).data;
  const center = c.getImageData(256, 256, 1, 1).data;
  console.log(`Favicon corner alpha: ${corner[3]} (want 0), center: rgb(${center[0]},${center[1]},${center[2]})`);
  console.log("Installed new logo + favicon assets.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
