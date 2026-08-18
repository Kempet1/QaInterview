# QA Test Website

Website latihan interview untuk menguji hard skill calon Staff QA melalui exploratory testing pada aplikasi login dan CRUD produk. Database menggunakan Supabase PostgreSQL, gambar produk disimpan di Supabase Storage, dan session login menggunakan signed cookie agar kompatibel dengan Vercel.

## Menjalankan

```bash
npm install
npm run seed
npm run dev
```

Buka `http://localhost:3000`.

## Akun Demo

- `staff1 / staff123` - production, hanya tambah produk
- `staff2 / staff123` - warehouse, edit, ubah stok, dan hapus produk
- `admin / admin123`

Gunakan Node.js 20+ dan isi `.env` berdasarkan `.env.example`. Jalankan `supabase/schema.sql` di SQL Editor Supabase sebelum menjalankan seed.

## Catatan Interviewer

Daftar bug tersembunyi berada di `docs/key-bugs.md`. Jangan berikan file tersebut kepada kandidat. Kandidat cukup menerima URL, akun demo, durasi ujian, dan template Bug Report.

## Deploy ke Vercel

Gunakan pengaturan berikut:

```text
Root Directory: .
Build Command: kosongkan
Output Directory: kosongkan
Install Command: npm install
```

Tambahkan environment variables `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`, dan `SESSION_SECRET` di Vercel. Jangan commit file `.env` atau secret key.
