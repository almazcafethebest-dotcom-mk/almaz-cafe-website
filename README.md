# Almaz Cafe website

A fast, 5-page static website for Almaz Cafe, 157 Onehunga Mall, Onehunga,
Auckland (09 622 2108): `index.html` (Home), `menu.html`, `about.html`,
`contact.html`, `support.html` (FAQ). Includes a floating "Ask Almaz" chat
widget that answers common questions (hours, halal/vegan options, parking,
delivery, etc.) instantly, with no backend required.

**Also included:**
- **Real logo & storefront photo** — the nav now uses the ornate emblem lockup cropped from your official menu artwork, and hero/About images use your real storefront photo.
- **Light / Dark / Vibrant theme switcher** (top-right of the nav) — the three modes now use genuinely distinct palettes: Light is soft and elegant, Vibrant is bold and saturated straight off your real sign (orange/maroon/gold, with a gradient banner-chip treatment on the homepage that echoes the shop sign), Dark is a moody near-black version of the same warm colours. Choice is remembered per visitor via `localStorage`.
- **Ottoman arch motif** watermarked behind the homepage headline, plus an animated rotating kebab skewer, a steaming tea glass, floating tulips, and a nazar (evil-eye) charm along the sides of the hero on desktop — small heritage touches, not stock clip-art, and they respect visitors' reduced-motion settings.
- **Turkish tile-pattern border band** at both the top and bottom of every page — a proper repeating star-and-cross motif in the theme colours.
- **Real food photography throughout** — I pulled additional real photos directly out of your own menu artwork (Lamb Pasendeh, Moussaka, Butter Chicken, kebab wraps) and used them across the homepage and the About page gallery, replacing the last of the illustrated placeholders. No stock photos, no AI-generated images — everything is from your actual menu board and combo poster.
- **Real app icons** (favicon + Apple touch icon) generated from the diamond mark, plus a web app manifest so visitors on mobile can "Add to Home Screen" and get a proper app-like icon.
- **Elite interactive touches**: a scroll progress bar along the top of the page, a soft cursor-follow glow in the homepage hero, and buttons that subtly pull toward your cursor — small things most small-business sites skip.
- **Animated stat counters** on the homepage (20+ years, 4.2★, 222+ reviews, 40+ seats) that count up as you scroll to them.
- **"Today's Special" banner** on the homepage — automatically rotates through a different dish each day of the week.
- **Testimonial carousel** with auto-advance, arrows and dots, instead of a static grid.
- **Interactive menu filter tabs** — visitors can jump straight to Kebabs, Persian Specials, Vegetarian, or Sweets instead of scrolling the whole menu.
- **"Surprise me" dish picker** at the bottom of the menu, complete with a little confetti burst.
- **Click-to-enlarge photo lightbox** on the About page gallery.
- **Live "Open now / Closed" badge** on the Home and Menu pages, computed from real Auckland time against your actual hours.
- **SEO structured data** (`Restaurant` JSON-LD schema) on every page — address, hours, phone, price range and rating, so Google can show rich results.
- Open Graph / Twitter card meta tags, so links shared on social/WhatsApp show a proper title and description.
- A subtle scroll-reveal animation on cards and sections.
- A sticky mobile "Call / Directions / Order" action bar.

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
it, so once it's live on Netlify, every submission is automatically
collected under **Forms** in your Netlify dashboard — no extra setup
needed. To also get them emailed to you: **Site settings → Forms →
Form notifications → Add notification → Email notification**, then
enter your email address. From then on, every message a customer
sends through the site lands in your inbox.

⚠️ **Important**: on GitHub Pages alone (with no Netlify), the form has
nowhere to send to, since GitHub Pages can't run a backend. The page's
JS will still *look* like it worked (it shows the "Message sent"
success screen), because it can't actually detect whether a real
backend received it — but nothing is stored anywhere unless the site is
deployed on Netlify. Don't rely on the contact form for real enquiries
until it's live on Netlify.

## 3. Things to personalise before launch

- **Photos & video**: the food photos (kebab wrap, rice bowl, combo shot), the logo, and the storefront photo are now real — pulled from your own menu artwork and signage photo, not stock or illustrations. A few illustrated accents remain (the "Around the cafe" gallery on the About page, the Baklava & Turkish Coffee card on the homepage) — swap those `.gallery-item`/`.dish-card` blocks for real `<img>` tags whenever you have more photos. The "Take a look inside" video block on the homepage is also still a static image — swap it for a real video embed (e.g. an Instagram Reel or YouTube embed code) whenever you have one. I still won't pull photos from Google/Tripadvisor review pages, since those were uploaded by other people, not you.
- **Menu & prices**: the full menu on `menu.html` (kebabs, rice meals, traditional dishes, sides, desserts, drinks, and the two Deal Combos) matches your actual menu board and combo poster exactly. If prices change, update them directly in `menu.html` — and consider updating `js/chat.js`'s `price` fact too, so the chat assistant stays accurate.
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

## Security & legal — what's included, and what's still on you

I did a security pass and added the things a real deployment needs:

- **No secrets anywhere.** There's no API key, password, or token in this codebase — the "Ask Almaz" chatbot runs entirely in the browser with hardcoded facts, and the contact form goes through Netlify's own form handling. Nothing to leak.
- **Spam protection** on the contact form (a honeypot field Netlify uses to silently drop bot submissions).
- **Security headers** (`netlify.toml`) — clickjacking protection, MIME-sniffing protection, a Content Security Policy, and a referrer policy. These only take effect on Netlify, not GitHub Pages.
- **HTTPS** — automatic and free on both Netlify and GitHub Pages, nothing to configure.
- **Privacy Policy** (`privacy.html`, linked in every footer) — since the contact form collects a name, email, and message, this explains what happens to it. Worth a quick read to make sure it matches how you actually handle enquiries.
- **robots.txt + sitemap.xml** so Google indexes the site properly, and a custom **404 page** instead of a broken default.
- **Allergen note** added to the menu page — "please let your server know of any allergies," standard practice for a food business and something you'd want regardless of the website.

**Not included, and worth thinking about separately:**
- This isn't legal advice, and I'm not a lawyer — if you want a proper Terms of Service or want the Privacy Policy reviewed for NZ Privacy Act 2020 compliance specifically, that's worth a quick check from someone qualified, especially once the site is handling real customer data.
- Food safety, allergen labelling, and pricing-display obligations (e.g. under the Fair Trading Act) are about how the business operates, not the website — the site just displays what you tell it to.
- If you ever add real analytics (Google Analytics, Meta Pixel, etc.), that changes the privacy picture — you'd likely need a cookie-consent banner and an updated Privacy Policy at that point. Right now the site has zero tracking, so none of that applies yet.

## Real dish photography (added from your own photoshoot)

Nine professional dish photos and a hero collage were added from the files you sent (Uber Eats / Hi-Res / Low-Res sets), matched to the correct real menu items:

- Chicken Salad, Chicken on Rice, Falafel on Rice, Beef on Rice, Lamb on Rice, Moussaka, Chicken & Chips, Cheese Burger, Almaz Platter

Each now has a real thumbnail directly on its menu row, and hovering over any of those rows on desktop pops up a larger floating preview of the actual dish next to your cursor — this is the "shows the item" interaction. On mobile, the thumbnail is simply always visible instead (no hover on touchscreens, so this is the right fallback rather than a broken feature).

The homepage's "customer favourites" cards, the About page's "Around the cafe" gallery (now 9 real photos, up from 4 illustrations), and the "Take a look inside" video frame all now use this real photography instead of the earlier menu-poster crops.

## This round's changes

- **Fixed a real dark-mode bug**: the footer background and text were both using the same variable, so in Dark mode the footer became invisible (light text on a light background) — this is almost certainly what "can't see the bottom" was. Fixed by giving the footer its own always-dark token, independent of the theme.
- **Real badge logo** — swapped in the actual "almaz · the real turkish taste" circular badge from your wall, cropped from the photo you sent, paired with a clean text wordmark for legibility at small sizes.
- **Blurred storefront backdrop** on the homepage hero — your real shopfront photo, blurred and darkened behind the hero text, the same treatment used by kebabsonmaskell.co.nz and other restaurant sites, with a subtle parallax drift as you scroll.
- **Trust badge strip** under the nav (4.2★ rating, Halal certified, 20+ years, Uber Eats/DoorDash) — inspired by the "awards" row on the reference site, but built from real, verifiable facts about Almaz rather than invented awards, since I won't fabricate credentials that aren't real.
- **All remaining low-quality/black-background photos replaced** with your real photoshoot images (brown wood table background, consistent throughout) — nothing mismatched anymore.
- **Mobile pass**: tighter spacing, smaller touch-friendly thumbnails, horizontally-scrollable trust badges, adjusted hero type scale, and the floating hover-preview is now explicitly disabled on touch devices (it was already effectively off, this makes it certain) so nothing breaks on a phone.
