import { getLocalStorage, setLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

function addProductToCart(product) {
  let cart = getLocalStorage('so-cart') || [];
  cart = Array.isArray(cart) ? cart : [cart];
  cart.push(product);
  setLocalStorage('so-cart', cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

async function init() {
  const productId = new URLSearchParams(window.location.search).get('product');
  const product = await dataSource.findProductById(productId);

  document.querySelector('.product__brand').textContent = product.Brand.Name;
  document.querySelector('.product__name').textContent =
    product.NameWithoutBrand;
  const productImage = document.querySelector('.product__image');
  productImage.src = product.Image;
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
