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
    { name: "Falafel & Hummus", tag: "Vegetarian" },
    { name: "Chicken & Chips", tag: "Regular favourite" },
    { name: "Baklava & Turkish Coffee", tag: "To finish" },
  ];

  function init() {
    const btn = document.getElementById("surprise-btn");
    const result = document.getElementById("surprise-result");
    if (!btn || !result) return;
    btn.addEventListener("click", () => {
      const pick = DISHES[Math.floor(Math.random() * DISHES.length)];
      result.innerHTML = `<span class="tag">${pick.tag}</span>${pick.name}`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
