# Almaz Cafe — one-time setup

Do these once, in this order. Roughly twenty minutes. After that the owner
manages the site himself at `/admin` and you should not hear from him again
except for real problems.

Everything is signed into with the cafe's Gmail — `almazcafethebest@gmail.com` —
so when you hand over the Gmail password, he owns the lot.

---

## 1. Put the site in a GitHub repo

This is the step that makes the CMS possible. Decap saves an edit by
committing it to Git; without a repo there is nothing for it to commit to,
and the Identity → Git Gateway button will not work.

Sign in to GitHub **as the cafe Gmail**, create a new repository (private is
fine), then from this folder:

```
git init
git add .
git commit -m "Almaz Cafe website"
git branch -M main
git remote add origin https://github.com/<account>/almaz-cafe.git
git push -u origin main
```

The branch must be called **main** — `admin/config.yml` names it.

## 2. Point Netlify at the repo

In Netlify: **Add new site → Import an existing project → GitHub**, pick the
repo, and accept the settings it reads from `netlify.toml`:

- Build command: `node build.js`
- Publish directory: `.`

From now on, publishing means pushing to GitHub. The old drag-and-drop
method still works in an emergency, but it bypasses the build, so use the
repo.

## 3. Turn on Identity and Git Gateway

Netlify → the site → **Identity** → **Enable Identity**.

Then, still under Identity:

- **Registration** → set to **Invite only**. Without this, anyone who finds
  `/admin` can sign themselves up and start editing the menu.
- **Services** → **Git Gateway** → **Enable Git Gateway**. This is the bridge
  that lets the editor commit without anyone holding a GitHub password.

## 4. Create the owner's login

Identity → **Invite users** → enter `almazcafethebest@gmail.com`.

Open that inbox, click the invitation, and set a password. The invite link
lands on the home page and redirects itself into `/admin` — that redirect is
already in `index.html`.

Check the junk folder if it does not arrive.

## 5. Test it before you hand over

Worth five minutes:

1. Log in at `/admin`.
2. Change one price. Publish.
3. Watch the deploy run in Netlify → Deploys.
4. Confirm the new price is on the live menu page.
5. Change it back.

If the deploy fails, open the log. `build.js` reports which file it could not
read; it stops rather than writing a half-built page.

## 6. Hand over

Write these three lines down for him:

- **The website editor** — `https://<the site>/admin` — *bookmark this*
- **Gmail** — `almazcafethebest@gmail.com` and the password
- **Netlify** — `netlify.com`, click *Log in with Google*, same Gmail

Then point him at `OWNER-GUIDE.html`, which is written for him and covers
everything he will actually do.

---

## Still outstanding

**The domain.** Four places name `almazcafe.netlify.app`:

- `sitemap.xml` — six URLs
- `robots.txt` — the `Sitemap:` line
- every `.html` — the `<link rel="canonical">` in the head
- `admin/config.yml` — `site_url`, `display_url`, `logo_url`

One find-and-replace across the folder once the real domain exists. Do it
before submitting to Google Search Console, or Google indexes the Netlify
subdomain as the real site.

**Form notifications.** Netlify → Forms → Form notifications → Add → Email.
Section 7 of the owner's guide walks him through it if you would rather he
did it himself.

---

## How the build works

`build.js` is plain Node with no dependencies — nothing to install, nothing
that can rot.

| Source (edited in the CMS) | Generated |
|---|---|
| `data/settings.json` | `site-settings.js` |
| `data/specials.json` | the list inside `js/special.js` |
| `data/menu/*.json` | the menu inside `menu.html` |

The generated regions sit between markers (`<!-- MENU:START -->`,
`/* SPECIALS:START */`). Everything outside them is hand-written and left
alone, so page structure, copy and SEO stay under your control while prices
belong to the owner.

Running the build twice produces byte-identical output, and the generated
menu is byte-identical to the hand-written one it replaced — verified, not
assumed. Editing a generated file by hand works until the next publish and
is then overwritten; edit `data/` instead.

To add a field to the editor: add it to `admin/config.yml`, then teach
`build.js` what to do with it. Both files are commented.
