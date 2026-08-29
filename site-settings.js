/* ============================================================
   ALMAZ CAFE  -  site-settings.js

   GENERATED FILE - DO NOT EDIT BY HAND.

   Change these details in the website editor (the "Cafe details"
   entry), or in data/settings.json. This file is rewritten from
   scratch every time the site publishes, so any change made here
   is lost at the next Publish.
   ============================================================ */

window.ALMAZ_SETTINGS = {
  email:     "almazcafethebest@gmail.com",
  phone:     "(09) 622 2108",
  phoneDial: "+6496222108",
  address:   "157 Onehunga Mall, Onehunga, Auckland 1061",
  hours:     "Daily, 11am–9pm",
  facebook:  "https://www.facebook.com/profile.php?id=61593177522414",
  instagram: "https://www.instagram.com/almazcafeonehunga/"
};

(function () {
  var S = window.ALMAZ_SETTINGS || {};
  function fill() {
    document.querySelectorAll("[data-site]").forEach(function (el) {
      var v = S[el.getAttribute("data-site")];
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-site-link]").forEach(function (el) {
      var k = el.getAttribute("data-site-link");
      var href =
        k === "email" ? (S.email ? "mailto:" + S.email : null)
      : k === "phone" ? (S.phoneDial ? "tel:" + S.phoneDial : null)
      : S[k] || null;
      if (href) el.setAttribute("href", href);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fill);
  } else { fill(); }
})();
