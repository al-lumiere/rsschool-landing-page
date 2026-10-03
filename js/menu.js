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

function getProductCategoryIndex(product) {
  return products
    .filter((item) => item.category === product.category)
    .findIndex((item) => item.id === product.id);
}

function createProductModal(product) {
  const imageIndex = getProductCategoryIndex(product);

  const sizes = Object.entries(product.sizes)
    .map(
      ([key, value], index) => `
        <button
          class="modalOption sizeOption ${index === 0 ? "active" : ""}"
          type="button"
          data-price="${value["add-price"]}"
        >
          <span class="optionKey">${key.toUpperCase()}</span>
          ${value.size}
        </button>
      `,
    )
    .join("");

  const additives = product.additives
    .map(
      (additive, index) => `
        <button
          class="modalOption additiveOption"
          type="button"
          data-price="${additive["add-price"]}"
        >
          <span class="optionKey">
            ${String.fromCharCode(65 + index)}
          </span>

          ${additive.name}
        </button>
      `,
    )
    .join("");

  return `
    <div class="modalOverlay">
      <div
        class="productModal"
        data-product-id="${product.id}"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="modalImage">
          <img
            src="${getProductImage(product, imageIndex)}"
            alt="${product.name}"
          />
        </div>

        <div class="modalContent">
          <div class="modalInfo">
            <h2 id="modal-title" class="heading-3">
              ${product.name}
            </h2>

            <p class="text-medium">
              ${product.description}
            </p>
          </div>

          <div class="modalParameters">
            <p class="text-medium">Size</p>

            <div class="modalOptions">
              ${sizes}
            </div>
          </div>

          <div class="modalParameters">
            <p class="text-medium">Additives</p>

            <div class="modalOptions">
              ${additives}
            </div>
          </div>

          <div class="modalTotal">
            <span class="heading-3">Total:</span>

            <span class="heading-3 modalPrice">
              $${product.price}
            </span>
          </div>

          <div class="productAlert">
          <img
          src="./assets/icons/info-empty.svg"
          alt=""
          aria-hidden="true"
          class="productAlertIcon"
          />
          <p class="productAlertText">
          The cost is not final. Download our mobile app to see the final price and place your order.
          Earn loyalty points and enjoy your favorite coffee with up to 20% discount.
          </p>
          </div>
          <button class="modalClose linkButton" type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
}

function closeModal() {
  const overlay = document.querySelector(".modalOverlay");

  if (!overlay) return;

  overlay.remove();
  document.body.style.overflow = "";
}

function openModal(product) {
  document.body.insertAdjacentHTML("beforeend", createProductModal(product));

  document.body.style.overflow = "hidden";
}

function updateModalPrice(modal) {
  const productId = Number(modal.dataset.productId);

  const product = products.find((item) => item.id === productId);

  if (!product) return;

  const selectedSize = modal.querySelector(".sizeOption.active");

  const selectedAdditives = [
    ...modal.querySelectorAll(".additiveOption.active"),
  ];

  let total = Number(product.price);

  if (selectedSize) {
    total += Number(selectedSize.dataset.price);
  }

  selectedAdditives.forEach((button) => {
    total += Number(button.dataset.price);
  });

  modal.querySelector(".modalPrice").textContent = `$${total.toFixed(2)}`;
}

document.addEventListener("click", (event) => {
  const sizeOption = event.target.closest(".sizeOption");

  if (sizeOption) {
    const modal = sizeOption.closest(".productModal");

    modal.querySelectorAll(".sizeOption").forEach((button) => {
      button.classList.remove("active");
    });

    sizeOption.classList.add("active");

    updateModalPrice(modal);

    return;
  }

  const additiveOption = event.target.closest(".additiveOption");

  if (additiveOption) {
    const modal = additiveOption.closest(".productModal");

    additiveOption.classList.toggle("active");

    updateModalPrice(modal);
  }
});

menuGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".menuCard");

  if (!card) return;

  const productId = Number(card.dataset.productId);

  const product = products.find((item) => item.id === productId);

  if (product) {
    openModal(product);
  }
});

document.addEventListener("click", (event) => {
  const overlay = event.target.closest(".modalOverlay");

  if (!overlay) return;

  if (event.target === overlay || event.target.closest(".modalClose")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});
