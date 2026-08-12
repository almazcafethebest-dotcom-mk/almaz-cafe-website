/* Scroll progress bar along the top of the page */
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

/* Subtle magnetic pull on primary buttons */
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
