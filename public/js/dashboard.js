(async function () {
  const alertBox = document.getElementById('page-alert');
  try {
    await loadCurrentUser();
    const data = await api('/api/dashboard');
    document.getElementById('total-products').textContent = data.totalProducts;
    document.getElementById('total-stock').textContent = data.totalStock;
    document.getElementById('total-categories').textContent = data.totalCategories;
    document.getElementById('minimum-stock').textContent = data.minStock ? data.minStock.stock : '-';
    document.getElementById('minimum-stock-name').textContent = data.minStock ? data.minStock.name : 'Tidak ada data';
    const rows = document.getElementById('recent-products');
    if (!data.recent.length) {
      rows.innerHTML = '<tr><td colspan="4" class="text-center py-5 text-secondary">Belum ada produk.</td></tr>';
      return;
    }
    rows.innerHTML = data.recent.map((product) => `<tr><td><div class="product-name">${product.name}</div><div class="product-sub">#${product.id}</div></td><td>${product.category}</td><td>Rp ${Number(product.price).toLocaleString('id-ID')}</td><td>${stockBadge(product.stock)}</td></tr>`).join('');
  } catch (error) {
    alertBox.textContent = error.message;
    alertBox.className = 'alert alert-danger';
  }
})();

function stockBadge(stock) {
  const value = Number(stock);
  const className = value < 0 ? 'negative' : value < 10 ? 'low' : '';
  return `<span class="stock-pill ${className}">${stock}</span>`;
}
