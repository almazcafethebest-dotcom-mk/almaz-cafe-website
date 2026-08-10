(function () {
  function buildLightbox() {
    const items = document.querySelectorAll(".gallery-grid .gallery-item");
    if (!items.length) return;

    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <div class="lightbox-inner">
        <div class="frame" id="lightbox-frame"></div>
        <div class="lightbox-cap" id="lightbox-cap"></div>
      </div>
    `;
    document.body.appendChild(box);
    const frame = box.querySelector("#lightbox-frame");
    const cap = box.querySelector("#lightbox-cap");

    items.forEach((item) => {
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      const open = () => {
        frame.innerHTML = item.querySelector(".art")
          ? item.querySelector(".art").outerHTML
          : "";
        cap.textContent = item.querySelector(".cap")
          ? item.querySelector(".cap").textContent
          : "";
        box.classList.add("open");
      };
      item.addEventListener("click", open);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    function close() {
      box.classList.remove("open");
    }
    box.querySelector(".lightbox-close").addEventListener("click", close);
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }
  document.addEventListener("DOMContentLoaded", buildLightbox);
})();
