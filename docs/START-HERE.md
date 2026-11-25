# Yaqeen Advisory website: start here

This guide takes you from "a folder of files" to "a live website on your own domain that you can edit like a document". Nothing here needs coding. Every step says exactly what to click. If a screen looks different from what is described (these services change their buttons now and then), tell me what you see and I will adjust the steps.

**Time needed:** about 2 to 3 hours for the first launch, plus waiting time for the domain to connect.
**Running cost:** your domain name (about the price of a lunch per month or less; check the current price when you buy) and a business email. Everything else in this guide is free.

---

## 0. What you have

- **A complete website of 59 pages:** home, 7 main services and 26 specific services (each on its own page), India, UAE, Saudi Arabia and GCC pages, 5 "who we serve" pages, plans, how we work, partner programme, about, contact, 4 starter articles, privacy policy, terms, sitemap and a 404 page.
- **Your brand:** colours, logo and typography come from your logo kit (teal, brass, paper, Inter). The same tokens can be reused for proposals, reports and decks. The original logo files are in the `brand-kit` folder.
- **Search engine setup built in:** a unique title and description on every page, clean web addresses, a sitemap, structured data (so Google understands you are an accounting firm serving India, the UAE and Saudi Arabia), breadcrumbs, FAQ markup and fast loading.
- **An editing screen** (Pages CMS) where you change text, add a service, publish an article or update contact details by filling in forms. No code.

### How it works, in plain words

Your website's content lives in a folder on **GitHub** (a free online storage service for files). Every time you save a change in the editing screen, GitHub automatically rebuilds the website and publishes it, usually within 2 to 3 minutes. You never touch the build.

### The web address plan (already built)

| Page | Address |
|---|---|
| Home | `/` |
| All services | `/services/` |
| One service | `/services/gst-india/`, `/services/uae-vat/`, `/services/payroll-india/` and so on |
| Markets | `/india/`, `/uae/`, `/saudi-arabia/`, `/gcc/` |
| Who we serve | `/solutions/startups/`, `/solutions/smes/` and so on |
| Plans | `/plans/` |
| Articles | `/insights/article-name/` |

Every service can be reached in **one click** from the homepage (the Services menu lists all of them, and the homepage also lists them) and in two clicks from the Services page.

---

## 1. Decisions to make before you start (15 minutes)

1. **Your domain name.** I used `yaqeenadvisory.com` as a placeholder. Check which names are free at the registrar you choose in step 2. If `.com` is taken, consider `yaqeenadvisory.in` (good for India) and also buy `.ae` or `.sa` later only if you set up in those countries.
2. **Your business email**, for example `hello@yourdomain.com`. Using a free Gmail address on a firm's website looks less credible to GCC and corporate clients.
3. **Your contact details to show publicly:** email, phone, WhatsApp number. Leave any of them empty and it simply will not appear.
4. **Your office address.** I put only "Kozhikode, Kerala, India" (city level) as a placeholder. Change it if that is not right.

---

## 2. Buy your domain (20 minutes)

1. Pick a registrar. Cloudflare Registrar, Namecheap and GoDaddy all work. (Registrars where you also get email hosting or easy DNS editing make later steps simpler.)
2. Search for your name, add it to the cart and pay. Turn on **auto-renew** and **domain privacy** if offered.
3. Use an email address you will always have access to for the account, and save the login somewhere safe. If you lose access to the registrar, you lose the domain.

You will come back to the registrar's **DNS settings** in step 8.

---

## 3. Set up business email (30 minutes)

Easiest path: **Google Workspace** (paid, most professional) or **Zoho Mail** (has a free tier for a small team). Both walk you through verifying your domain and creating `hello@yourdomain.com`. Follow their on-screen setup. When you are done, send a test email to yourself.

---

## 4. Create your GitHub account and put the website there (45 minutes)

### 4a. Make the account

1. Go to **github.com** and click **Sign up**.
2. Choose a username. Using your brand is best, for example `yaqeenadvisory`. (Your first test address will be `https://yaqeenadvisory.github.io`.)
3. Verify your email and turn on two-factor sign-in when it asks.

### 4b. Install GitHub Desktop (a free app that uploads files for you)

1. Go to **desktop.github.com**, download the app for your computer (Windows or Mac) and install it.
2. Open it and click **Sign in to GitHub.com**. Approve in the browser.

### 4c. Create the project

1. In GitHub Desktop choose **File, then New repository**.
2. **Name:** type exactly `yourusername.github.io`, for example `yaqeenadvisory.github.io`. (This exact pattern is what lets your website show up at the first test address.)
3. **Local path:** leave the default. Remember where it is shown, for example `Documents/GitHub`. Leave the other boxes alone and click **Create repository**.

### 4d. Copy the website files in

1. Unzip the `yaqeen-advisory-website.zip` I gave you.
2. Open the folder created in step 4c on your computer (in GitHub Desktop: **Repository, then Show in Explorer** on Windows or **Show in Finder** on Mac).
3. Copy **everything inside** the unzipped website folder into that folder. You should end up with `build.mjs`, `content`, `static` and so on directly inside it.
4. **Important:** two items begin with a dot: `.pages.yml` and the `.github` folder. They are hidden by default.
   - **Windows:** in File Explorer click **View, then Show, then Hidden items**.
   - **Mac:** in Finder press **Command + Shift + Period**.
   - Make sure both were copied. Without them the website will not publish and the editing screen will not work.

### 4e. Upload (publish)

1. Back in GitHub Desktop you will see a long list of changed files on the left. In the box at the bottom left, type `First version of website` and click **Commit to main**.
2. Click **Publish repository** (top bar). **Untick "Keep this code private"**. Free hosting needs a public repository. This is fine: the content is your public website text. Do not put anything confidential in the folder.
3. Click **Publish repository**.

---

## 5. Turn on hosting (10 minutes)

1. In your browser open `https://github.com/yourusername/yourusername.github.io`.
2. Click **Settings** (top row of the repository), then **Pages** in the left list.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Click the **Actions** tab at the top. You should see a run called **Publish website**. Wait until it shows a green tick (about 2 minutes). If it shows a red cross, or nothing ran, click **Publish website** on the left, then **Run workflow**, then the green **Run workflow** button.
5. Open `https://yourusername.github.io`. Your website is live on a test address.

> The first time, the website will show the placeholder domain `yaqeenadvisory.com` inside its code (for search engines). That is expected, and step 8 sets the real one.

---

## 6. Open the editing screen (15 minutes)

1. Go to **app.pagescms.org** and click **Sign in with GitHub**.
2. When asked, allow access and **install the app on your repository** (choose "Only select repositories" and pick `yourusername.github.io`).
3. Select your repository. You will see a left menu: **Services, Insights, Markets, Who we serve, Homepage, Plans page, How we work, About us, Partner programme, Contact page, Site settings, Top menu**.
4. Click any item to edit it. Press **Save**. Wait 2 to 3 minutes and refresh your website to see it.

> **Honest note:** I could not log in to Pages CMS from where I built this, so the editing screen layout (file `.pages.yml`) was prepared from its documentation but not tested live. If a screen shows an error or a field looks wrong, send me a screenshot and I will fix the file. Fallback that always works: on github.com open the file, click the pencil icon and edit the text between quotation marks.

---

## 7. Fill in your real details (20 minutes)

In the editing screen open **Site settings** and set:

- **Website address:** `https://www.yourdomain.com` (include `https://`, no slash at the end). Use this exactly once you complete step 8. Search engines use it.
- **Email address**, **Phone**, **WhatsApp** (country code and digits only, for example `919XXXXXXXXX`), **Address**, **Social links**.
- Leave **Google Analytics ID** and the **Search Console code** empty for now.

### Make the contact form work

Until you do this, the form opens the visitor's email app instead. That works, but a real form is better.

1. Go to **formspree.io** and create a free account.
2. Click **New form**, name it `Yaqeen website`, and set it to email you at your business email.
3. Copy the **form address** it shows. It looks like `https://formspree.io/f/abcdwxyz`.
4. In **Site settings** paste it in **Contact form address** and save.
5. After the site updates, send a test message from your website's Contact page. Confirm the email arrives (check spam the first time and confirm the Formspree verification email).

---

## 8. Connect your own domain (20 minutes of work, then wait)

1. At your registrar open **DNS settings** for your domain.
2. Add these records (delete any existing "parking page" records first):

| Type | Name / Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `yourusername.github.io` |

3. In GitHub go to your repository, **Settings, then Pages**. Under **Custom domain** type `www.yourdomain.com` and click **Save**.
4. Wait. DNS can take from a few minutes to a day. When GitHub shows a green tick, tick **Enforce HTTPS**.
5. Visit `https://www.yourdomain.com`. Also test `https://yourdomain.com`; it should redirect to the `www` version.
6. Make sure **Site settings, Website address** is exactly `https://www.yourdomain.com`.

(If GitHub's page shows different DNS instructions from the table above, follow GitHub's. They publish the current ones on the same Pages screen.)

---

## 9. Get found on Google and Bing (30 minutes)

1. **Google Search Console** (search.google.com/search-console): click **Add property**, choose **Domain**, enter your domain and follow the instruction to add a **TXT record** at your registrar (same DNS screen as step 8). Click **Verify**.
2. In Search Console open **Sitemaps** and submit `sitemap.xml`. It lists all 59 pages.
3. Use **URL inspection** to request indexing for the homepage and your top service pages. Google typically takes days to a few weeks to list a brand-new site.
4. **Bing Webmaster Tools** (bing.com/webmasters): sign in and choose **Import from Google Search Console**. This also helps with other search tools.
5. **Google Business Profile** (business.google.com): optional, useful for local searches in Kozhikode. Google asks for a real address and verification, so only do this if you have an office clients can visit or you want to appear as a service-area business.
6. **LinkedIn company page:** create one, then add the link in **Site settings, Social links**.
7. Optional: **Google Analytics** (analytics.google.com). Create a property, copy the **Measurement ID** (starts with `G-`) into **Site settings, Google Analytics ID**.

### What search engines already get from the site

- One page per service, each with its own address, title, description and FAQ answers.
- Market pages for **India, UAE, Saudi Arabia and the GCC**, so people searching "VAT services UAE" or "GST return filing India" can land on the right page.
- Service structured data naming the countries you serve.

### What only you can do to rank well

- **Publish helpful articles** (see recipes below). Two a month is plenty.
- **Get real links:** LinkedIn page, client and partner websites, professional directories, guest articles.
- **Collect genuine client reviews** and add them to the site only when they are real and approved.
- **Keep facts current.** Tax rules change. Review pages quarterly.

---

## 10. Everyday editing recipes

All of these are done in the editing screen (app.pagescms.org). After each **Save**, the website updates in 2 to 3 minutes.

### Change a sentence anywhere
Open the section (for example **Homepage**), find the field, edit and save.

### Add a new service
1. **Services, then Add**.
2. Fill: **Page heading**, **Short name** (for menus), **Belongs to** (pick the main service, or leave blank for a new main service), **Order**, **Icon**, **Markets**, **How it is delivered**, **Short summary**, **Search title** and **Search description**, **What we do** and a few **FAQs**.
3. Save. It appears by itself in the menu, the Services page, the homepage list, its parent's page and the sitemap.
4. **Search title tip:** about 55 to 60 characters, with the service and place in it, for example "UAE VAT Services: Returns, Reconciliation and Support".
5. To show it on a market page, edit that page (for example **Markets, India**) and add the service under **Services to show**.

### Remove or hide a service
Open the service and delete it. If another page still links to it (for example a link inside "Who we serve"), the website will refuse to publish and show a red cross in GitHub's **Actions** tab, instead of publishing a broken link. Remove the old link and save again.

### Publish an article
**Insights, then Add.** Fill the title, date, category, a one-paragraph summary and the article body. Tick **Hide this article** to keep it as a draft.

### Change the plan tables or add-ons
**Plans page.** Open **India table** or **UAE and Saudi table**, then the group and the row. In cells type `yes`, `no`, or any text such as `Quarterly`.

### Add team members
**About us, then Team, then add a person.** The Team section appears on the About page once there is at least one person, and stays hidden while empty. Upload a photo with the image button.

### Add an image
Use the image field in the editing screen. Uploaded images go into `static/assets/uploads` automatically.

### Change colours or fonts
Brand colours are deliberately fixed so that everything stays on-brand. If you ever need a change, ask me.

---

## 11. Before you announce the website: checklist

- [ ] Your real email, phone or WhatsApp and address are in **Site settings**.
- [ ] The contact form test email arrived.
- [ ] **Have the content reviewed by a qualified professional**, especially tax rates, thresholds and statements about UAE and Saudi rules (VAT 5% in the UAE and 15% in Saudi Arabia, UAE corporate tax at 9% above AED 375,000, ZATCA e-invoicing phases). I wrote these from general knowledge and your service catalogue; rules change.
- [ ] **Privacy policy and Terms are drafts.** Have a lawyer review them for India and the GCC.
- [ ] Confirm the claims match what you can deliver on day one: "books closed by the 7th", response times in each tier, "named accountant", "WhatsApp group", the tools list (Zoho Books, Tally Prime, Looker Studio, etc.).
- [ ] Confirm your professional status wording. The site says you do not perform statutory or tax audit and that reserved work stays with licensed professionals. Align with your ACCA and any registrations.
- [ ] No team, client logos, testimonials or numbers are shown, because I have none from you. Add them only when they are real.
- [ ] Open the site on your phone and on a laptop. Click through the menu, the Plans page tabs and the contact form.
- [ ] The logo kit guidelines mention a trademark check. Do it before heavy marketing.
- [ ] Search Console verified, sitemap submitted.

---

## 12. If something goes wrong

| What you see | What to do |
|---|---|
| I saved but nothing changed | Wait 3 minutes, then hard refresh (Ctrl+F5, or Cmd+Shift+R). Then open the **Actions** tab on GitHub. A green tick means published. |
| Red cross in Actions | Click it, then the failed step. The message tells which page has a problem (usually a link to a removed page). Fix it and save again, or send me the message. |
| `Run workflow` never ran | Settings, Pages, Source must be **GitHub Actions**. Then Actions, **Publish website**, **Run workflow**. |
| Custom domain not working | DNS can take up to a day. Re-check the five records. Remove any older "A" or "CNAME" records that conflict. |
| "Not secure" warning | In Settings, Pages, tick **Enforce HTTPS** once the domain check is green. |
| Form says it could not send | Check the Formspree address is pasted exactly and your Formspree email is confirmed. |
| Editing screen errors | Send me a screenshot. Meanwhile edit the files directly on github.com (pencil icon). |

---

## 13. Optional: preview on your own computer

Install **Node.js** (nodejs.org, LTS). In the website folder run `node build.mjs`, then `node tools/serve.mjs`, and open `http://localhost:8080`. Not needed for normal use.

---

## 14. What I assumed and could not do

- **No real contact details, prices, team or testimonials were provided**, so none are shown. Prices are deliberately not published (your catalogue leaves fees for a quote); the Plans page says fees are quoted after a discovery call.
- **Placeholder values:** domain `yaqeenadvisory.com`, email `hello@yaqeenadvisory.com`, city Kozhikode (used in Google's structured data). Change them in Site settings.
- **I worked offline**, so the Inter font loads from Google Fonts on the live site, the editing-screen config was not tested in your Pages CMS account, and I could not check domain availability.
- **Hosting:** free GitHub Pages. If you outgrow it later, the same files can move to Cloudflare Pages or Netlify (build command `node build.mjs`, publish folder `dist`).
- **Languages:** English only for now. An Arabic version for GCC visitors is a natural next step.
