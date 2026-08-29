# Almaz Cafe — technical handover

Static HTML, CSS and JavaScript. No build step, no framework, no database,
no packages to install. Open `index.html` in a browser and it runs.

**The owner's copy of this information is `OWNER-GUIDE.html`** — written in
plain English and meant to be opened in a browser, not read as source. This
file is the version for whoever maintains the code.

---

## Publishing

Drag the whole folder onto <https://app.netlify.com/drop>. `netlify.toml`
already sets security headers, caching and the 404 redirect, so there is
nothing to configure afterwards.

Custom domain: Netlify → Domain settings → Add custom domain, then point a
CNAME at the Netlify address.

---

## Before the site goes live on its real domain

Three things still say `almazcafe.netlify.app`:

- `sitemap.xml` — six URLs
- `robots.txt` — the `Sitemap:` line
- every `.html` — the `<link rel="canonical">` in the head

One find-and-replace across the folder. Do it before submitting to Search
Console, or Google indexes the Netlify subdomain as the real site.

---

## One place for the details

`site-settings.js` holds phone, email, address, hours and the social links,
and is loaded on every page **before** `js/almaz-2026.js`. Anything in the
markup carrying `data-site="…"` gets its text filled in, and anything with
`data-site-link="email|phone|facebook|instagram"` gets its `href` set.

This is deliberately the only file the owner should ever need for contact
details. If you add a phone number or email anywhere, tag it rather than
hard-coding it, or the single-source promise quietly stops being true.

The visible email is a placeholder (`almazcafethebest@gmail.com`) until the real
one is supplied.

**Contact-form messages are separate.** They go to Netlify Forms. Nobody is
notified until someone adds an email notification under Forms → Form
notifications. Until that is done the messages accumulate unseen.

---

## File map

| Path | What it is |
|---|---|
| `START-HERE.txt` | First thing the owner should read. |
| `OWNER-GUIDE.html` | The owner's guide. `noindex`, so it will not be listed by Google. |
| `site-settings.js` | Contact details, hours, social links. Loaded on every page. |
| `*.html` | One file per page. Each opens with a plain-English comment. |
| `css/style.css` | Original stylesheet — layout, components, colour tokens. |
| `css/almaz-2026.css` | Redesign layer, loaded second so it wins. 54 numbered sections, each with a note on why it exists. |
| `js/almaz-2026.js` | Redesign behaviour. Every piece is called inside its own `try`, so one failure cannot take the page down. |
| `js/*.js` | One small script per feature, each independent. |
| `images/` | Photography, logo, printable menu. |
| `netlify.toml` | Headers, caching, redirects. |

---

## Things worth knowing before you change something

**The cascade.** `almaz-2026.css` loads after `style.css` and uses
`!important` heavily to override it. If an edit to `style.css` appears to do
nothing, the answer is almost always a rule in `almaz-2026.css`. Global
`h1`/`h2`/`h3` rules in section 3 are `!important`, so a component heading
has to match them in kind to change size.

**Any component that sets its own background must set its own colour in the
same rule.** Three separate "invisible text" bugs during the build had one
cause: a card set a cream background and inherited cream text from a dark
band. There is a pixel-level contrast audit for exactly this — see below.

**The hero is a grid, and grid items default to `min-width: auto`.** A
non-breaking space in the headline once made a single unbreakable line
415px wide inside a 342px column; `.hero { overflow: hidden }` then cut the
end off the headline, the sentence and the buttons on every phone, silently.
`.hero .wrap { min-width: 0 }` is now there to stop that recurring. Avoid
`&nbsp;` in headings.

**Menu categories cap at three visible rows**, photo rows first, then a
"see more". `menuCaps()` reorders the whole list through one document
fragment — moving nodes one at a time relative to a moving anchor scrambles
the order.

**Page transitions.** There is no view-transition and no overlay. Links
navigate directly. Speculation rules in each page head pre-fetch same-origin
links on hover in Chrome and Edge; `prefetchLinks()` does the same by hand
elsewhere, and stands down on save-data and 2G. The homepage loads the first
hero photograph eagerly and the other two after load, so a visitor is not
paying for two pictures they will not see for four seconds.

---

## Checks

`/home/claude/audit.py` renders every page in both themes and compares each
text colour against the pixels actually painted around it, rather than
against the declared background. It catches "same colour as the background"
regardless of which rule caused it. Current state: **zero real failures**
(one reported entry is the order-ahead dialog, measured while closed —
its parent has `opacity: 0`, so the reading is meaningless).

Also worth re-running after layout changes: a sweep at 320/360/390/414/768px
checking that nothing extends past the viewport. That is how the clipped
hero was found.

---

## The CMS

The owner edits the site at `/admin` (Decap CMS + Netlify Identity + Git
Gateway). **Setup steps are in `SETUP-README.md`** — the site must be in a
GitHub repo on branch `main` before any of it works.

`admin/config.yml` decides what boxes he sees. It is split so that the
sidebar reads like a menu: The Menu (one entry per category) and Cafe
Details (contact details, today's special). Field labels and hints are
written for someone who has never seen a CMS.

`build.js` turns `data/` back into the site on every deploy. Plain Node,
no dependencies. Generated regions sit between markers; everything outside
them is hand-written and untouched. See `SETUP-README.md` for the mapping.

The public CSP stays strict. `/admin` gets its own looser policy in
`netlify.toml`, scoped to that path only, because Decap and the Identity
widget load from `unpkg.com` and `identity.netlify.com`. The invite-token
redirect on `index.html` is inline rather than the Netlify Identity widget,
specifically so the public pages do not need a third-party script.

Set Identity registration to **Invite only**. Left open, anyone who finds
`/admin` can sign up and edit the menu.
