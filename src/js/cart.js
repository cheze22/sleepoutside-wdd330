import {
  changeCartItemQuantity,
  getCartItems,
  getCartTotal,
  updateCartIndicator,
} from './Cart.mjs';
import { getProductImage } from './utils.mjs';
import './Search.mjs';

const cartList = document.querySelector('.product-list');
const emptyCartMessage = document.querySelector('.cart-empty');
const cartSummary = document.querySelector('.cart-summary');
const cartTotal = document.querySelector('.cart-total');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function renderCartContents() {
  const cartItems = getCartItems();
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  cartList.innerHTML = htmlItems.join('');
  emptyCartMessage.hidden = cartItems.length > 0;
  cartSummary.hidden = cartItems.length === 0;
  cartTotal.textContent = currencyFormatter.format(getCartTotal(cartItems));
  updateCartIndicator(cartItems);
}

function cartItemTemplate(item) {
  const itemSubtotal = Number(item.FinalPrice) * item.quantity;
  const productUrl = `/product_pages/index.html?product=${encodeURIComponent(item.Id)}`;
  const newItem = `<li class="cart-card divider">
  <a href="${productUrl}" class="cart-card__image">
    <img
      src="${getProductImage(item)}"
      alt="${item.Name}"
    />
  </a>
  <a href="${productUrl}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ''}</p>
  <div class="cart-card__quantity" data-id="${item.Id}">
    <button
      class="quantity-button"
      type="button"
      data-action="decrease"
      aria-label="Decrease quantity"
    >−</button>
    <span class="quantity-value">${item.quantity}</span>
    <button
      class="quantity-button"
      type="button"
      data-action="increase"
      aria-label="Increase quantity"
    >+</button>
  </div>
  <p class="cart-card__price">
    <span class="visually-hidden">Item subtotal: </span>
    ${currencyFormatter.format(itemSubtotal)}
  </p>
</li>`;

  return newItem;
}

cartList.addEventListener('click', (event) => {
  const quantityButton = event.target.closest('.quantity-button');
  if (!quantityButton) {
    return;
  }

  const quantityControls = quantityButton.closest('.cart-card__quantity');
  const amount = quantityButton.dataset.action === 'increase' ? 1 : -1;
  changeCartItemQuantity(quantityControls.dataset.id, amount);
  renderCartContents();
});

renderCartContents();
