(function () {
  const FRAME_COUNT = 48;
  const FRAME_PATH = (i) => `images/rotisserie/frame_${String(i).padStart(3, "0")}.webp`;

  function init() {
    const section = document.getElementById("scrub-section");
    const frameEl = document.getElementById("scrub-frame");
    if (!section || !frameEl) return;

    // Preload all frames so scrubbing is instant, not janky
    const images = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      images.push(img);
    }

    let lastIndex = -1;
    let ticking = false;

    function render() {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / total, 0), 1);
      const index = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
      if (index !== lastIndex) {
        frameEl.src = images[index].src;
        lastIndex = index;
      }
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(render);
        ticking = true;
      }
    }

    document.addEventListener("scroll", onScroll, { passive: true });
    render();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
