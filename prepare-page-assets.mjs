import fs from 'node:fs/promises';
const assets = new Map();
for (const file of await fs.readdir('.')) {
  if (!/^figma-.*\.txt$/.test(file)) continue;
  const text = await fs.readFile(file, 'utf8');
  const prefix = text.match(/const assetPathPrefix = "([^"]+)/)[1];
  for (const [, name] of text.matchAll(/\$\{assetPathPrefix\}\/([a-f0-9]+\.(?:png|svg))/g)) assets.set(name, `${prefix}/${name}`);
}
const missing = [];
for (const [name, url] of assets) {
  try { await fs.access(`assets/${name}`); } catch {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${name}: ${response.status}`);
    await fs.writeFile(`assets/${name}`, Buffer.from(await response.arrayBuffer()));
    missing.push(name);
  }
}
console.log('Downloaded:', missing.length, missing.join(', '));
