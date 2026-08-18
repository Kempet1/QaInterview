function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Silakan login terlebih dahulu' });
  }
  next();
}

// BUG B-H4 (sengaja): middleware admin TIDAK memverifikasi role.
// Selama user sudah login (role apa pun, termasuk 'staff'),
// ia bisa mengakses endpoint khusus admin.
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Silakan login terlebih dahulu' });
  }
  // Seharusnya: if (req.session.user.role !== 'admin') return res.status(403)...
  next();
}

module.exports = { requireLogin, requireAdmin };
