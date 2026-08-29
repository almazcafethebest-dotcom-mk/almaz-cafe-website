/* ============================================================
   ALMAZ CAFE  -  js/item-preview.js

   Shows a larger photo when you tap a dish on the menu page.

   Plain-English guide: open OWNER-GUIDE.html in the main folder.
   Phone, email, address and hours live in site-settings.js
   ============================================================ */
(function () {
  function init() {
    const items = document.querySelectorAll(".menu-item.has-photo[data-img]");
    if (!items.length || window.matchMedia("(pointer: coarse)").matches) return;

    const preview = document.createElement("div");
    preview.className = "item-preview";
    preview.innerHTML = `<img id="item-preview-img" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" /><div class="item-preview-cap" id="item-preview-cap"></div>`;
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
      const thumb = item.querySelector(".menu-item-thumb");
      item.addEventListener("mouseenter", (e) => {
        img.src = item.dataset.img;
        cap.textContent = item.dataset.name || "";
        preview.classList.add("visible");
        move(e);
      });
      item.addEventListener("mousemove", (e) => {
        move(e);
        if (thumb) {
          const rect = item.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          thumb.style.transform = `scale(1.15) rotateX(${py * -18}deg) rotateY(${px * 22}deg)`;
        }
      });
      item.addEventListener("mouseleave", () => {
        preview.classList.remove("visible");
        if (thumb) thumb.style.transform = "";
      });
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
