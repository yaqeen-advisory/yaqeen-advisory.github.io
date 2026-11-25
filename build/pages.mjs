// Builds every page type from the content files.
import { esc, md, icon, stripHtml } from './lib.mjs';
import {
  ctx, layout, abs, eyebrow, checks, button, breadcrumbs, faqSection, ctaBand, serviceCard,
  marketTags, pageHero, crumbsJsonLd, faqJsonLd, TIERS, MARKET_LABEL,
} from './render.mjs';

const meta = (o, fallbackTitle, fallbackDesc) => ({
  title: (o && o.title) || fallbackTitle,
  description: (o && o.description) || fallbackDesc,
});

const sectionHead = (eb, h, text, center = false) =>
  `<div class="sec-head ${center ? 'center' : ''}">${eyebrow(eb)}<h2>${esc(h)}</h2>${text ? `<p class="sec-lead">${esc(text)}</p>` : ''}</div>`;

const tierPill = (id) => `<span class="pill ${TIERS[id].cls}">${TIERS[id].name}</span>`;

const callout = (text, kind = '') => (text ? `<div class="callout ${kind}"><p>${esc(text)}</p></div>` : '');

const stepsRow = (items) =>
  `<ol class="steps">${items.map((s, i) => `<li><span class="num">${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol>`;

const PROJECT_STEPS = [
  { title: 'Scope call', text: 'We map your process and agree the outcome.' },
  { title: 'Fixed-fee proposal', text: 'One price, one scope and a delivery date.' },
  { title: 'Build and weekly updates', text: 'You see progress every week, not only at the end.' },
  { title: 'Handover and training', text: 'Documentation, training and a support window.' },
];

const cardsGrid = (items, cls = '') =>
  `<div class="grid ${cls}">${items
    .map((c) => `<div class="card info-card">${c.icon ? `<span class="ico-tile">${icon(c.icon)}</span>` : ''}<h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></div>`)
    .join('')}</div>`;

// ---------------------------------------------------------------- HOME
const misCard = () => `
<div class="hero-visual" role="img" aria-label="Illustration of a monthly management report with revenue, margin and cash position">
<div class="mis-card" aria-hidden="true">
<div class="mis-head"><strong>Monthly MIS</strong><span class="live"><i></i>Live</span></div>
<div class="kpis">
<div class="kpi"><small>Revenue</small><svg viewBox="0 0 100 30"><polyline points="2,25 18,19 34,22 52,12 70,14 98,5"/></svg></div>
<div class="kpi"><small>Gross margin</small><svg viewBox="0 0 100 30"><polyline points="2,16 20,18 38,13 56,15 76,11 98,12"/></svg></div>
<div class="kpi"><small>Cash position</small><svg viewBox="0 0 100 30" class="brass"><polyline points="2,22 20,23 38,18 56,20 76,12 98,8"/></svg></div>
</div>
<div class="bars"><small>Revenue and cost by month</small>
<svg viewBox="0 0 240 80" preserveAspectRatio="none">${[
    [30, 22], [38, 24], [26, 20], [44, 28], [50, 30], [40, 26], [56, 32], [62, 34],
  ].map(([t, b], i) => `<rect x="${12 + i * 28}" y="${76 - t - b}" width="14" height="${t}" rx="2" fill="#0F3D3E"/><rect x="${12 + i * 28}" y="${76 - b}" width="14" height="${b}" rx="2" fill="#B98B3E"/>`).join('')}</svg></div>
<ul class="ticks"><li>${icon('check')}Books closed and reconciled</li><li>${icon('check')}Filings submitted before due dates</li></ul>
</div>
<div class="toast" aria-hidden="true"><span>${icon('check')}</span><div><strong>Your monthly MIS is ready</strong><small>Tap to open the dashboard, or read the one-page summary.</small></div></div>
</div>`;

export const homePage = (h) => {
  const site = ctx.site;
  const m = meta(h.meta, `${site.name}: accounting, tax and finance advisory for India and the GCC`, site.description);
  const hero = `
<section class="home-hero dots"><div class="wrap hero-grid has-aside"><div class="hero-copy">
${eyebrow(h.hero.eyebrow, 'on-dark')}
<h1>${esc(h.hero.heading)}</h1>
<p class="lead">${esc(h.hero.text)}</p>
<div class="actions">${button(h.hero.primaryLabel, h.hero.primaryUrl, 'brass', true)}${button(h.hero.secondaryLabel, h.hero.secondaryUrl, 'ghost-light')}</div>
<ul class="tags">${(h.hero.markets || []).map((x) => `<li><a href="${esc(x.url)}">${esc(x.label)}</a></li>`).join('')}</ul>
</div>${misCard()}</div></section>`;

  const vp = `<section class="valueprops"><div class="wrap"><div class="grid g4">${h.valueProps
    .map((v) => `<div class="vp"><span class="ico-tile">${icon(v.icon)}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div>`)
    .join('')}</div></div></section>`;

  const why = `<section class="section"><div class="wrap">
${sectionHead(h.why.eyebrow, h.why.heading, h.why.text)}
<div class="grid g2 callouts">
<div class="panel dark"><h3>${esc(h.why.ai.title)}</h3><p>${esc(h.why.ai.text)}</p></div>
<div class="panel sand"><h3>${esc(h.why.built.title)}</h3><p>${esc(h.why.built.text)}</p></div></div></div></section>`;

  const services = `<section class="section alt" id="services"><div class="wrap">
${sectionHead(h.servicesIntro.eyebrow, h.servicesIntro.heading, h.servicesIntro.text)}
<div class="grid g3">${ctx.parents.map((p) => serviceCard(p, { showKids: true })).join('')}</div>
<p class="center-link">${button('View all services', '/services/', 'primary', true)}</p></div></section>`;

  const markets = `<section class="section"><div class="wrap">
${sectionHead(h.marketsIntro.eyebrow, h.marketsIntro.heading, h.marketsIntro.text)}
<div class="grid g3">${ctx.markets
    .filter((x) => x.slug !== 'gcc')
    .map((x) => `<a class="card market-card" href="/${x.slug}/"><span class="mk-label">${esc(x.navLabel || x.title)}</span><p>${esc(x.summary)}</p><span class="more">Explore ${icon('arrow')}</span></a>`)
    .join('')}</div></div></section>`;

  const how = `<section class="section dark dots"><div class="wrap">
${sectionHead(h.steps.eyebrow, h.steps.heading, h.steps.text)}
${stepsRow(h.steps.items)}
<div class="rhythm"><h3>${esc(h.rhythm.heading)}</h3><div class="month">${h.rhythm.steps.map((s) => `<div><strong>${esc(s.label)}</strong><span>${esc(s.text)}</span></div>`).join('')}</div></div>
<p class="center-link">${button('See how we work', '/how-we-work/', 'brass', true)}</p></div></section>`;

  const plans = ctx.pages.plans;
  const tiers = `<section class="section"><div class="wrap">
${sectionHead(h.plansTeaser.eyebrow, h.plansTeaser.heading, h.plansTeaser.text)}
<div class="grid g3 tiers">${plans.tiers
    .map(
      (t) => `<div class="card tier ${t.id === 'growth' ? 'featured' : ''}">${tierPill(t.id)}<h3>${esc(t.name)}</h3><p class="tier-tag">${esc(t.tagline)}</p><p class="mini">Best for</p><p>${esc(t.bestFor)}</p>${checks(t.features.slice(0, 5))}<p class="outcome">${esc(t.outcome)}</p></div>`
    )
    .join('')}</div>
<p class="center-link">${button('Compare plans in detail', '/plans/', 'primary', true)}</p></div></section>`;

  const who = `<section class="section alt"><div class="wrap">
${sectionHead(h.solutionsIntro.eyebrow, h.solutionsIntro.heading, h.solutionsIntro.text)}
<div class="grid g3 sol-grid">${ctx.solutions
    .map((s) => `<a class="card sol-card" href="/solutions/${s.slug}/"><span class="ico-tile">${icon(s.icon)}</span><h3>${esc(s.navLabel || s.title)}</h3><p>${esc(s.summary)}</p><span class="more">Learn more ${icon('arrow')}</span></a>`)
    .join('')}</div></div></section>`;

  const trust = `<section class="section"><div class="wrap grid g2 trust">
<div>${sectionHead(h.trust.eyebrow, h.trust.heading, h.trust.text)}<div class="grid g2 compact">${h.trust.stack
    .map((s) => `<div class="card mini-card"><span class="ico-tile sm">${icon(s.icon)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`)
    .join('')}</div></div>
<div class="card protect"><h3>${esc(h.trust.protectHeading)}</h3>${checks(h.trust.protect)}</div></div></section>`;

  const latest = ctx.insights.slice(0, 3);
  const insights = latest.length
    ? `<section class="section alt"><div class="wrap">${sectionHead('Insights', 'Practical notes on finance, tax and reporting', 'Short, plain-language reads for owners and finance leads.')}<div class="grid g3">${latest.map(insightCard).join('')}</div><p class="center-link">${button('All insights', '/insights/', 'primary', true)}</p></div></section>`
    : '';

  const body = hero + vp + why + services + markets + how + tiers + who + trust + insights + faqSection(h.faqs) + ctaBand(h.cta);
  return {
    path: '/',
    html: layout({
      title: m.title,
      description: m.description,
      path: '/',
      bodyClass: 'home',
      body,
      jsonld: [
        { '@context': 'https://schema.org', '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: site.name, publisher: { '@id': abs('/#organization') } },
        h.faqs && h.faqs.length ? faqJsonLd(h.faqs) : null,
      ],
    }),
  };
};

// ---------------------------------------------------------------- SERVICES
export const servicesHub = (p) => {
  const m = meta(p.meta, 'Accounting, tax, payroll and finance advisory services', '');
  const trail = [{ label: 'Home', url: '/' }, { label: 'Services', url: '/services/' }];
  const body = `${pageHero({ trail, eyebrowText: p.hero.eyebrow, h1: p.hero.heading, intro: p.hero.text, actions: button('Book a free call', '/contact/', 'brass', true) + button('Compare plans', '/plans/', 'ghost-light') })}
<section class="section"><div class="wrap">
${ctx.parents
  .map((par) => {
    const kids = ctx.childrenOf(par.slug);
    return `<div class="svc-group"><div class="svc-group-head"><span class="ico-tile">${icon(par.icon)}</span><div><h2><a href="/services/${par.slug}/">${esc(par.title)}</a></h2><p>${esc(par.summary)}</p></div></div>
<div class="grid g3 slim">${kids.map((k) => `<a class="card slim-card" href="/services/${k.slug}/"><h3>${esc(k.navLabel || k.title)}</h3><p>${esc(k.summary)}</p><span class="more">Learn more ${icon('arrow')}</span></a>`).join('')}</div></div>`;
  })
  .join('')}
</div></section>
<section class="section alt"><div class="wrap narrow">${sectionHead(p.layers.eyebrow, p.layers.heading, p.layers.text)}
${cardsGrid(p.layers.items.map((x) => ({ title: x.title, text: x.text })), 'g3')}</div></section>
${ctaBand(p.cta)}`;
  return { path: '/services/', html: layout({ title: m.title, description: m.description, path: '/services/', body, jsonld: [crumbsJsonLd(trail)] }) };
};

export const servicePage = (s) => {
  const parent = s.parent ? ctx.services.find((x) => x.slug === s.parent) : null;
  const kids = ctx.childrenOf(s.slug);
  const siblings = parent ? ctx.childrenOf(parent.slug).filter((x) => x.slug !== s.slug) : [];
  const trail = [{ label: 'Home', url: '/' }, { label: 'Services', url: '/services/' }];
  if (parent) trail.push({ label: parent.navLabel || parent.title, url: `/services/${parent.slug}/` });
  trail.push({ label: s.navLabel || s.title, url: `/services/${s.slug}/` });
  const url = `/services/${s.slug}/`;
  const kindLabel = { subscription: 'Monthly subscription', project: 'Fixed-fee project', both: 'Subscription or fixed-fee project' }[s.kind] || 'Monthly subscription';
  const glance = `<aside class="glance card"><h2>At a glance</h2><dl>
<dt>Where</dt><dd>${(s.markets || []).map((x) => MARKET_LABEL[x] || x).join(', ') || 'India and the GCC'}</dd>
<dt>How it is delivered</dt><dd>${esc(kindLabel)}</dd>
${s.duration ? `<dt>Timeline</dt><dd>${esc(s.duration)}</dd>` : ''}
<dt>Your contact</dt><dd>A named accountant, with a WhatsApp group</dd></dl></aside>`;

  const byPlan = s.byPlan && (s.byPlan.foundation || s.byPlan.growth || s.byPlan.cfo)
    ? `<section class="blk"><h2>How it changes by plan</h2><p class="muted">The same engine runs under every plan. What changes is how much analysis and advice sits on top.</p><div class="tier-rows">${['foundation', 'growth', 'cfo']
        .filter((t) => s.byPlan[t])
        .map((t) => `<div class="tier-row">${tierPill(t)}<p>${esc(s.byPlan[t])}</p></div>`)
        .join('')}</div><p><a class="more" href="/plans/">Compare all plans ${icon('arrow')}</a></p></section>`
    : '';

  const main = `
${s.overview ? `<section class="blk prose">${md(s.overview)}</section>` : ''}
${kids.length ? `<section class="blk"><h2>Services in this area</h2><div class="grid g2 slim">${kids.map((k) => `<a class="card slim-card" href="/services/${k.slug}/"><h3>${esc(k.navLabel || k.title)}</h3><p>${esc(k.summary)}</p><span class="more">Learn more ${icon('arrow')}</span></a>`).join('')}</div></section>` : ''}
${s.whatWeDo && s.whatWeDo.length ? `<section class="blk"><h2>What we do</h2>${checks(s.whatWeDo, 'two-col')}</section>` : ''}
${s.whoFor && s.whoFor.length ? `<section class="blk"><h2>Who this is for</h2>${checks(s.whoFor)}</section>` : ''}
${byPlan}
${s.kind === 'project' || s.kind === 'both' ? `<section class="blk"><h2>How a project runs</h2>${stepsRow(PROJECT_STEPS)}</section>` : ''}
${callout(s.note, 'sand')}
${s.body ? `<section class="blk prose">${md(s.body)}</section>` : ''}`;

  const related = (s.related || []).map((r) => ctx.services.find((x) => x.slug === r)).filter(Boolean);
  const aside = `<div class="side"><div class="card side-cta"><h2>Talk to us about ${esc(s.navLabel || s.title)}</h2><p>30 minutes. We learn your business and send a scoped proposal within 2 working days.</p>${button('Book a free call', `/contact/?service=${encodeURIComponent(s.slug)}`, 'brass', true)}</div>
${siblings.length ? `<div class="card side-list"><h3>More in ${esc(parent.navLabel || parent.title)}</h3><ul>${siblings.map((x) => `<li><a href="/services/${x.slug}/">${esc(x.navLabel || x.title)}</a></li>`).join('')}</ul></div>` : ''}
${related.length ? `<div class="card side-list"><h3>Related services</h3><ul>${related.map((x) => `<li><a href="/services/${x.slug}/">${esc(x.navLabel || x.title)}</a></li>`).join('')}</ul></div>` : ''}</div>`;

  const body = `${pageHero({ trail, eyebrowText: parent ? parent.navLabel || parent.title : 'Service', h1: s.title, intro: s.heroIntro || s.summary, tags: marketTags(s.markets), actions: button('Book a free call', `/contact/?service=${encodeURIComponent(s.slug)}`, 'brass', true) + button('Compare plans', '/plans/', 'ghost-light'), aside: glance })}
<section class="section"><div class="wrap two-col"><div class="main-col">${main}</div>${aside}</div></section>
${faqSection(s.faqs, `${s.navLabel || s.title}: common questions`)}
${ctaBand()}`;
  const areaServed = (s.markets && s.markets.length ? s.markets : ['india', 'uae', 'saudi-arabia']).map((x) => ({ '@type': 'Country', name: { india: 'India', uae: 'United Arab Emirates', 'saudi-arabia': 'Saudi Arabia' }[x] || x }));
  return {
    path: url,
    html: layout({
      title: s.metaTitle || s.title,
      description: s.metaDescription || s.summary,
      path: url,
      body,
      jsonld: [
        crumbsJsonLd(trail),
        { '@context': 'https://schema.org', '@type': 'Service', '@id': abs(url + '#service'), name: s.title, serviceType: s.title, description: s.metaDescription || s.summary, url: abs(url), provider: { '@id': abs('/#organization') }, areaServed },
        s.faqs && s.faqs.length ? faqJsonLd(s.faqs) : null,
      ],
    }),
  };
};

// ---------------------------------------------------------------- MARKETS
export const marketPage = (mk) => {
  const url = `/${mk.slug}/`;
  const trail = [{ label: 'Home', url: '/' }, { label: mk.navLabel || mk.title, url }];
  const svcs = (mk.services || []).map((s) => ctx.services.find((x) => x.slug === s)).filter(Boolean);
  const body = `${pageHero({ trail, eyebrowText: mk.eyebrow, h1: mk.heroHeading, intro: mk.heroIntro, tags: `<ul class="tags">${(mk.pills || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`, actions: button('Book a free call', '/contact/', 'brass', true) + button('Compare plans', '/plans/', 'ghost-light') })}
<section class="section"><div class="wrap two-col"><div class="main-col"><section class="blk prose">${md(mk.overview)}</section>
${mk.howWeServe && mk.howWeServe.length ? `<section class="blk"><h2>${esc(mk.howHeading || 'How we serve you')}</h2>${checks(mk.howWeServe)}</section>` : ''}
${mk.highlights && mk.highlights.length ? `<section class="blk"><h2>${esc(mk.highlightsHeading || 'What is covered')}</h2>${cardsGrid(mk.highlights, 'g2')}</section>` : ''}
${callout(mk.note, 'sand')}</div>
<div class="side"><div class="card side-cta"><h2>Talk to us about ${esc(mk.navLabel || mk.title)}</h2><p>30 minutes. We learn your business and send a scoped proposal within 2 working days.</p>${button('Book a free call', '/contact/', 'brass', true)}</div></div></div></section>
<section class="section alt"><div class="wrap">${sectionHead('Services', `Services for ${mk.navLabel || mk.title}`, 'Every service has its own page with scope, plans and answers to common questions.')}<div class="grid g3">${svcs.map((s) => serviceCard(s)).join('')}</div></div></section>
${faqSection(mk.faqs, `${mk.navLabel || mk.title}: common questions`)}
${ctaBand()}`;
  return {
    path: url,
    html: layout({
      title: mk.metaTitle || mk.title,
      description: mk.metaDescription || mk.summary,
      path: url,
      body,
      jsonld: [crumbsJsonLd(trail), mk.faqs && mk.faqs.length ? faqJsonLd(mk.faqs) : null],
    }),
  };
};

// ---------------------------------------------------------------- SOLUTIONS
export const solutionsHub = (p) => {
  const m = meta(p.meta, 'Finance support for startups, SMEs and established companies', '');
  const trail = [{ label: 'Home', url: '/' }, { label: 'Who we serve', url: '/solutions/' }];
  const body = `${pageHero({ trail, eyebrowText: p.hero.eyebrow, h1: p.hero.heading, intro: p.hero.text, actions: button('Book a free call', '/contact/', 'brass', true) })}
<section class="section"><div class="wrap"><div class="grid g3 sol-grid">${ctx.solutions
    .map((s) => `<a class="card sol-card" href="/solutions/${s.slug}/"><span class="ico-tile">${icon(s.icon)}</span><h3>${esc(s.navLabel || s.title)}</h3><p>${esc(s.summary)}</p><span class="more">Learn more ${icon('arrow')}</span></a>`)
    .join('')}</div></div></section>${ctaBand()}`;
  return { path: '/solutions/', html: layout({ title: m.title, description: m.description, path: '/solutions/', body, jsonld: [crumbsJsonLd(trail)] }) };
};

export const solutionPage = (s) => {
  const url = `/solutions/${s.slug}/`;
  const trail = [{ label: 'Home', url: '/' }, { label: 'Who we serve', url: '/solutions/' }, { label: s.navLabel || s.title, url }];
  const svcs = (s.services || []).map((x) => ctx.services.find((y) => y.slug === x)).filter(Boolean);
  const tier = ctx.pages.plans.tiers.find((t) => t.id === s.recommendedPlan);
  const body = `${pageHero({ trail, eyebrowText: s.eyebrow, h1: s.heroHeading, intro: s.heroIntro, actions: button('Book a free call', '/contact/', 'brass', true) + button('Compare plans', '/plans/', 'ghost-light') })}
<section class="section"><div class="wrap">${sectionHead('Where finance gets hard', s.challengesHeading || 'Common challenges we help with')}${cardsGrid(s.challenges, 'g3')}</div></section>
<section class="section alt"><div class="wrap">${sectionHead('How we help', s.helpHeading || 'What working with us looks like')}<div class="grid g2">${s.howWeHelp
    .map((h) => `<div class="card info-card"><h3>${esc(h.title)}</h3><p>${esc(h.text)}</p>${h.link ? `<a class="more" href="${esc(h.link)}">${esc(h.linkLabel || 'Learn more')} ${icon('arrow')}</a>` : ''}</div>`)
    .join('')}</div></div></section>
${tier ? `<section class="section"><div class="wrap narrow"><div class="card tier featured wide">${tierPill(tier.id)}<h2>${esc(s.planHeading || `A good starting point: the ${tier.name} plan`)}</h2><p>${esc(s.planText || tier.bestFor)}</p>${checks(tier.features)}<p>${button('Compare all plans', '/plans/', 'primary', true)}</p></div></div></section>` : ''}
<section class="section alt"><div class="wrap">${sectionHead('Services', 'Services most clients in this group use')}<div class="grid g3">${svcs.map((x) => serviceCard(x)).join('')}</div></div></section>
${faqSection(s.faqs, `${s.navLabel || s.title}: common questions`)}
${ctaBand()}`;
  return {
    path: url,
    html: layout({ title: s.metaTitle || s.title, description: s.metaDescription || s.summary, path: url, body, jsonld: [crumbsJsonLd(trail), s.faqs && s.faqs.length ? faqJsonLd(s.faqs) : null] }),
  };
};

// ---------------------------------------------------------------- PLANS
const cell = (v) => {
  if (v === true || String(v).toLowerCase() === 'yes') return `<span class="yes" aria-label="Included">${icon('check')}</span>`;
  if (!v || String(v).toLowerCase() === 'no') return `<span class="no" aria-label="Not included">&ndash;</span>`;
  return `<span class="val">${esc(v)}</span>`;
};

const planTable = (t, id) => `<div class="table-wrap" id="${id}" role="region" aria-label="${esc(t.label)} plan comparison" tabindex="0"><table class="compare"><thead><tr><th scope="col"><span class="sr">Feature</span></th><th scope="col">${tierPill('foundation')}</th><th scope="col">${tierPill('growth')}</th><th scope="col">${tierPill('cfo')}</th></tr></thead>
<tbody><tr class="fee"><th scope="row">${esc(t.feeLabel)}</th><td colspan="3">Quoted after your discovery call, based on monthly transaction volume</td></tr>
${t.groups
  .map(
    (g) => `<tr class="grp"><th scope="colgroup" colspan="4">${esc(g.title)}</th></tr>${g.rows
      .map((r) => `<tr><th scope="row">${r.market ? `<span class="mkt">${esc(r.market)}</span>` : ''}${esc(r.label)}</th><td>${cell(r.foundation)}</td><td>${cell(r.growth)}</td><td>${cell(r.cfo)}</td></tr>`)
      .join('')}`
  )
  .join('')}</tbody></table></div>`;

export const plansPage = (p) => {
  const m = meta(p.meta, 'Plans', '');
  const trail = [{ label: 'Home', url: '/' }, { label: 'Plans', url: '/plans/' }];
  const body = `${pageHero({ trail, eyebrowText: p.hero.eyebrow, h1: p.hero.heading, intro: p.hero.text, actions: button('Get a scoped proposal', '/contact/', 'brass', true) })}
<section class="section"><div class="wrap">${sectionHead(p.layers.eyebrow, p.layers.heading, p.layers.text)}
<div class="grid g3 layers">${p.layers.items.map((l, i) => `<div class="card layer"><span class="big-n">0${i + 1}</span><h3>${esc(l.title)}</h3><p class="mini">${esc(l.cadence)}</p><p>${esc(l.text)}</p><p class="priced">${esc(l.pricing)}</p></div>`).join('')}</div>
<h3 class="mt-l">What moves the price</h3><div class="grid g4 compact">${p.priceDrivers.map((d) => `<div class="card mini-card"><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p></div>`).join('')}</div>
${callout(p.layers.note, 'dark')}</div></section>
<section class="section alt"><div class="wrap">${sectionHead('Core subscriptions', p.tiersHeading, p.tiersText)}
<div class="grid g3 tiers">${p.tiers.map((t) => `<div class="card tier ${t.id === 'growth' ? 'featured' : ''}">${tierPill(t.id)}<h3>${esc(t.name)}</h3><p class="tier-tag">${esc(t.tagline)}</p><p class="mini">Best for</p><p>${esc(t.bestFor)}</p><p class="mini">What you get</p>${checks(t.features)}<p class="outcome">${esc(t.outcome)}</p></div>`).join('')}</div></div></section>
<section class="section" id="compare"><div class="wrap">${sectionHead('Compare tiers', p.compareHeading, p.compareText)}
<div class="tabs" role="tablist" aria-label="Choose a market"><button role="tab" aria-selected="true" aria-controls="tbl-india" id="tab-india" type="button">India</button><button role="tab" aria-selected="false" aria-controls="tbl-gcc" id="tab-gcc" type="button">UAE and Saudi Arabia</button></div>
<div class="tabpanels">${planTable(p.india, 'tbl-india')}${planTable(p.gcc, 'tbl-gcc')}</div>
<p class="muted small">A tick means included. Filings are scoped at onboarding to what applies to your registrations.</p></div></section>
<section class="section alt"><div class="wrap">${sectionHead('Add-on modules', p.addonsHeading, p.addonsText)}
<div class="table-wrap" role="region" aria-label="Add-on modules" tabindex="0"><table class="addons"><thead><tr><th scope="col">Module</th><th scope="col">What you get</th><th scope="col">Priced by</th><th scope="col">Works with</th></tr></thead><tbody>${p.addons
    .map((a) => `<tr><th scope="row"><span class="ico-tile sm">${icon(a.icon)}</span>${esc(a.name)}</th><td>${esc(a.text)}</td><td>${esc(a.pricedBy)}</td><td><span class="chip">${esc(a.worksWith)}</span></td></tr>`)
    .join('')}</tbody></table></div></div></section>
${faqSection(p.faqs)}${ctaBand(p.cta)}`;
  return { path: '/plans/', html: layout({ title: m.title, description: m.description, path: '/plans/', body, jsonld: [crumbsJsonLd(trail), p.faqs && p.faqs.length ? faqJsonLd(p.faqs) : null] }) };
};

// ---------------------------------------------------------------- HOW WE WORK
export const howPage = (p) => {
  const m = meta(p.meta, 'How we work', '');
  const trail = [{ label: 'Home', url: '/' }, { label: 'How we work', url: '/how-we-work/' }];
  const body = `${pageHero({ trail, eyebrowText: p.hero.eyebrow, h1: p.hero.heading, intro: p.hero.text, actions: button('Book a free call', '/contact/', 'brass', true) })}
<section class="section"><div class="wrap">${sectionHead('The rhythm', p.rhythmHeading, p.rhythmText)}
<div class="timeline">${p.stages.map((s) => `<div class="card stage"><span class="ico-tile">${icon(s.icon)}</span><h3>${esc(s.title)}</h3><p class="mini">${esc(s.when)}</p>${checks(s.items)}</div>`).join('')}</div>
<div class="rhythm light"><h3>Your month at a glance</h3><div class="month">${p.month.map((s) => `<div><strong>${esc(s.label)}</strong><span>${esc(s.text)}</span></div>`).join('')}</div></div></div></section>
<section class="section alt"><div class="wrap grid g2 trust"><div>${sectionHead('Tools', p.toolsHeading, p.toolsText)}<div class="grid g2 compact">${p.stack.map((s) => `<div class="card mini-card"><span class="ico-tile sm">${icon(s.icon)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div></div>
<div class="card protect"><h3>How we protect your business</h3>${checks(p.protect)}</div></div></section>
<section class="section"><div class="wrap">${sectionHead('Scope and terms', p.scopeHeading, p.scopeText)}${cardsGrid(p.scope, 'g4')}</div></section>
${faqSection(p.faqs)}${ctaBand()}`;
  return { path: '/how-we-work/', html: layout({ title: m.title, description: m.description, path: '/how-we-work/', body, jsonld: [crumbsJsonLd(trail), p.faqs && p.faqs.length ? faqJsonLd(p.faqs) : null] }) };
};

// ---------------------------------------------------------------- ABOUT
export const aboutPage = (p) => {
  const m = meta(p.meta, 'About', '');
  const trail = [{ label: 'Home', url: '/' }, { label: 'About', url: '/about/' }];
  const team = p.team && p.team.members && p.team.members.length
    ? `<section class="section alt"><div class="wrap">${sectionHead('Our team', p.team.heading, p.team.text)}<div class="grid g3">${p.team.members
        .map((t) => `<div class="card person">${t.photo ? `<img src="${esc(t.photo)}" alt="${esc(t.name)}" loading="lazy" width="240" height="240">` : `<span class="avatar">${esc((t.name || '?').charAt(0))}</span>`}<h3>${esc(t.name)}</h3><p class="mini">${esc(t.role)}</p><p>${esc(t.bio)}</p></div>`)
        .join('')}</div></div></section>`
    : '';
  const body = `${pageHero({ trail, eyebrowText: p.hero.eyebrow, h1: p.hero.heading, intro: p.hero.text, actions: button('Book a free call', '/contact/', 'brass', true) })}
<section class="section"><div class="wrap two-col narrow-side"><div class="main-col"><h2>${esc(p.story.heading)}</h2><div class="prose">${md(p.story.body)}</div></div>
<aside class="card yaqeen-mark"><img src="/assets/img/yaqeen-stacked.svg" alt="Yaqeen Advisory logo" width="220" height="220" loading="lazy"><p><strong>Yaqeen</strong> (يقين) is Arabic for certainty. The brass tick in our mark is the promise: certainty, verified.</p></aside></div></section>
<section class="section alt"><div class="wrap">${sectionHead('What we stand for', p.principlesHeading)}${cardsGrid(p.principles, 'g3')}</div></section>
${team}${ctaBand()}`;
  return { path: '/about/', html: layout({ title: m.title, description: m.description, path: '/about/', body, jsonld: [crumbsJsonLd(trail)] }) };
};

// ---------------------------------------------------------------- PARTNERS
export const partnersPage = (p) => {
  const m = meta(p.meta, 'Partner programme', '');
  const trail = [{ label: 'Home', url: '/' }, { label: 'Partner programme', url: '/partners/' }];
  const body = `${pageHero({ trail, eyebrowText: p.hero.eyebrow, h1: p.hero.heading, intro: p.hero.text, actions: button('Become a partner', '/contact/?topic=partner', 'brass', true) })}
<section class="section"><div class="wrap grid g2">
<div class="card info-card big"><h2>What we deliver for you</h2>${checks(p.deliver)}</div>
<div class="card info-card big"><h2>How we protect your clients and your brand</h2>${checks(p.protect)}</div></div></section>
<section class="section alt"><div class="wrap">${sectionHead('How a partnership runs', p.stepsHeading)}${stepsRow(p.steps)}</div></section>
${faqSection(p.faqs)}${ctaBand({ heading: 'Start with a three-client pilot', text: 'Tell us about your clients and the services you want covered. We will propose a pilot with a fixed monthly fee per client.', primary: { label: 'Become a partner', url: '/contact/?topic=partner' } })}`;
  return { path: '/partners/', html: layout({ title: m.title, description: m.description, path: '/partners/', body, jsonld: [crumbsJsonLd(trail), p.faqs && p.faqs.length ? faqJsonLd(p.faqs) : null] }) };
};

// ---------------------------------------------------------------- CONTACT
export const contactPage = (p) => {
  const s = ctx.site;
  const m = meta(p.meta, 'Contact', '');
  const trail = [{ label: 'Home', url: '/' }, { label: 'Contact', url: '/contact/' }];
  const opts = ctx.parents.map((x) => `<option value="${esc(x.slug)}">${esc(x.title)}</option>`).join('');
  const direct = [
    s.email ? `<li>${icon('mail')}<a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li>` : '',
    s.phone ? `<li>${icon('phone')}<a href="tel:${esc(s.phone.replace(/\s+/g, ''))}">${esc(s.phone)}</a></li>` : '',
    s.whatsapp ? `<li>${icon('whatsapp')}<a href="https://wa.me/${esc(s.whatsapp.replace(/\D/g, ''))}" rel="noopener">Message us on WhatsApp</a></li>` : '',
    s.address && s.address.city ? `<li>${icon('pin')}<span>${esc([s.address.line, s.address.city, s.address.region, s.address.country].filter(Boolean).join(', '))}</span></li>` : '',
  ].join('');
  const body = `${pageHero({ trail, eyebrowText: p.hero.eyebrow, h1: p.hero.heading, intro: p.hero.text })}
<section class="section"><div class="wrap two-col contact-grid"><div class="main-col">
<h2>${esc(p.formHeading)}</h2>
<form id="contact-form" class="form" method="post" action="${esc(s.formEndpoint || '#')}" data-endpoint="${esc(s.formEndpoint || '')}" data-email="${esc(s.email || '')}" novalidate>
<div class="row"><label>Your name<input name="name" required autocomplete="name"></label><label>Work email<input type="email" name="email" required autocomplete="email"></label></div>
<div class="row"><label>Phone or WhatsApp (optional)<input name="phone" autocomplete="tel"></label><label>Company<input name="company" autocomplete="organization"></label></div>
<div class="row"><label>Where do you operate?<select name="country"><option>India</option><option>UAE</option><option>Saudi Arabia</option><option>India and the GCC</option><option>Other</option></select></label>
<label>What do you need help with?<select name="service" id="f-service"><option value="">Not sure yet</option>${opts}<option value="plans">Choosing a plan</option><option value="partner">Partner programme</option></select></label></div>
<label>Tell us a little about your business<textarea name="message" rows="5" placeholder="For example: size of team, registrations you hold, what is hurting today"></textarea></label>
<label class="hp" aria-hidden="true">Leave this empty<input name="_gotcha" tabindex="-1" autocomplete="off"></label>
<p class="small muted">${esc(p.consent)}</p>
<button class="btn btn-primary" type="submit">Send message ${icon('arrow')}</button>
<p class="form-status" role="status" aria-live="polite"></p>
</form></div>
<div class="side"><div class="card side-list"><h3>What happens next</h3><ol class="next">${p.expect.map((e) => `<li><strong>${esc(e.title)}</strong><span>${esc(e.text)}</span></li>`).join('')}</ol></div>
${direct ? `<div class="card side-list"><h3>Reach us directly</h3><ul class="contact-list dark">${direct}</ul></div>` : ''}</div></div></section>
${faqSection(p.faqs)}`;
  return { path: '/contact/', html: layout({ title: m.title, description: m.description, path: '/contact/', body, jsonld: [crumbsJsonLd(trail)] }) };
};

// ---------------------------------------------------------------- INSIGHTS
const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const readMins = (t) => Math.max(1, Math.round(stripHtml(md(t || '')).split(/\s+/).length / 200));

export const insightCard = (a) =>
  `<article class="card post-card"><p class="mini">${esc(a.category || 'Insight')} &middot; ${fmtDate(a.date)}</p><h3><a href="/insights/${a.slug}/">${esc(a.title)}</a></h3><p>${esc(a.summary)}</p><a class="more" href="/insights/${a.slug}/">Read more ${icon('arrow')}</a></article>`;

export const insightsIndex = (p) => {
  const m = meta(p.meta, 'Insights', '');
  const trail = [{ label: 'Home', url: '/' }, { label: 'Insights', url: '/insights/' }];
  const body = `${pageHero({ trail, eyebrowText: p.hero.eyebrow, h1: p.hero.heading, intro: p.hero.text })}
<section class="section"><div class="wrap">${ctx.insights.length ? `<div class="grid g3">${ctx.insights.map(insightCard).join('')}</div>` : '<p>New articles are on the way.</p>'}</div></section>${ctaBand()}`;
  return { path: '/insights/', html: layout({ title: m.title, description: m.description, path: '/insights/', body, jsonld: [crumbsJsonLd(trail)] }) };
};

export const insightPage = (a) => {
  const url = `/insights/${a.slug}/`;
  const trail = [{ label: 'Home', url: '/' }, { label: 'Insights', url: '/insights/' }, { label: a.title, url }];
  const related = (a.related || []).map((r) => ctx.services.find((x) => x.slug === r)).filter(Boolean);
  const body = `<section class="page-hero dots slim-hero"><div class="wrap narrow">${breadcrumbs(trail)}${eyebrow(a.category || 'Insight', 'on-dark')}<h1>${esc(a.title)}</h1><p class="lead">${esc(a.summary)}</p><p class="meta-line">${esc(a.author || 'Yaqeen Advisory')} &middot; ${fmtDate(a.date)} &middot; ${readMins(a.body)} min read</p></div></section>
<section class="section"><div class="wrap narrow"><article class="prose article">${md(a.body)}</article>
${related.length ? `<div class="card side-list rel"><h3>Related services</h3><ul>${related.map((x) => `<li><a href="/services/${x.slug}/">${esc(x.title)}</a></li>`).join('')}</ul></div>` : ''}
<p class="small muted">This article is general information, not tax, legal or investment advice. Rules change; confirm how they apply to your business before acting.</p></div></section>${ctaBand()}`;
  return {
    path: url,
    html: layout({
      title: a.metaTitle || a.title,
      description: a.metaDescription || a.summary,
      path: url,
      body,
      type: 'article',
      published: a.date,
      modified: a.updated || a.date,
      jsonld: [
        crumbsJsonLd(trail),
        { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.summary, datePublished: a.date, dateModified: a.updated || a.date, author: { '@type': 'Organization', name: a.author || ctx.site.name }, publisher: { '@id': abs('/#organization') }, mainEntityOfPage: abs(url), image: abs('/assets/img/og-default.png') },
      ],
    }),
  };
};

// ---------------------------------------------------------------- LEGAL / UTILITY
export const legalPage = (p, slug) => {
  const url = `/${slug}/`;
  const m = meta(p.meta, p.heading, '');
  const trail = [{ label: 'Home', url: '/' }, { label: p.heading, url }];
  const body = `<section class="page-hero dots slim-hero"><div class="wrap narrow">${breadcrumbs(trail)}<h1>${esc(p.heading)}</h1>${p.updated ? `<p class="meta-line">Last updated ${esc(p.updated)}</p>` : ''}</div></section>
<section class="section"><div class="wrap narrow"><article class="prose">${md(p.body)}</article></div></section>`;
  return { path: url, html: layout({ title: m.title, description: m.description, path: url, body, jsonld: [crumbsJsonLd(trail)] }) };
};

export const sitemapPage = () => {
  const trail = [{ label: 'Home', url: '/' }, { label: 'Sitemap', url: '/sitemap/' }];
  const list = (arr) => `<ul>${arr.join('')}</ul>`;
  const body = `<section class="page-hero dots slim-hero"><div class="wrap narrow">${breadcrumbs(trail)}<h1>Sitemap</h1><p class="lead">Every page on this site, in one place.</p></div></section>
<section class="section"><div class="wrap narrow prose sitemap">
<h2>Main pages</h2>${list(['/', '/services/', '/plans/', '/how-we-work/', '/solutions/', '/partners/', '/about/', '/insights/', '/contact/'].map((u) => `<li><a href="${u}">${u === '/' ? 'Home' : u.replace(/\//g, '').replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())}</a></li>`))}
<h2>Services</h2>${ctx.parents.map((p) => `<h3><a href="/services/${p.slug}/">${esc(p.title)}</a></h3>${list(ctx.childrenOf(p.slug).map((c) => `<li><a href="/services/${c.slug}/">${esc(c.title)}</a></li>`))}`).join('')}
<h2>Markets</h2>${list(ctx.markets.map((m) => `<li><a href="/${m.slug}/">${esc(m.title)}</a></li>`))}
<h2>Who we serve</h2>${list(ctx.solutions.map((m) => `<li><a href="/solutions/${m.slug}/">${esc(m.title)}</a></li>`))}
<h2>Insights</h2>${list(ctx.insights.map((m) => `<li><a href="/insights/${m.slug}/">${esc(m.title)}</a></li>`))}
<h2>Legal</h2>${list(['<li><a href="/privacy-policy/">Privacy policy</a></li>', '<li><a href="/terms/">Terms of use</a></li>'])}
</div></section>`;
  return { path: '/sitemap/', html: layout({ title: 'Sitemap', description: 'A complete list of every page on the Yaqeen Advisory website: services, markets, plans and insights.', path: '/sitemap/', body, jsonld: [crumbsJsonLd(trail)] }) };
};

export const notFoundPage = () => {
  const body = `<section class="page-hero dots"><div class="wrap narrow"><p class="eyebrow on-dark">Error 404</p><h1>This page could not be found</h1><p class="lead">The link may be old or mistyped. Try one of these instead.</p><div class="actions">${button('Go to the homepage', '/', 'brass', true)}${button('Browse services', '/services/', 'ghost-light')}${button('Contact us', '/contact/', 'ghost-light')}</div></div></section>`;
  return { path: '/404.html', file: '404.html', html: layout({ title: 'Page not found', description: 'This page could not be found. Browse our services or contact Yaqeen Advisory.', path: '/404/', noindex: true, body }) };
};
