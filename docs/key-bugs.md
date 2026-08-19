# Key Bugs - Interviewer Only

Jangan bagikan dokumen ini kepada kandidat. Seluruh bug dimaksudkan untuk ditemukan melalui interaksi black-box pada UI.

| ID | Severity | Priority | Bug | Verifikasi cepat |
|---|---|---|---|---|
| B-C1 | Critical | High | IDOR pada update/delete produk | Login sebagai staff, ubah/hapus ID produk milik user lain. |
| B-C2 | Critical | High | Stored XSS pada nama produk | Buat produk bernama `<script>alert(1)</script>`, buka list. |
| B-C3 | Critical | High | Login bypass | Submit username valid dengan password kosong. |
| B-H1 | High | High | Tidak ada rate limit login | Ulangi login gagal berkali-kali. |
| B-H2 | High | High | Session tidak expire | Periksa cookie/session setelah idle. |
| B-H3 | High | High | Validasi harga/stok longgar | Simpan harga negatif atau stok desimal/negatif. |
| B-H4 | High | High | Upload file non-JPG/PNG diterima sebagai gambar produk | Buat produk, pilih PDF/TXT atau file non-image <= 2 MB, lalu simpan. |
| B-M1 | Medium | Medium | Next pagination selalu aktif | Buka halaman terakhir lalu klik Next. |
| B-M2 | Medium | Medium | Sorting case-sensitive | Sort nama dengan data `Apel` dan `apel`. |
| B-M3 | Medium | High | Duplikat produk diizinkan | Buat produk dengan nama yang sama dua kali. |
| B-M4 | Medium | High | Stack trace/error detail bocor | Picu error server dan periksa response. |
| B-M5 | Medium | Medium | Edit tidak pre-fill harga/kategori | Klik edit pada produk yang sudah ada. |
| B-M6 | Medium | High | Delete tanpa konfirmasi/feedback | Klik ikon delete. |
| B-L1 | Low | Low | Typo UI | Review semua label dan tombol. |
| B-L2 | Low | Medium | Kontras/aksesibilitas | Review warna dan label aksesibel. |
| B-L3 | Low | Medium | Layout mobile | Uji viewport sempit. |
| B-L4 | Low | Medium | Pesan error generik | Submit nama kosong. |
| B-L5 | Low | Medium | Stok negatif tampil | Lihat kartu stok minimum di dashboard. |
| B-L6 | Low | Medium | Tab order | Navigasi form dengan keyboard. |
| B-L7 | Low | Medium | Partial localization | Ganti ID/EN; beberapa teks tetap tidak berubah atau kembali ke bahasa Indonesia saat modal dibuka. |

## Ringkasan

Total bug: **20**

| Dimensi | High | Medium | Low | Critical |
|---|---:|---:|---:|---:|
| Severity | 4 | 6 | 7 | 3 |
| Priority | 10 | 9 | 1 | 0 |

Severity menunjukkan dampak teknis dan bisnis jika bug terjadi. Priority menunjukkan urgensi perbaikan berdasarkan risiko eksploitasi, potensi kehilangan atau perubahan data, serta frekuensi penggunaan fitur.

## Reset Data

Jalankan `npm run seed` sebelum sesi baru. Perintah ini menghapus dan membuat ulang database demo.
