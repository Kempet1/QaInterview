# Key Bugs - Interviewer Only

Jangan bagikan dokumen ini kepada kandidat. Seluruh bug dimaksudkan untuk ditemukan melalui interaksi black-box pada UI.

| ID | Severity | Bug | Verifikasi cepat |
|---|---|---|---|
| B-C1 | Critical | IDOR pada update/delete produk | Login sebagai staff, ubah/hapus ID produk milik user lain. |
| B-C2 | Critical | Stored XSS pada nama produk | Buat produk bernama `<script>alert(1)</script>`, buka list. |
| B-C3 | Critical | Login bypass | Submit username valid dengan password kosong. |
| B-H1 | High | Tidak ada rate limit login | Ulangi login gagal berkali-kali. |
| B-H2 | High | Session tidak expire | Periksa cookie/session setelah idle. |
| B-H3 | High | Validasi harga/stok longgar | Simpan harga negatif atau stok desimal/negatif. |
| B-M1 | Medium | Next pagination selalu aktif | Buka halaman terakhir lalu klik Next. |
| B-M2 | Medium | Sorting case-sensitive | Sort nama dengan data `Apel` dan `apel`. |
| B-M3 | Medium | Duplikat produk diizinkan | Buat produk dengan nama yang sama dua kali. |
| B-M4 | Medium | Stack trace/error detail bocor | Picu error server dan periksa response. |
| B-M5 | Medium | Edit tidak pre-fill harga/kategori | Klik edit pada produk yang sudah ada. |
| B-M6 | Medium | Delete tanpa konfirmasi/feedback | Klik ikon delete. |
| B-L1 | Low | Typo UI | Review semua label dan tombol. |
| B-L2 | Low | Kontras/aksesibilitas | Review warna dan label aksesibel. |
| B-L3 | Low | Layout mobile | Uji viewport sempit. |
| B-L4 | Low | Pesan error generik | Submit nama kosong. |
| B-L5 | Low | Stok negatif tampil | Lihat kartu stok minimum di dashboard. |
| B-L6 | Low | Tab order | Navigasi form dengan keyboard. |
| B-L7 | Low | Partial localization | Ganti ID/EN; beberapa teks tetap tidak berubah atau kembali ke bahasa Indonesia saat modal dibuka. |

## Reset Data

Jalankan `npm run seed` sebelum sesi baru. Perintah ini menghapus dan membuat ulang database demo.
