# Regenerates .pages.yml (the editing-screen layout for Pages CMS) from the current content folder.
# Not needed for day-to-day editing. Run:  python3 tools/make-cms-config.py
import json, glob, os, yaml
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
slugs = lambda d: sorted(os.path.basename(f)[:-5] for f in glob.glob(f'{R}/content/{d}/*.json'))
ICONS = ['book','calendar','chart','shield','message','receipt','percent','users','file','trend','search','layers','globe','link','sliders','clock','bank','wallet','zap','gear','lock','check','target','mail','rocket','building','store','trendup','handshake']

def f(name, type='string', label=None, **kw):
    d = {'name': name, 'label': label or name[0].upper() + ''.join(' ' + c.lower() if c.isupper() else c for c in name[1:]), 'type': type}
    d.update({k: v for k, v in kw.items() if v is not None})
    return d
S = lambda n, l=None, **k: f(n, 'string', l, **k)
T = lambda n, l=None, **k: f(n, 'text', l, **k)
RT = lambda n, l=None, **k: f(n, 'rich-text', l, **k)
LS = lambda n, l=None, **k: f(n, 'string', l, list=True, **k)
O = lambda n, fields, l=None, **k: f(n, 'object', l, fields=fields, **k)
OL = lambda n, fields, l=None, **k: f(n, 'object', l, fields=fields, list=True, **k)
SEL = lambda n, vals, l=None, **k: f(n, 'select', l, options={'values': vals}, **k)
MSEL = lambda n, vals, l=None, **k: f(n, 'select', l, options={'values': vals}, list=True, **k)
FAQS = OL('faqs', [S('q', 'Question'), T('a', 'Answer')], 'Frequently asked questions')
SEO = lambda: [S('title', 'Search title (shown in Google, keep under about 60 characters)'), T('description', 'Search description (about 140 to 160 characters)')]
ICON = lambda n='icon': SEL(n, ICONS, 'Icon')
HERO = lambda: O('hero', [S('eyebrow', 'Small label above heading'), S('heading', 'Heading'), T('text', 'Intro text')], 'Top banner')
def page(name, label, fields, file=None):
    return {'name': name, 'label': label, 'type': 'file', 'path': f'content/pages/{file or name}.json', 'format': 'json', 'fields': fields}
def coll(name, label, d, fields, primary='title', extra=None):
    c = {'name': name, 'label': label, 'type': 'collection', 'path': f'content/{d}', 'format': 'json', 'fields': fields, 'view': {'fields': extra or [primary], 'primary': primary}}
    return c

parents = [s for s in slugs('services') if not json.load(open(f'{R}/content/services/{s}.json'))['parent']]
service = [S('title', 'Page heading (H1)', required=True), S('navLabel', 'Short name used in menus and links'),
  SEL('parent', [''] + parents, 'Belongs to (leave blank for a main service)'), f('order', 'number', 'Order in lists (1 = first)'), ICON(),
  MSEL('markets', ['india', 'uae', 'saudi-arabia'], 'Markets'), SEL('kind', ['subscription', 'project', 'both'], 'How it is delivered'),
  T('summary', 'Short summary (used on cards)'), S('metaTitle', 'Search title (under about 60 characters)'), T('metaDescription', 'Search description (140 to 160 characters)'),
  T('heroIntro', 'Intro text in the top banner'), RT('overview', 'Overview paragraphs'), LS('whatWeDo', 'What we do (one point each)'), LS('whoFor', 'Who this is for'),
  O('byPlan', [T('foundation', 'Foundation'), T('growth', 'Growth'), T('cfo', 'CFO')], 'How it changes by plan'), S('duration', 'Typical timeline (projects)'),
  T('note', 'Highlighted note'), FAQS, MSEL('related', slugs('services'), 'Related services'), RT('body', 'Extra content (optional)')]
market = [S('title', 'Page heading (H1)', required=True), S('navLabel', 'Short name'), f('order', 'number', 'Order'), S('eyebrow'), S('menuText', 'One-line description in menu'), T('summary', 'Short summary'),
  S('metaTitle', 'Search title'), T('metaDescription', 'Search description'), S('heroHeading', 'Banner heading'), T('heroIntro', 'Banner intro'), LS('pills', 'Small tags'), RT('overview', 'Overview'),
  S('howHeading', 'Heading for the list below'), LS('howWeServe', 'What you get (one point each)'), S('highlightsHeading', 'Heading for the cards'), OL('highlights', [S('title'), T('text')], 'Cards'),
  MSEL('services', slugs('services'), 'Services to show'), T('note', 'Highlighted note'), FAQS]
solution = [S('title', 'Page heading (H1)', required=True), S('navLabel', 'Short name'), f('order', 'number', 'Order'), ICON(), S('eyebrow'), S('menuText', 'One-line description in menu'), T('summary', 'Short summary'),
  S('metaTitle', 'Search title'), T('metaDescription', 'Search description'), S('heroHeading', 'Banner heading'), T('heroIntro', 'Banner intro'),
  S('challengesHeading'), OL('challenges', [ICON(), S('title'), T('text')], 'Challenges'), S('helpHeading'), OL('howWeHelp', [S('title'), T('text'), S('link', 'Link (e.g. /services/taxation/)'), S('linkLabel', 'Link text')], 'How we help'),
  SEL('recommendedPlan', ['foundation', 'growth', 'cfo'], 'Suggested plan'), S('planHeading'), T('planText'), MSEL('services', slugs('services'), 'Services to show'), FAQS]
insight = [S('title', required=True), f('date', 'date', 'Publish date'), f('updated', 'date', 'Last updated (optional)'), S('category'), S('author'), T('summary', 'Short summary (shown on cards and in Google)'),
  S('metaTitle', 'Search title (optional)'), T('metaDescription', 'Search description (optional)'), MSEL('related', slugs('services'), 'Related services'), f('draft', 'boolean', 'Hide this article (draft)'), RT('body', 'Article')]
legal = [O('meta', SEO(), 'Search settings'), S('heading'), S('updated', 'Last updated (text)'), RT('body', 'Text')]
cardlist = lambda n, l: OL(n, [ICON(), S('title'), T('text')], l)
tbl = lambda n, l: O(n, [S('label', 'Tab label'), S('feeLabel', 'Fee row label'), OL('groups', [S('title', 'Group heading'), OL('rows', [S('market', 'Country tag (UAE or KSA, optional)'), S('label', 'Row text'), S('foundation', 'Foundation (type yes, no, or text)'), S('growth', 'Growth'), S('cfo', 'CFO')], 'Rows')], 'Groups')], l)
tier = OL('tiers', [SEL('id', ['foundation', 'growth', 'cfo']), S('name'), S('tagline'), T('bestFor'), LS('features'), S('outcome')], 'Tiers')
steps = lambda n, l: OL(n, [S('title'), T('text')], l)
home = [O('meta', SEO(), 'Search settings'),
  O('hero', [S('eyebrow'), S('heading'), T('text'), S('primaryLabel'), S('primaryUrl'), S('secondaryLabel'), S('secondaryUrl'), OL('markets', [S('label'), S('url')], 'Country tags')], 'Top banner'),
  cardlist('valueProps', 'Four promises under the banner'),
  O('why', [S('eyebrow'), S('heading'), T('text'), O('ai', [S('title'), T('text')], 'Dark box'), O('built', [S('title'), T('text')], 'Sand box')], 'Why Yaqeen'),
  O('servicesIntro', [S('eyebrow'), S('heading'), T('text')], 'Services section intro'), O('marketsIntro', [S('eyebrow'), S('heading'), T('text')], 'Markets section intro'),
  O('steps', [S('eyebrow'), S('heading'), T('text'), steps('items', 'Steps')], 'Getting started'), O('rhythm', [S('heading'), OL('steps', [S('label'), S('text')], 'Month at a glance')], 'Month at a glance'),
  O('plansTeaser', [S('eyebrow'), S('heading'), T('text')], 'Plans section intro'), O('solutionsIntro', [S('eyebrow'), S('heading'), T('text')], 'Who we serve intro'),
  O('trust', [S('eyebrow'), S('heading'), T('text'), cardlist('stack', 'Tools'), S('protectHeading'), LS('protect', 'How we protect your business')], 'Tools and trust'), FAQS,
  O('cta', [S('heading'), T('text')], 'Closing call to action')]
cfg = {
 'media': {'input': 'static/assets/uploads', 'output': '/assets/uploads'},
 'content': [
  coll('services', 'Services', 'services', service, extra=['title', 'parent']),
  coll('insights', 'Insights (articles)', 'insights', insight, extra=['title', 'date']),
  coll('markets', 'Markets (India, UAE, Saudi Arabia, GCC)', 'markets', market),
  coll('solutions', 'Who we serve', 'solutions', solution),
  page('home', 'Homepage', home),
  page('plans', 'Plans page', [O('meta', SEO(), 'Search settings'), HERO(), O('layers', [S('eyebrow'), S('heading'), T('text'), OL('items', [S('title'), S('cadence'), T('text'), S('pricing')], 'Three layers'), T('note')], 'Three layers section'),
     OL('priceDrivers', [S('title'), T('text')], 'What moves the price'), S('tiersHeading'), T('tiersText'), tier, S('compareHeading'), T('compareText'), tbl('india', 'India table'), tbl('gcc', 'UAE and Saudi table'),
     S('addonsHeading'), T('addonsText'), OL('addons', [ICON(), S('name'), T('text'), S('pricedBy'), S('worksWith')], 'Add-on modules'), FAQS, O('cta', [S('heading'), T('text')], 'Closing call to action')]),
  page('how-we-work', 'How we work', [O('meta', SEO(), 'Search settings'), HERO(), S('rhythmHeading'), T('rhythmText'), OL('stages', [ICON(), S('title'), S('when'), LS('items')], 'Stages'), OL('month', [S('label'), S('text')], 'Month at a glance'), S('toolsHeading'), T('toolsText'), cardlist('stack', 'Tools'), LS('protect', 'How we protect your business'), S('scopeHeading'), T('scopeText'), cardlist('scope', 'Scope and terms'), FAQS]),
  page('about', 'About us', [O('meta', SEO(), 'Search settings'), HERO(), O('story', [S('heading'), RT('body', 'Story')], 'Our story'), S('principlesHeading'), cardlist('principles', 'Principles'),
     O('team', [S('heading'), T('text'), OL('members', [S('name'), S('role'), T('bio'), f('photo', 'image', 'Photo')], 'People')], 'Team (add people here when ready; the section stays hidden while empty)')]),
  page('partners', 'Partner programme', [O('meta', SEO(), 'Search settings'), HERO(), LS('deliver', 'What we deliver'), LS('protect', 'How we protect clients and brand'), S('stepsHeading'), steps('steps', 'Steps'), FAQS]),
  page('contact', 'Contact page', [O('meta', SEO(), 'Search settings'), HERO(), S('formHeading'), T('consent', 'Small print under the form'), OL('expect', [S('title'), T('text')], 'What happens next'), FAQS]),
  page('services', 'Services overview page', [O('meta', SEO(), 'Search settings'), HERO(), O('layers', [S('eyebrow'), S('heading'), T('text'), steps('items', 'Layers')], 'Three layers'), O('cta', [S('heading'), T('text')], 'Closing call to action')]),
  page('solutions', 'Who we serve overview', [O('meta', SEO(), 'Search settings'), HERO()]),
  page('insights', 'Insights overview page', [O('meta', SEO(), 'Search settings'), HERO()]),
  page('privacy-policy', 'Privacy policy', legal), page('terms', 'Terms of use', legal),
  {'name': 'site', 'label': 'Site settings (contact details, form, analytics)', 'type': 'file', 'path': 'content/settings/site.json', 'format': 'json', 'fields': [
    S('name', 'Business name'), S('legalName', 'Legal name'), S('tagline'), T('description', 'Default description of the firm (used in Google and social sharing)'),
    S('siteUrl', 'Website address (include https:// and no trailing slash)'), S('email', 'Email address'), S('phone', 'Phone number (leave empty to hide)'), S('whatsapp', 'WhatsApp number with country code, digits only (leave empty to hide)'),
    O('address', [S('line', 'Street address (optional)'), S('city'), S('region'), S('country')], 'Address'), O('social', [S('linkedin'), S('instagram'), S('x', 'X (Twitter)'), S('youtube')], 'Social media links'),
    S('formEndpoint', 'Contact form address (from Formspree)'), S('analyticsId', 'Google Analytics ID (starts with G-)'), S('googleSiteVerification', 'Google Search Console code'), S('bingSiteVerification', 'Bing Webmaster code'),
    S('headerCtaLabel', 'Header button text'), S('headerCtaUrl', 'Header button link'), T('footerAbout', 'Footer text'), T('disclaimer', 'Footer disclaimer')]},
  {'name': 'navigation', 'label': 'Top menu', 'type': 'file', 'path': 'content/settings/navigation.json', 'format': 'json', 'fields': [
    OL('main', [S('label'), S('url'), SEL('menu', ['', 'services', 'markets', 'solutions'], 'Drop-down type')], 'Menu items')]},
 ]}
open(f'{R}/.pages.yml', 'w').write('# Editing-screen layout for Pages CMS (app.pagescms.org). Regenerate with: python3 tools/make-cms-config.py\n' + yaml.safe_dump(cfg, sort_keys=False, allow_unicode=True, width=200))
print('ok', len(cfg['content']))
