document.addEventListener("click", (event) => {
  const burger = event.target.closest?.(".burger");

  if (burger) {
    const header = burger.closest(".header");

    if (!header) {
      return;
    }

    header.classList.toggle("menuOpen");

    const isOpen = header.classList.contains("menuOpen");

    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu",
    );

    document.body.style.overflow = isOpen ? "hidden" : "";

    return;
  }

  const mobileLink = event.target.closest?.(".mobileNavigation a");

  if (mobileLink) {
    const header = mobileLink.closest(".header");
    const headerBurger = header?.querySelector(".burger");

    header?.classList.remove("menuOpen");

    headerBurger?.setAttribute("aria-expanded", "false");
    headerBurger?.setAttribute("aria-label", "Open menu");

    document.body.style.overflow = "";
  }
});