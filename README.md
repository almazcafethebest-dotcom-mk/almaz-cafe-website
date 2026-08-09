# Almaz Cafe website

A fast, 5-page static website for Almaz Cafe, 157 Onehunga Mall, Onehunga,
Auckland (09 622 2108): `index.html` (Home), `menu.html`, `about.html`,
`contact.html`, `support.html` (FAQ). Includes a floating "Ask Almaz" chat
widget that answers common questions (hours, halal/vegan options, parking,
delivery, etc.) instantly, with no backend required.

**Also included:**
- **Light / Dark / Vibrant theme switcher** (top-right of the nav) — choice is remembered per visitor via `localStorage`.
- **Live "Open now / Closed" badge** on the Home and Menu pages, computed from real Auckland time against your actual hours.
- **SEO structured data** (`Restaurant` JSON-LD schema) on every page — address, hours, phone, price range and rating, so Google can show rich results.
- Open Graph / Twitter card meta tags, so links shared on social/WhatsApp show a proper title and description.
- A subtle scroll-reveal animation on cards and sections.
- A sticky mobile "Call / Directions / Order" action bar.
- A diamond-mark favicon.

No build step, no framework — plain HTML/CSS/JS, so it deploys as-is to
GitHub Pages or Netlify.

Business details (hours, address, phone, cuisine, rating) were pulled from
Almaz Cafe's public Google/Tripadvisor/Uber Eats/DoorDash listings — double
check anything important (especially hours, which can change) against your
own records before publishing.

## File structure

```
almaz-cafe/
├── index.html
├── menu.html
├── about.html
├── contact.html
├── support.html      ← FAQ / support page
├── css/style.css
├── js/script.js
├── js/chat.js         ← the "Ask Almaz" chat widget logic
├── images/            ← put your real photos here
└── README.md
```

## About the "Ask Almaz" chat widget

This is a lightweight, **rule-based** FAQ bot — it matches keywords in
whatever's typed (like "hours", "halal", "parking", "deliver") against a
fixed list of facts about the cafe, all defined at the top of `js/chat.js`.
It runs entirely in the visitor's browser: no external AI API, no API key,
nothing to pay for or configure. Update the `FACTS` object in that file any
time your hours, menu highlights, or policies change.

If you'd rather it be backed by a real AI model (so it can handle
open-ended questions, not just the ones it's been given canned answers
for), that needs a small server-side piece — e.g. a Netlify Function that
calls the Anthropic API with your own API key. An API key should **never**
be placed directly in `chat.js` or any other front-end file, since anyone
viewing the page source could read and misuse it. Ask me if you'd like
that upgraded version built.

## 1. Put this on GitHub

1. Create a new repository on GitHub (e.g. `almaz-cafe-website`). Don't
   initialise it with a README (you already have one here).
2. From inside this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/almaz-cafe-website.git
   git push -u origin main
   ```

## 2. Deploy — pick ONE of these (or do both, they don't conflict)

### Option A: GitHub Pages (free, hosted by GitHub)

1. On GitHub, go to your repo → **Settings** → **Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`.
3. Branch: `main`, folder: `/ (root)` → **Save**.
4. After a minute, your site is live at:
   `https://<your-username>.github.io/almaz-cafe-website/`
5. Optional: add a custom domain (e.g. `almazcafe.co.nz`) in the same
   Pages settings screen, and add a CNAME record with your domain
   registrar pointing to `<your-username>.github.io`.

### Option B: Netlify (free, a bit more flexible — recommended if you want the contact form to actually work)

1. Go to [netlify.com](https://www.netlify.com) and sign up / log in
   (you can sign in with your GitHub account).
2. Click **Add new site → Import an existing project**.
3. Choose GitHub, then select your `almaz-cafe-website` repo.
4. Build settings: leave the build command **blank** and set the
   publish directory to `.` (this is a static site, nothing to build).
5. Click **Deploy site**. Netlify gives you a live URL immediately
   (e.g. `random-name-123.netlify.app`), which you can rename or
   point a custom domain at under **Site settings → Domain management**.
6. Every time you push to `main` on GitHub, Netlify redeploys automatically.

The contact form in `contact.html` already has `data-netlify="true"` on
it, so once it's live on Netlify, Netlify will automatically collect
submissions under **Forms** in your Netlify dashboard — no extra setup
needed. (On GitHub Pages alone, the form has no backend to send to; the
JS just shows a placeholder message.)

## 3. Things to personalise before launch

- **Photos & video**: I've used custom illustrated placeholders (in
  brand colours) rather than pulling photos from Google/Tripadvisor
  review pages — those were taken and uploaded by other people, so
  reusing them without permission isn't something I can do, even for
  your own business's site. The easiest legitimate source is your own
  Google Business Profile (Google Business Profile → Photos → download)
  or photos/video you take yourself. Swap the `.gallery-item` and
  `.dish-card` art blocks in `index.html` / `about.html` for real
  `<img>` tags, and swap the "Take a look inside" video block on the
  homepage for a real embed (e.g. an Instagram Reel or YouTube embed
  code).
- **Menu & prices**: the dish names are real (pulled from Uber Eats/
  DoorDash listings), but exact prices are estimates within the
  $10–20/person range reported for the cafe — edit them directly in
  `menu.html` to match your actual menu board.
- **Address, phone, email, hours**: update in `contact.html` (and the
  footer, which is repeated on every page) — also update the map
  `<iframe>` in `contact.html` with your exact address once you have it.
- **About page copy**: replace the placeholder paragraphs in
  `about.html` with your real story.
- **Favicon / social preview image**: optional, add a `favicon.ico`
  and an Open Graph image if you want one later.

## 4. Local preview

You can just double-click `index.html` to open it in a browser, or run
a tiny local server from this folder:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.
