import { getLocalStorage, setLocalStorage } from './utils.mjs';

const CART_KEY = 'so-cart';

function getCartItemKey(item) {
  return String(item.Id ?? item.id ?? item.Name ?? '');
}

function getValidQuantity(quantity) {
  if (quantity === undefined) {
    return 1;
  }

  const parsedQuantity = Number(quantity);
  return Number.isFinite(parsedQuantity)
    ? Math.max(0, Math.floor(parsedQuantity))
    : 1;
}

export function normalizeCart(cart) {
  const storedItems = Array.isArray(cart) ? cart : cart ? [cart] : [];
  const normalizedItems = new Map();

  storedItems.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      return;
    }

    const quantity = getValidQuantity(item.quantity);
    if (quantity === 0) {
      return;
    }

    const itemKey = getCartItemKey(item) || `cart-item-${index}`;
    const existingItem = normalizedItems.get(itemKey);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      normalizedItems.set(itemKey, { ...item, quantity });
    }
  });

  return Array.from(normalizedItems.values());
}

export function saveCartItems(cartItems) {
  const normalizedItems = normalizeCart(cartItems);
  setLocalStorage(CART_KEY, normalizedItems);
  return normalizedItems;
}

export function getCartItems() {
  const storedCart = getLocalStorage(CART_KEY);
  const normalizedItems = normalizeCart(storedCart);

  if (JSON.stringify(storedCart) !== JSON.stringify(normalizedItems)) {
    setLocalStorage(CART_KEY, normalizedItems);
  }

  return normalizedItems;
}

export function addProductToCart(product) {
  const cartItems = getCartItems();
  const productKey = getCartItemKey(product);
  const existingItem = cartItems.find(
    (item) => getCartItemKey(item) === productKey,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  return saveCartItems(cartItems);
}

export function changeCartItemQuantity(itemKey, amount) {
  const cartItems = getCartItems();
  const item = cartItems.find(
    (cartItem) => getCartItemKey(cartItem) === String(itemKey),
  );

  if (item) {
    item.quantity = Math.max(0, item.quantity + amount);
  }

  return saveCartItems(cartItems);
}

export function getCartItemCount(cartItems = getCartItems()) {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(cartItems = getCartItems()) {
  return cartItems.reduce(
    (total, item) => total + (Number(item.FinalPrice) || 0) * item.quantity,
    0,
  );
}

export function updateCartIndicator(cartItems = getCartItems()) {
  const cartLink = document.querySelector('.cart a');
  if (!cartLink) {
    return;
  }

  let cartCount = cartLink.querySelector('.cart-count');
  if (!cartCount) {
    cartCount = document.createElement('span');
    cartCount.className = 'cart-count';
    cartCount.setAttribute('aria-live', 'polite');
    cartLink.appendChild(cartCount);
  }

  const itemCount = getCartItemCount(cartItems);
  cartCount.textContent = itemCount;
  cartCount.hidden = itemCount === 0;
  cartLink.setAttribute(
    'aria-label',
    `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`,
  );
}
