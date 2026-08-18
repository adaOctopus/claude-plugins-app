/**
 * Build social preview assets for Twitter/X, Facebook, Slack, etc.
 * Run: npm run sync:og
 */
import { mkdir, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const SOURCE = join(ROOT, "src/assets/coolpreview.png");
const BACKGROUND = "#f9f8f6";
const WIDTH = 1200;
const HEIGHT = 630;

const OUTPUTS = [
  join(ROOT, "public/social-preview.jpg"),
  join(ROOT, "src/app/opengraph-image.jpg"),
  join(ROOT, "src/app/twitter-image.jpg"),
];

async function buildSocialPreview(): Promise<Buffer> {
  return sharp(SOURCE)
    .flatten({ background: BACKGROUND })
    .resize(WIDTH, HEIGHT, {
      fit: "contain",
      background: BACKGROUND,
    })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

async function main() {
  const buffer = await buildSocialPreview();

  for (const output of OUTPUTS) {
    await mkdir(dirname(output), { recursive: true });
    await sharp(buffer).toFile(output);
  }

  // Keep legacy PNG in public for bookmarks / older shares.
  await copyFile(SOURCE, join(ROOT, "public/coolpreview.png"));

  console.log(
    `Wrote ${OUTPUTS.length} social previews (${WIDTH}x${HEIGHT} JPEG, ${Math.round(buffer.length / 1024)} KB)`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
