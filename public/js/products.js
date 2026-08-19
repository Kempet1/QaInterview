(async function () {
  const pageSize = 10;
  let products = [];
  let page = 1;
  let nameOrder = 'asc';
  let currentUser;
  const modal = new bootstrap.Modal(document.getElementById('product-modal'));
  const rows = document.getElementById('product-rows');
  const alertBox = document.getElementById('page-alert');

  ensureImageUpload();
  try { currentUser = await loadCurrentUser(); applyRolePermissions(); await loadCategories(); await loadProducts(); } catch (error) { showAlert(error.message, 'danger'); }

  ['search', 'category', 'min-price'].forEach((id) => document.getElementById(id).addEventListener('input', () => { page = 1; loadProducts(); }));
  document.getElementById('name-sort').addEventListener('click', () => { nameOrder = nameOrder === 'asc' ? 'desc' : 'asc'; updateSortIcon(); page = 1; loadProducts(); });
  document.getElementById('reset-filter').addEventListener('click', () => { ['search', 'min-price'].forEach((id) => { document.getElementById(id).value = ''; }); document.getElementById('category').value = ''; nameOrder = 'asc'; updateSortIcon(); page = 1; loadProducts(); });
  document.getElementById('prev-page').addEventListener('click', () => { if (page > 1) { page -= 1; render(); } });
  // BUG B-M1: tombol Next tetap aktif pada halaman terakhir.
  document.getElementById('next-page').addEventListener('click', () => { page += 1; render(); });
  document.getElementById('add-product').addEventListener('click', () => openForm());
  document.getElementById('product-form').addEventListener('submit', saveProduct);
  document.getElementById('product-image').addEventListener('change', previewSelectedImage);

  async function loadCategories() {
    const data = await api('/api/products/categories');
    document.getElementById('category').insertAdjacentHTML('beforeend', data.categories.map((item) => `<option value="${item}">${item}</option>`).join(''));
  }

  async function loadProducts() {
    const params = new URLSearchParams({ search: document.getElementById('search').value, category: document.getElementById('category').value, sort: 'name', order: nameOrder, minPrice: document.getElementById('min-price').value });
    const data = await api(`/api/products?${params}`);
    products = data.products;
    page = 1;
    render();
  }

  function render() {
    const start = (page - 1) * pageSize;
    const visible = products.slice(start, start + pageSize);
    document.getElementById('result-count').textContent = `${products.length} produk ditemukan`;
    document.getElementById('page-label').textContent = products.length ? `Page ${page} of ${Math.max(1, Math.ceil(products.length / pageSize))}` : '';
    document.getElementById('prev-page').disabled = page <= 1;
    // BUG B-M1: harusnya disabled jika page >= totalPages.
    document.getElementById('next-page').disabled = false;
    document.getElementById('empty-state').classList.toggle('d-none', products.length !== 0);
    const actionButtons = (product) => currentUser.role === 'production' ? '<span class="text-secondary">-</span>' : `<button class="btn btn-sm btn-light edit-product" data-id="${product.id}" title="Edit"><i class="bi bi-pencil"></i></button> <button class="btn btn-sm btn-light text-danger delete-product" data-id="${product.id}" title="Delete"><i class="bi bi-trash3"></i></button>`;
    rows.innerHTML = visible.map((product) => `<tr><td><div class="product-cell"><div class="product-thumb-wrap">${product.image_url ? `<img class="product-thumb" src="${product.image_url}" alt="${product.name}">` : '<span class="product-thumb-placeholder"><i class="bi bi-image"></i></span>'}</div><div><div class="product-name">${product.name}</div><div class="product-sub">ID #${product.id}</div></div></div></td><td>${product.category}</td><td>Rp ${Number(product.price).toLocaleString('id-ID')}</td><td>${stockBadge(product.stock)}</td><td class="text-end">${actionButtons(product)}</td></tr>`).join('');
    document.querySelectorAll('.edit-product').forEach((button) => button.addEventListener('click', () => openForm(button.dataset.id)));
    document.querySelectorAll('.delete-product').forEach((button) => button.addEventListener('click', () => deleteProduct(button.dataset.id)));
  }

  async function openForm(id) {
    document.getElementById('product-form').reset();
    clearValidation();
    clearImagePreview();
    document.getElementById('product-id').value = id || '';
    document.getElementById('product-modal-title').textContent = id ? 'Edit produk' : 'Tambah produk';
    if (id) {
      const data = await api(`/api/products/${id}`);
      document.getElementById('product-name').value = data.product.name;
      // BUG B-M5: harga dan kategori tidak diisi ulang saat edit.
      document.getElementById('product-stock').value = data.product.stock;
      if (data.product.image_url) showImagePreview(data.product.image_url);
    }
    modal.show();
  }

  async function saveProduct(event) {
    event.preventDefault();
    const id = document.getElementById('product-id').value;
    const body = { name: document.getElementById('product-name').value, category: document.getElementById('product-category').value, price: document.getElementById('product-price').value, stock: document.getElementById('product-stock').value };
    const image = document.getElementById('product-image').files[0];
    clearValidation();
    const requiredFields = [
      ['product-name', body.name],
      ['product-category', body.category],
      ['product-price', body.price],
      ['product-stock', body.stock],
    ];
    const firstInvalid = requiredFields.find(([field, value]) => !String(value).trim());
    if (firstInvalid) {
      requiredFields.filter(([, value]) => !String(value).trim()).forEach(([field]) => markInvalid(field));
      document.getElementById(firstInvalid[0]).focus();
      return;
    }
    if (image && !isValidImage(image)) {
      markInvalid('product-image');
      document.getElementById('product-image').focus();
      return;
    }
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append('image', image);
    try { await api(id ? `/api/products/${id}` : '/api/products', { method: id ? 'PUT' : 'POST', body: formData }); modal.hide(); showToast(id ? 'Produk diperbarui.' : 'Produk berhasil ditambahkan.'); await loadProducts(); } catch (error) { const formAlert = document.getElementById('form-alert'); formAlert.textContent = error.message; formAlert.className = 'alert alert-danger'; }
  }

  async function deleteProduct(id) {
    // BUG B-M6: delete dilakukan tanpa konfirmasi dan feedback sukses dari server kosong.
    try { await api(`/api/products/${id}`, { method: 'DELETE' }); await loadProducts(); } catch (error) { showAlert(error.message, 'danger'); }
  }

  function showAlert(message, type) { alertBox.textContent = message; alertBox.className = `alert alert-${type}`; setTimeout(() => { alertBox.className = 'alert d-none'; }, 3500); }
  function applyRolePermissions() { if (currentUser.role === 'warehouse') document.getElementById('add-product').classList.add('d-none'); }
  function showToast(message) { document.getElementById('toast-message').textContent = message; bootstrap.Toast.getOrCreateInstance(document.getElementById('app-toast'), { delay: 3500 }).show(); }
  function updateSortIcon() { const button = document.getElementById('name-sort'); button.innerHTML = `<i class="bi bi-arrow-${nameOrder === 'asc' ? 'up' : 'down'}"></i>`; button.setAttribute('aria-label', `Urutkan nama produk ${nameOrder === 'asc' ? 'ascending' : 'descending'}`); }
  function markInvalid(field) { document.getElementById(field).classList.add('is-invalid'); }
  function clearValidation() { document.querySelectorAll('#product-form .is-invalid').forEach((field) => field.classList.remove('is-invalid')); }
  function ensureImageUpload() {
    const hiddenId = document.getElementById('product-id');
    hiddenId.insertAdjacentHTML('afterend', '<div class="mb-3"><label for="product-image" class="form-label">Gambar produk</label><input id="product-image" class="form-control" type="file" accept="*/*"><div class="form-text">Format JPG/PNG, maksimal 2 MB.</div><div class="invalid-feedback">Gambar harus JPG/PNG dan maksimal 2 MB.</div><div id="image-preview-wrap" class="image-preview-wrap d-none"><img id="image-preview" alt="Preview gambar produk"></div></div>');
  }
  // BUG B-H4 (sengaja): validasi client hanya memeriksa ukuran file.
  function isValidImage(file) { return file.size <= 2 * 1024 * 1024; }
  function previewSelectedImage(event) { const file = event.target.files[0]; if (!file) return hideImagePreview(); if (isValidImage(file)) { clearValidation(); showImagePreview(URL.createObjectURL(file)); } else { hideImagePreview(); markInvalid('product-image'); } }
  function showImagePreview(src) { document.getElementById('image-preview').src = src; document.getElementById('image-preview-wrap').classList.remove('d-none'); }
  function hideImagePreview() { document.getElementById('image-preview-wrap').classList.add('d-none'); document.getElementById('image-preview').removeAttribute('src'); }
  function clearImagePreview() { const input = document.getElementById('product-image'); if (input) input.value = ''; hideImagePreview(); }
  function stockBadge(stock) { const value = Number(stock); return `<span class="stock-pill ${value < 0 ? 'negative' : value < 10 ? 'low' : ''}">${stock}</span>`; }
})();
