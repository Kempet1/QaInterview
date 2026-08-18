require('dotenv').config();
const bcrypt = require('bcryptjs');
const { getSupabase } = require('../src/supabase');

async function seed() {
  const client = getSupabase();
  const { error: productDeleteError } = await client.from('products').delete().not('id', 'is', null);
  if (productDeleteError) throw productDeleteError;
  const { error: userDeleteError } = await client.from('users').delete().not('id', 'is', null);
  if (userDeleteError) throw userDeleteError;

  const users = [
    { username: 'admin', password_hash: bcrypt.hashSync('admin123', 10), role: 'admin' },
    { username: 'staff1', password_hash: bcrypt.hashSync('staff123', 10), role: 'production' },
    { username: 'staff2', password_hash: bcrypt.hashSync('staff123', 10), role: 'warehouse' },
  ];
  const { data: insertedUsers, error: userInsertError } = await client.from('users').insert(users).select('id, username');
  if (userInsertError) throw userInsertError;
  const ownerByUsername = Object.fromEntries(insertedUsers.map((user) => [user.username, user.id]));

  const names = [
    ['Apel Fuji', 'Buah', 25000, 40, 'staff1'], ['Mangga Harum Manis', 'Buah', 30000, 25, 'staff1'],
    ['Zebra Cake', 'Kue', 15000, 10, 'staff2'], ['apel Malang', 'Buah', 20000, 30, 'staff2'],
    ['Buku Tulis', 'Alat Tulis', 5000, 100, 'staff1'], ['Pulpen Standard', 'Alat Tulis', 3000, 200, 'staff1'],
    ['Penghapus', 'Alat Tulis', 2000, 150, 'staff2'], ['Kopi Arabika', 'Minuman', 60000, 18, 'staff1'],
    ['Teh Melati', 'Minuman', 25000, 35, 'staff2'], ['Gula Pasir', 'Sembako', 14000, 50, 'staff1'],
    ['Minyak Goreng', 'Sembako', 32000, 22, 'staff1'], ['Beras Premium', 'Sembako', 68000, 15, 'staff2'],
    ['Roti Tawar', 'Makanan', 18000, 12, 'staff1'], ['Susu UHT', 'Minuman', 17000, 28, 'staff2'],
    ['Keju Cheddar', 'Makanan', 45000, 8, 'staff1'], ['Cokelat Batang', 'Makanan', 22000, 33, 'staff2'],
    ['Mie Instan', 'Sembako', 3500, 300, 'staff1'], ['Sabun Mandi', 'Kebutuhan', 6000, 80, 'staff2'],
    ['Sampo', 'Kebutuhan', 21000, 45, 'staff1'], ['Deterjen', 'Kebutuhan', 27000, 38, 'staff2'],
    ['Payung Lipat', 'Aksesoris', 35000, 14, 'staff1'], ['Tas Belanja', 'Aksesoris', 12000, 60, 'staff2'],
    ['Botol Minum', 'Aksesoris', 28000, 26, 'staff1'], ['Kursi Lipat', 'Furnitur', 95000, -3, 'staff2'],
  ];
  const products = names.map(([name, category, price, stock, owner]) => ({ name, category, price, stock, owner_id: ownerByUsername[owner] }));
  const { error: productInsertError } = await client.from('products').insert(products);
  if (productInsertError) throw productInsertError;
  console.log('Seed Supabase selesai.');
  console.log('Akun demo: admin/admin123 (admin), staff1/staff123 (production), staff2/staff123 (warehouse)');
}

seed().catch((error) => {
  console.error('Seed gagal:', error.message);
  process.exitCode = 1;
});
