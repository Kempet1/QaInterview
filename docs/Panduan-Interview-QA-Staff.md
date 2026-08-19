# Panduan Interview QA Staff

**Versi:** 1.1  
**Durasi total:** 120 menit  
**Penggunaan:** Interviewer, HR, QA Lead

## Tujuan

Panduan ini menyederhanakan interview menjadi tiga waktu utama agar interviewer mudah mengikuti alur dan mencatat bukti jawaban kandidat.

| Waktu | Sesi | Tujuan |
|---|---|---|
| 00-45 menit | Perkenalan dan pengalaman | Menilai pengalaman nyata, komunikasi, ownership, kolaborasi, dan kemampuan belajar |
| 45-110 menit | QA Skill Test | Menilai kemampuan exploratory testing, API testing, risk-based thinking, dan bug reporting |
| 110-120 menit | Tanya jawab | Memberi ruang kandidat bertanya dan menilai kualitas pertanyaan kandidat |

AI hanya dibahas pada pertanyaan QA Mindset, Growth Mindset, dan satu probing pada skill test. AI bukan aspek penilaian terpisah.

## Link Dan Akses Test

| Materi | Link | Catatan |
|---|---|---|
| Web Skill Test | [Buka Web Skill Test](https://qa-interview-7oy6fv1nl-qa-interview.vercel.app/) | Exploratory testing aplikasi katalog produk |
| API Skill Test | [Buka Dokumentasi Restful Booker](https://restful-booker.herokuapp.com/apidoc/#api-Booking-GetBookings) | Dokumentasi endpoint untuk pengujian API |
| API Base URL | `https://restful-booker.herokuapp.com` | Base URL endpoint Restful Booker |

## Persiapan Interviewer

1. Buka Web Skill Test dan pastikan halaman dapat diakses.
2. Siapkan satu akun demo untuk kandidat:
   - `production / staff123`: dapat menambah produk.
   - `warehouse / staff123`: dapat mengedit, mengubah stok, dan menghapus produk.
   - `admin / admin123`: akses penuh untuk verifikasi interviewer.
3. Siapkan template Bug Report.
4. Siapkan link API Skill Test.
5. Jangan memberikan source code atau `key-bugs.md` kepada kandidat.
6. Reset data Web Skill Test sebelum kandidat berikutnya.

# Sesi 1 - Perkenalan Dan Pengalaman

**Waktu:** 00-45 menit

## Pembukaan - 5 Menit

Sampaikan kepada kandidat:

> Interview terdiri dari diskusi pengalaman, pertanyaan situasional, dan QA Skill Test. Kami menilai cara berpikir, komunikasi, prioritas risiko, dan ownership. Tidak semua jawaban harus sempurna; jelaskan asumsi dan cara Anda memvalidasi keputusan.

Pertanyaan pembuka:

- Apakah ada hal yang ingin Anda klarifikasi sebelum interview dimulai?
- Apakah Anda siap menjelaskan kontribusi pribadi saat menceritakan pengalaman kerja?

## A. Pengalaman QA - 15 Menit

Pertanyaan utama:

1. Ceritakan pengalaman QA yang paling relevan dengan posisi ini.
2. Dalam proyek tersebut, apa tanggung jawab Anda secara langsung?
3. Ceritakan satu bug yang paling berdampak dan bagaimana Anda menanganinya.
4. Bagaimana Anda menentukan pekerjaan testing yang harus diprioritaskan?
5. Apa hasil atau perubahan yang terjadi karena kontribusi Anda?

Pertanyaan pendalaman:

- Requirement atau acceptance criteria apa yang menjadi acuan?
- Bagaimana bug tersebut direproduksi?
- Data uji atau evidence apa yang Anda kumpulkan?
- Siapa saja yang perlu dilibatkan?
- Apa yang akan Anda lakukan berbeda jika mengulang kasus tersebut?

Indikator kuat:

- Kandidat membedakan kontribusi pribadi dari kontribusi tim.
- Kandidat menjelaskan konteks, risiko, tindakan, dan hasil.
- Kandidat menggunakan bukti seperti data uji, log, screenshot, atau metrik.

## B. Communication & Clarity - 8 Menit

Pertanyaan:

1. Jelaskan sebuah bug teknis kepada Product Manager non-teknis.
2. Bagaimana Anda menyampaikan risiko ketika bukti belum lengkap?
3. Apa yang harus ada dalam laporan bug agar developer dapat langsung melakukan investigasi?
4. Ceritakan saat Anda harus menyampaikan kabar buruk menjelang release.

Yang dinilai:

- Penjelasan runtut dan mudah dipahami.
- Perbedaan fakta, asumsi, dan ketidakpastian.
- Expected result dan actual result dijelaskan secara jelas.
- Bahasa disesuaikan dengan audiens.

Catatan: jangan mengarahkan sesi ini menjadi diskusi tentang AI atau tools.

## C. QA Mindset & Problem Ownership - 10 Menit

Pertanyaan utama:

> AI menghasilkan draft test case dari sebuah requirement. Sebelum test case tersebut digunakan, apa saja yang akan Anda lakukan?

Pertanyaan pendalaman:

- Bagaimana memastikan expected result yang dibuat AI benar?
- Apa source of truth yang Anda gunakan?
- Bagaimana jika AI membuat skenario yang tidak tertulis di requirement?
- Bagaimana menemukan skenario penting yang tidak dibuat AI?
- Siapa yang bertanggung jawab jika test case hasil AI ternyata salah?
- Data apa yang tidak boleh dimasukkan ke public AI?

Jawaban kuat biasanya memuat:

- Output AI diperlakukan sebagai draft, bukan hasil final.
- Test case dipetakan kembali ke requirement dan acceptance criteria.
- Expected result divalidasi dengan requirement, API contract, atau aturan bisnis.
- Duplikasi dihapus, asumsi ditandai, dan risiko yang terlewat ditambahkan.
- QA tetap bertanggung jawab atas keputusan dan hasil akhir.

Red flag:

- Langsung menggunakan output AI karena AI sudah membaca requirement.
- Menyalahkan AI jika test case salah.
- Menganggap semakin banyak test case berarti coverage semakin baik.
- Memasukkan log production lengkap ke public AI.

Pertanyaan situasional keamanan data:

> Anda ingin meminta AI menganalisis error API. Log berisi access token, email customer, nomor rekening, dan detail transaksi. Apa yang Anda lakukan?

Jawaban yang diharapkan:

- Tidak langsung memasukkan log ke public AI.
- Menghapus token, credential, dan data customer.
- Menggunakan data dummy atau sintetik.
- Memeriksa kebijakan perusahaan dan memakai tool internal atau enterprise yang disetujui.
- Melaporkan insiden jika data sensitif telanjur dibagikan.

Token production, password, atau data customer yang dianggap aman untuk dimasukkan ke public AI adalah red flag kritis.

## D. Collaboration & Team Attitude - 7 Menit

Pertanyaan:

1. Ceritakan saat developer tidak setuju dengan bug yang Anda laporkan.
2. Bagaimana Anda memberi feedback ketika test case rekan memiliki risiko yang terlewat?
3. Ceritakan konflik profesional yang pernah terjadi di tim.
4. Bagaimana Anda membantu rekan yang belum memahami domain atau proses testing?
5. Kapan Anda akan melakukan eskalasi?

Yang dinilai:

- Fokus pada masalah, bukan menyerang orang.
- Menggunakan bukti dan reproduksi yang jelas.
- Mau mendengar perspektif pihak lain.
- Mengetahui kapan harus berkolaborasi dan kapan harus eskalasi.
- Tetap menjaga ownership setelah handoff.

## E. Growth Mindset & Learning Agility - 10 Menit

Pertanyaan utama:

> Apakah Anda pernah menggunakan AI untuk membantu pekerjaan atau proses belajar QA? Ceritakan satu penggunaan yang berhasil atau justru tidak berhasil.

Pertanyaan pendalaman:

- Masalah apa yang ingin Anda selesaikan?
- Mengapa memilih menggunakan AI?
- Bagian mana yang dibantu AI?
- Bagian mana yang tetap Anda kerjakan atau validasi sendiri?
- Bagaimana mengetahui bahwa penggunaannya benar-benar membantu?
- Pernahkah output AI membuat pekerjaan lebih lama?
- Apa yang Anda pelajari dari pengalaman tersebut?
- Apa yang dilakukan jika perusahaan tidak mengizinkan public AI?

Contoh jawaban kuat:

> Saya pernah memakai AI untuk membuat alternatif negative scenario API. Hasil awalnya membantu brainstorming, tetapi beberapa expected result tidak sesuai API contract. Setelah itu saya hanya meminta daftar risiko dan pertanyaan yang perlu diperiksa, lalu menyusun test case final sendiri.

Red flag:

- Tidak dapat bekerja ketika AI tidak tersedia.
- Menggunakan AI diam-diam ketika perusahaan melarangnya.
- Tidak pernah mengevaluasi kualitas output.
- Menganggap AI selalu meningkatkan produktivitas.
- Mengukur manfaat hanya dari kecepatan tanpa mempertimbangkan ketepatan dan coverage.

# Sesi 2 - QA Skill Test

**Waktu:** 45-110 menit

## Alur Skill Test

| Waktu | Aktivitas | Output kandidat |
|---|---|---|
| 45-50 | Penjelasan instruksi dan pembagian akses | Kandidat memahami scope dan batasan |
| 50-75 | Web Skill Test | Bug report dan catatan area yang diuji |
| 75-100 | API Skill Test | Test scenario, evidence request/response, dan bug report |
| 100-110 | Pembahasan hasil dan probing AI | Prioritas risiko dan alasan keputusan |

## A. Web Skill Test - 25 Menit

**URL:** [Web Skill Test](https://qa-interview-7oy6fv1nl-qa-interview.vercel.app/)

Instruksi kepada kandidat:

> Anda akan menguji aplikasi katalog produk. Lakukan exploratory testing selama 25 menit. Prioritaskan risiko yang berdampak pada user dan data. Uji happy path, negative path, dan boundary value. Catat setiap temuan dalam Bug Report yang reproducible. Anda boleh menggunakan browser DevTools seperlunya, tetapi tidak diberikan akses source code.

Kandidat menerima:

- URL Web Skill Test.
- Satu akun demo dari interviewer.
- Template Bug Report.
- Batas waktu 25 menit.

Output kandidat:

- Title, severity, priority, environment, precondition, test data, steps to reproduce, expected result, actual result, dan evidence.
- Catatan area yang sudah diuji dan area yang belum sempat diuji.

Rubrik Web Skill Test:

| Aspek | Bobot |
|---|---:|
| Bug unik yang ditemukan | 30% |
| Kualitas langkah reproduksi dan expected/actual | 25% |
| Ketepatan severity dan priority | 20% |
| Cakupan functional, security, data, dan UI | 15% |
| Komunikasi dan metode eksplorasi | 10% |

Sinyal kuat:

- Membuat hipotesis sebelum eksplorasi.
- Menguji happy path, negative path, dan boundary value.
- Membedakan severity dan priority.
- Memberikan bukti yang cukup.
- Menemukan risiko security, data, role, atau akses selain masalah tampilan.

## B. API Skill Test - 25 Menit

**Dokumentasi:** [Restful Booker API Documentation](https://restful-booker.herokuapp.com/apidoc/#api-Booking-GetBookings)  
**Base URL:** `https://restful-booker.herokuapp.com`

Instruksi kepada kandidat:

> Gunakan dokumentasi Restful Booker untuk menyusun pengujian API. Prioritaskan status code, response schema, data integrity, authentication, negative scenario, dan konsistensi antar request. Catat request, response, data uji, expected result, actual result, dan defect yang dapat direproduksi.

Area minimum yang disarankan:

- Get bookings dan get booking berdasarkan ID.
- Create booking dengan payload valid.
- Create booking dengan field wajib kosong, tipe data salah, dan boundary value.
- Update atau partial update booking.
- Delete booking dengan dan tanpa token valid.
- Membaca kembali data setelah create atau update.
- Memvalidasi response code, content type, schema, dan error message.
- Memeriksa akses terhadap resource yang tidak semestinya.

Output kandidat:

- Daftar test scenario atau test case yang diprioritaskan.
- Evidence request dan response.
- Bug report untuk setiap defect yang ditemukan.
- Ringkasan risiko dan area yang belum diuji.

Rubrik API Skill Test:

| Aspek | Bobot |
|---|---:|
| Cakupan endpoint dan fungsi utama | 25% |
| Positive, negative, dan boundary testing | 25% |
| Validasi status code, schema, dan data integrity | 20% |
| Authentication dan security dasar | 15% |
| Evidence, bug report, dan komunikasi | 15% |

Catatan keamanan:

- Gunakan data dummy saja.
- Jangan mengirim credential, token, atau data pribadi ke API demo.
- Jangan melakukan load test atau aktivitas yang mengganggu layanan public.
- Batasi request agar tetap wajar dan sesuai tujuan skill test.

## C. Studi Kasus Dan Probing AI - 10 Menit

Studi kasus:

> Tim akan merilis fitur pembayaran hari ini. Regression baru selesai 60%, dan ditemukan intermittent API 500 pada proses pembayaran. Product Owner ingin release tetap dilakukan karena ada kebutuhan customer. Apa yang Anda lakukan sebagai QA?

Setelah kandidat menjawab, tanyakan:

> QA lain telah menggunakan AI untuk menghasilkan 30 test case untuk fitur ini. Apakah informasi tersebut mengubah keputusan atau strategi testing Anda?

Pertanyaan pendalaman:

- Apakah 30 test case berarti coverage sudah cukup?
- Apa yang akan Anda periksa dari test case tersebut?
- Bagaimana jika AI tidak membuat skenario pembayaran berhasil tetapi jurnal gagal terbentuk?
- Bagaimana jika expected result berbeda dari requirement?
- Dengan waktu terbatas, apakah semua test case akan dieksekusi?

Jawaban kuat seharusnya:

1. Memeriksa critical flow dan risiko bisnis terlebih dahulu.
2. Menilai dampak API 500 terhadap transaksi, retry, duplicate charge, dan data finansial.
3. Memetakan test case ke requirement, acceptance criteria, dan API contract.
4. Menghapus duplikasi dan memvalidasi expected result.
5. Menambahkan risiko yang terlewat, termasuk pembayaran berhasil tetapi jurnal gagal.
6. Memprioritaskan testing berdasarkan impact dan likelihood.
7. Menyiapkan evidence, batasan, mitigation, dan rekomendasi go/no-go.
8. Tidak mengeksekusi semua test case hanya demi angka coverage.

# Sesi 3 - Tanya Jawab Dan Penutup

**Waktu:** 110-120 menit

## Pertanyaan Untuk Kandidat

Sampaikan:

> Sekarang giliran Anda. Apa yang ingin Anda tanyakan tentang peran, tim, proses kerja, atau tahapan berikutnya?

Jika kandidat belum memiliki pertanyaan, gunakan pertanyaan pemantik berikut:

- Apa hal terpenting yang ingin Anda pahami tentang peran ini?
- Bagian mana dari proses interview atau skill test yang ingin Anda klarifikasi?
- Dukungan seperti apa yang menurut Anda penting untuk berkembang sebagai QA di tim baru?

Yang dinilai:

- Relevansi pertanyaan terhadap peran dan konteks pekerjaan.
- Rasa ingin tahu terhadap kualitas, proses, produk, dan kerja sama tim.
- Kemampuan mendengar jawaban dan melakukan follow-up.
- Ekspektasi kandidat yang realistis.

## Penutup Interviewer

Sampaikan:

> Terima kasih atas waktunya. Kami akan mereview hasil interview dan skill test. Tim kami akan menghubungi Anda terkait tahapan berikutnya.

Catat pertanyaan kandidat dan komitmen follow-up sebelum mengakhiri sesi.

## Bobot Penilaian Keseluruhan

AI tidak dinilai sebagai aspek terpisah. Unsur AI dimasukkan ke QA Mindset, Growth Mindset, dan probing pada skill test.

| Aspek | Bobot | Unsur AI bila relevan |
|---|---:|---|
| Perkenalan dan pengalaman | 15% | Tidak ada |
| Communication & Clarity | 10% | Tidak ada |
| QA Mindset & Problem Ownership | 20% | Validasi output, source of truth, keamanan data, ownership |
| Collaboration & Team Attitude | 10% | Tidak ada |
| Growth Mindset & Learning Agility | 10% | Kemauan mencoba dan evaluasi hasil |
| Web Skill Test | 15% | Tidak ada pertanyaan AI tambahan |
| API Skill Test dan studi kasus | 20% | Probing strategi testing berbantuan AI |

Target pengaruh unsur AI adalah sekitar 10% dari keseluruhan penilaian, bukan tambahan bobot di luar tabel.

## Lembar Catatan Interviewer

| Aspek | Bukti atau catatan | Skor |
|---|---|---:|
| Perkenalan dan pengalaman |  |  |
| Communication & Clarity |  |  |
| QA Mindset & Problem Ownership |  |  |
| Collaboration & Team Attitude |  |  |
| Growth Mindset & Learning Agility |  |  |
| Web Skill Test |  |  |
| API Skill Test dan studi kasus |  |  |
| Tanya jawab kandidat |  |  |
| Total |  |  |

Keputusan akhir:

- [ ] Strong hire
- [ ] Hire
- [ ] Hold / perlu kalibrasi tambahan
- [ ] No hire

Alasan keputusan:

______________________________________________________________________________

______________________________________________________________________________
