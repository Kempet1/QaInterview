const express = require('express');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { getSupabase } = require('../supabase');
const { requireLogin } = require('../middlewares/auth');

const router = express.Router();
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const validExtension = ['.jpg', '.jpeg', '.png'].includes(extension);
    const validMime = ['image/jpeg', 'image/png'].includes(file.mimetype);
    if (!validExtension || !validMime) return callback(new Error('Gambar harus berformat JPG atau PNG'));
    callback(null, true);
  },
});
const IMAGE_BUCKET = 'product-images';

router.use(requireLogin);

function handleImageUpload(req, res, next) {
  imageUpload.single('image')(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Ukuran gambar maksimal 2 MB' });
    }
    res.status(400).json({ error: error.message || 'Upload gambar gagal' });
  });
}

async function uploadImage(file) {
  if (!file) return null;
  const extension = path.extname(file.originalname).toLowerCase();
  const storagePath = `products/${crypto.randomUUID()}${extension}`;
  const storage = getSupabase().storage.from(IMAGE_BUCKET);
  const { error } = await storage.upload(storagePath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });
  if (error) throw error;
  return storage.getPublicUrl(storagePath).data.publicUrl;
}

async function removeImage(imageUrl) {
  if (!imageUrl) return;
  const marker = `/${IMAGE_BUCKET}/`;
  const markerIndex = imageUrl.indexOf(marker);
  if (markerIndex === -1) return;
  const storagePath = decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
  await getSupabase().storage.from(IMAGE_BUCKET).remove([storagePath]);
}

router.get('/', async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, order } = req.query;
    let query = getSupabase().from('products').select('*', { count: 'exact' });
    if (search) query = query.ilike('name', `%${search}%`);
    if (category) query = query.eq('category', category);
    if (minPrice !== undefined && minPrice !== '') query = query.gte('price', Number(minPrice));
    if (maxPrice !== undefined && maxPrice !== '') query = query.lte('price', Number(maxPrice));

    // BUG B-M2 (sengaja): nama diurutkan dengan case-sensitive ordering.
    const allowedSort = ['name', 'price', 'stock', 'created_at'];
    const sortColumn = allowedSort.includes(sort) ? sort : 'created_at';
    query = query.order(sortColumn, { ascending: order !== 'desc' });
    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ products: data || [], total: count || 0 });
  } catch (error) {
    next(error);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    const { data, error } = await getSupabase().from('products').select('category').order('category');
    if (error) throw error;
    res.json({ categories: [...new Set((data || []).map((row) => row.category))] });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await getSupabase().from('products').select('*').eq('id', req.params.id).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json({ product: data });
  } catch (error) {
    next(error);
  }
});

router.post('/', handleImageUpload, async (req, res, next) => {
  let imageUrl;
  try {
    const { name, category, price, stock } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Data tidak valid' });
    imageUrl = await uploadImage(req.file);
    const { data, error } = await getSupabase().from('products').insert({
      name,
      category: category || 'Umum',
      price: price === undefined || price === '' ? 0 : Number(price),
      stock: stock === undefined || stock === '' ? 0 : Number(stock),
      owner_id: req.session.user.id,
      image_url: imageUrl,
    }).select('id').single();
    if (error) throw error;
    res.status(201).json({ message: 'Produk berhasil dibuat', id: data.id });
  } catch (error) {
    if (imageUrl) await removeImage(imageUrl).catch(() => {});
    next(error);
  }
});

router.put('/:id', handleImageUpload, async (req, res, next) => {
  let newImageUrl;
  try {
    const { name, category, price, stock } = req.body || {};
    const client = getSupabase();
    const { data: existing, error: findError } = await client.from('products').select('*').eq('id', req.params.id).maybeSingle();
    if (findError) throw findError;
    if (!existing) return res.status(404).json({ error: 'Produk tidak ditemukan' });

    // BUG B-C1 (sengaja): tidak ada pengecekan owner_id (IDOR).
    newImageUrl = await uploadImage(req.file);
    const { error } = await client.from('products').update({
      name: name !== undefined ? name : existing.name,
      category: category !== undefined ? category : existing.category,
      price: price !== undefined ? Number(price) : existing.price,
      stock: stock !== undefined ? Number(stock) : existing.stock,
      image_url: newImageUrl || existing.image_url,
    }).eq('id', req.params.id);
    if (error) throw error;
    if (newImageUrl && existing.image_url) await removeImage(existing.image_url);
    res.json({ message: 'Produk berhasil diperbarui' });
  } catch (error) {
    if (newImageUrl) await removeImage(newImageUrl).catch(() => {});
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const client = getSupabase();
    const { data: existing, error: findError } = await client.from('products').select('id, image_url').eq('id', req.params.id).maybeSingle();
    if (findError) throw findError;
    if (!existing) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    // BUG B-C1 (sengaja): tidak ada pengecekan owner_id (IDOR).
    const { error } = await client.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    await removeImage(existing.image_url);
    // BUG B-M6 (sengaja): response sukses tidak informatif.
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
