# Test Case Matrix

Gunakan daftar ini sebagai lembar kerja kandidat. Status dapat diisi `Pass`, `Fail`, atau `Blocked`.

## Authentication

| ID | Test case | Category | Priority |
|---|---|---|---|
| TC-001 | Login dengan kredensial valid | Functional | Critical |
| TC-002 | Password salah ditolak | Functional | Critical |
| TC-003 | Username tidak terdaftar | Functional | High |
| TC-004 | Field login kosong | Functional | High |
| TC-005 | Percobaan login gagal berulang | Security | High |
| TC-006 | Logout lalu buka halaman terproteksi | Functional | High |
| TC-007 | Session expired setelah idle | Security | High |
| TC-008 | Akses URL terproteksi tanpa login | Security | Critical |

## Product CRUD

| ID | Test case | Category | Priority |
|---|---|---|---|
| TC-101 | Create produk valid | Functional | Critical |
| TC-102 | Field wajib kosong | Functional | High |
| TC-103 | Nama duplikat | Data Integrity | Medium |
| TC-104 | Harga negatif, nol, desimal | Boundary | High |
| TC-105 | Stok negatif, non-numerik | Boundary | High |
| TC-106 | Nama sangat panjang | Boundary | Medium |
| TC-107 | List menampilkan data yang benar | Functional | Critical |
| TC-108 | Update produk | Functional | Critical |
| TC-109 | Update ID tidak ada | Functional | Medium |
| TC-110 | Update produk user lain | Security | Critical |
| TC-111 | Delete produk | Functional | Critical |
| TC-112 | Delete ID tidak ada | Functional | Medium |
| TC-113 | Delete produk user lain | Security | Critical |
| TC-114 | Data tetap ada setelah refresh/re-login | Data Integrity | High |
| TC-115 | Payload XSS pada nama produk | Security | Critical |
| TC-116 | Upload JPG/PNG maksimal 2 MB | Functional | High |
| TC-117 | File non-image atau >2 MB ditolak | Boundary | High |
| TC-118 | Preview/thumbnail tetap ada setelah refresh | Data Integrity | Medium |

## Search, Filter, Pagination

| ID | Test case | Category | Priority |
|---|---|---|---|
| TC-201 | Search dengan hasil | Functional | High |
| TC-202 | Search tanpa hasil | Functional | Medium |
| TC-203 | Filter kategori | Functional | High |
| TC-204 | Filter harga minimum | Boundary | Medium |
| TC-205 | First, next, previous, last page | Functional | High |
| TC-206 | Last page tidak error | Functional | Medium |
| TC-207 | Sort nama dan harga asc/desc | Functional | Medium |

## UI, Accessibility, Edge Case

| ID | Test case | Category | Priority |
|---|---|---|---|
| TC-301 | Pesan error menunjuk field | UI | Medium |
| TC-302 | Tidak ada typo | UI | Low |
| TC-303 | Kontras memadai | Accessibility | Low |
| TC-304 | Layout mobile | Responsive | Medium |
| TC-305 | Tab order | Accessibility | Low |
| TC-306 | Feedback submit | UI | Medium |
| TC-307 | Delete memiliki konfirmasi | UI | Medium |
| TC-401 | Double-submit tidak menggandakan data | Data Integrity | Medium |
| TC-402 | Format harga konsisten | Data Integrity | Medium |
| TC-403 | Input angka `e`, `+`, koma | Boundary | Medium |
| TC-404 | Stok minimum dashboard akurat | Data Integrity | Medium |
| TC-405 | Unicode/emoji pada nama | Compatibility | Low |
