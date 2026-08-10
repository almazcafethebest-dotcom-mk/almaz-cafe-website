(function () {
  function init() {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dotsWrap = carousel.querySelector(".carousel-dots");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to review " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => show(i, true));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll("button");

    function show(i, manual) {
      slides[index].classList.remove("active");
      dots[index].classList.remove("active");
      index = (i + slides.length) % slides.length;
      slides[index].classList.add("active");
      dots[index].classList.add("active");
      if (manual) restart();
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(() => show(index + 1), 6000);
    }

    prevBtn.addEventListener("click", () => show(index - 1, true));
    nextBtn.addEventListener("click", () => show(index + 1, true));
    restart();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
