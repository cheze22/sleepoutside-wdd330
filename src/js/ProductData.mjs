function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
}

const apiBaseUrl = (
  import.meta.env?.VITE_SERVER_URL ||
  'https://wdd330-backend.onrender.com/'
).replace(/\/?$/, '/');

const productCategories = [
  'tents',
  'backpacks',
  'sleeping-bags',
  'hammocks',
];

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `${apiBaseUrl}products/search/${encodeURIComponent(category)}`;
  }

  async getData() {
    const data = await fetch(this.path).then(convertToJson);
    return Array.isArray(data.Result) ? data.Result : [];
  }

  async findProductById(id) {
    const data = await fetch(
      `${apiBaseUrl}product/${encodeURIComponent(id)}`,
    ).then(convertToJson);
    return data.Result;
  }

  async searchProducts(query) {
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    if (!query.trim()) {
      return [];
    }

    const categoryRequests = productCategories.map(async (category) => {
      const data = await fetch(
        `${apiBaseUrl}products/search/${encodeURIComponent(category)}`,
      ).then(convertToJson);
      return Array.isArray(data.Result) ? data.Result : [];
    });
    const products = (await Promise.all(categoryRequests)).flat();

    return products.filter((product) => {
      const searchableText = [
        product.Name,
        product.NameWithoutBrand,
        product.Brand?.Name,
        product.Category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }
}
