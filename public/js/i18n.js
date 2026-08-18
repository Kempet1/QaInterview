(function () {
  const translations = {
    id: {
      'login.eyebrow': 'INTERVIEW LAB / QA STAFF',
      'login.title': 'Uji produk. Temukan yang rusak.',
      'login.description': 'Platform simulasi interview untuk menguji kemampuan pengujian fungsional, exploratory testing, dan pelaporan bug secara sistematis.',
      'login.welcome': 'SELAMAT DATANG KEMBALI',
      'login.heading': 'Masuk ke QA Lab',
      'login.subtitle': 'Gunakan akun yang diberikan interviewer.',
      'login.username': 'Username',
      'login.usernameHint': 'Masukkan username',
      'login.password': 'Password',
      'login.passwordHint': 'Masukkan password',
      'login.demo': 'Akun demo',
      'login.submit': 'Masuk ke workspace',
      'login.demoNote': 'Demo:',
      'nav.dashboard': 'Dasbor',
      'nav.products': 'Produk',
      'nav.logout': 'Keluar',
      'dashboard.eyebrow': 'RINGKASAN / HARI INI',
      'dashboard.title': 'Pengujian yang baik dimulai dari visibilitas.',
      'dashboard.subtitle': 'Pantau kondisi katalog sebelum mulai eksplorasi.',
      'dashboard.add': 'Tambah produk',
      'dashboard.totalProducts': 'Total produk',
      'dashboard.totalStock': 'Total stok',
      'dashboard.categories': 'Kategori',
      'dashboard.minimumStock': 'Stok terendah',
      'dashboard.items': 'Item dalam katalog',
      'dashboard.stockAcross': 'Total seluruh produk',
      'dashboard.activeCategories': 'Kategori aktif',
      'dashboard.recent': 'Produk terbaru',
      'dashboard.viewAll': 'Lihat semua',
      'products.eyebrow': 'KATALOG / EKSPLORASI',
      'products.title': 'Workspace produk',
      'products.subtitle': 'Kelola data katalog dan uji setiap workflow.',
      'products.add': 'Tambah produk',
      'products.search': 'Cari produk',
      'products.category': 'Kategori',
      'products.allCategories': 'Semua kategori',
      'products.minPrice': 'Harga minimum',
      'products.all': 'Semua produk',
      'products.name': 'Nama Produk',
      'products.price': 'Harga',
      'products.stock': 'Stok',
      'products.actions': 'Aksi',
      'products.testMode': 'Mode pengujian',
      'products.modalAdd': 'Tambah produk',
      'products.modalEdit': 'Edit produk',
      'products.productName': 'Nama produk',
      'products.image': 'Gambar produk',
      'products.imageHelp': 'Format JPG/PNG, maksimal 2 MB.',
      'products.save': 'Simpan produk',
      'products.cancel': 'Batal'
    },
    en: {
      'login.eyebrow': 'INTERVIEW LAB / QA STAFF',
      'login.title': 'Test the product. Find what breaks.',
      'login.description': 'An interview simulation platform for testing functional testing, exploratory testing, and systematic bug reporting skills.',
      'login.welcome': 'WELCOME BACK',
      'login.heading': 'Sign in to QA Lab',
      'login.subtitle': 'Use the account provided by the interviewer.',
      'login.username': 'Username',
      'login.usernameHint': 'Enter username',
      'login.password': 'Password',
      // BUG B-L7 (sengaja): hint password tidak ikut berubah saat English.
      'login.passwordHint': 'Masukkan password',
      'login.demo': 'Demo account',
      'login.submit': 'Enter workspace',
      'login.demoNote': 'Demo:',
      'nav.dashboard': 'Dashboard',
      'nav.products': 'Products',
      'nav.logout': 'Logout',
      'dashboard.eyebrow': 'OVERVIEW / TODAY',
      'dashboard.title': 'Good testing starts with visibility.',
      'dashboard.subtitle': 'Review catalog health before starting exploration.',
      'dashboard.add': 'Add product',
      'dashboard.totalProducts': 'Total products',
      'dashboard.totalStock': 'Total stock',
      'dashboard.categories': 'Categories',
      'dashboard.minimumStock': 'Lowest stock',
      'dashboard.items': 'Items in catalog',
      'dashboard.stockAcross': 'Across all products',
      'dashboard.activeCategories': 'Active categories',
      'dashboard.recent': 'Recent products',
      'dashboard.viewAll': 'View all',
      'products.eyebrow': 'CATALOG / EXPLORATION',
      'products.title': 'Product workspace',
      'products.subtitle': 'Manage catalog data and test every workflow.',
      'products.add': 'Add product',
      'products.search': 'Search products',
      'products.category': 'Category',
      'products.allCategories': 'All categories',
      'products.minPrice': 'Minimum price',
      'products.all': 'All products',
      'products.name': 'Product Name',
      'products.price': 'Price',
      'products.stock': 'Stock',
      'products.actions': 'Actions',
      'products.testMode': 'Test mode',
      'products.modalAdd': 'Add product',
      'products.modalEdit': 'Edit product',
      'products.productName': 'Product name',
      'products.image': 'Product image',
      'products.imageHelp': 'JPG/PNG format, maximum 2 MB.',
      'products.save': 'Save product',
      'products.cancel': 'Cancel'
    }
  };

  function applyLanguage(language) {
    const dictionary = translations[language] || translations.id;
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = dictionary[element.dataset.i18n];
      if (value) element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const value = dictionary[element.dataset.i18nPlaceholder];
      if (value) element.placeholder = value;
    });
    document.querySelectorAll('[data-language-label]').forEach((element) => {
      element.textContent = language === 'id' ? 'EN' : 'ID';
    });
    localStorage.setItem('qa-language', language);
  }

  document.addEventListener('DOMContentLoaded', () => {
    let language = localStorage.getItem('qa-language') || 'id';
    applyLanguage(language);
    document.querySelectorAll('[data-language-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        language = language === 'id' ? 'en' : 'id';
        applyLanguage(language);
      });
    });
  });
})();
