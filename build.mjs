// Yaqeen Advisory website generator.
// Run:  node build.mjs      (creates the finished website in the "dist" folder)
// No packages to install. Content lives in the "content" folder.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { readJSON, listJSON, ensureDir, copyDir, esc } from './build/lib.mjs';
import { ctx, abs } from './build/render.mjs';
import * as P from './build/pages.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const C = (...p) => path.join(ROOT, 'content', ...p);
const DIST = path.join(ROOT, 'dist');
const warnings = [];
const warn = (m) => warnings.push(m);

// ---------- load content ----------
const site = readJSON(C('settings', 'site.json'));
const nav = readJSON(C('settings', 'navigation.json'));
const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999) || String(a.title).localeCompare(String(b.title));
const services = listJSON(C('services')).sort(byOrder);
const markets = listJSON(C('markets')).sort(byOrder);
const solutions = listJSON(C('solutions')).sort(byOrder);
const insights = listJSON(C('insights')).filter((i) => !i.draft).sort((a, b) => String(b.date).localeCompare(String(a.date)));
const pages = {};
for (const n of ['home', 'services', 'solutions', 'plans', 'how-we-work', 'about', 'partners', 'contact', 'insights', 'privacy-policy', 'terms']) {
  pages[n] = readJSON(C('pages', `${n}.json`));
}

Object.assign(ctx, {
  site, nav, services, markets, solutions, insights, pages,
  parents: services.filter((s) => !s.parent),
  childrenOf: (slug) => services.filter((s) => s.parent === slug),
});

// ---------- clean and copy static files ----------
fs.rmSync(DIST, { recursive: true, force: true });
ensureDir(DIST);
copyDir(path.join(ROOT, 'static'), DIST);
const hash = (f) => crypto.createHash('md5').update(fs.readFileSync(path.join(DIST, f))).digest('hex').slice(0, 8);
ctx.assetV = crypto.createHash('md5').update(hash('assets/css/site.css') + hash('assets/js/site.js')).digest('hex').slice(0, 8);

// ---------- build pages ----------
const out = [];
const add = (r) => out.push(r);
add(P.homePage(pages.home));
add(P.servicesHub(pages.services));
services.forEach((s) => add(P.servicePage(s)));
markets.forEach((m) => add(P.marketPage(m)));
add(P.solutionsHub(pages.solutions));
solutions.forEach((s) => add(P.solutionPage(s)));
add(P.plansPage(pages.plans));
add(P.howPage(pages['how-we-work']));
add(P.aboutPage(pages.about));
add(P.partnersPage(pages.partners));
add(P.contactPage(pages.contact));
add(P.insightsIndex(pages.insights));
insights.forEach((a) => add(P.insightPage(a)));
add(P.legalPage(pages['privacy-policy'], 'privacy-policy'));
add(P.legalPage(pages.terms, 'terms'));
add(P.sitemapPage());
const nf = P.notFoundPage();
add(nf);

for (const r of out) {
  const file = r.file ? path.join(DIST, r.file) : path.join(DIST, r.path, 'index.html');
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, r.html);
  // quality checks
  const t = (r.html.match(/<title>(.*?)<\/title>/) || [])[1] || '';
  const d = (r.html.match(/<meta name="description" content="(.*?)">/) || [])[1] || '';
  if (t.length > 75) warn(`Title is long (${t.length}): ${r.path}`);
  if (d.length < 70 || d.length > 175) warn(`Meta description length ${d.length}: ${r.path}`);
}

// ---------- sitemap, robots, feed ----------
const urls = out.filter((r) => !r.file).map((r) => r.path);
const prio = (u) => (u === '/' ? '1.0' : /^\/services\/[^/]+\/$/.test(u) ? '0.8' : '0.6');
const insightDate = Object.fromEntries(insights.map((i) => [`/insights/${i.slug}/`, i.updated || i.date]));
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `<url><loc>${abs(u)}</loc>${insightDate[u] ? `<lastmod>${insightDate[u]}</lastmod>` : ''}<priority>${prio(u)}</priority></url>`)
    .join('\n')}\n</urlset>\n`
);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);
fs.writeFileSync(
  path.join(DIST, 'feed.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(site.name)} insights</title><link>${abs('/insights/')}</link><description>${esc(site.description)}</description>\n${insights
    .map((i) => `<item><title>${esc(i.title)}</title><link>${abs(`/insights/${i.slug}/`)}</link><guid>${abs(`/insights/${i.slug}/`)}</guid><pubDate>${new Date(i.date).toUTCString()}</pubDate><description>${esc(i.summary)}</description></item>`)
    .join('\n')}\n</channel></rss>\n`
);

// ---------- content health warnings (shown in the build log) ----------
if (/yaqeenadvisory\.com/.test(site.siteUrl)) warn('Settings: "Website address" is still the placeholder. Change it to your real domain before launch.');
if (!site.formEndpoint) warn('Settings: no contact-form address set, so the form will open the visitor\'s email app instead.');
if (!site.googleSiteVerification) warn('Settings: Google Search Console verification code is empty (add it when you set up Search Console).');
const slugs = new Set(services.map((s) => s.slug));
for (const s of services) {
  if (s.parent && !slugs.has(s.parent)) warn(`Service "${s.slug}" has a parent that does not exist: ${s.parent}`);
  for (const r of s.related || []) if (!slugs.has(r)) warn(`Service "${s.slug}" lists a related service that does not exist: ${r}`);
  if (!s.metaTitle || !s.metaDescription) warn(`Service "${s.slug}" is missing a search title or description.`);
}

console.log(`Built ${out.length} pages into ${DIST}`);
if (warnings.length) console.log('\nNotes:\n - ' + warnings.join('\n - '));
