require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');

const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const dashboardRoutes = require('./src/routes/dashboard');
const { initDb } = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

initDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// BUG B-H2 (sengaja): session tidak memiliki maxAge / rolling, sehingga
// session tidak pernah expire meskipun user idle dalam waktu lama.
app.use(
  session({
    name: 'qa_sid',
    secret: process.env.SESSION_SECRET || 'rahasia-ujian-qa',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      // maxAge sengaja TIDAK diset -> session hidup selamanya
    },
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// BUG B-M4 (sengaja): error handler menampilkan stack trace mentah ke user
// alih-alih pesan yang ramah.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Terjadi kesalahan pada server',
    detail: err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`QA Test Website berjalan di http://localhost:${PORT}`);
});
