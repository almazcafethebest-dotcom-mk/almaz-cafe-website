/* ============================================================
   ALMAZ CAFE  -  js/reveal.js

   Fades sections in gently as you scroll down.

   Plain-English guide: open OWNER-GUIDE.html in the main folder.
   Phone, email, address and hours live in site-settings.js
   ============================================================ */
/* Subtle fade-up reveal as sections enter the viewport. */
(function () {
  function init() {
    const targets = document.querySelectorAll(
      "section .card, section .feature-item, section .dish-card, section .testimonial-card, section .gallery-item, section .journey-step, .video-feature"
    );
    if (!("IntersectionObserver" in window) || !targets.length) {
      targets.forEach((t) => t.classList.add("revealed"));
      return;
    }
    targets.forEach((t) => t.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((t) => io.observe(t));
  }
  document.addEventListener("DOMContentLoaded", init);
})();
