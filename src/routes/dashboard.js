const express = require('express');
const { getSupabase } = require('../supabase');
const { requireLogin, requireAdmin } = require('../middlewares/auth');

const router = express.Router();
router.use(requireLogin);

router.get('/', async (req, res, next) => {
  try {
    const client = getSupabase();
    const { data: products, error } = await client.from('products').select('id, name, category, price, stock').order('created_at', { ascending: false });
    if (error) throw error;
    const rows = products || [];
    const totalStock = rows.reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const minStock = rows.reduce((minimum, product) => (!minimum || Number(product.stock) < Number(minimum.stock) ? product : minimum), null);
    const categories = new Set(rows.map((product) => product.category));
    // BUG B-L5 (sengaja): nilai stok negatif ditampilkan apa adanya.
    res.json({
      totalProducts: rows.length,
      totalStock,
      minStock,
      totalCategories: categories.size,
      recent: rows.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/admin', requireAdmin, async (req, res, next) => {
  try {
    const client = getSupabase();
    const [{ data: users, error: usersError }, { data: products, error: productsError }] = await Promise.all([
      client.from('users').select('id, username, role'),
      client.from('products').select('owner_id'),
    ]);
    if (usersError) throw usersError;
    if (productsError) throw productsError;
    const productsByOwner = Object.values((products || []).reduce((result, product) => {
      result[product.owner_id] = result[product.owner_id] || { owner_id: product.owner_id, total: 0 };
      result[product.owner_id].total += 1;
      return result;
    }, {}));
    res.json({ users: users || [], productsByOwner });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
