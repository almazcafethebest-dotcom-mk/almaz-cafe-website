/* Kebab skewer that rotates in true 3D as the visitor scrolls, sitting in
   the unused side gutter on very wide screens only (doesn't affect layout
   on normal or mobile screens — see the 1500px min-width in CSS). */
(function () {
  function init() {
    const rails = document.querySelectorAll(".scroll3d-rail");
    if (!rails.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function update() {
      const angle = (window.scrollY * 0.4) % 360;
      rails.forEach((rail) => {
        const inner = rail.querySelector("svg");
        if (inner) inner.style.transform = `rotateY(${angle}deg) rotateX(8deg)`;
      });
    }
    document.addEventListener("scroll", update, { passive: true });
    update();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
