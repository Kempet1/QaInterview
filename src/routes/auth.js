const express = require('express');
const bcrypt = require('bcryptjs');
const { getSupabase } = require('../supabase');

const router = express.Router();

function normalizeRole(user) {
  if (user.role !== 'staff') return user.role;
  if (user.username === 'warehouse' || user.username === 'staff2') return 'warehouse';
  return 'production';
}

// BUG B-H1 (sengaja): tidak ada rate limiting / lockout pada endpoint login.

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username) return res.status(400).json({ error: 'Username wajib diisi' });

    const { data: user, error } = await getSupabase()
      .from('users')
      .select('id, username, password_hash, role')
      .eq('username', username)
      .maybeSingle();
    if (error) throw error;
    if (!user) return res.status(401).json({ error: 'Username atau password salah' });
    const role = normalizeRole(user);

    // BUG B-C3 (sengaja): password kosong melewati verifikasi.
    if (password === undefined || password === null || password === '') {
      req.session.user = { id: user.id, username: user.username, role };
      return res.json({ message: 'Login berhasil', user: req.session.user });
    }

    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    req.session.user = { id: user.id, username: user.username, role };
    res.json({ message: 'Login berhasil', user: req.session.user });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  req.session = null;
  res.json({ message: 'Logout berhasil' });
});

router.get('/me', (req, res) => {
  if (!req.session || !req.session.user) return res.status(401).json({ error: 'Belum login' });
  res.json({ user: req.session.user });
});

module.exports = router;
