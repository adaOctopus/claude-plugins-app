/**
 * Install CoolPlugz favicon + icon assets — animal only, transparent background.
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

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2);
}

/** Flood-fill corner-connected background (white / cream) to transparent. */
function stripBackground(imageData: ImageData, threshold = 36) {
  const { width, height, data } = imageData;
  const seeds: [number, number][] = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];

  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  for (const [sx, sy] of seeds) {
    const start = sy * width + sx;
    if (visited[start] || data[start * 4 + 3] === 0) continue;

    const sr = data[start * 4];
    const sg = data[start * 4 + 1];
    const sb = data[start * 4 + 2];
    queue.push(start);
    visited[start] = 1;

    while (queue.length > 0) {
      const pixel = queue.shift()!;
      const i = pixel * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (colorDistance(r, g, b, sr, sg, sb) <= threshold) {
        data[i + 3] = 0;
        const x = pixel % width;
        const y = (pixel - x) / width;
        const neighbors = [
          x > 0 ? pixel - 1 : -1,
          x < width - 1 ? pixel + 1 : -1,
          y > 0 ? pixel - width : -1,
          y < height - 1 ? pixel + width : -1,
        ];
        for (const next of neighbors) {
          if (next >= 0 && !visited[next] && data[next * 4 + 3] > 0) {
            visited[next] = 1;
            queue.push(next);
          }
        }
      }
    }
  }

  return imageData;
}

async function loadTransparentMark(sourcePath: string) {
  const image = await loadImage(sourcePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  stripBackground(imageData);
  ctx.clearRect(0, 0, image.width, image.height);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/** Scale transparent mark to square PNG with padding for favicon legibility. */
function renderTransparentIcon(sourceCanvas: ReturnType<typeof createCanvas>, size: number, paddingRatio = 0.08) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);

  const padding = size * paddingRatio;
  const inner = size - padding * 2;
  ctx.drawImage(sourceCanvas as unknown as import("@napi-rs/canvas").Image, padding, padding, inner, inner);

  return canvas.toBuffer("image/png");
}

/** Navbar mark tile — transparent animal, optional cream tile applied in CSS when framed. */
function renderMarkTile(sourceCanvas: ReturnType<typeof createCanvas>, size: number) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  const padding = size * 0.06;
  const inner = size - padding * 2;
  ctx.drawImage(sourceCanvas as unknown as import("@napi-rs/canvas").Image, padding, padding, inner, inner);
  return canvas.toBuffer("image/png");
}

async function main() {
  mkdirSync(LEGACY_DIR, { recursive: true });

  const stamp = "v3-white-bg";
  backupIfExists(join(ROOT, "public/icon.png"), join(LEGACY_DIR, `icon-${stamp}.png`));
  backupIfExists(join(ROOT, "src/app/icon.png"), join(LEGACY_DIR, `app-icon-${stamp}.png`));
  backupIfExists(join(ROOT, "src/app/apple-icon.png"), join(LEGACY_DIR, `apple-icon-${stamp}.png`));
  backupIfExists(join(ROOT, "src/app/favicon.ico"), join(LEGACY_DIR, `favicon-${stamp}.ico`));
  backupIfExists(join(ROOT, "public/favicon.ico"), join(LEGACY_DIR, `public-favicon-${stamp}.ico`));

  const sourcePath = resolveSource();
  console.log(`Source: ${sourcePath}`);
  const transparentMark = await loadTransparentMark(sourcePath);

  const mark512 = renderMarkTile(transparentMark, 512);
  const mark1024 = renderMarkTile(transparentMark, 1024);
  const icon512 = renderTransparentIcon(transparentMark, 512);
  const apple180 = renderTransparentIcon(transparentMark, 180);

  writeFileSync(join(ROOT, "public/coolplugz-mark.png"), mark512);
  writeFileSync(join(ROOT, "public/coolplugz-mark-hq.png"), mark1024);
  writeFileSync(join(ROOT, "public/icon.png"), icon512);
  writeFileSync(join(ROOT, "public/apple-icon.png"), apple180);
  writeFileSync(join(ROOT, "src/app/icon.png"), icon512);
  writeFileSync(join(ROOT, "src/app/apple-icon.png"), apple180);

  const iconSource = await loadImage(icon512);
  const icoSizes = [16, 32, 48, 96, 192];
  const icoPngs = icoSizes.map((size) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
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

  const check = createCanvas(512, 512);
  const c = check.getContext("2d");
  const iconImg = await loadImage(icon512);
  c.drawImage(iconImg, 0, 0);
  const corner = c.getImageData(0, 0, 1, 1).data;
  const center = c.getImageData(256, 256, 1, 1).data;
  console.log(`Favicon corner alpha: ${corner[3]} (want 0), center alpha: ${center[3]} (want 255)`);
  console.log("Installed transparent favicon + icon assets.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
