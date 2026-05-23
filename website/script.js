const products = [
  {
    id: 1,
    title: 'Short Bus Tee',
    shortDescription: 'Soft cotton tee with custom branding.',
    description: 'A modern placeholder tee crafted for the Short Bus brand. Suitable for everyday wear and future printing options.',
    price: '$0',
    colors: ['White', 'Black', 'Red'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    title: 'Short Bus Hoodie',
    shortDescription: 'Cozy hoodie with bold artwork.',
    description: 'A premium placeholder hoodie built for comfort and style, ready to show off your custom Short Bus logo.',
    price: '$0',
    colors: ['White', 'Black', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 3,
    title: 'Short Bus Cap',
    shortDescription: 'Structured cap with minimalist branding.',
    description: 'A clean placeholder cap design that pairs with any look. Perfect for future customization by color and embroidery.',
    price: '$0',
    colors: ['White', 'Black', 'Navy'],
    sizes: ['One Size'],
  },
];

const ORDER_EMAIL = 'orders@shortbus.com';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('shortBusCart')) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('shortBusCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().length;
  document.querySelectorAll('#cartCount').forEach((el) => {
    el.textContent = count;
  });
}

function renderProductGrid() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = products
    .map((product) => {
      const colors = product.colors
        .map(() => '<span class="color-dot" title="Color option"></span>')
        .join('');

      return `
      <article class="product-card">
        <a href="item.html?id=${product.id}">
          <div class="product-image">
            <span>Product image placeholder</span>
          </div>
          <div class="product-card-content">
            <div class="product-badge">Best seller</div>
            <div>
              <h3>${product.title}</h3>
              <p>${product.shortDescription}</p>
            </div>
            <div class="detail-row">
              <div class="detail-list">
                <span class="color-pill">${product.colors[0]}</span>
                <span class="color-pill">${product.sizes[0]}</span>
              </div>
              <p class="product-price">${product.price}</p>
            </div>
          </div>
        </a>
      </article>`;
    })
    .join('');
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function renderProductDetails() {
  const container = document.getElementById('itemDetail');
  if (!container) return;

  const query = new URLSearchParams(window.location.search);
  const id = parseInt(query.get('id'), 10);
  const product = getProductById(id);

  if (!product) {
    container.innerHTML = '<p>Product not found. Return to the <a href="index.html">browse page</a>.</p>';
    return;
  }

  const colors = product.colors
    .map((color) => `
      <label class="color-pill">
        <input type="radio" name="itemColor" value="${color}" /> ${color}
      </label>`)
    .join('');

  const sizes = product.sizes
    .map((size) => `<option value="${size}">${size}</option>`)
    .join('');

  container.innerHTML = `
    <div class="item-detail-layout">
      <div class="item-detail-image">
        <span>Item image placeholder</span>
      </div>
      <div class="detail-meta">
        <p class="eyebrow">Product detail</p>
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <div class="detail-row">
          <div>
            <p class="eyebrow">Price</p>
            <p class="product-price">${product.price}</p>
          </div>
          <div>
            <p class="eyebrow">Available colors</p>
            <div class="color-options">${colors}</div>
          </div>
        </div>
        <div class="detail-row">
          <label>
            Size
            <select id="itemSize">${sizes}</select>
          </label>
        </div>
        <div class="detail-btns">
          <button class="button primary" id="addToCart">Add to cart</button>
          <a class="button secondary" href="index.html">Back to browse</a>
        </div>
      </div>
    </div>`;

  const addButton = document.getElementById('addToCart');
  addButton.addEventListener('click', () => {
    const selectedColor = document.querySelector('input[name="itemColor"]:checked')?.value || product.colors[0];
    const selectedSize = document.getElementById('itemSize').value;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
    });

    addButton.textContent = 'Added to cart';
    setTimeout(() => {
      addButton.textContent = 'Add to cart';
    }, 1400);
  });
}

function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;

  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = '<p>Your cart is empty. Add items from the browse page.</p>';
    return;
  }

  container.innerHTML = cart
    .map(
      (item, index) => `
      <article class="cart-card">
        <div class="detail-list">
          <span class="color-pill">${item.color}</span>
          <span class="color-pill">${item.size}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.price}</p>
        <div class="meta-row">
          <p>Item #${index + 1}</p>
        </div>
      </article>`
    )
    .join('');
}

function handleCartPage() {
  const form = document.getElementById('orderForm');
  const clearButton = document.getElementById('clearCart');

  renderCart();

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      saveCart([]);
      renderCart();
    });
  }

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const cart = getCart();
    if (!cart.length) {
      alert('Add at least one item to your cart before submitting an order.');
      return;
    }

    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const notes = document.getElementById('orderNotes').value.trim();

    const subject = encodeURIComponent('Short Bus Order Request');
    const body = encodeURIComponent(`Name: ${name || 'N/A'}\nEmail: ${email || 'N/A'}\n\nItems:\n${cart
      .map((item, index) => `${index + 1}. ${item.title} - Color: ${item.color} - Size: ${item.size}`)
      .join('\n')}\n\nNotes:\n${notes || 'None'}`);

    window.location.href = `mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderProductGrid();
  renderProductDetails();
  handleCartPage();
});
