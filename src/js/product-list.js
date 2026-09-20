import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import './Search.mjs';

const query = new URLSearchParams(window.location.search).get('search')?.trim();
const dataSource = new ProductData('tents');
const listElement = document.querySelector('.product-list');
const productList = new ProductList('search', dataSource, listElement);
const heading = document.querySelector('.search-results__heading');
const status = document.querySelector('.search-results__status');

async function init() {
  if (!query) {
    status.textContent = 'Enter a product to search for.';
    return;
  }

  heading.textContent = `Search Results for "${query}"`;
  status.textContent = 'Searching...';

  try {
    const products = await dataSource.searchProducts(query);
    productList.renderList(products);
    status.textContent = products.length
      ? `${products.length} product${products.length === 1 ? '' : 's'} found.`
      : 'No products found.';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Product search failed:', error);
    productList.renderList([]);
    status.textContent =
      'Unable to load search results. Please try again later.';
  }
}

init();
