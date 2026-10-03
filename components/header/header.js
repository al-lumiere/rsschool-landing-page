function setMenuState(header, isOpen) {
  const burger = header.querySelector(".burger");
  header.classList.toggle("menuOpen", isOpen);

  burger?.setAttribute("aria-expanded", String(isOpen));
  burger?.setAttribute(
    "aria-label",
    isOpen ? "Close menu" : "Open menu"
  );

  document.body.style.overflow = isOpen ? "hidden" : "";
}

document.addEventListener("click", (event) => {
  const burger = event.target.closest?.(".burger");

  if (burger) {
    const header = burger.closest(".header");
    if (!header) {
      return;
    }
    const isOpen = !header.classList.contains("menuOpen");
    setMenuState(header, isOpen);
    return;
  }

  const mobileLink = event.target.closest?.(".mobileNavigation a");

  if (mobileLink) {
    const header = mobileLink.closest(".header");
    if (header) {
      setMenuState(header, false);
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  const header = document.querySelector(".header.menuOpen");

  if (header) {
    setMenuState(header, false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth < 769) {
    return;
  }

  const header = document.querySelector(".header.menuOpen");

  if (header) {
    setMenuState(header, false);
  }
});