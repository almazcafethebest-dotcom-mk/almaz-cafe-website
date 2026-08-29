/* ============================================================
   ALMAZ CAFE  -  js/special.js

   TODAY'S SPECIAL. One line per day of the week - this is the file to edit when the specials change.

   Plain-English guide: open OWNER-GUIDE.html in the main folder.
   Phone, email, address and hours live in site-settings.js
   ============================================================ */
(function () {
  /* Generated from data/specials.json by build.js.
     Edit the special in the website editor, not here. */
  const SPECIALS = [
  /* SPECIALS:START */
    { name: "Lamb Pasendeh", note: "Our Sunday-night regulars' favourite Persian special." }, // Sun
    { name: "Mixed Kebab", note: "Start the week with the most-ordered plate on the menu." }, // Mon
    { name: "Moussaka", note: "Layered, spiced, and slow-baked." }, // Tue
    { name: "Lamb Souvlaki", note: "Wrapped fresh, sauces and salad included." }, // Wed
    { name: "Almaz Platter", note: "Built for sharing — a bit of everything." }, // Thu
    { name: "Chicken Kebab", note: "A lighter classic to kick off the weekend." }, // Fri
    { name: "Baklava & Turkish Coffee", note: "Finish Saturday night the traditional way." }, // Sat
  /* SPECIALS:END */
  ];

  function init() {
    const el = document.getElementById("special-text");
    if (!el) return;
    const day = new Date().getDay(); // Auckland-local is fine for a light-touch feature
    const pick = SPECIALS[day];
    el.innerHTML = `<strong>${pick.name}</strong><p>${pick.note}</p>`;
  }
  document.addEventListener("DOMContentLoaded", init);
})();
