/* ============================================================
   ALMAZ CAFE  -  js/script.js

   The mobile menu button and a few shared odds and ends.

   Plain-English guide: open OWNER-GUIDE.html in the main folder.
   Phone, email, address and hours live in site-settings.js
   ============================================================ */
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

  // Contact form — submits properly to Netlify Forms (works once the site
  // is deployed on Netlify; on GitHub Pages alone there's no backend to
  // receive it, since GitHub Pages only serves static files).
  const form = document.querySelector("#contact-form");
  if (form) {
    const submitBtn = document.querySelector("#form-submit");
    const status = document.querySelector("#form-status");
    const successBox = document.querySelector("#form-success");
    const resetBtn = document.querySelector("#form-reset");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (status) status.textContent = "";
      submitBtn.classList.add("sending");
      submitBtn.textContent = "Sending…";

      const body = new URLSearchParams(new FormData(form)).toString();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      })
        .then(() => {
          form.hidden = true;
          if (successBox) successBox.hidden = false;
        })
        .catch(() => {
          if (status) {
            status.textContent =
              "Couldn't send that just now — please call (09) 622 2108 instead, or try again shortly.";
          }
        })
        .finally(() => {
          submitBtn.classList.remove("sending");
          submitBtn.textContent = "Send message";
        });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        form.hidden = false;
        if (successBox) successBox.hidden = true;
      });
    }
  }

  // Set current year in footer
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});
