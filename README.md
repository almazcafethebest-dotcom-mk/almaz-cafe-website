# Almaz Cafe website

A simple, fast, 4-page static website for Almaz Cafe (Onehunga, Auckland):
`index.html` (Home), `menu.html`, `about.html`, `contact.html`.

No build step, no framework — plain HTML/CSS/JS, so it deploys as-is to
GitHub Pages or Netlify.

## File structure

```
almaz-cafe/
├── index.html
├── menu.html
├── about.html
├── contact.html
├── css/style.css
├── js/script.js
├── images/          ← put your real photos here
└── README.md
```

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

- **Photos**: replace the dashed-border placeholder blocks in
  `index.html` and `about.html` with `<img>` tags pointing at real
  photos dropped into the `images/` folder.
- **Menu & prices**: edit the items directly in `menu.html`.
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
