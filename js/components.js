async function loadComponent(selector, path) {
  const container = document.querySelector(selector);

  if (!container) {
    return;
  }

  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load component: ${path}`);
  }

  container.innerHTML = await response.text();
}

async function loadComponents() {
  await Promise.all([
    loadComponent(
      "#header-container",
      "./components/header/header.html"
    ),
    loadComponent(
      "#footer-container",
      "./components/footer/footer.html"
    ),
  ]);

  document.dispatchEvent(new CustomEvent("componentsLoaded"));
}

loadComponents();