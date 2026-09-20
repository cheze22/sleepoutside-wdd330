export function initSearchForm() {
  const form = document.querySelector('.search-form');
  if (!form) {
    return;
  }

  const input = form.querySelector('input[name="search"]');
  const currentSearch = new URLSearchParams(window.location.search).get(
    'search',
  );
  if (currentSearch) {
    input.value = currentSearch;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) {
      input.value = '';
      input.focus();
      return;
    }

    window.location.href = `/product-list/index.html?search=${encodeURIComponent(query)}`;
  });
}

initSearchForm();
