/* Hero backdrop uses native CSS background-attachment:fixed for the
   "stays in place while scrolling" effect — see style.css .hero-backdrop */

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

(function () {
  function init() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.querySelectorAll(".btn-primary, .btn-ghost").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
