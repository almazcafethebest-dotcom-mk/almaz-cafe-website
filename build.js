/* ============================================================
   ALMAZ CAFE  -  build.js

   Turns the files in data/ into the website.

   Netlify runs this automatically every time somebody clicks
   Publish in the website editor, so nobody ever has to run it
   by hand. If you want to run it on your own computer:

       node build.js

   It has no dependencies - plain Node, nothing to install.

   What it writes:
     data/settings.json   ->  site-settings.js
     data/specials.json   ->  the list inside js/special.js
     data/menu/*.json     ->  the menu inside menu.html

   Those three destinations are GENERATED. Editing them by hand
   works until the next Publish, and then it is overwritten.
   Edit the files in data/ instead.
   ============================================================ */

const fs = require("fs");
const path = require("path");

/* The order categories appear on the page. A category missing from
   this list is simply not published, which is a deliberate way to
   retire one without deleting it. */
const ORDER = ["combos", "kebabs", "rice", "traditional", "veg",
               "fishburgers", "sides", "drinks"];

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Replace the text between two markers, leaving the markers in place.
   Refusing rather than guessing is deliberate: a half-written page is
   worse than a build that stops and says why. */
function between(file, marker, replacement) {
  const open = `<!-- ${marker}:START -->`, close = `<!-- ${marker}:END -->`;
  const src = fs.readFileSync(file, "utf8");
  const a = src.indexOf(open), b = src.indexOf(close);
  if (a === -1 || b === -1 || b < a) {
    throw new Error(`${file}: could not find the ${marker} markers. They must both be present and in order.`);
  }
  return src.slice(0, a + open.length) + "\n" + replacement + src.slice(b);
}

/* A photo the owner uploads through the editor will not have a
   matching -thumb file. Fall back to the full picture rather than
   linking to something that does not exist. */
function thumbFor(photo) {
  if (!photo) return null;
  const t = photo.replace(/(\.[a-z0-9]+)$/i, "-thumb$1");
  return fs.existsSync(path.join(__dirname, t)) ? t : photo;
}

function itemHTML(it) {
  const name = esc(it.name) +
    (it.name_note ? ` <span style="font-weight:400; opacity:0.7;">${esc(it.name_note)}</span>` : "");
  const desc = it.description
    ? `<div class="menu-item-desc">${esc(it.description)}</div>` : "";
  const price = `<div class="menu-item-price">${esc(it.price)}</div>`;
  const inner = `<div><div class="menu-item-name">${name}</div>${desc}</div>`;

  if (!it.photo) {
    return `        <div class="menu-item">${inner}${price}</div>`;
  }
  const alt = esc(it.name);
  return `        <div class="menu-item has-photo" data-img="${esc(it.photo)}" data-name="${alt}">` +
         `<img class="menu-item-thumb" src="${esc(thumbFor(it.photo))}" alt="${alt}" loading="lazy" />` +
         `<div class="menu-item-main">${inner}${price}</div></div>`;
}

const SUBHEAD = 'style="margin-top:26px; font-family:var(--font-display); color:var(--espresso-deep);"';

function categoryHTML(id, c) {
  const tag = c.halal
    ? ' <span class="dish-tag" style="position:static; display:inline-block; vertical-align:middle;">Halal</span>'
    : "";
  const out = [`      <div class="menu-group" data-category="${esc(id)}">`,
               `        <h2>${esc(c.title)}${tag}</h2>`];

  /* The combos block is a row of picture cards plus the sauce list,
     not a price list, so it is built differently. */
  if (c.cards && c.cards.length) {
    out.push('        <div class="grid-3" style="margin-bottom:10px;">');
    c.cards.forEach((k) => {
      out.push('          <div class="dish-card tilt-card">',
        '            <div class="gallery-item" style="border-radius:0; aspect-ratio:4/3;">',
        `              <img src="${esc(k.photo)}" alt="${esc(k.alt || k.name)}" style="width:100%; height:100%; object-fit:cover;" loading="lazy" decoding="async">`,
        `              <span class="cap">${esc(k.tag || "")}</span>`,
        '            </div>',
        '            <div class="dish-body">',
        `              <h3>${esc(k.name)}</h3>`,
        `              <p>${esc(k.description || "")}</p>`,
        `              <p class="menu-item-price" style="margin-top:8px;">${esc(k.price)}</p>`,
        '            </div>', '          </div>');
    });
    if (c.sauces && c.sauces.length) {
      out.push('          <div class="dish-card tilt-card">',
        '            <div class="dish-body" style="padding-top:24px;">',
        `              <h3>${esc(c.sauces_title || "Choose up to 3 sauces")}</h3>`,
        '              <div class="sauce-stickers">');
      c.sauces.forEach((s) => {
        out.push(`                <span class="sauce-sticker" style="--sc:${esc(s.colour)}; --st:${esc(s.text_colour)}; --rot:${esc(s.tilt)};">${esc(s.name)}</span>`);
      });
      out.push('              </div>', '            </div>', '          </div>');
    }
    out.push('        </div>');
  }

  (c.items || []).forEach((it) => out.push(itemHTML(it)));
  if (c.note) out.push(`        <p class="form-note">${esc(c.note)}</p>`);

  (c.sections || []).forEach((s) => {
    out.push("", `        <h3 ${SUBHEAD}>${esc(s.heading)}</h3>`);
    if (s.note) out.push(`        <p class="form-note" style="margin-top:-4px;">${esc(s.note)}</p>`);
    (s.items || []).forEach((it) => out.push(itemHTML(it)));
  });

  out.push("      </div>");
  return out.join("\n");
}

/* ---- 1. the menu ---------------------------------------------------- */
function buildMenu() {
  const blocks = [];
  let count = 0;
  ORDER.forEach((id) => {
    const f = path.join(__dirname, "data", "menu", id + ".json");
    if (!fs.existsSync(f)) { console.log(`  (no data/menu/${id}.json — skipped)`); return; }
    const c = read(f);
    blocks.push(categoryHTML(id, c));
    count += (c.items || []).length + (c.cards || []).length +
             (c.sections || []).reduce((n, s) => n + (s.items || []).length, 0);
  });
  fs.writeFileSync("menu.html", between("menu.html", "MENU", blocks.join("\n\n") + "\n"));
  console.log(`  menu.html      ${count} dishes across ${blocks.length} categories`);
}

/* ---- 2. today's special --------------------------------------------- */
function buildSpecials() {
  const { specials } = read("data/specials.json");
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const rows = DAYS.map((day) => {
    const s = specials.find((x) => x.day === day) || { name: "", note: "" };
    const q = (v) => JSON.stringify(String(v || ""));
    return `    { name: ${q(s.name)}, note: ${q(s.note)} }, // ${day.slice(0, 3)}`;
  }).join("\n");

  const file = "js/special.js";
  const src = fs.readFileSync(file, "utf8");
  const open = "/* SPECIALS:START */", close = "/* SPECIALS:END */";
  const a = src.indexOf(open), b = src.indexOf(close);
  if (a === -1 || b === -1) throw new Error(`${file}: SPECIALS markers missing.`);
  fs.writeFileSync(file, src.slice(0, a + open.length) + "\n" + rows + "\n  " + src.slice(b));
  console.log(`  js/special.js  7 daily specials`);
}

/* ---- 3. contact details --------------------------------------------- */
function buildSettings() {
  const s = read("data/settings.json");
  const q = (v) => JSON.stringify(String(v || ""));
  const body = `/* ============================================================
   ALMAZ CAFE  -  site-settings.js

   GENERATED FILE - DO NOT EDIT BY HAND.

   Change these details in the website editor (the "Cafe details"
   entry), or in data/settings.json. This file is rewritten from
   scratch every time the site publishes, so any change made here
   is lost at the next Publish.
   ============================================================ */

window.ALMAZ_SETTINGS = {
  email:     ${q(s.email)},
  phone:     ${q(s.phone)},
  phoneDial: ${q(s.phoneDial)},
  address:   ${q(s.address)},
  hours:     ${q(s.hours)},
  facebook:  ${q(s.facebook)},
  instagram: ${q(s.instagram)}
};

(function () {
  var S = window.ALMAZ_SETTINGS || {};
  function fill() {
    document.querySelectorAll("[data-site]").forEach(function (el) {
      var v = S[el.getAttribute("data-site")];
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-site-link]").forEach(function (el) {
      var k = el.getAttribute("data-site-link");
      var href =
        k === "email" ? (S.email ? "mailto:" + S.email : null)
      : k === "phone" ? (S.phoneDial ? "tel:" + S.phoneDial : null)
      : S[k] || null;
      if (href) el.setAttribute("href", href);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fill);
  } else { fill(); }
})();
`;
  fs.writeFileSync("site-settings.js", body);
  console.log(`  site-settings.js  ${s.phone} / ${s.email}`);
}

console.log("Building Almaz Cafe from data/ …");
buildSettings();
buildSpecials();
buildMenu();
console.log("Done.");
