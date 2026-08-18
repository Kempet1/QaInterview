const express = require('express');
const { getDb } = require('../db');
const { requireLogin, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

router.use(requireLogin);

// GET /api/dashboard  (statistik umum)
router.get('/', (req, res) => {
  const db = getDb();

  const totalProducts = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
  const totalStock = db.prepare('SELECT COALESCE(SUM(stock),0) AS s FROM products').get().s;
  const minStockRow = db
    .prepare('SELECT name, stock FROM products ORDER BY stock ASC LIMIT 1')
    .get();
  const totalCategories = db
    .prepare('SELECT COUNT(DISTINCT category) AS c FROM products')
    .get().c;

  // BUG B-L5 (sengaja): nilai stock minimum / total ditampilkan apa adanya.
  // Jika ada stock negatif (akibat B-H3), dashboard ikut menampilkan angka minus.
  const recent = db
    .prepare('SELECT id, name, category, price, stock FROM products ORDER BY created_at DESC LIMIT 5')
    .all();

  res.json({
    totalProducts,
    totalStock,
    minStock: minStockRow || null,
    totalCategories,
    recent,
  });
});

// GET /api/dashboard/admin  (ringkasan khusus admin)
// BUG B-H4 (sengaja): memakai requireAdmin yang TIDAK mengecek role,
// sehingga user 'staff' biasa pun bisa mengakses data admin ini.
router.get('/admin', requireAdmin, (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT id, username, role FROM users').all();
  const byOwner = db
    .prepare(
      'SELECT owner_id, COUNT(*) AS total FROM products GROUP BY owner_id'
    )
    .all();
  res.json({ users, productsByOwner: byOwner });
});

module.exports = router;
