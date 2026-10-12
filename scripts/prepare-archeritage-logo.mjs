/**
 * Derives tightly cropped header logo variants from the official source asset.
 * Run: node scripts/prepare-archeritage-logo.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sourcePath = join(root, 'public/images/logo/archeritage.png');
const outLight = join(root, 'public/images/logo/archeritage-on-light.png');
const outDark = join(root, 'public/images/logo/archeritage-on-dark.png');
const metaPath = join(root, 'src/lib/brand/logo-meta.ts');

const IVORY = { r: 247, g: 243, b: 234 };
const MARGIN = 10;
/** 2× export width for retina header display (~260px CSS) */
const EXPORT_WIDTH = 520;

function luminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function isCopperPixel(r, g, b, a) {
  if (a < 24) return false;
  return r > g && g > b && r > 95 && g > 55 && b > 35 && r - b > 45;
}

function isDarkStructuralPixel(r, g, b, a) {
  if (a < 24) return false;
  if (isCopperPixel(r, g, b, a)) return false;
  return luminance(r, g, b) < 145;
}

function recolorDarkToIvory(r, g, b, a) {
  const strength = Math.min(1, (145 - luminance(r, g, b)) / 145);
  const mix = 0.35 + strength * 0.65;
  return {
    r: Math.round(r * (1 - mix) + IVORY.r * mix),
    g: Math.round(g * (1 - mix) + IVORY.g * mix),
    b: Math.round(b * (1 - mix) + IVORY.b * mix),
    a,
  };
}

async function computeAlphaBounds(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const i = (y * info.width + x) * 4;
      if (data[i + 3] > 12) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return {
    sourceWidth: info.width,
    sourceHeight: info.height,
    bounds: { minX, minY, maxX, maxY },
    visibleWidth: maxX - minX + 1,
    visibleHeight: maxY - minY + 1,
  };
}

async function cropWithMargin(inputPath, bounds, sourceWidth, sourceHeight) {
  const left = Math.max(0, bounds.minX - MARGIN);
  const top = Math.max(0, bounds.minY - MARGIN);
  const width = Math.min(sourceWidth - left, bounds.maxX - bounds.minX + 1 + MARGIN * 2);
  const height = Math.min(sourceHeight - top, bounds.maxY - bounds.minY + 1 + MARGIN * 2);

  return sharp(inputPath).extract({ left, top, width, height });
}

async function buildOnDarkVariant(croppedBuffer, width, height) {
  const { data, info } = await sharp(croppedBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const a = out[i + 3];

    if (a < 12) continue;

    if (isCopperPixel(r, g, b, a)) continue;

    if (isDarkStructuralPixel(r, g, b, a)) {
      const next = recolorDarkToIvory(r, g, b, a);
      out[i] = next.r;
      out[i + 1] = next.g;
      out[i + 2] = next.b;
      out[i + 3] = next.a;
    }
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

const analysis = await computeAlphaBounds(sourcePath);

const cropped = await cropWithMargin(
  sourcePath,
  analysis.bounds,
  analysis.sourceWidth,
  analysis.sourceHeight,
);
const croppedBuffer = await cropped.png().toBuffer();
const croppedMeta = await sharp(croppedBuffer).metadata();

const onLightBuffer = await sharp(croppedBuffer)
  .resize({ width: EXPORT_WIDTH, withoutEnlargement: false })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();

const onLightMeta = await sharp(onLightBuffer).metadata();
const darkIntermediate = await buildOnDarkVariant(croppedBuffer, croppedMeta.width, croppedMeta.height);
const onDarkBuffer = await sharp(darkIntermediate)
  .resize({ width: EXPORT_WIDTH, withoutEnlargement: false })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();

await sharp(onLightBuffer).toFile(outLight);
await sharp(onDarkBuffer).toFile(outDark);

const meta = {
  source: {
    path: 'public/images/logo/archeritage.png',
    width: analysis.sourceWidth,
    height: analysis.sourceHeight,
    alphaBounds: analysis.bounds,
    visibleWidth: analysis.visibleWidth,
    visibleHeight: analysis.visibleHeight,
    paddingTop: analysis.bounds.minY,
    paddingBottom: analysis.sourceHeight - analysis.bounds.maxY - 1,
    paddingLeft: analysis.bounds.minX,
    paddingRight: analysis.sourceWidth - analysis.bounds.maxX - 1,
    hasOpaqueBackground: false,
  },
  cropped: {
    margin: MARGIN,
    width: croppedMeta.width,
    height: croppedMeta.height,
  },
  export: {
    width: onLightMeta.width,
    height: onLightMeta.height,
    displayWidthPx: Math.round(onLightMeta.width / 2),
    displayHeightPx: Math.round(onLightMeta.height / 2),
  },
};

const metaSource = `/** Generated by scripts/prepare-archeritage-logo.mjs — do not edit manually. */
export const HEADER_LOGO_ON_LIGHT = '/images/logo/archeritage-on-light.png' as const;
export const HEADER_LOGO_ON_DARK = '/images/logo/archeritage-on-dark.png' as const;

export const headerLogoMeta = ${JSON.stringify(meta, null, 2)} as const;

export const HEADER_LOGO_WIDTH = ${onLightMeta.width} as const;
export const HEADER_LOGO_HEIGHT = ${onLightMeta.height} as const;
`;

mkdirSync(dirname(metaPath), { recursive: true });
writeFileSync(metaPath, metaSource, 'utf8');

console.log('Logo preparation complete');
console.log(JSON.stringify(meta, null, 2));
