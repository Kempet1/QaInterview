# QA Test Website

Website latihan interview untuk menguji hard skill calon Staff QA melalui exploratory testing pada aplikasi login dan CRUD produk. Database menggunakan `node:sqlite` bawaan Node.js 22.5+ sehingga tidak membutuhkan compiler native tambahan.

## Menjalankan

```bash
npm install
npm run seed
npm run dev
```

Buka `http://localhost:3000`.

## Akun Demo

- `staff1 / staff123`
- `staff2 / staff123`
- `admin / admin123`

Gunakan Node.js 24 LTS atau versi yang sudah menyediakan `node:sqlite`.

## Catatan Interviewer

Daftar bug tersembunyi berada di `docs/key-bugs.md`. Jangan berikan file tersebut kepada kandidat. Kandidat cukup menerima URL, akun demo, durasi ujian, dan template Bug Report.
