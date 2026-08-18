const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');

const router = express.Router();

// BUG B-H1 (sengaja): TIDAK ada rate limiting / lockout pada endpoint login.
// Percobaan login gagal bisa dilakukan tanpa batas.

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username) {
    return res.status(400).json({ error: 'Username wajib diisi' });
  }

  const db = getDb();
  const user = db
    .prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?')
    .get(username);

  if (!user) {
    return res.status(401).json({ error: 'Username atau password salah' });
  }

  // BUG B-C3 (sengaja): jika field password kosong / tidak dikirim,
  // server melewatkan verifikasi password dan langsung login.
  // Akibatnya siapa pun bisa masuk hanya dengan username yang valid.
  if (password === undefined || password === null || password === '') {
    req.session.user = { id: user.id, username: user.username, role: user.role };
    return res.json({
      message: 'Login berhasil',
      user: { id: user.id, username: user.username, role: user.role },
    });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Username atau password salah' });
  }

  req.session.user = { id: user.id, username: user.username, role: user.role };
  res.json({
    message: 'Login berhasil',
    user: { id: user.id, username: user.username, role: user.role },
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logout berhasil' });
  });
});

router.get('/me', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Belum login' });
  }
  res.json({ user: req.session.user });
});

module.exports = router;
