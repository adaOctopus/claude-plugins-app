/**
 * Generate 1500×500 Twitter header — Make Money gradient bg, dog face + wordmark, tagline.
 * Run: npx tsx scripts/generate-twitter-banner.ts
 */
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public/marketing");
const OUT_FILE = join(OUT_DIR, "coolplugz-twitter-header-1500x500.png");

const WIDTH = 1500;
const HEIGHT = 500;
const RENDER_SCALE = 2;
const TEXT = "#2d2926";

/** Matches MakeMoneySection: bg-gradient-to-br from-accent-sage via-cream to-amber-50/90 */
function fillMakeMoneyGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#e8ede6"); // accent-sage
  gradient.addColorStop(0.5, "#f9f8f6"); // cream
  gradient.addColorStop(1, "#fffbeb"); // amber-50 (~90% on light bg)
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

const GEIST_PATH = join(
  ROOT,
  "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf"
);
const DOG_FACE = join(ROOT, "public/cooldog.png");
const WORDMARK = join(ROOT, "public/coolplugz-wordmark-1024.png");

type CanvasLike = ReturnType<typeof createCanvas>;
type LoadedImage = Awaited<ReturnType<typeof loadImage>>;

function enableSharpScaling(ctx: CanvasRenderingContext2D) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
}

function getAlphaBounds(imageData: ImageData, alphaMin = 10) {
  const { width, height, data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha >= alphaMin) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX) return null;

  return {
    minX,
    minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function cropImageToContent(source: LoadedImage): CanvasLike {
  const canvas = createCanvas(source.width, source.height);
  const ctx = canvas.getContext("2d");
  enableSharpScaling(ctx);
  ctx.drawImage(source, 0, 0);
  const bounds = getAlphaBounds(ctx.getImageData(0, 0, source.width, source.height));
  if (!bounds) return canvas;

  const cropped = createCanvas(bounds.width, bounds.height);
  const croppedCtx = cropped.getContext("2d");
  enableSharpScaling(croppedCtx);
  croppedCtx.drawImage(
    source,
    bounds.minX,
    bounds.minY,
    bounds.width,
    bounds.height,
    0,
    0,
    bounds.width,
    bounds.height
  );
  return cropped;
}

/** Supersampled sprite — crisp downscale instead of soft upscale. */
function buildDogSprite(cropped: CanvasLike, targetHeight: number) {
  const oversample = 4;
  const spriteHeight = targetHeight * oversample;
  const spriteWidth = (cropped.width / cropped.height) * spriteHeight;
  const sprite = createCanvas(Math.ceil(spriteWidth), Math.ceil(spriteHeight));
  const ctx = sprite.getContext("2d");
  enableSharpScaling(ctx);
  ctx.clearRect(0, 0, sprite.width, sprite.height);
  ctx.drawImage(cropped as unknown as LoadedImage, 0, 0, spriteWidth, spriteHeight);
  return { sprite, width: spriteWidth / oversample, height: targetHeight };
}

function downscaleCanvas(source: CanvasLike, targetW: number, targetH: number) {
  const canvas = createCanvas(targetW, targetH);
  const ctx = canvas.getContext("2d");
  enableSharpScaling(ctx);
  ctx.drawImage(source as unknown as LoadedImage, 0, 0, targetW, targetH);
  return canvas;
}

function drawBanner(ctx: CanvasRenderingContext2D, scale: number) {
  const dogHeight = 92 * scale;
  const lockupGap = 28 * scale;
  const wordmarkHeight = 78 * scale;
  const taglineSize = 30 * scale;
  const taglineGap = 24 * scale;
  const tagline = "The AI-native developer's best friend.";

  return { dogHeight, lockupGap, wordmarkHeight, taglineSize, taglineGap, tagline };
}

async function main() {
  if (!existsSync(DOG_FACE)) throw new Error(`Missing ${DOG_FACE}`);
  if (!existsSync(WORDMARK)) throw new Error(`Missing ${WORDMARK}`);
  if (!existsSync(GEIST_PATH)) throw new Error(`Missing Geist font at ${GEIST_PATH}`);

  GlobalFonts.registerFromPath(GEIST_PATH, "Geist");

  const dogFaceRaw = await loadImage(DOG_FACE);
  const dogCropped = cropImageToContent(dogFaceRaw);
  const wordmarkRaw = await loadImage(WORDMARK);
  const wordmark = cropImageToContent(wordmarkRaw);

  const renderW = WIDTH * RENDER_SCALE;
  const renderH = HEIGHT * RENDER_SCALE;
  const canvas = createCanvas(renderW, renderH);
  const ctx = canvas.getContext("2d");
  enableSharpScaling(ctx);

  fillMakeMoneyGradient(ctx, renderW, renderH);

  const { dogHeight, lockupGap, wordmarkHeight, taglineSize, taglineGap, tagline } =
    drawBanner(ctx, RENDER_SCALE);

  const { sprite: dogSprite, width: dogWidth } = buildDogSprite(dogCropped, dogHeight);
  const wordmarkWidth = (wordmark.width / wordmark.height) * wordmarkHeight;
  const lockupWidth = dogWidth + lockupGap + wordmarkWidth;

  ctx.font = `${taglineSize}px Geist`;
  const taglineWidth = ctx.measureText(tagline).width;
  const blockHeight = dogHeight + taglineGap + taglineSize;
  const blockY = (renderH - blockHeight) / 2;
  const lockupX = (renderW - lockupWidth) / 2;

  ctx.drawImage(
    dogSprite as unknown as LoadedImage,
    lockupX,
    blockY,
    dogWidth,
    dogHeight
  );

  const wordmarkX = lockupX + dogWidth + lockupGap;
  const wordmarkY = blockY + (dogHeight - wordmarkHeight) / 2;
  ctx.drawImage(
    wordmark as unknown as LoadedImage,
    wordmarkX,
    wordmarkY,
    wordmarkWidth,
    wordmarkHeight
  );

  ctx.fillStyle = TEXT;
  ctx.font = `${taglineSize}px Geist`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(tagline, renderW / 2, blockY + dogHeight + taglineGap);

  const final = downscaleCanvas(canvas, WIDTH, HEIGHT);

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, final.toBuffer("image/png"));

  console.log(`Wrote ${OUT_FILE}`);
  console.log(
    `dog ${Math.round(dogWidth)}x${dogHeight / RENDER_SCALE}px (2x render + 4x dog sprite) · wordmark ${Math.round(wordmarkWidth / RENDER_SCALE)}x${wordmarkHeight / RENDER_SCALE}px`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
