import { getLocalStorage } from './utils.mjs';
import marmotAjaxImage from '../images/tents/marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg';
import northfaceTalusImage from '../images/tents/the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320.jpg';
import northfaceAlpineImage from '../images/tents/the-north-face-alpine-guide-tent-3-person-4-season-in-canary-yellow-high-rise-grey~p~985pr_01~320.jpg';
import cedarRidgeImage from '../images/tents/cedar-ridge-rimrock-tent-2-person-3-season-in-rust-clay~p~344yj_01~320.jpg';

const productImages = {
  '880RR': marmotAjaxImage,
  '985RF': northfaceTalusImage,
  '989CG': northfaceTalusImage,
  '985PR': northfaceAlpineImage,
  '344YJ': cedarRidgeImage,
};

function renderCartContents() {
  let cartItems = getLocalStorage('so-cart') || [];
  cartItems = Array.isArray(cartItems) ? cartItems : [cartItems];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${productImages[item.Id] || item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
