/* ============================================================
   ALMAZ CAFE  -  js/interactive-fx.js

   Rotates the three big homepage photographs every 4 seconds, and a few small hover effects.

   Plain-English guide: open OWNER-GUIDE.html in the main folder.
   Phone, email, address and hours live in site-settings.js
   ============================================================ */
/* Hero backdrop uses native CSS background-attachment:fixed for the
   "stays in place while scrolling" effect — see style.css .hero-backdrop */

/* Rotating hero backdrop — cycles through real dish photos every 4 seconds */
(function () {
  function init() {
    const layers = document.querySelectorAll(".hero-backdrop-layer");
    if (!layers.length) return;
    // Always start on the first layer: that is the plate the page
    // preloads with fetchpriority=high, so a random start would
    // throw the preload away and paint a late-discovered image.
    let i = 0;
    layers[i].classList.add("active");
    setInterval(() => {
      layers[i].classList.remove("active");
      i = (i + 1) % layers.length;
      layers[i].classList.add("active");
    }, 4000);
  }
  document.addEventListener("DOMContentLoaded", init);
})();

(function () {
  function init() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    function update() {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      bar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + "%";
    }
    document.addEventListener("scroll", update, { passive: true });
    update();
  }
  document.addEventListener("DOMContentLoaded", init);
})();

/* Cursor-follow glow inside the hero section */
(function () {
  function init() {
    const hero = document.querySelector(".hero");
    if (!hero || window.matchMedia("(pointer: coarse)").matches) return;
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--mx", x + "%");
      hero.style.setProperty("--my", y + "%");
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();

/* 3D tilt effect for cards — mouse position drives a subtle perspective tilt */
(function () {
  function init() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${py * -8}deg) rotateY(${px * 10}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) translateY(0)";
      });
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();

/* The old magnetic-button handler lived here. It moved the button box
   itself, which cancelled the new hover lift and dragged the halo off
   centre. Replaced by the label-only magnet in js/almaz-2026.js. */

/* Pickup call-out — reactive popover */
(function () {
  function init() {
    const wrap = document.getElementById("pickup-callout");
    const btn = document.getElementById("pickup-btn");
    if (!wrap || !btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = wrap.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
