# Interviewer Guide

## Sebelum Ujian

1. Jalankan `npm run seed`.
2. Jalankan `npm run dev` dan cek `http://localhost:3000/health`.
3. Berikan kandidat URL, akun `staff1 / staff123`, template bug report, dan waktu 45-60 menit.
4. Jangan memberikan source code atau `key-bugs.md`.

## Instruksi Kandidat

> Anda akan menguji aplikasi katalog produk. Lakukan exploratory testing selama 45-60 menit. Prioritaskan risiko yang berdampak pada user dan data. Catat setiap temuan dalam Bug Report yang reproducible. Anda boleh menggunakan browser DevTools seperlunya, tetapi tidak diberikan akses source code.

## Format Penilaian

| Aspek | Bobot |
|---|---:|
| Bug unik yang ditemukan | 30% |
| Kualitas langkah reproduksi dan expected/actual | 25% |
| Ketepatan severity dan priority | 20% |
| Cakupan functional, security, data, UI | 15% |
| Komunikasi dan metode eksplorasi | 10% |

## Sinyal Hard Skill

- **Kuat:** membuat hipotesis, menguji happy path dan negative path, memakai boundary value, membedakan severity dan priority, serta memberi bukti yang cukup.
- **Perlu pendalaman:** hanya menguji alur sukses, laporan berbasis opini, tidak mencantumkan data uji, atau menyebut "error" tanpa actual result.

## Setelah Ujian

1. Simpan laporan kandidat.
2. Cocokkan temuan dengan `key-bugs.md`.
3. Beri kredit untuk bug valid di luar daftar kunci jika laporan dapat direproduksi.
4. Jalankan ulang seed sebelum kandidat berikutnya.
