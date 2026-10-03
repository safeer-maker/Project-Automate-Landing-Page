import manifest from '../../assets.config.json';
import responsive from './responsive-images.json';

export type AssetId = (typeof manifest.assets)[number]['id'];

const assets = Object.fromEntries(manifest.assets.map((asset) => [asset.id, asset]));

/**
 * Custom domain of the R2 media bucket (same keys as the manifest paths). Unlike the Worker's
 * static assets it answers Range requests, which iOS needs to play video.
 */
export const MEDIA_BASE_URL = 'https://media.projectautomate.com';

/**
 * Resolves an extracted asset locally in development, or from R2 when
 * PUBLIC_R2_ASSET_URL is supplied at build/deploy time.
 */
export function assetUrl(id: AssetId): string {
  const asset = assets[id];
  if (!asset) throw new Error(`Unknown asset id: ${id}`);

  const r2BaseUrl = import.meta.env.PUBLIC_R2_ASSET_URL?.replace(/\/$/, '');
  if (r2BaseUrl) {
    const prefix = manifest.r2Prefix ? `${manifest.r2Prefix}/` : '';
    return `${r2BaseUrl}/${prefix}${asset.path}`;
  }
  return `/${manifest.publicDirectory}/${asset.path}`;
}

/** Absolute media-host URL of an extracted asset, for places that need one (e.g. og:image). */
export function mediaUrl(id: AssetId): string {
  const asset = assets[id];
  if (!asset) throw new Error(`Unknown asset id: ${id}`);

  const prefix = manifest.r2Prefix ? `${manifest.r2Prefix}/` : '';
  return `${MEDIA_BASE_URL}/${prefix}${asset.path}`;
}

type Recipe = { widths: number[] };
const recipes: Partial<Record<AssetId, Recipe>> = responsive.images;

/** URL of a sibling written by scripts/optimize-images.mjs: a width (`-960`) or a named crop (`-portrait-600`). */
export function assetVariantUrl(id: AssetId, variant: number | string): string {
  return assetUrl(id).replace(/\.webp$/, `-${variant}.webp`);
}

/** Best single file for `src`: the largest optimized sibling when there is one, else the original. */
export function assetSrc(id: AssetId): string {
  const widths = recipes[id]?.widths ?? [];
  return widths.length ? assetVariantUrl(id, Math.max(...widths)) : assetUrl(id);
}

/** `srcset` of the optimized siblings, or undefined when the asset only has one size. */
export function assetSrcset(id: AssetId): string | undefined {
  const widths = recipes[id]?.widths ?? [];
  return widths.length > 1
    ? widths.map((w) => `${assetVariantUrl(id, w)} ${w}w`).join(', ')
    : undefined;
}

export { manifest as framerAssets };
