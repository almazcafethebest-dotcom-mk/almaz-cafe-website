(function () {
  const FRAME_COUNT = 48;
  const FRAME_PATH = (i) => `images/rotisserie/frame_${String(i).padStart(3, "0")}.webp`;

  function init() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 1099px)").matches) return; // matches CSS display cutoff

    // Preload every frame once so scrubbing never stutters
    const images = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      images.push(img);
    }

    // Build the fixed widget
    const widget = document.createElement("div");
    widget.className = "rotisserie-fixed";
    widget.innerHTML = `<img id="rotisserie-fixed-img" src="${FRAME_PATH(0)}" alt="Rotisserie meat turning, decorative" /><span class="rf-tip">🔥 Fresh off the spit</span>`;
    document.body.appendChild(widget);
    const imgEl = widget.querySelector("#rotisserie-fixed-img");

    let lastScrollY = window.scrollY;
    let frameIndex = 0;
    let ticking = false;

    function render() {
      ticking = false;
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;

      // Every ~14px of scroll advances (or reverses) one frame — continuous,
      // cyclic rotation that never "runs out", regardless of page length or
      // scroll direction.
      const step = delta / 14;
      frameIndex = ((frameIndex + step) % FRAME_COUNT + FRAME_COUNT) % FRAME_COUNT;
      const idx = Math.floor(frameIndex);
      imgEl.src = images[idx].src;

      // Gentle drift synced to total scroll position — kept small and
      // biased rightward/downward so it never drifts off the left edge
      // of the viewport from its top-left home position.
      const sway = Math.sin(currentY / 260) * 10 + 8;
      const bob = Math.sin(currentY / 340) * 8;
      widget.style.transform = `translate(${sway}px, ${bob}px)`;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(render);
        ticking = true;
      }
    }

    document.addEventListener("scroll", onScroll, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
