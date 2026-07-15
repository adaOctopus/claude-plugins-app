/**
 * Renders "coolplugz" in Milk Peach Clean on a transparent 1024×1024 PNG.
 * Run: npx tsx scripts/generate-coolplugz-wordmark-png.ts
 */
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import type { SKRSContext2D } from "@napi-rs/canvas";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FONT_PATH = join(ROOT, "public/fonts/brand/milk-peach-clean.ttf");
const OUT_PATH = join(ROOT, "public/coolplugz-wordmark-1024.png");

const BRAND_COLOR = "#201721";
const TEXT = "coolplugz";
const SIZE = 1024;
const LETTER_SPACING_EM = -0.02;
const MAX_WIDTH_RATIO = 0.9;

GlobalFonts.registerFromPath(FONT_PATH, "Milk Peach Clean");

function measureTextWithSpacing(ctx: SKRSContext2D, text: string, spacingPx: number) {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    width += ctx.measureText(text[i]).width;
    if (i < text.length - 1) width += spacingPx;
  }
  return width;
}

function measureTextHeight(ctx: SKRSContext2D, text: string) {
  const metrics = ctx.measureText(text);
  return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
}

function drawTextWithSpacing(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  spacingPx: number
) {
  let cursor = x;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + spacingPx;
  }
}

const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, SIZE, SIZE);

let fontSize = 280;
const maxWidth = SIZE * MAX_WIDTH_RATIO;
const maxHeight = SIZE * 0.72;

while (fontSize > 48) {
  ctx.font = `400 ${fontSize}px "Milk Peach Clean"`;
  const spacingPx = fontSize * LETTER_SPACING_EM;
  const textWidth = measureTextWithSpacing(ctx, TEXT, spacingPx);
  const textHeight = measureTextHeight(ctx, TEXT);
  if (textWidth <= maxWidth && textHeight <= maxHeight) break;
  fontSize -= 2;
}

ctx.font = `400 ${fontSize}px "Milk Peach Clean"`;
ctx.fillStyle = BRAND_COLOR;
ctx.textBaseline = "alphabetic";

const spacingPx = fontSize * LETTER_SPACING_EM;
const textWidth = measureTextWithSpacing(ctx, TEXT, spacingPx);
const metrics = ctx.measureText(TEXT);
const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

const x = (SIZE - textWidth) / 2;
const y = (SIZE - textHeight) / 2 + metrics.actualBoundingBoxAscent;

drawTextWithSpacing(ctx, TEXT, x, y, spacingPx);

writeFileSync(OUT_PATH, canvas.toBuffer("image/png"));

console.log(`Wrote ${OUT_PATH}`);
console.log(`Font: Milk Peach Clean | Color: ${BRAND_COLOR} | Size: ${fontSize}px`);
