const WHATSAPP_NUMBER = "5588921891265";
const INITIAL_PRODUCT_COUNT = 4;
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const glassesViews = [
  { src: "assets/glasses-angles/angle-01.png", angle: 0, label: "de frente" },
  { src: "assets/glasses-angles/angle-02.png", angle: 60, label: "de três quartos" },
  { src: "assets/glasses-angles/angle-03.png", angle: 120, label: "em detalhe lateral" },
  { src: "assets/glasses-angles/angle-04.png", angle: 180, label: "de lado" },
  { src: "assets/glasses-angles/angle-05.png", angle: 240, label: "por trás e de lado" },
  { src: "assets/glasses-angles/angle-06.png", angle: 300, label: "de frente" },
];

function runBrandIntro() {
  const intro = document.getElementById("intro-screen");

  if (!intro) {
    document.body.classList.remove("intro-active");
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const leaveIntro = () => {
      intro.classList.add("is-exiting");
      window.setTimeout(() => {
        intro.remove();
        document.body.classList.remove("intro-active");
        resolve();
      }, 720);
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(leaveIntro, reducedMotion ? 450 : 1450);
  });
}

function initGlassesViewer() {
  const viewer = document.getElementById("spin-viewer");
  const image = document.getElementById("spin-image");
  const angleLabel = document.getElementById("spin-angle");
  if (!viewer || !image || !angleLabel) return;

  let views = [];
  let currentViewIndex = 0;
  let autoRotationTimer;
  let resumeRotationTimer;
  let frameChangeTimer;
  let pointerId = null;
  let previousPointerX = 0;
  let dragDistance = 0;

  function showView(index) {
    if (views.length === 0) return;
    currentViewIndex = (index + views.length) % views.length;
    const view = views[currentViewIndex];
    image.classList.add("is-changing");
    window.clearTimeout(frameChangeTimer);
    frameChangeTimer = window.setTimeout(() => {
      image.src = view.src;
      image.alt = `Óculos The Drip visto ${view.label}`;
      angleLabel.textContent = `${view.angle}°`;
      window.requestAnimationFrame(() => image.classList.remove("is-changing"));
    }, 90);
  }

  function rotate(direction) {
    if (views.length === 0) return;
    showView(currentViewIndex + direction);
  }

  function startAutoRotation() {
    window.clearInterval(autoRotationTimer);
    autoRotationTimer = window.setInterval(() => rotate(1), 1250);
  }

  function pauseAutoRotation() {
    window.clearInterval(autoRotationTimer);
    window.clearTimeout(resumeRotationTimer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resumeRotationTimer = window.setTimeout(startAutoRotation, 4500);
    }
  }

  document.getElementById("spin-left").addEventListener("click", () => {
    rotate(-1);
    pauseAutoRotation();
  });
  document.getElementById("spin-right").addEventListener("click", () => {
    rotate(1);
    pauseAutoRotation();
  });

  viewer.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".viewer-controls")) return;
    pointerId = event.pointerId;
    previousPointerX = event.clientX;
    dragDistance = 0;
    viewer.classList.add("is-dragging");
    viewer.setPointerCapture(event.pointerId);
    pauseAutoRotation();
  });

  viewer.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    dragDistance += event.clientX - previousPointerX;
    previousPointerX = event.clientX;
    while (dragDistance >= 34) {
      rotate(1);
      dragDistance -= 34;
    }
    while (dragDistance <= -34) {
      rotate(-1);
      dragDistance += 34;
    }
  });

  function endDrag(event) {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    viewer.classList.remove("is-dragging");
    pauseAutoRotation();
  }

  viewer.addEventListener("pointerup", endDrag);
  viewer.addEventListener("pointercancel", endDrag);
  viewer.addEventListener("keydown", (event) => {
    if (event.target.closest("button")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      rotate(event.key === "ArrowRight" ? 1 : -1);
      pauseAutoRotation();
    }
  });

  Promise.all(glassesViews.map((view) => new Promise((resolve) => {
    const preloadedImage = new Image();
    preloadedImage.onload = () => resolve(true);
    preloadedImage.onerror = () => {
      console.error(`Não foi possível carregar a imagem ${view.src}.`);
      resolve(false);
    };
    preloadedImage.src = view.src;
  }))).then((loadedViews) => {
    views = glassesViews.filter((view, index) => loadedViews[index]);
    if (views.length === 0) {
      console.error("Nenhuma imagem do visualizador 360° foi carregada.");
      return;
    }
    showView(0);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startAutoRotation();
    }
  });
}

const products = [
  {
    id: 1,
    name: "PHANTOM",
    category: "solar",
    priceCents: 45900,
    description: "Óculos de sol preto com lentes escuras. Um visual marcante, urbano e sem esforço.",
    image: "assets/glasses-angles/angle-01.png",
    tag: "THE DRIP",
  },
  {
    id: 2,
    name: "NIGHTFALL",
    category: "solar",
    priceCents: 52900,
    description: "Lentes polarizadas e proteção UV400. Atitude e conforto em cada detalhe.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=85&auto=format&fit=crop",
    tag: "",
  },
  {
    id: 3,
    name: "VANDAL",
    category: "limited",
    priceCents: 62900,
    description: "Edição limitada com estrutura leve e design de presença. Exclusividade THE DRIP.",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=700&q=85&auto=format&fit=crop",
    tag: "LIMITED",
  },
  {
    id: 4,
    name: "OBSIDIAN",
    category: "solar",
    priceCents: 48900,
    description: "Armação preta fosca e lentes cinza. Um clássico para acompanhar qualquer ocasião.",
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=700&q=85&auto=format&fit=crop",
    tag: "",
  },
  {
    id: 5,
    name: "ECHO",
    category: "grau",
    priceCents: 39900,
    description: "Armação leve com linhas minimalistas para um visual versátil e elegante.",
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=700&q=85&auto=format&fit=crop",
    tag: "",
  },
  {
    id: 6,
    name: "DRIFT",
    category: "solar",
    priceCents: 54900,
    description: "Design marcante para quem não passa despercebido. O seu próximo favorito.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&q=85&auto=format&fit=crop",
    tag: "NOVO",
  },
];

const grid = document.getElementById("product-grid");
const seeMoreButton = document.getElementById("see-more");
const catalogCount = document.getElementById("catalog-count");
const bagCount = document.getElementById("bag-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");
const productModal = document.getElementById("product-modal");
const cartModal = document.getElementById("cart-modal");
const toast = document.getElementById("toast");
const cart = new Map();
let activeFilter = "all";
let selectedProductId = null;
let toastTimeout;

function formatPrice(cents) {
  return currency.format(cents / 100);
}

function getCategoryLabel(category) {
  return category === "grau" ? "Óculos de grau" : "Óculos solar";
}

function getFilteredProducts() {
  return products.filter((product) => activeFilter === "all" || product.category === activeFilter);
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  const isFullCatalog = document.body.dataset.catalogPage === "all";
  const visibleProducts = isFullCatalog
    ? filteredProducts
    : filteredProducts.slice(0, INITIAL_PRODUCT_COUNT);

  catalogCount.textContent = `${filteredProducts.length} modelos`;
  seeMoreButton.hidden = isFullCatalog || filteredProducts.length <= INITIAL_PRODUCT_COUNT;

  grid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <button class="product-image-button" type="button" data-details-id="${product.id}" aria-label="Ver detalhes de ${product.name}">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <img class="${product.id === 1 ? "" : "photo-product"}" src="${product.image}" alt="${product.name}" loading="lazy">
      </button>
      <div class="product-info">
        <button class="product-name-button" type="button" data-details-id="${product.id}">${product.name}</button>
        <div class="product-category">${getCategoryLabel(product.category)}</div>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.priceCents)}</span>
          <div class="product-actions">
            <button class="text-button" type="button" data-details-id="${product.id}">Ver detalhes</button>
            <button class="text-button" type="button" data-add-id="${product.id}" aria-label="Adicionar ${product.name} à sacola">
              <i class="fas fa-plus" aria-hidden="true"></i> Sacola
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

function openModal(modal) {
  modal.hidden = false;
  document.body.classList.add("modal-open");
  const focusTarget = modal.querySelector("button, a[href]");
  if (focusTarget) focusTarget.focus();
}

function closeModal(modal) {
  if (modal.hidden) return;
  modal.hidden = true;
  if (productModal.hidden && cartModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function updateBagCount() {
  const count = Array.from(cart.values()).reduce((sum, quantity) => sum + quantity, 0);
  bagCount.textContent = String(count);
  document.getElementById("open-cart").setAttribute("aria-label", `Abrir sacola, ${count} ${count === 1 ? "item" : "itens"}`);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  cart.set(productId, (cart.get(productId) || 0) + 1);
  updateBagCount();
  renderCart();
  showToast(`${product.name} adicionado à sacola`);
}

function updateCartQuantity(productId, change) {
  const quantity = (cart.get(productId) || 0) + change;
  if (quantity <= 0) {
    cart.delete(productId);
  } else {
    cart.set(productId, quantity);
  }
  updateBagCount();
  renderCart();
}

function buildOrderMessage() {
  const orderLines = ["Olá! Gostaria de fazer este pedido na THE DRIP:", ""];
  let total = 0;

  for (const [productId, quantity] of cart) {
    const product = products.find((item) => item.id === productId);
    if (!product) continue;
    const subtotal = product.priceCents * quantity;
    total += subtotal;
    orderLines.push(`• ${product.name} — ${quantity} ${quantity === 1 ? "unidade" : "unidades"} — ${formatPrice(subtotal)}`);
  }

  orderLines.push("", `Total: ${formatPrice(total)}`);
  return orderLines.join("\n");
}

function renderCart() {
  const entries = Array.from(cart.entries())
    .map(([productId, quantity]) => ({
      product: products.find((item) => item.id === productId),
      quantity,
    }))
    .filter((entry) => entry.product);

  if (entries.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Sua sacola está vazia.<br>Encontre seu próximo favorito no catálogo.</p>';
    cartTotal.textContent = formatPrice(0);
    checkoutButton.href = "#";
    checkoutButton.classList.add("is-disabled");
    checkoutButton.setAttribute("aria-disabled", "true");
    return;
  }

  let total = 0;
  cartItems.innerHTML = entries.map(({ product, quantity }) => {
    const subtotal = product.priceCents * quantity;
    total += subtotal;
    return `
      <article class="cart-item">
        <div>
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">${formatPrice(product.priceCents)} cada</div>
          <div class="quantity-controls" aria-label="Quantidade de ${product.name}">
            <button type="button" data-quantity-id="${product.id}" data-change="-1" aria-label="Diminuir ${product.name}">−</button>
            <span>${quantity}</span>
            <button type="button" data-quantity-id="${product.id}" data-change="1" aria-label="Aumentar ${product.name}">+</button>
          </div>
        </div>
        <div class="cart-item-subtotal">${formatPrice(subtotal)}</div>
      </article>
    `;
  }).join("");

  cartTotal.textContent = formatPrice(total);
  checkoutButton.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage())}`;
  checkoutButton.classList.remove("is-disabled");
  checkoutButton.setAttribute("aria-disabled", "false");
}

function showProductDetails(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  selectedProductId = product.id;
  document.getElementById("modal-image").src = product.image;
  document.getElementById("modal-image").alt = product.name;
  document.getElementById("modal-name").textContent = product.name;
  document.getElementById("modal-price").textContent = formatPrice(product.priceCents);
  document.getElementById("modal-description").textContent = product.description;
  openModal(productModal);
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderProducts();
  });
});

grid.addEventListener("click", (event) => {
  const detailsButton = event.target.closest("[data-details-id]");
  const addButton = event.target.closest("[data-add-id]");
  if (detailsButton) showProductDetails(Number(detailsButton.dataset.detailsId));
  if (addButton) addToCart(Number(addButton.dataset.addId));
});

document.getElementById("modal-add").addEventListener("click", () => {
  if (selectedProductId !== null) addToCart(selectedProductId);
  closeModal(productModal);
});

document.getElementById("open-cart").addEventListener("click", () => {
  renderCart();
  openModal(cartModal);
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity-id]");
  if (quantityButton) {
    updateCartQuantity(Number(quantityButton.dataset.quantityId), Number(quantityButton.dataset.change));
  }
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-id]");
  if (addButton && !grid.contains(addButton)) {
    addToCart(Number(addButton.dataset.addId));
  }

  const closeButton = event.target.closest("[data-close-modal]");
  if (closeButton) {
    closeModal(closeButton.closest(".modal-backdrop"));
  }

  if (event.target.classList.contains("modal-backdrop")) {
    closeModal(event.target);
  }
});

checkoutButton.addEventListener("click", (event) => {
  if (cart.size === 0) event.preventDefault();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(productModal);
    closeModal(cartModal);
  }
});

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }
});

document.getElementById("current-year").textContent = String(new Date().getFullYear());
renderProducts();
renderCart();
runBrandIntro().then(initGlassesViewer);
