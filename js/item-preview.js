(function () {
  function init() {
    const items = document.querySelectorAll(".menu-item.has-photo[data-img]");
    if (!items.length || window.matchMedia("(pointer: coarse)").matches) return;

    const preview = document.createElement("div");
    preview.className = "item-preview";
    preview.innerHTML = `<img id="item-preview-img" alt="" /><div class="item-preview-cap" id="item-preview-cap"></div>`;
    document.body.appendChild(preview);
    const img = preview.querySelector("#item-preview-img");
    const cap = preview.querySelector("#item-preview-cap");

    function move(e) {
      const offsetX = 24;
      const offsetY = 24;
      let x = e.clientX + offsetX;
      let y = e.clientY + offsetY;
      const rect = preview.getBoundingClientRect();
      if (x + rect.width > window.innerWidth - 16) x = e.clientX - rect.width - offsetX;
      if (y + rect.height > window.innerHeight - 16) y = window.innerHeight - rect.height - 16;
      preview.style.left = x + "px";
      preview.style.top = y + "px";
    }

    items.forEach((item) => {
      item.addEventListener("mouseenter", (e) => {
        img.src = item.dataset.img;
        cap.textContent = item.dataset.name || "";
        preview.classList.add("visible");
        move(e);
      });
      item.addEventListener("mousemove", move);
      item.addEventListener("mouseleave", () => {
        preview.classList.remove("visible");
      });
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
