// Checks every internal link and image in the built site. Run after "node build.mjs".
import fs from 'node:fs'; import path from 'node:path';
const D = path.resolve('dist'); let bad = 0, pages = 0, links = 0;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const exists = (u) => { const p = decodeURI(u.split('#')[0].split('?')[0]); if (!p) return true; const f = path.join(D, p); return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html'))); };
const ids = {};
const idsOf = (file) => ids[file] ??= new Set([...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const f of walk(D).filter((f) => f.endsWith('.html'))) {
  pages++; const html = fs.readFileSync(f, 'utf8'); const rel = path.relative(D, f);
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    links++; const u = m[1];
    if (!exists(u)) { bad++; console.log(`BROKEN  ${rel}  ->  ${u}`); continue; }
    const hash = u.split('#')[1];
    if (hash && !u.startsWith('//')) { const t = path.join(D, u.split('#')[0].split('?')[0], u.endsWith('/') || !u.split('#')[0].includes('.') ? 'index.html' : ''); const tf = fs.existsSync(t) && fs.statSync(t).isFile() ? t : path.join(D, u.split('#')[0], 'index.html'); if (fs.existsSync(tf) && !idsOf(tf).has(hash)) { bad++; console.log(`NO ANCHOR ${rel} -> ${u}`); } }
  }
  const h1 = (html.match(/<h1[\s>]/g) || []).length; if (h1 !== 1 && !rel.startsWith('404')) { bad++; console.log(`H1 count ${h1}: ${rel}`); }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(m[0])) { bad++; console.log(`IMG without alt: ${rel}`); }
}
console.log(`Checked ${pages} pages and ${links} internal links. Problems: ${bad}`);
process.exit(bad ? 1 : 0);
