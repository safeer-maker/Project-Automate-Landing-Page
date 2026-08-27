import manifest from '../../framer-assets.config.json';

export type AssetId = (typeof manifest.assets)[number]['id'];

const assets = Object.fromEntries(manifest.assets.map((asset) => [asset.id, asset]));

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
  return asset.source;
}

export { manifest as framerAssets };
