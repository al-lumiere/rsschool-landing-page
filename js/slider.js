const slider = document.querySelector(".favoriteCoffee");

if (slider) {
  const track = slider.querySelector(".sliderTrack");
  const viewport = slider.querySelector(".sliderViewport");

  const slides = [...slider.querySelectorAll(".slide")];
  const paginationButtons = [
    ...slider.querySelectorAll(".paginationButton"),
  ];

  const prevButton = slider.querySelector(".prev");
  const nextButton = slider.querySelector(".next");

  let currentSlide = 0;

  function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    paginationButtons.forEach((button, index) => {
      const isActive = index === currentSlide;

      button.classList.toggle("active", isActive);

      if (isActive) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    updateSlider();
  }

  prevButton.addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });

  paginationButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showSlide(index);
    });
  });

  let startX = null;
  let startY = null;

  viewport.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    startY = event.clientY;
  });

  viewport.addEventListener("pointerup", (event) => {
    if (startX === null || startY === null) {
      return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (
      Math.abs(deltaX) > 50 &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX < 0) {
        showSlide(currentSlide + 1);
      } else {
        showSlide(currentSlide - 1);
      }
    }

    startX = null;
    startY = null;
  });

  viewport.addEventListener("pointercancel", () => {
    startX = null;
    startY = null;
  });

  updateSlider();
}