/* Menu category filter tabs */
(function () {
  function init() {
    const tabs = document.querySelectorAll(".menu-tab");
    const groups = document.querySelectorAll(".menu-group[data-category]");
    if (!tabs.length || !groups.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const filter = tab.dataset.filter;
        groups.forEach((g) => {
          const show = filter === "all" || g.dataset.category === filter;
          g.hidden = !show;
        });
      });
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();

/* "Surprise me" dish picker */
(function () {
  const DISHES = [
    { name: "Mixed Kebab", tag: "Most ordered" },
    { name: "Lamb Souvlaki", tag: "Fan favourite" },
    { name: "Almaz Platter", tag: "Great for sharing" },
    { name: "Lamb Pasendeh", tag: "Persian special" },
    { name: "Moussaka", tag: "Persian special" },
    { name: "Falafel Kebab", tag: "Vegetarian" },
    { name: "Chicken & Chips", tag: "Regular favourite" },
    { name: "Baklava & Turkish Coffee", tag: "To finish" },
  ];

  function init() {
    const btn = document.getElementById("surprise-btn");
    const result = document.getElementById("surprise-result");
    if (!btn || !result) return;
    btn.addEventListener("click", (e) => {
      const pick = DISHES[Math.floor(Math.random() * DISHES.length)];
      result.innerHTML = `<span class="tag">${pick.tag}</span>${pick.name}`;
      burstConfetti(e.clientX, e.clientY);
    });
  }

  function burstConfetti(x, y) {
    const colors = ["#f78e49", "#e8a317", "#7a2f22", "#1f6b6b", "#fbf4e7"];
    for (let i = 0; i < 22; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = (x || window.innerWidth / 2) + (Math.random() * 120 - 60) + "px";
      piece.style.top = (y || 200) + "px";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = 900 + Math.random() * 700 + "ms";
      piece.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 1700);
    }
  }
  document.addEventListener("DOMContentLoaded", init);
})();
