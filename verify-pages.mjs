import fs from 'node:fs/promises';
const files = (await fs.readdir('.')).filter(file => file.endsWith('.html'));
const issues = [];
let references = 0;
for (const file of files) {
  const html = await fs.readFile(file, 'utf8');
  if ((html.match(/<h1\b/g) || []).length !== 1) issues.push({ file, error: 'Expected one h1' });
  for (const [, reference] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|data:)/.test(reference)) continue;
    const [target, hash] = reference.split('#');
    references++;
    try {
      const path = target || file;
      const stat = await fs.stat(path);
      if (!stat.size) issues.push({ file, reference, error: 'Empty file' });
      if (hash && path.endsWith('.html')) {
        const linked = path === file ? html : await fs.readFile(path, 'utf8');
        if (!linked.includes(`id="${hash}"`)) issues.push({ file, reference, error: 'Missing anchor' });
      }
    } catch { issues.push({ file, reference, error: 'Missing file' }); }
  }
}
console.log(JSON.stringify({ pages: files.length, references, issues }, null, 2));
if (issues.length) process.exitCode = 1;
