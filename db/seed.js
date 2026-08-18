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
    { username: 'production', password_hash: bcrypt.hashSync('staff123', 10), role: 'production' },
    { username: 'warehouse', password_hash: bcrypt.hashSync('staff123', 10), role: 'warehouse' },
  ];
  const { data: insertedUsers, error: userInsertError } = await client.from('users').insert(users).select('id, username');
  if (userInsertError) throw userInsertError;
  const ownerByUsername = Object.fromEntries(insertedUsers.map((user) => [user.username, user.id]));

  const names = [
    ['Apel Fuji', 'Buah', 25000, 40, 'production'], ['Mangga Harum Manis', 'Buah', 30000, 25, 'production'],
    ['Zebra Cake', 'Kue', 15000, 10, 'warehouse'], ['apel Malang', 'Buah', 20000, 30, 'warehouse'],
    ['Buku Tulis', 'Alat Tulis', 5000, 100, 'production'], ['Pulpen Standard', 'Alat Tulis', 3000, 200, 'production'],
    ['Penghapus', 'Alat Tulis', 2000, 150, 'warehouse'], ['Kopi Arabika', 'Minuman', 60000, 18, 'production'],
    ['Teh Melati', 'Minuman', 25000, 35, 'warehouse'], ['Gula Pasir', 'Sembako', 14000, 50, 'production'],
    ['Minyak Goreng', 'Sembako', 32000, 22, 'production'], ['Beras Premium', 'Sembako', 68000, 15, 'warehouse'],
    ['Roti Tawar', 'Makanan', 18000, 12, 'production'], ['Susu UHT', 'Minuman', 17000, 28, 'warehouse'],
    ['Keju Cheddar', 'Makanan', 45000, 8, 'production'], ['Cokelat Batang', 'Makanan', 22000, 33, 'warehouse'],
    ['Mie Instan', 'Sembako', 3500, 300, 'production'], ['Sabun Mandi', 'Kebutuhan', 6000, 80, 'warehouse'],
    ['Sampo', 'Kebutuhan', 21000, 45, 'production'], ['Deterjen', 'Kebutuhan', 27000, 38, 'warehouse'],
    ['Payung Lipat', 'Aksesoris', 35000, 14, 'production'], ['Tas Belanja', 'Aksesoris', 12000, 60, 'warehouse'],
    ['Botol Minum', 'Aksesoris', 28000, 26, 'production'], ['Kursi Lipat', 'Furnitur', 95000, -3, 'warehouse'],
  ];
  const products = names.map(([name, category, price, stock, owner]) => ({ name, category, price, stock, owner_id: ownerByUsername[owner] }));
  const { error: productInsertError } = await client.from('products').insert(products);
  if (productInsertError) throw productInsertError;
  console.log('Seed Supabase selesai.');
  console.log('Akun demo: admin/admin123 (admin), production/staff123 (production), warehouse/staff123 (warehouse)');
}

seed().catch((error) => {
  console.error('Seed gagal:', error.message);
  process.exitCode = 1;
});
