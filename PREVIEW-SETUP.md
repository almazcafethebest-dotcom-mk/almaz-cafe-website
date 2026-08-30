# Showing the site privately, for free

Netlify build credits have run out, so the Netlify copy is frozen on an old
version and cannot update until the billing cycle resets. This is the way to
get the current site online, behind a password, at no cost, today.

Cloudflare Pages has no build-minute cap and no bandwidth cap on its free
plan, so it also makes a sensible permanent backup host.

---

## 1. Put the latest files in GitHub

Same as before: repo -> **Add file** -> **Upload files** -> drag in everything
inside the `almaz-cafe` folder -> **Commit changes**.

## 2. Connect Cloudflare Pages

1. Sign up free at <https://dash.cloudflare.com> (a Google sign-in is fine).
2. **Compute (Workers & Pages)** -> **Create** -> **Pages** ->
   **Connect to Git** -> authorise GitHub -> pick `almaz-cafe-website`.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** `node build.js`
   - **Build output directory:** `/`
4. **Save and Deploy.** First build takes about a minute.

You get an address like `almaz-cafe-website.pages.dev`.

## 3. Put the password on it

1. In the Pages project: **Settings** -> **Variables and Secrets**.
2. Add a variable named exactly `SITE_PASSWORD`, with whatever password you
   want to hand out. Save.
3. **Deployments** -> **Retry deployment**, so the new value is picked up.

Now every page asks for that password first. Send the buyer the address and
the password and nothing else.

**To take the password off later:** delete the `SITE_PASSWORD` variable and
redeploy. With no password set the gate does not exist at all, so the same
files work as a normal public site.

---

## What the gate does and does not do

It stops anyone without the password from loading the site. That is all it
is for, and it does it properly: the cookie holds a signature rather than
the password, so it cannot be forged, and the check is timing-safe.

It does **not** stop the person you gave the password to from saving the
files once they are in. Nothing can - a browser has to download a page to
draw it. Your protection there is that the files alone are not the product:
the domain, the Netlify and Cloudflare accounts, the editor logins and the
build that turns his edits back into a website all stay with you until you
hand them over.

---

## Files involved

| File | What it is |
|---|---|
| `functions/_middleware.js` | The password gate. Cloudflare only. Inert unless `SITE_PASSWORD` is set. |
| `netlify.toml` | Points Netlify's functions directory at `netlify/functions`, so Netlify ignores the Cloudflare folder. |

Both hosts can run from the same repo at the same time without interfering.
