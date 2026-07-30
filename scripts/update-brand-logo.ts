/**
 * Favicon + tab icons from public/cooldog.png — strip black bg only, never crop the dog.
 * Run: npx tsx scripts/update-brand-logo.ts
 */
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import toIco from "to-ico";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEGACY_DIR = join(ROOT, "public/legacy");
const COOLDOG_PATH = join(ROOT, "public/cooldog.png");

type CanvasLike = ReturnType<typeof createCanvas>;

function backupIfExists(from: string, to: string) {
  if (!existsSync(from)) return;
  copyFileSync(from, to);
  console.log(`Backed up → ${to}`);
}

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2);
}

/** Flood-fill corner black/white — full canvas kept, dog never cropped. */
function stripBackground(imageData: ImageData, threshold = 48) {
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

async function loadCooldogTransparent(): Promise<CanvasLike> {
  if (!existsSync(COOLDOG_PATH)) {
    throw new Error("Missing public/cooldog.png");
  }

  const image = await loadImage(COOLDOG_PATH);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  stripBackground(imageData);
  ctx.clearRect(0, 0, image.width, image.height);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/** Fit entire dog inside square — contain, never cover/crop. */
function renderIconContain(source: CanvasLike, size: number, insetRatio = 0.04) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);

  const inset = size * insetRatio;
  const inner = size - inset * 2;
  const scale = Math.min(inner / source.width, inner / source.height);
  const drawW = source.width * scale;
  const drawH = source.height * scale;
  const offsetX = (size - drawW) / 2;
  const offsetY = (size - drawH) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source as unknown as import("@napi-rs/canvas").Image, offsetX, offsetY, drawW, drawH);
  return canvas;
}

function downscaleCanvas(source: CanvasLike, targetSize: number) {
  const canvas = createCanvas(targetSize, targetSize);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source as unknown as import("@napi-rs/canvas").Image, 0, 0, targetSize, targetSize);
  return canvas;
}

function downscaleStepped(source: CanvasLike, targetSize: number) {
  let current = source;
  let currentSize = source.width;

  while (currentSize / 2 >= targetSize) {
    currentSize = Math.floor(currentSize / 2);
    current = downscaleCanvas(current, currentSize);
  }

  if (currentSize !== targetSize) {
    current = downscaleCanvas(current, targetSize);
  }

  return current;
}

async function main() {
  mkdirSync(LEGACY_DIR, { recursive: true });

  const stamp = `cooldog-${Date.now()}`;
  backupIfExists(COOLDOG_PATH, join(LEGACY_DIR, `cooldog-${stamp}.png`));
  backupIfExists(join(ROOT, "public/icon.png"), join(LEGACY_DIR, `icon-${stamp}.png`));
  backupIfExists(join(ROOT, "public/favicon.ico"), join(LEGACY_DIR, `favicon-${stamp}.ico`));

  const transparent = await loadCooldogTransparent();
  writeFileSync(COOLDOG_PATH, transparent.toBuffer("image/png"));
  console.log(`Updated public/cooldog.png — black bg stripped, full ${transparent.width}x${transparent.height} kept`);

  const master512 = renderIconContain(transparent, 512);
  const icon512 = master512.toBuffer("image/png");
  const icon192 = downscaleStepped(master512, 192).toBuffer("image/png");
  const icon32 = downscaleStepped(master512, 32).toBuffer("image/png");
  const apple180 = downscaleStepped(master512, 180).toBuffer("image/png");

  writeFileSync(join(ROOT, "public/icon.png"), icon512);
  writeFileSync(join(ROOT, "public/icon-192.png"), icon192);
  writeFileSync(join(ROOT, "public/icon-32.png"), icon32);
  writeFileSync(join(ROOT, "public/apple-icon.png"), apple180);
  writeFileSync(join(ROOT, "src/app/icon.png"), icon512);
  writeFileSync(join(ROOT, "src/app/apple-icon.png"), apple180);

  const icoSizes = [16, 24, 32, 48, 64, 128, 256];
  const icoPngs = icoSizes.map((size) => downscaleStepped(renderIconContain(transparent, size), size).toBuffer("image/png"));
  const ico = await toIco(icoPngs, { resize: false });
  writeFileSync(join(ROOT, "src/app/favicon.ico"), ico);
  writeFileSync(join(ROOT, "public/favicon.ico"), ico);

  writeFileSync(
    join(ROOT, "public/site.webmanifest"),
    `${JSON.stringify(
      {
        name: "coolplugz",
        short_name: "coolplugz",
        icons: [
          { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-32.png", sizes: "32x32", type: "image/png", purpose: "any" },
        ],
      },
      null,
      2
    )}\n`
  );

  console.log("Favicons generated from cooldog.png (contain — no crop).");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
