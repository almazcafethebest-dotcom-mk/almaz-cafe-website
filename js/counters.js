/* ============================================================
   ALMAZ CAFE  -  js/counters.js

   Makes the numbers on the dark band (20+, 4.2, 222+, 40+) count up when they scroll into view.

   Plain-English guide: open OWNER-GUIDE.html in the main folder.
   Phone, email, address and hours live in site-settings.js
   ============================================================ */
/* Animates .num[data-count] elements from 0 up to their target once visible. */
(function () {
  function animate(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function init() {
    const nums = document.querySelectorAll(".num[data-count]");
    if (!nums.length) return;
    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    nums.forEach((n) => io.observe(n));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
