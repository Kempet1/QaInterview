require('dotenv').config();
const bcrypt = require('bcryptjs');
const { getDb, initDb } = require('../src/db');

const db = initDb();

db.prepare('DELETE FROM products').run();
db.prepare('DELETE FROM users').run();

const insertUser = db.prepare(
  'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)'
);

const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'staff1', password: 'staff123', role: 'staff' },
  { username: 'staff2', password: 'staff123', role: 'staff' },
];

for (const u of users) {
  insertUser.run(u.username, bcrypt.hashSync(u.password, 10), u.role);
}

const insertProduct = db.prepare(
  'INSERT INTO products (name, category, price, stock, owner_id) VALUES (?, ?, ?, ?, ?)'
);

// Nama dengan campuran huruf besar/kecil untuk memperlihatkan bug sorting B-M2.
const products = [
  ['Apel Fuji', 'Buah', 25000, 40, 2],
  ['Mangga Harum Manis', 'Buah', 30000, 25, 2],
  ['Zebra Cake', 'Kue', 15000, 10, 3],
  ['apel Malang', 'Buah', 20000, 30, 3],
  ['Buku Tulis', 'Alat Tulis', 5000, 100, 2],
  ['Pulpen Standard', 'Alat Tulis', 3000, 200, 2],
  ['Penghapus', 'Alat Tulis', 2000, 150, 3],
  ['Kopi Arabika', 'Minuman', 60000, 18, 2],
  ['Teh Melati', 'Minuman', 25000, 35, 3],
  ['Gula Pasir', 'Sembako', 14000, 50, 2],
  ['Minyak Goreng', 'Sembako', 32000, 22, 2],
  ['Beras Premium', 'Sembako', 68000, 15, 3],
  ['Roti Tawar', 'Makanan', 18000, 12, 2],
  ['Susu UHT', 'Minuman', 17000, 28, 3],
  ['Keju Cheddar', 'Makanan', 45000, 8, 2],
  ['Cokelat Batang', 'Makanan', 22000, 33, 3],
  ['Mie Instan', 'Sembako', 3500, 300, 2],
  ['Sabun Mandi', 'Kebutuhan', 6000, 80, 3],
  ['Sampo', 'Kebutuhan', 21000, 45, 2],
  ['Deterjen', 'Kebutuhan', 27000, 38, 3],
  ['Payung Lipat', 'Aksesoris', 35000, 14, 2],
  ['Tas Belanja', 'Aksesoris', 12000, 60, 3],
  ['Botol Minum', 'Aksesoris', 28000, 26, 2],
  // Stock negatif (sengaja) untuk memunculkan bug B-L5 di dashboard.
  ['Kursi Lipat', 'Furnitur', 95000, -3, 3],
];

for (const p of products) {
  insertProduct.run(p[0], p[1], p[2], p[3], p[4]);
}

console.log('Seed selesai.');
console.log('Akun demo:');
console.log('  admin  / admin123  (role: admin)');
console.log('  staff1 / staff123  (role: staff)');
console.log('  staff2 / staff123  (role: staff)');
