// Reusable page pieces: layout, header, footer, cards, FAQ, calls to action.
import { esc, md, icon, stripHtml } from './lib.mjs';

export const TIERS = {
  foundation: { name: 'Foundation', cls: 'pill-foundation' },
  growth: { name: 'Growth', cls: 'pill-growth' },
  cfo: { name: 'CFO', cls: 'pill-cfo' },
};

export const MARKET_LABEL = { india: 'India', uae: 'UAE', 'saudi-arabia': 'Saudi Arabia' };

export const ctx = { site: null, nav: null, parents: [], childrenOf: () => [], services: [], markets: [], solutions: [], assetV: '' };

export const abs = (p) => `${ctx.site.siteUrl.replace(/\/$/, '')}${p}`;

// ---------- Structured data ----------
export const orgJsonLd = () => {
  const s = ctx.site;
  const same = Object.values(s.social || {}).filter(Boolean);
  const o = {
    '@context': 'https://schema.org',
    '@type': ['AccountingService', 'ProfessionalService'],
    '@id': abs('/#organization'),
    name: s.name,
    url: abs('/'),
    logo: abs('/assets/img/yaqeen-symbol.svg'),
    image: abs('/assets/img/og-default.png'),
    description: s.description,
    slogan: s.tagline,
    email: s.email || undefined,
    telephone: s.phone || undefined,
    address: s.address && s.address.city ? { '@type': 'PostalAddress', addressLocality: s.address.city, addressRegion: s.address.region, addressCountry: 'IN' } : undefined,
    areaServed: ['India', 'United Arab Emirates', 'Saudi Arabia'].map((n) => ({ '@type': 'Country', name: n })),
    sameAs: same.length ? same : undefined,
  };
  return o;
};

export const crumbsJsonLd = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.label, item: abs(t.url) })),
});

export const faqJsonLd = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: stripHtml(md(f.a)) } })),
});

// ---------- Components ----------
export const eyebrow = (t, cls = '') => (t ? `<p class="eyebrow ${cls}">${esc(t)}</p>` : '');

export const checks = (items = [], cls = '') =>
  `<ul class="checks ${cls}">${items.map((i) => `<li>${icon('tick')}<span>${esc(i)}</span></li>`).join('')}</ul>`;

export const button = (label, url, kind = 'primary', arrow = false) =>
  `<a class="btn btn-${kind}" href="${esc(url)}">${esc(label)}${arrow ? icon('arrow') : ''}</a>`;

export const breadcrumbs = (trail) =>
  `<nav class="crumbs" aria-label="Breadcrumb"><ol>${trail
    .map((t, i) => (i === trail.length - 1 ? `<li aria-current="page">${esc(t.label)}</li>` : `<li><a href="${t.url}">${esc(t.label)}</a></li>`))
    .join('')}</ol></nav>`;

export const faqSection = (faqs = [], heading = 'Frequently asked questions') =>
  faqs.length
    ? `<section class="section faq" id="faq"><div class="wrap narrow"><h2>${esc(heading)}</h2>${faqs
        .map((f) => `<details><summary>${esc(f.q)}${icon('chevron')}</summary><div class="ans">${md(f.a)}</div></details>`)
        .join('')}</div></section>`
    : '';

export const ctaBand = ({ heading, text, primary, secondary } = {}) => {
  const s = ctx.site;
  return `<section class="cta-band"><div class="wrap cta-inner"><div><h2>${esc(heading || 'Let us run your finance function, so you always have certainty.')}</h2><p>${esc(
    text || 'Book a 30-minute discovery call. We learn your business and registrations, then send a scoped proposal within 2 working days.'
  )}</p></div><div class="cta-actions">${button((primary && primary.label) || s.headerCtaLabel, (primary && primary.url) || '/contact/', 'brass', true)}${
    secondary !== false ? button((secondary && secondary.label) || 'See our plans', (secondary && secondary.url) || '/plans/', 'ghost-light') : ''
  }</div></div></section>`;
};

export const serviceCard = (svc, { showKids = false } = {}) => {
  const kids = showKids ? ctx.childrenOf(svc.slug) : [];
  return `<article class="card svc-card"><a class="card-link" href="/services/${svc.slug}/"><span class="ico-tile">${icon(svc.icon || 'check')}</span><h3>${esc(svc.title)}</h3><p>${esc(svc.summary)}</p></a>${
    kids.length ? `<ul class="kids">${kids.map((k) => `<li><a href="/services/${k.slug}/">${esc(k.navLabel || k.title)}</a></li>`).join('')}</ul>` : ''
  }<a class="more" href="/services/${svc.slug}/">Learn more ${icon('arrow')}</a></article>`;
};

export const marketTags = (markets = []) =>
  markets.length ? `<ul class="tags">${markets.map((m) => `<li>${esc(MARKET_LABEL[m] || m)}</li>`).join('')}</ul>` : '';

export const pageHero = ({ trail, eyebrowText, h1, intro, actions = '', tags = '', aside = '' }) => `
<section class="page-hero dots"><div class="wrap hero-grid ${aside ? 'has-aside' : ''}"><div class="hero-copy">${trail ? breadcrumbs(trail) : ''}${eyebrow(eyebrowText, 'on-dark')}<h1>${esc(h1)}</h1><p class="lead">${esc(intro || '')}</p>${tags}<div class="actions">${actions}</div></div>${aside}</div></section>`;

// ---------- Layout ----------
const megaServices = () => `
<div class="mega" id="menu-services"><div class="wrap mega-grid">
${ctx.parents
  .map(
    (p) => `<div class="mega-col"><a class="mega-head" href="/services/${p.slug}/">${icon(p.icon)}<span>${esc(p.navLabel || p.title)}</span></a><ul>${ctx
      .childrenOf(p.slug)
      .map((c) => `<li><a href="/services/${c.slug}/">${esc(c.navLabel || c.title)}</a></li>`)
      .join('')}</ul></div>`
  )
  .join('')}
<div class="mega-col mega-promo"><p class="mega-promo-t">Not sure what you need?</p><p>Tell us about your business and we will recommend a plan.</p><a class="btn btn-brass" href="/contact/">Book a free call</a><a class="mega-all" href="/services/">View all services ${icon('arrow')}</a></div>
</div></div>`;

const megaList = (id, items, allLink) => `
<div class="mega mega-small" id="${id}"><div class="wrap"><ul class="mega-simple">${items
  .map((i) => `<li><a href="${i.url}"><strong>${esc(i.label)}</strong><span>${esc(i.text || '')}</span></a></li>`)
  .join('')}</ul>${allLink ? `<a class="mega-all" href="${allLink.url}">${esc(allLink.label)} ${icon('arrow')}</a>` : ''}</div></div>`;

const header = (path) => {
  const s = ctx.site;
  const items = ctx.nav.main
    .map((n, idx) => {
      const id = `menu-${idx}`;
      let menu = '';
      if (n.menu === 'services') menu = megaServices();
      if (n.menu === 'markets')
        menu = megaList(id, ctx.markets.map((m) => ({ url: `/${m.slug}/`, label: m.navLabel || m.title, text: m.menuText })), null);
      if (n.menu === 'solutions')
        menu = megaList(id, ctx.solutions.map((m) => ({ url: `/solutions/${m.slug}/`, label: m.navLabel || m.title, text: m.menuText })), { url: '/solutions/', label: 'All solutions' });
      if (menu) {
        const mid = n.menu === 'services' ? 'menu-services' : id;
        menu = menu.replace(/id="menu-[a-z0-9]+"/, `id="${mid}"`);
        return `<li class="has-menu"><button type="button" aria-expanded="false" aria-controls="${mid}">${esc(n.label)}${icon('chevron')}</button>${menu}</li>`;
      }
      const cur = path === n.url || (n.url !== '/' && path.startsWith(n.url)) ? ' aria-current="page"' : '';
      return `<li><a href="${n.url}"${cur}>${esc(n.label)}</a></li>`;
    })
    .join('');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header" id="top"><div class="wrap bar">
<a class="brand" href="/" aria-label="${esc(s.name)} home"><img src="/assets/img/yaqeen-horizontal.svg" alt="${esc(s.name)}" width="150" height="52"></a>
<nav class="primary" id="primary-nav" aria-label="Primary"><ul>${items}</ul><div class="nav-cta-m"><a class="btn btn-brass" href="${esc(s.headerCtaUrl)}">${esc(s.headerCtaLabel)}</a></div></nav>
<a class="btn btn-brass hdr-cta" href="${esc(s.headerCtaUrl)}">${esc(s.headerCtaLabel)}</a>
<button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">${icon('menu', 'm-open')}${icon('close', 'm-close')}</button>
</div></header>`;
};

const footer = () => {
  const s = ctx.site;
  const soc = s.social || {};
  const contact = [
    s.email ? `<li>${icon('mail')}<a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li>` : '',
    s.phone ? `<li>${icon('phone')}<a href="tel:${esc(s.phone.replace(/\s+/g, ''))}">${esc(s.phone)}</a></li>` : '',
    s.whatsapp ? `<li>${icon('whatsapp')}<a href="https://wa.me/${esc(s.whatsapp.replace(/\D/g, ''))}" rel="noopener">WhatsApp us</a></li>` : '',
    s.address && s.address.city ? `<li>${icon('pin')}<span>${esc([s.address.line, s.address.city, s.address.region, s.address.country].filter(Boolean).join(', '))}</span></li>` : '',
    soc.linkedin ? `<li>${icon('linkedin')}<a href="${esc(soc.linkedin)}" rel="noopener me">LinkedIn</a></li>` : '',
  ].join('');
  return `<footer class="site-footer"><div class="wrap">
<div class="foot-grid">
<div class="foot-brand"><a href="/" aria-label="${esc(s.name)} home"><img src="/assets/img/yaqeen-horizontal-reversed.svg" alt="${esc(s.name)}" width="170" height="60" loading="lazy"></a><p>${esc(s.footerAbout)}</p><ul class="contact-list">${contact}</ul></div>
<div><h3>Services</h3><ul>${ctx.parents.map((p) => `<li><a href="/services/${p.slug}/">${esc(p.navLabel || p.title)}</a></li>`).join('')}<li><a href="/services/">All services</a></li></ul></div>
<div><h3>Markets</h3><ul>${ctx.markets.map((m) => `<li><a href="/${m.slug}/">${esc(m.navLabel || m.title)}</a></li>`).join('')}</ul><h3 class="mt">Who we serve</h3><ul>${ctx.solutions.map((m) => `<li><a href="/solutions/${m.slug}/">${esc(m.navLabel || m.title)}</a></li>`).join('')}</ul></div>
<div><h3>Company</h3><ul><li><a href="/about/">About us</a></li><li><a href="/how-we-work/">How we work</a></li><li><a href="/plans/">Plans</a></li><li><a href="/partners/">Partner programme</a></li><li><a href="/insights/">Insights</a></li><li><a href="/contact/">Contact</a></li><li><a href="/sitemap/">Sitemap</a></li></ul></div>
</div>
<p class="disclaimer">${esc(s.disclaimer)}</p>
<div class="foot-bottom"><span>&copy; ${new Date().getFullYear()} ${esc(s.legalName || s.name)}. All rights reserved.</span><span><a href="/privacy-policy/">Privacy policy</a> &middot; <a href="/terms/">Terms of use</a></span></div>
</div></footer>`;
};

export const layout = ({ title, description, path, ogImage, jsonld = [], body, noindex = false, bodyClass = '', type = 'website', published, modified }) => {
  const s = ctx.site;
  const fullTitle = path === '/' ? title : `${title} | ${s.name}`;
  const url = abs(path);
  const img = abs(ogImage || '/assets/img/og-default.png');
  const ld = [orgJsonLd(), ...jsonld].filter(Boolean);
  const ga = s.analyticsId
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(s.analyticsId)}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(s.analyticsId)}');</script>`
    : '';
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
${s.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(s.googleSiteVerification)}">` : ''}
${s.bingSiteVerification ? `<meta name="msvalidate.01" content="${esc(s.bingSiteVerification)}">` : ''}
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${esc(s.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
${published ? `<meta property="article:published_time" content="${published}">` : ''}${modified ? `<meta property="article:modified_time" content="${modified}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${img}">
<meta name="theme-color" content="#0F3D3E">
<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="${esc(s.name)} insights" href="/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/css/site.css?v=${ctx.assetV}">
${ld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
${ga}
</head>
<body class="${bodyClass}">
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/site.js?v=${ctx.assetV}" defer></script>
</body></html>`;
};
