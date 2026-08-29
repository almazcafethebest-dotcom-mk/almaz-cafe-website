/* ============================================================
   ALMAZ CAFE  -  js/almaz-2026.js

   The main behaviour file for the 2026 redesign: the rolling plate above the bar, the menu 'see more' buttons, the pickup pop-up, the photo rails, the light/dark hint, and page pre-loading. Sections are named and commented.

   Plain-English guide: open OWNER-GUIDE.html in the main folder.
   Phone, email, address and hours live in site-settings.js
   ============================================================ */
/* ==========================================================================
   ALMAZ — 2026 behaviour layer

   Everything is feature-detected and wrapped, because this runs on a
   restaurant site where a thrown error in a decorative effect must never
   take the phone number down with it.
   ========================================================================== */
(function () {
  "use strict";

  var REDUCED = false;
  try { REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  var COARSE = false;
  try { COARSE = matchMedia("(pointer: coarse)").matches; } catch (e) {}

  /* ----------------------------------------------------------------------
     1. THE ROLLING PLATE
     Internal links are intercepted: the plate rolls in, and only once it
     has covered the screen does the browser actually navigate. On arrival
     the new page rolls it back off.

     The guard that matters: if navigation is somehow blocked or slow, a
     timeout releases the overlay so nobody is ever left staring at a
     plate. Deceleration is never worth a dead page.
     ---------------------------------------------------------------------- */
  /* The full-screen plate transition was removed before handover. It
     never settled: a roll was too slow, a still was a hard cut, and every
     version added a stall between the click and the page. The site is
     faster and calmer without it — links now navigate instantly, which is
     what people actually want from a restaurant site. The plate motif
     lives on in the marquee above the bar.  */

  /* A plate rolling along the strip above the bar — the motif, at a size
     where it is a detail rather than an event. */
  function miniPlate() {
    if (REDUCED) return;
    // The strip used to be pinned to the top of the window, above the bar.
    // The bar is now full width at the top of the page, so there is no gap
    // for it to live in. It is placed into the page instead, wherever the
    // markup puts <div id="plate-strip-slot">.
    var slot = document.getElementById("plate-strip-slot");
    if (!slot || slot.querySelector(".plate-mini-strip")) return;
    var strip = document.createElement("div");
    strip.className = "plate-mini-strip";
    strip.setAttribute("aria-hidden", "true");
    strip.innerHTML = '<span class="plate-mini"></span>';
    slot.appendChild(strip);
  }

  function nav() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var last = window.scrollY, ticking = false;
    function onScroll() {
      var y = window.scrollY;
      // Wide across the page at rest, contracting into the floating capsule
      // as soon as the visitor moves. 30px is enough that a stray wheel
      // nudge does not flicker it.
      header.classList.toggle("scrolled", y > 30);
      header.classList.toggle("at-top", y <= 30);
      // Only hide well past the fold, and never while a menu is open.
      if (y > 260 && y > last + 4 && !document.querySelector(".nav-links.open")) {
        header.classList.add("nav-hidden");
      } else if (y < last - 4 || y < 120) {
        header.classList.remove("nav-hidden");
      }
      last = y;
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    // Sliding pill behind whichever link is hovered, parked on the current page.
    var links = document.querySelector(".nav-links");
    if (!links || COARSE) return;
    var pill = document.createElement("span");
    pill.className = "nav-pill";
    links.appendChild(pill);

    function move(el, pin) {
      if (!el) return;
      pill.style.width = el.offsetWidth + "px";
      pill.style.transform = "translateX(" + el.offsetLeft + "px)";
      pill.classList.toggle("pinned", !!pin);
    }
    var current = links.querySelector('a[aria-current="page"]');
    function park() { if (current) move(current, true); else pill.classList.remove("pinned"); }

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("mouseenter", function () { move(a, true); });
    });
    links.addEventListener("mouseleave", park);
    window.addEventListener("resize", park);
    setTimeout(park, 60);
  }

  /* ----------------------------------------------------------------------
     3. BACK TO TOP — with a progress ring
     ---------------------------------------------------------------------- */
  function toTop() {
    var b = document.createElement("button");
    b.className = "to-top";
    b.type = "button";
    b.setAttribute("aria-label", "Back to top");
    b.innerHTML =
      '<svg class="ring" viewBox="0 0 48 48" fill="none" aria-hidden="true">' +
        '<rect x="1" y="1" width="46" height="46" rx="6" stroke="currentColor" ' +
        'stroke-opacity="0.9" stroke-width="1.5" pathLength="1" ' +
        'stroke-dasharray="1" stroke-dashoffset="1"/></svg>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(b);

    var ring = b.querySelector(".ring rect");
    var ticking = false;
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      b.classList.toggle("show", h.scrollTop > 500);
      if (ring) ring.setAttribute("stroke-dashoffset", String(1 - p));
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(upd); }
    }, { passive: true });
    upd();

    b.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
    });
  }

  /* ----------------------------------------------------------------------
     4. REVEALS
     Tagged at child level, not section level — a whole section fading as
     one block is not felt, but its cards arriving in sequence is.
     ---------------------------------------------------------------------- */
  function reveals() {
    var sel = ".dish-card, .feature-item, .review-card, .stat-item, " +
              ".section-head, .gallery-item, .menu-item, .card, " +
              ".video-feature, .special-banner, .taste-strip, .hero-meta div, .know-band";
    var els = Array.prototype.slice.call(document.querySelectorAll(sel));
    if (!els.length) return;

    if (!("IntersectionObserver" in window) || REDUCED) return;

    els.forEach(function (el) {
      if (el.closest(".hero")) return;   // the hero must never arrive late
      el.setAttribute("data-rise", "");
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        // Stagger siblings so a row lands like a row, not all at once.
        var sibs = en.target.parentElement
          ? Array.prototype.slice.call(en.target.parentElement.children)
          : [];
        var i = sibs.indexOf(en.target);
        en.target.style.setProperty("--d", Math.min(i, 6) * 85 + "ms");
        en.target.classList.add("risen");
        io.unobserve(en.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

    els.forEach(function (el) { if (el.hasAttribute("data-rise")) io.observe(el); });

    // Anything still hidden after 6s gets shown regardless. A decorative
    // reveal must never be the reason a menu is unreadable.
    setTimeout(function () {
      document.querySelectorAll("[data-rise]:not(.risen)").forEach(function (el) {
        el.classList.add("risen");
      });
    }, 6000);
  }

  /* ----------------------------------------------------------------------
     5. MENU — cap each category at five, reveal the rest on request
     Works off whatever the page structure happens to be: it finds each
     category block, counts its rows, and only acts when there are more
     than five.
     ---------------------------------------------------------------------- */
  function menuCaps() {
    var CAP = 3;
    var groups = document.querySelectorAll(".menu-group");
    if (!groups.length) return;

    groups.forEach(function (group) {
      var items = Array.prototype.slice.call(group.querySelectorAll(".menu-item"));
      if (!items.length) return;

      // A short code per row — K1, R2 — from the category name. It gives
      // every dish something to be asked for over the phone, and it is
      // what appears in the gutter on hover.
      var cat = (group.getAttribute("data-category") || "").toUpperCase();
      var letter = (cat.replace(/[^A-Z]/g, "") || "M").charAt(0);

      // Rows with a photograph go to the top of the category: people scan
      // menus by picture, so the pictures should be what is showing before
      // anything is expanded. Built as one fragment and put back in a
      // single insert — moving nodes one at a time relative to a moving
      // anchor is what scrambled the order the first time.
      var photos = items.filter(function (el) { return el.classList.contains("has-photo"); });
      var plain  = items.filter(function (el) { return !el.classList.contains("has-photo"); });
      var ordered = photos.concat(plain);

      var marker = document.createElement("span");
      marker.style.display = "none";
      items[0].parentNode.insertBefore(marker, items[0]);

      var frag = document.createDocumentFragment();
      ordered.forEach(function (el, i) {
        el.setAttribute("data-code", letter + (i + 1));
        frag.appendChild(el);
      });
      marker.parentNode.insertBefore(frag, marker);
      marker.remove();

      // Sub-headings inside the category ("Salads") lose their rows to the
      // reorder, so they would sit above nothing. They go with them.
      Array.prototype.forEach.call(group.querySelectorAll("h3"), function (h) {
        h.style.display = "none";
      });

      if (ordered.length <= CAP) return;
      var hidden = ordered.slice(CAP);
      hidden.forEach(function (el) { el.classList.add("is-hidden"); });

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "see-more";
      btn.setAttribute("aria-expanded", "false");

      function label(open) {
        btn.innerHTML = (open ? "Show less" : "See all") +
          ' <span class="count">' + (open ? "" : "+" + hidden.length) + "</span>" +
          '<svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" ' +
          'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
          'stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
      }
      label(false);

      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        hidden.forEach(function (el, i) {
          if (open) {
            el.classList.add("is-hidden");
            el.classList.remove("risen");
          } else {
            el.classList.remove("is-hidden");
            el.setAttribute("data-rise", "");
            el.style.setProperty("--d", Math.min(i, 8) * 40 + "ms");
            requestAnimationFrame(function () { el.classList.add("risen"); });
          }
        });
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        label(!open);
        if (open) ordered[0].scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "nearest" });
      });

      var last = ordered[ordered.length - 1];
      last.parentNode.insertBefore(btn, last.nextSibling);
    });
  }

  /* ----------------------------------------------------------------------
     6. MAGNETIC BUTTONS
     Replaces the older handler, which moved the button itself and so
     fought the hover lift. This moves only the label, which reads as the
     button leaning toward the cursor.
     ---------------------------------------------------------------------- */
  function magnetic() {
    if (COARSE || REDUCED) return;
    document.querySelectorAll(".btn").forEach(function (btn) {
      // Wrap the text so it can move independently of the box.
      if (!btn.querySelector(".btn-label")) {
        var span = document.createElement("span");
        span.className = "btn-label";
        span.style.cssText = "display:inline-flex;align-items:center;gap:.5em;" +
          "transition:transform .5s cubic-bezier(.16,1,.3,1);will-change:transform";
        while (btn.firstChild) {
          if (btn.firstChild.nodeType === 1 &&
              (btn.firstChild.classList.contains("btn-label"))) break;
          span.appendChild(btn.firstChild);
        }
        btn.appendChild(span);
      }
      var label = btn.querySelector(".btn-label");

      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        label.style.transform = "translate(" + (x * 12).toFixed(2) + "px," +
                                (y * 7).toFixed(2) + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        label.style.transform = "translate(0,0)";
      });
    });
  }

  /* ----------------------------------------------------------------------
     7. MAKE THE DISH CARDS ACTUALLY CLICKABLE
     They looked interactive and did nothing. Now the whole card is a link
     target, keyboard included.
     ---------------------------------------------------------------------- */
  function clickableCards() {
    document.querySelectorAll(".dish-card").forEach(function (card) {
      if (card.querySelector("a")) return;
      var href = card.getAttribute("data-href") || "menu.html";
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var h = card.querySelector("h3");
      if (h) card.setAttribute("aria-label", h.textContent + " — see it on the menu");
      function go() { 
        var a = document.createElement("a");
        a.href = href;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      card.addEventListener("click", go);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });
  }

  /* ----------------------------------------------------------------------
     8. HERO PARALLAX — the image drifts slower than the words
     ---------------------------------------------------------------------- */
  function heroDrift() {
    if (REDUCED || COARSE) return;
    var hero = document.querySelector(".hero");
    var copy = document.querySelector(".hero-copy");
    if (!hero || !copy) return;
    var ticking = false;
    function upd() {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        copy.style.transform = "translateY(" + (y * 0.16).toFixed(1) + "px)";
        copy.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.8)));
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(upd); }
    }, { passive: true });
  }


  /* ----------------------------------------------------------------------
     9. ORDER-AHEAD DIALOG
     Replaces the anchored popover, which on a phone could open past the
     edge of the screen with no visible way to dismiss it. A dialog needs
     three exits or it is a trap: the close control, the backdrop, and
     Escape. All three are wired, and focus is returned to the button that
     opened it so keyboard users are not dropped at the top of the page.
     ---------------------------------------------------------------------- */
  function orderAhead() {
    // Built after the settings file has filled the rest of the page, so it
    // reads the values itself rather than carrying its own copy.
    var S = window.ALMAZ_SETTINGS || {};
    var OA_PHONE = S.phone || "(09) 622 2108";
    var OA_DIAL = S.phoneDial || "+6496222108";
    var btn = document.getElementById("pickup-btn");
    if (!btn) return;

    var scrim = document.createElement("div");
    scrim.className = "oa-scrim";

    var card = document.createElement("div");
    card.className = "oa-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "oa-title");
    card.innerHTML =
      '<button class="oa-close" type="button" aria-label="Close">&times;</button>' +
      '<div class="oa-icon">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
        'stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 ' +
        '19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 ' +
        '2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z"/>' +
        '</svg></div>' +
      '<h3 id="oa-title">Order ahead</h3>' +
      '<p>Call and tell us what you want. We will have it hot and bagged, ' +
      'ready to pick up when you walk in &mdash; and there are no delivery-app ' +
      'fees on top.</p>' +
      '<a class="btn btn-primary" href="tel:' + OA_DIAL + '">Call ' + OA_PHONE + '</a>' +
      '<p class="oa-hours">Open daily 11am &ndash; 9pm</p>';

    document.body.appendChild(scrim);
    document.body.appendChild(card);

    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      scrim.classList.add("open");
      card.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      var first = card.querySelector("a.btn");
      if (first) first.focus({ preventScroll: true });
    }
    function close() {
      scrim.classList.remove("open");
      card.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    btn.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); open(); });
    card.querySelector(".oa-close").addEventListener("click", close);
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && card.classList.contains("open")) close();
    });
    // Keep tab focus inside the dialog while it is open.
    card.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = card.querySelectorAll("a[href], button");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ----------------------------------------------------------------------
     10. TODAY'S SPECIAL — a way through to the dish
     ---------------------------------------------------------------------- */
  function specialLink() {
    var banner = document.querySelector(".special-banner");
    if (!banner || banner.querySelector(".special-go")) return;
    var a = document.createElement("a");
    a.className = "special-go";
    a.href = "menu.html";
    a.innerHTML = 'See it on the menu <svg width="13" height="13" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    banner.appendChild(a);
  }


  /* ----------------------------------------------------------------------
     11. MENU RAILS
     Two columns of dishes running up the outside margins of the menu
     page — the same idea as the homepage strip, turned on its side.

     They only appear when there is real margin to put them in. Below
     1500px the menu column needs the full width, and a rail would either
     overlap the prices or squeeze them; so it is not built at all rather
     than built and hidden, which keeps the images off the network on the
     screens that cannot show them.
     ---------------------------------------------------------------------- */
  function menuRails() {
    // Everywhere except the two pages already carrying the photography:
    // the home page has the rotating hero, and the gallery IS the pictures.
    // Those two say so on their <body> tag rather than being sniffed out,
    // because the about page also contains a small gallery grid and was
    // being excluded by accident.
    if (document.body.dataset.rails === "off") return;
    if (window.innerWidth < 1500) return;
    if (REDUCED) return;

    var SHOTS = [
      ["food-beef-on-rice", "Beef on Rice"],
      ["food-lamb-on-rice", "Lamb on Rice"],
      ["food-chicken-salad", "Chicken Salad"],
      ["food-almaz-platter-real", "Almaz Platter"],
      ["food-falafel-on-rice", "Falafel on Rice"],
      ["food-moussaka-real", "Moussaka"],
      ["food-chicken-chips", "Chicken & Chips"],
      ["food-chicken-on-rice", "Chicken on Rice"],
      ["food-cheeseburger", "Cheeseburger"]
    ];

    function build(side, offset) {
      var rail = document.createElement("div");
      rail.className = "menu-rail menu-rail-" + side;
      rail.setAttribute("aria-hidden", "true");

      var track = document.createElement("div");
      track.className = "menu-rail-track";

      // The two rails start two images apart so they never show the same
      // dish level with itself across the page.
      var order = SHOTS.slice(offset).concat(SHOTS.slice(0, offset));

      // Duplicated once: the track scrolls to exactly -50% and restarts,
      // which is seamless only if the second half repeats the first.
      // Rhythm: one photo, a gap, two photos, a gap. A continuous column
      // of pictures on both edges was competing with the menu itself.
      for (var pass = 0; pass < 2; pass++) {
        order.forEach(function (sh, i) {
          var fig = document.createElement("figure");
          fig.className = "menu-rail-shot" + (i % 3 === 0 ? " after-gap" : "");
          var img = document.createElement("img");
          img.src = "images/" + sh[0] + "-thumb.jpg";
          img.alt = "";
          img.loading = "lazy";
          img.decoding = "async";
          fig.appendChild(img);
          track.appendChild(fig);
        });
      }
      rail.appendChild(track);
      document.body.appendChild(rail);
    }

    build("left", 0);
    build("right", 2);
  }


  /* ----------------------------------------------------------------------
     Instant page changes.
     Chrome and Edge handle this natively through the speculation rules in
     the page head. Everything else gets the same idea the old-fashioned
     way: the moment a finger or cursor lands on a link, fetch that page in
     the background so the click has nothing left to wait for.
     ---------------------------------------------------------------------- */
  function prefetchLinks() {
    if (HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules")) return;
    var conn = navigator.connection;
    if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ""))) return;

    var done = {};
    function warm(href) {
      if (!href || done[href]) return;
      done[href] = 1;
      var l = document.createElement("link");
      l.rel = "prefetch";
      l.href = href;
      document.head.appendChild(l);
    }
    function onPoint(e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (a.origin !== location.origin) return;
      if (/^(mailto|tel):/.test(a.getAttribute("href") || "")) return;
      warm(a.href);
    }
    document.addEventListener("pointerenter", onPoint, true);
    document.addEventListener("touchstart", onPoint, { passive: true, capture: true });
  }

  /* ----------------------------------------------------------------------
     Hero photographs — first one now, the rest after the page is usable.
     All three used to download together, which meant the visitor paid for
     two pictures they would not see for another four seconds.
     ---------------------------------------------------------------------- */
  function heroLayersLater() {
    var later = document.querySelectorAll(".hero-backdrop-layer[data-bg]");
    if (!later.length) return;
    function load() {
      later.forEach(function (el) {
        el.style.backgroundImage = el.getAttribute("data-bg");
        el.removeAttribute("data-bg");
      });
    }
    // Whichever comes first: the page finishing, or a short grace period.
    // The second photograph is due on screen at four seconds, so it must
    // never be waiting on a slow connection to finish the first one.
    var fired = false;
    function once() { if (fired) return; fired = true; load(); }
    window.addEventListener("load", function () { setTimeout(once, 150); });
    setTimeout(once, 1400);
  }


  /* ----------------------------------------------------------------------
     The colour-mode hint.
     Shown once, ever. It points at the switch, waits until the visitor has
     settled (or scrolled), and takes itself away after a while if it is
     ignored. Any click on the switch counts as understood.
     ---------------------------------------------------------------------- */
  function themeHint() {
    // Not on a phone. The card would cover a third of the screen to explain
    // a control that is already lit, and screen space there is the scarcest
    // thing the design has.
    if (window.innerWidth < 760) return;
    var KEY = "almaz-theme-hint";
    try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }

    var root = document.getElementById("theme-switch-root");
    if (!root) return;

    var card = document.createElement("div");
    card.className = "theme-hint";
    card.setAttribute("role", "note");
    card.innerHTML =
      "<strong>Light or dark?</strong>" +
      "<p>Tap here any time to change how the site looks. Your choice sticks.</p>" +
      '<button type="button">Got it</button>';

    function seen() {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      card.classList.remove("show");
      setTimeout(function () { card.remove(); }, 450);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
    }

    function place() {
      var sw = root.querySelector(".theme-switch") || root;
      var r = sw.getBoundingClientRect();
      if (!r.width) return;
      var w = card.offsetWidth || 272;
      var left = Math.min(
        Math.max(10, r.left + r.width / 2 - w / 2),
        window.innerWidth - w - 10
      );
      card.style.left = left + "px";
      card.style.top = r.bottom + 12 + "px";
      // Keep the arrow under the switch even when the card is pushed in.
      var arrow = r.left + r.width / 2 - left - 5.5;
      card.style.setProperty("--arrow", Math.min(Math.max(12, arrow), w - 22) + "px");
    }

    card.querySelector("button").addEventListener("click", seen);
    root.addEventListener("click", seen);

    // Give the header its final position before measuring anything.
    setTimeout(function () {
      document.body.appendChild(card);
      place();
      requestAnimationFrame(function () { card.classList.add("show"); });
      window.addEventListener("resize", place);
      // Follow the control while the visitor is still near the top; once
      // they start reading, the hint has had its chance and gets out of
      // the way rather than riding down the page with them.
      window.addEventListener("scroll", function () {
        if (window.scrollY > 320) { seen(); return; }
        place();
      }, { passive: true });
      setTimeout(function () { if (card.isConnected) seen(); }, 11000);
    }, 1800);
  }


  /* ----------------------------------------------------------------------
     THE PAGE CHANGE — a sheet of paper, cut down the middle.
     Two halves of warm paper meet at the centre line and part sideways,
     the way a wrapper opens. Kebab stickers ride on the paper so it is a
     printed thing rather than a blank panel.

     Everything is one composited transform on two elements, which is what
     keeps it smooth: nothing reflows, nothing repaints. The whole sequence
     is 520ms because the honest job of a page transition is to cover a
     hand-off, and anything longer is a toll on the visitor.

     The earlier rolling-plate version failed because it tried to animate
     the *incoming* page, which the browser captures before its scripts
     run. This one only ever animates a sheet the current page owns.
     ---------------------------------------------------------------------- */
  function paperCut() {
    if (REDUCED) return;
    var stage = document.querySelector(".paper-stage");
    if (!stage) return;

    var KEY = "almaz-paper-in";
    var root = document.documentElement;

    /* Arriving. The sheet is already closed over the page — the inline
       script in <head> put it there before the first paint, which is the
       whole point: the visitor never sees the new page uncovered between
       the close and the open. All that is left is to open it. */
    if (root.classList.contains("paper-in")) {
      try { sessionStorage.removeItem(KEY); } catch (e) {}
      requestAnimationFrame(function () {
        stage.classList.add("opening");
        root.classList.remove("paper-in");
        setTimeout(function () { stage.classList.remove("opening"); }, 600);
      });
    }

    /* Leaving. Close the sheet, then navigate while it is covering. */
    var leaving = false;
    document.addEventListener("click", function (e) {
      if (leaving) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      if (a.origin !== location.origin) return;
      var href = a.getAttribute("href") || "";
      if (/^(mailto|tel|#)/.test(href)) return;
      if (a.pathname === location.pathname && a.hash) return;

      e.preventDefault();
      leaving = true;
      try { sessionStorage.setItem(KEY, "1"); } catch (err) {}
      stage.classList.add("closing");
      // Navigate the moment the sheet has met in the middle.
      setTimeout(function () { location.href = a.href; }, 300);
      // Never strand anyone behind paper if the browser is slow to leave.
      setTimeout(function () { stage.classList.remove("closing"); leaving = false; }, 2500);
    }, true);

    /* Back button restores a cached page that may still be mid-transition. */
    window.addEventListener("pageshow", function (e) {
      if (!e.persisted) return;
      stage.classList.remove("closing");
      stage.classList.remove("opening");
      root.classList.remove("paper-in");
      leaving = false;
      try { sessionStorage.removeItem(KEY); } catch (err) {}
    });
  }


  /* ----------------------------------------------------------------------
     Mark today in the opening-hours week. Read from Auckland time, not the
     visitor's clock, so somebody checking from overseas still sees the
     cafe's today rather than their own.
     ---------------------------------------------------------------------- */
  function hoursWeek() {
    var list = document.getElementById("hours-week");
    if (!list) return;
    var name;
    try {
      name = new Intl.DateTimeFormat("en-NZ", {
        timeZone: "Pacific/Auckland", weekday: "long"
      }).format(new Date());
    } catch (e) {
      name = new Date().toLocaleDateString("en-NZ", { weekday: "long" });
    }
    Array.prototype.forEach.call(list.children, function (li) {
      if (li.firstElementChild && li.firstElementChild.textContent.trim() === name) {
        li.classList.add("is-today");
        li.insertAdjacentHTML("beforeend", '<span class="today-tag">Today</span>');
      }
    });
  }

  /* ----------------------------------------------------------------------
     Boot — each piece isolated, so one failure cannot cascade.
     ---------------------------------------------------------------------- */
  function boot() {
    [miniPlate, nav, toTop, reveals, menuCaps, magnetic, clickableCards, heroDrift,
     orderAhead, specialLink, menuRails, prefetchLinks, heroLayersLater, themeHint, paperCut, hoursWeek]
      .forEach(function (fn) {
        try { fn(); } catch (e) { console.warn("[almaz]", fn.name, e); }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
