/* Theme switcher — persists choice in localStorage, applied instantly. */
(function () {
  const THEMES = [
    { id: "light", label: "Light", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' },
    { id: "dark", label: "Dark", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>' },
    { id: "vibrant", label: "Vibrant", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.8 6.2L21 11l-6.2 2.8L12 20l-2.8-6.2L3 11l6.2-2.8Z"/></svg>' },
  ];

  function applyTheme(id) {
    document.documentElement.setAttribute("data-theme", id);
    try { localStorage.setItem("almaz-theme", id); } catch (e) {}
    document.querySelectorAll(".theme-switch button").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.theme === id ? "true" : "false");
    });
  }

  function buildSwitcher() {
    const root = document.getElementById("theme-switch-root");
    if (!root) return;
    const current = document.documentElement.getAttribute("data-theme") || "light";
    root.innerHTML =
      '<div class="theme-switch" role="group" aria-label="Choose a colour theme">' +
      THEMES.map(
        (t) =>
          `<button type="button" data-theme="${t.id}" aria-pressed="${t.id === current}" title="${t.label} mode" aria-label="${t.label} mode">${t.icon}</button>`
      ).join("") +
      "</div>";
    root.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
    });
  }

  document.addEventListener("DOMContentLoaded", buildSwitcher);
})();

/* Live "open now / closed" badge — reads real Auckland time, since Almaz Cafe
   is open daily 11:00am–9:00pm. Add <span id="status-badge"></span> anywhere. */
(function () {
  function buildStatus() {
    const el = document.getElementById("status-badge");
    if (!el) return;
    const parts = new Intl.DateTimeFormat("en-NZ", {
      timeZone: "Pacific/Auckland",
      hour: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    const hour = parseInt(parts.find((p) => p.type === "hour").value, 10);
    const isOpen = hour >= 11 && hour < 21;
    el.classList.toggle("closed", !isOpen);
    el.innerHTML =
      '<span class="dot"></span>' +
      (isOpen ? "Open now — until 9pm" : "Closed now — opens 11am");
  }
  document.addEventListener("DOMContentLoaded", buildStatus);
})();
