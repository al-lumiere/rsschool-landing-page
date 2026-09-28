const showMoreButton = document.querySelector(".showMore");
const MOBILE_BREAKPOINT = 768;
let activeCategory = "coffee";
let isExpanded = false;

const categoryButtons = [...document.querySelectorAll(".category")];

const menuGrid = document.querySelector(".menuGrid");

const imageExtensions = {
  coffee: "jpg",
  tea: "png",
  dessert: "png",
};

let products = [];

function getProductImage(product, index) {
  const extension = imageExtensions[product.category];
  return `./assets/images/${product.category}-${index + 1}.${extension}`;
}

function createProductCard(product, index) {
  return `
    <article
      class="menuCard"
      data-product-id="${product.id}"
    >
      <div class="cardImage">
        <img
          src="${getProductImage(product, index)}"
          alt="${product.name}"
        />
      </div>

      <div class="cardContent">
        <div>
          <h2 class="heading-3">${product.name}</h2>

          <p class="text-medium">
            ${product.description}
          </p>
        </div>

        <p class="heading-3">$${product.price}</p>
      </div>
    </article>
  `;
}

function renderProducts() {
  const categoryProducts = products.filter(
    (product) => product.category === activeCategory,
  );

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  const visibleProducts =
    isMobile && !isExpanded ? categoryProducts.slice(0, 4) : categoryProducts;

  menuGrid.innerHTML = visibleProducts
    .map((product, index) => createProductCard(product, index))
    .join("");

  const hasHiddenProducts =
    isMobile && categoryProducts.length > 4 && !isExpanded;

  showMoreButton.hidden = !hasHiddenProducts;
}

function setActiveCategory(category) {
  activeCategory = category;
  isExpanded = false;

  categoryButtons.forEach((button) => {
    const isActive = button.dataset.category === category;

    button.classList.toggle("active", isActive);
  });

  renderProducts();
}

async function loadProducts() {
  try {
    const response = await fetch("./data/products.json");

    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    const data = await response.json();

    products = data.map((product, index) => ({
      ...product,
      id: index,
    }));

    setActiveCategory("coffee");
  } catch (error) {
    console.error(error);
  }
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveCategory(button.dataset.category);
  });
});

showMoreButton.addEventListener("click", () => {
  isExpanded = true;

  renderProducts();
});

window.addEventListener("resize", () => {
  renderProducts();
});

loadProducts();
