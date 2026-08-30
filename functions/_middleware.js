/* ============================================================
   ALMAZ CAFE  -  functions/_middleware.js

   A password gate for the PREVIEW copy of the site.

   This file only does anything on Cloudflare Pages, and only
   when an environment variable called SITE_PASSWORD has been
   set in the Cloudflare dashboard. With no password set it
   steps aside completely, so the public site is never gated.

   Netlify ignores this folder - netlify.toml points Netlify's
   own functions directory somewhere else on purpose.

   TO TURN THE GATE ON
     Cloudflare dashboard - your Pages project - Settings -
     Variables and Secrets - add  SITE_PASSWORD  with whatever
     password you want to give out, then redeploy.

   TO TURN IT OFF
     Delete that variable and redeploy.
   ============================================================ */

const COOKIE = "almaz_preview";
const MAX_AGE = 60 * 60 * 24 * 14;   // stay signed in for a fortnight

/* The cookie holds a signature of the password rather than the password
   itself, so a stolen cookie reveals nothing and cannot be hand-written. */
async function sign(secret) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(COOKIE));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* Compares in constant time. A plain === leaks how much of the value
   matched through how long it took to fail. */
function same(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function loginPage(wrong) {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Almaz Cafe &mdash; private preview</title>
<style>
  :root{color-scheme:light}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
       background:radial-gradient(120% 90% at 50% 30%,#FFFDF6 0%,#F3E6C9 60%,#E4D3B0 100%);
       font:16px/1.6 "Jost","Segoe UI",system-ui,sans-serif;color:#2A1A0C}
  .card{width:100%;max-width:380px;background:#FFFBF2;border:1px solid rgba(42,26,12,.14);
        border-radius:16px;padding:34px 30px;box-shadow:0 30px 70px -40px rgba(42,26,12,.6);
        position:relative;overflow:hidden}
  .card::before{content:"";position:absolute;inset:0 0 auto 0;height:2px;
        background:linear-gradient(90deg,transparent,#C98A2E 24%,#B84514 60%,transparent)}
  h1{font-size:1.5rem;letter-spacing:.02em;text-transform:uppercase;margin:0 0 6px}
  p{margin:0 0 22px;font-size:.94rem;color:#5C4326}
  label{display:block;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;
        color:#8A6A3E;margin-bottom:7px}
  input{width:100%;padding:13px 14px;font:inherit;border-radius:8px;
        border:1px solid rgba(42,26,12,.22);background:#fff;color:#2A1A0C}
  input:focus{outline:2px solid #C98A2E;outline-offset:1px;border-color:transparent}
  button{width:100%;margin-top:14px;padding:13px;border:0;border-radius:8px;
         background:#B84514;color:#FFF6E8;font:inherit;font-weight:600;letter-spacing:.12em;
         text-transform:uppercase;font-size:.8rem;cursor:pointer}
  button:hover{background:#9C3A10}
  .err{margin:0 0 16px;padding:10px 12px;border-radius:8px;background:#FBE4DA;
       color:#8E2C08;font-size:.86rem}
</style></head><body>
<form class="card" method="POST" action="">
  <h1>Almaz Cafe</h1>
  <p>Private preview. Enter the password you were given.</p>
  ${wrong ? '<p class="err">That password wasn&rsquo;t right. Try again.</p>' : ""}
  <label for="pw">Password</label>
  <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
  <button type="submit">View the site</button>
</form>
</body></html>`;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const secret = env.SITE_PASSWORD;

  // No password configured: the gate does not exist.
  if (!secret) return next();

  const url = new URL(request.url);
  const token = await sign(secret);

  // Submitting the form.
  if (request.method === "POST") {
    const form = await request.formData();
    if (same(String(form.get("password") || ""), secret)) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: url.pathname + url.search,
          "Set-Cookie": `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`
        }
      });
    }
    return new Response(loginPage(true), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
    });
  }

  // Already signed in.
  const cookies = request.headers.get("Cookie") || "";
  const found = cookies.split(";").map((c) => c.trim()).find((c) => c.startsWith(COOKIE + "="));
  if (found && same(found.slice(COOKIE.length + 1), token)) return next();

  return new Response(loginPage(false), {
    status: 401,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
  });
}
