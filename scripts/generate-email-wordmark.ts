import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const opentype = require("opentype.js") as typeof import("opentype.js");

const ROOT = path.join(import.meta.dirname, "..");
const FONT_PATH = path.join(ROOT, "public/fonts/brand/milk-peach-clean.ttf");
const OUT_PATH = path.join(ROOT, "public/email-wordmark.png");

const TEXT = "coolplugz";
const FONT_SIZE = 72;
const COLOR = "#201721";
const PADDING = 6;

async function main() {
  const font = opentype.parse(fs.readFileSync(FONT_PATH));
  const textPath = font.getPath(TEXT, 0, FONT_SIZE, FONT_SIZE);
  const bbox = textPath.getBoundingBox();

  const width = Math.ceil(bbox.x2 - bbox.x1 + PADDING * 2);
  const height = Math.ceil(bbox.y2 - bbox.y1 + PADDING * 2);
  const offsetX = PADDING - bbox.x1;
  const offsetY = PADDING - bbox.y1;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <g transform="translate(${offsetX}, ${offsetY})">
    <path d="${textPath.toPathData(2)}" fill="${COLOR}" />
  </g>
</svg>`;

  await sharp(Buffer.from(svg)).png().toFile(OUT_PATH);

  const stats = fs.statSync(OUT_PATH);
  console.log(`Wrote ${OUT_PATH} (${stats.size} bytes, ${width}x${height})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
