#!/usr/bin/env node
/**
 * Writes the responsive WebP siblings listed in src/config/responsive-images.json next to the
 * extracted assets in public/. Originals are never modified, so the R2 bucket keeps the same files
 * and `npm run assets:download -- --force` can't undo anything. Siblings are committed like the
 * originals, so the Cloudflare build doesn't run this.
 *
 *   npm run images:optimize            write missing or stale siblings
 *   npm run images:optimize -- --force rewrite all of them
 *   npm run images:check               exit 1 if any sibling is missing or stale
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(resolve(root, 'assets.config.json'), 'utf8'));
const config = JSON.parse(
  await readFile(resolve(root, 'src/config/responsive-images.json'), 'utf8'),
);
const assetDir = resolve(root, 'public', manifest.publicDirectory);
const statePath = resolve(root, '.responsive-images-state.json');
const force = process.argv.includes('--force');
const check = process.argv.includes('--check');

const state = JSON.parse(await readFile(statePath, 'utf8').catch(() => '{}'));
const next = {};
let stale = 0;
let written = 0;

for (const [id, recipe] of Object.entries(config.images)) {
  const asset = manifest.assets.find((a) => a.id === id);
  if (!asset) throw new Error(`responsive-images.json: unknown asset id ${id}`);
  const source = resolve(assetDir, asset.path);
  const { size } = await stat(source);
  const meta = await sharp(source).metadata();
  const encoder = config.encoders[recipe.encoder];
  const jobs = [
    ...recipe.widths.map((width) => ({ width, crop: recipe.crop, name: '' })),
    ...Object.entries(recipe.crops ?? {}).flatMap(([name, crop]) =>
      crop.widths.map((width) => ({ width, crop, name: `${name}-` })),
    ),
  ];

  for (const { width, crop, name } of jobs) {
    const rel = asset.path.replace(/\.webp$/, `-${name}${width}.webp`);
    const out = resolve(assetDir, rel);
    const key = createHash('sha1')
      .update(JSON.stringify({ size, width, crop, encoder, sharp: sharp.versions.sharp }))
      .digest('hex')
      .slice(0, 12);
    next[rel] = key;
    const exists = await stat(out).then(
      () => true,
      () => false,
    );
    if (!force && exists && state[rel] === key) continue;
    stale += 1;
    if (check) {
      console.log(`stale     ${rel}`);
      continue;
    }

    let image = sharp(source);
    if (crop) {
      const w = Math.min(meta.width, Math.round(meta.height * crop.aspect));
      const h = Math.min(meta.height, Math.round(w / crop.aspect));
      // Keep the CSS object-position anchor so object-fit: cover frames it exactly as before.
      image = image.extract({
        left: Math.round((meta.width - w) * (crop.x ?? 0.5)),
        top: Math.round((meta.height - h) * (crop.y ?? 0.5)),
        width: w,
        height: h,
      });
    }
    await mkdir(dirname(out), { recursive: true });
    const info = await image
      .resize({ width, withoutEnlargement: true, kernel: 'lanczos3' })
      .webp(encoder)
      .toFile(out);
    written += 1;
    console.log(
      `write     ${rel} ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)} KB`,
    );
  }
}

if (check) {
  if (stale) process.exit(1);
  console.log('Responsive images are up to date.');
} else {
  await writeFile(statePath, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Complete: ${written} written, ${Object.keys(next).length - written} unchanged.`);
}
