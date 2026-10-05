# Implementasi ERD v2 pada database bersama

Migrasi `2026_09_26_000100` sampai `000102` dimiliki proyek **mspace** dan sudah dijalankan pada database lokal `mspace` tanggal 26 September 2026. Proyek dashboard memakai database yang sama dan tidak boleh membuat ulang tabel ini. Cadangan sebelum migrasi tersimpan privat di `storage/app/private/backups/mspace-pre-erd-20260926-173905.sql` (diabaikan Git).

## Struktur yang telah aktif

| Domain | Perubahan |
| --- | --- |
| Unit | `birdepts.nama_birdept` menjadi `VARCHAR`, `nama_panggilan` unik; `jenis` tetap tiga nilai `bph/biro/departemen`. |
| Orang dan studi | `people`, `memberships`, `prodis`, serta FK nullable `users.person_id` dan `users.prodi_id`. Keanggotaan bukan hak akses dashboard. |
| Peran | `roles` dan `user_roles` disediakan; otorisasi dashboard saat ini masih membaca `users.admin_role` setelah migrasi dashboard dan penetapan admin dijalankan. |
| Konten | `informasi.slug`, `updated_by`, `published_by`, `deleted_at`, indeks publikasi/pemilik/jenis; status dan jenis berubah dari enum menjadi `VARCHAR` dengan `CHECK` MariaDB. ID dan FK lama sengaja dipertahankan sebagai jembatan. |
| Detail | `informasi_lomba`, `informasi_birdepts`, `proker_participants`, `wisuda_profiles`; `sort_order` pada syarat dan manfaat beasiswa. |
| Berkas | `documents`, `document_versions`, `informasi_documents`. Metadata dan lokasi berkas dapat ditata tanpa menyimpan isi berkas di database. |
| Jejak | `content_revisions` dan `audit_events`. Audit baru mulai tersedia setelah aplikasi penulis dihubungkan; data masa lalu tidak direka sebagai audit. |

## Pemetaan data lama

- 2 akun BEM dipetakan ke 2 `people` dan 2 `memberships`; tanggal mulai lama tidak tersedia sehingga tetap `NULL`. NIM tidak disalin ke `people`.
- 5 prodi referensi dibuat; 2 akun yang memiliki nilai prodi dipetakan ke `prodi_id`.
- 59 informasi mendapat slug unik dan masing-masing satu revisi **baseline**. Tabel revisi tidak menyatakan siapa yang pernah mengubah konten sebelum migrasi.
- Dokumen, audit, profil wisuda, serta detail lomba belum berisi baris karena sumber data lama tidak menyediakannya. Enam proker mempunyai baris detail; sisanya tetap informasi jenis proker tanpa detail, tidak dibuatkan isi fiktif.
- `php artisan erd:backfill` aman dijalankan ulang untuk menyalin baris lama baru ke tabel tambahan. Perintah ini tidak menggantikan sinkronisasi permanen saat dashboard kelak menulis ke skema baru.

## Aturan saat masa transisi

- Situs publik membaca informasi melalui scope `published` dan `active`, serta hanya mengirim kolom publik. Halaman detail memakai slug atau ID sebagai cadangan bagi konten baru dari dashboard lama.
- Jangan menghapus kolom/tabel lama (`users_bem`, `panitia_proker`, `informasi.idbirdept`, `informasi.iduser`) sebelum dashboard menulis ke struktur baru dan seluruh relasi diperiksa. Migrasi ini sengaja menolak `rollback`; gunakan cadangan terverifikasi bila harus memulihkan database.
- `user_roles` belum menjadi sumber izin dashboard sampai alur pengelolaan peran dan migrasi `admin_role` disatukan. Jangan menyimpulkan hak admin dari `memberships.position` atau `users_bem.jabatan`.
- Tabel `audit_events` belum otomatis mencatat aksi dashboard. Hubungkan pencatatan server saat pembaruan dashboard, dengan metadata yang tidak memuat kata sandi, token, NIM, atau isi sesi.
- Konten baru dari dashboard lama dapat memiliki `slug = NULL`; gunakan `erd:backfill` setelah impor besar hingga dashboard menghasilkan slug dan revisi secara langsung.
