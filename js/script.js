document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Simple client-side handling for the contact form (no backend yet)
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.querySelector("#form-status");
      if (status) {
        status.textContent =
          "Thanks! This form isn't wired up to send messages yet — see the README for how to connect it (e.g. Netlify Forms).";
      }
      form.reset();
    });
  }

  // Set current year in footer
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});
