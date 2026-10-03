import { addProductToCart, updateCartIndicator } from './Cart.mjs';
import { getProductImage } from './utils.mjs';
import ProductData from './ProductData.mjs';
import './Search.mjs';

const dataSource = new ProductData('tents');

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  const cartItems = addProductToCart(product);
  updateCartIndicator(cartItems);
}

async function init() {
  const productId = new URLSearchParams(window.location.search).get('product');
  const product = await dataSource.findProductById(productId);

  document.querySelector('.product__brand').textContent = product.Brand.Name;
  document.querySelector('.product__name').textContent =
    product.NameWithoutBrand;
  const productImage = document.querySelector('.product__image');
  productImage.src = getProductImage(product, 'PrimaryLarge');
  productImage.alt = product.Name;
  document.querySelector('.product-card__price').textContent =
    `$${product.FinalPrice}`;
  document.querySelector('.product__color').textContent =
    product.Colors[0].ColorName;
  document.querySelector('.product__description').innerHTML =
    product.DescriptionHtmlSimple;

  const addToCartButton = document.getElementById('addToCart');
  addToCartButton.dataset.id = product.Id;
  addToCartButton.addEventListener('click', addToCartHandler);
}

init();
