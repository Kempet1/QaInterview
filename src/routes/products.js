const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { getDb } = require('../db');
const { requireLogin } = require('../middlewares/auth');

const router = express.Router();

router.use(requireLogin);

const uploadDirectory = path.join(__dirname, '..', '..', 'public', 'uploads', 'products');
fs.mkdirSync(uploadDirectory, { recursive: true });

const imageStorage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedExtensions.includes(extension) || !allowedTypes.includes(file.mimetype)) {
      return callback(new Error('Gambar harus berformat JPG atau PNG'));
    }
    callback(null, true);
  },
});

function handleImageUpload(req, res, next) {
  imageUpload.single('image')(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Ukuran gambar maksimal 2 MB' });
    }
    return res.status(400).json({ error: error.message || 'Upload gambar gagal' });
  });
}

function removeImage(imageUrl) {
  if (!imageUrl) return;
  const imageName = path.basename(imageUrl);
  const imagePath = path.join(uploadDirectory, imageName);
  if (imagePath.startsWith(uploadDirectory) && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
}

// GET /api/products
// Mendukung: search, filter kategori, filter harga (min/max), sorting.
router.get('/', (req, res) => {
  const { search, category, minPrice, maxPrice, sort, order } = req.query;
  const db = getDb();

  const where = [];
  const params = {};

  if (search) {
    where.push('name LIKE @search');
    params.search = `%${search}%`;
  }
  if (category) {
    where.push('category = @category');
    params.category = category;
  }
  if (minPrice !== undefined && minPrice !== '') {
    where.push('price >= @minPrice');
    params.minPrice = Number(minPrice);
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    where.push('price <= @maxPrice');
    params.maxPrice = Number(maxPrice);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // BUG B-M2 (sengaja): sorting nama memakai kolasi BINARY (case-sensitive)
  // sehingga huruf besar selalu mendahului huruf kecil.
  // Contoh: ["Zebra", "apel", "mangga"] -> "Zebra" tampil pertama.
  const allowedSort = ['name', 'price', 'stock', 'created_at'];
  const sortCol = allowedSort.includes(sort) ? sort : 'created_at';
  const sortDir = order === 'desc' ? 'DESC' : 'ASC';

  const rows = db
    .prepare(`SELECT * FROM products ${whereSql} ORDER BY ${sortCol} ${sortDir}`)
    .all(params);

  res.json({ products: rows, total: rows.length });
});

// GET /api/products/categories
router.get('/categories', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();
  res.json({ categories: rows.map((r) => r.category) });
});

// GET /api/products/:id  (untuk pre-fill form edit)
router.get('/:id', (req, res) => {
  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  res.json({ product });
});

// POST /api/products  (create)
router.post('/', handleImageUpload, (req, res) => {
  const { name, category, price, stock } = req.body || {};
  const db = getDb();

  if (!name || !String(name).trim()) {
    // BUG B-L4 (sengaja): pesan error generik, tidak menyebut field spesifik.
    return res.status(400).json({ error: 'Data tidak valid' });
  }

  // BUG B-H3 (sengaja): TIDAK ada validasi batas harga/stock.
  // Harga negatif, 0, dan stock desimal/negatif diterima begitu saja.
  // BUG B-M3 (sengaja): TIDAK ada pengecekan duplikasi nama produk.
  // BUG B-C2 (sengaja): nama disimpan apa adanya tanpa sanitasi/escaping,
  // memungkinkan stored XSS.
  const stmt = db.prepare(
    'INSERT INTO products (name, category, price, stock, owner_id, image_url) VALUES (@name, @category, @price, @stock, @owner, @imageUrl)'
  );
  const info = stmt.run({
    name: name,
    category: category || 'Umum',
    price: price === undefined || price === '' ? 0 : Number(price),
    stock: stock === undefined || stock === '' ? 0 : Number(stock),
    owner: req.session.user.id,
    imageUrl: req.file ? `/uploads/products/${req.file.filename}` : null,
  });

  res.status(201).json({ message: 'Produk berhasil dibuat', id: info.lastInsertRowid });
});

// PUT /api/products/:id  (update)
router.put('/:id', handleImageUpload, (req, res) => {
  const db = getDb();
  const { name, category, price, stock } = req.body || {};

  // BUG B-C1 (sengaja): TIDAK ada pengecekan kepemilikan (owner_id).
  // User mana pun yang login bisa mengubah produk milik user lain
  // selama tahu id-nya (IDOR).
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }

  const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : existing.image_url;
  db.prepare(
    'UPDATE products SET name = @name, category = @category, price = @price, stock = @stock, image_url = @imageUrl WHERE id = @id'
  ).run({
    id: Number(req.params.id),
    name: name !== undefined ? name : existing.name,
    category: category !== undefined ? category : existing.category,
    price: price !== undefined ? Number(price) : existing.price,
    stock: stock !== undefined ? Number(stock) : existing.stock,
    imageUrl,
  });
  if (req.file && existing.image_url) removeImage(existing.image_url);

  res.json({ message: 'Produk berhasil diperbarui' });
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const db = getDb();

  // BUG B-C1 (sengaja): TIDAK ada pengecekan kepemilikan saat delete (IDOR).
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  removeImage(existing.image_url);
  // BUG B-M6 sebagian (sengaja): tidak ada pesan sukses yang informatif.
  res.json({});
});

module.exports = router;
