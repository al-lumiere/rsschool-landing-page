const root = document.documentElement;
const savedTheme = localStorage.getItem("theme") || "light";
root.dataset.theme = savedTheme;

document.addEventListener("click", (event) => {
  const themeSwitch = event.target.closest(".themeSwitch");

  if (!themeSwitch) {
    return;
  }

  const currentTheme = root.dataset.theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
});