import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(resolve(root, 'assets.config.json'), 'utf8'));
const outputRoot = resolve(root, 'public', manifest.publicDirectory);
const statePath = resolve(root, '.assets-state.json');
const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');
const validateOnly = process.argv.includes('--validate');

let state = { assets: {} };
try {
  state = JSON.parse(await readFile(statePath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

function destinationFor(asset) {
  const destination = resolve(outputRoot, asset.path);
  if (!destination.startsWith(`${outputRoot}${sep}`)) {
    throw new Error(`Unsafe asset path for ${asset.id}: ${asset.path}`);
  }
  return destination;
}

let downloaded = 0;
let skipped = 0;

for (const asset of manifest.assets) {
  const destination = destinationFor(asset);
  const isCurrent = state.assets?.[asset.id]?.source === asset.source && state.assets?.[asset.id]?.path === asset.path;
  try {
    if (!force && isCurrent) {
      await stat(destination);
      console.log(`skip      ${asset.path}`);
      skipped += 1;
      continue;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  if (validateOnly) throw new Error(`Asset configuration changed or is missing: ${asset.path}. Run npm run assets:download.`);

  console.log(`${dryRun ? 'would get' : 'download'}  ${asset.path}`);
  if (dryRun || validateOnly) continue;

  const response = await fetch(asset.source, { headers: { 'User-Agent': 'PA-LP asset migration/1.0' } });
  if (!response.ok) throw new Error(`Failed to download ${asset.id}: ${response.status} ${response.statusText}`);
  await mkdir(resolve(destination, '..'), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  state.assets[asset.id] = { source: asset.source, path: asset.path };
  downloaded += 1;
}

if (!dryRun && !validateOnly) {
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

console.log(`Complete: ${downloaded} downloaded, ${skipped} unchanged.`);
