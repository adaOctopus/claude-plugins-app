/**
 * Renders "cool" in Milk Peach Clean on a transparent 1024×1024 PNG.
 * Run: npx tsx scripts/generate-cool-wordmark-png.ts
 */
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FONT_PATH = join(ROOT, "public/fonts/brand/milk-peach-clean.ttf");
const OUT_PATH = join(ROOT, "public/cool-wordmark-1024.png");

const BRAND_COLOR = "#201721";
const TEXT = "cool";
const SIZE = 1024;
const LETTER_SPACING_EM = -0.02;

GlobalFonts.registerFromPath(FONT_PATH, "Milk Peach Clean");

import type { SKRSContext2D } from "@napi-rs/canvas";

function measureTextWithSpacing(ctx: SKRSContext2D, text: string, spacingPx: number) {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    width += ctx.measureText(text[i]).width;
    if (i < text.length - 1) width += spacingPx;
  }
  return width;
}

function drawTextWithSpacing(ctx: SKRSContext2D, text: string, x: number, y: number, spacingPx: number) {
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

let fontSize = 420;
ctx.font = `400 ${fontSize}px "Milk Peach Clean"`;
ctx.fillStyle = BRAND_COLOR;
ctx.textBaseline = "middle";

const spacingPx = fontSize * LETTER_SPACING_EM;
let textWidth = measureTextWithSpacing(ctx, TEXT, spacingPx);

// Scale down if needed with comfortable padding
const maxWidth = SIZE * 0.82;
if (textWidth > maxWidth) {
  fontSize = Math.floor((fontSize * maxWidth) / textWidth);
  ctx.font = `400 ${fontSize}px "Milk Peach Clean"`;
  textWidth = measureTextWithSpacing(ctx, TEXT, fontSize * LETTER_SPACING_EM);
}

const finalSpacing = fontSize * LETTER_SPACING_EM;
textWidth = measureTextWithSpacing(ctx, TEXT, finalSpacing);
const metrics = ctx.measureText("o");
const x = (SIZE - textWidth) / 2;
const y = SIZE / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 4;

drawTextWithSpacing(ctx, TEXT, x, y, finalSpacing);

const png = canvas.toBuffer("image/png");
writeFileSync(OUT_PATH, png);

console.log(`Wrote ${OUT_PATH}`);
console.log(`Font: Milk Peach Clean | Color: ${BRAND_COLOR} | Size: ${fontSize}px`);
