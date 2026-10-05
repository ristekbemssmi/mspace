# Standar skema MSPACE

## Cakupan

Database MySQL dipakai bersama oleh situs publik dan dashboard. Migrasi `2026_09_27_010000_standardize_domain_schema.php` mengganti nama tabel dan kolom domain tanpa menghapus baris. Migrasi `2026_09_27_010100_normalize_expiration_end_of_day.php` mengubah nilai kedaluwarsa lama yang tepat pukul 00.00 menjadi 23.59.59 pada hari yang sama. Kedua migrasi memiliki nama dan isi yang sama di kedua proyek, sehingga hanya dijalankan sekali pada database bersama. Migrasi `2026_10_06_000000_normalize_domain_table_case.php` menyamakan nama tabel fisik menjadi huruf kecil pada server MySQL yang membedakan kapitalisasi; tabel impor yang sudah huruf kecil tidak diubah.

Migrasi historis tetap memuat nama lama agar instalasi baru dapat membangun skema awal sebelum migrasi penamaan. `LegacyErdBackfillService` hanya dipakai oleh migrasi historis. Kode aplikasi yang berjalan memakai nama baru.

## Nama tabel domain

| Sebelumnya | Sekarang |
| --- | --- |
| `birdepts` | `units` |
| `prodis` | `studyPrograms` |
| `informasi` | `information` |
| `informasi_beasiswa`, `syarat_beasiswa`, `benefit_beasiswa` | `scholarships`, `scholarshipRequirements`, `scholarshipBenefits` |
| `informasi_kegiatan`, `informasi_himpunan`, `informasi_wisuda` | `activities`, `studentAssociations`, `graduations` |
| `informasi_alumni`, `informasi_magang`, `informasi_lomba` | `alumni`, `internships`, `competitions` |
| `informasi_proker`, `informasi_prokers`, `panitia_proker`, `proker_participants` | `workPrograms`, `workProgramLinks`, `workProgramCommittees`, `workProgramParticipants` |
| `informasi_birdepts`, `informasi_documents` | `informationUnits`, `informationDocuments` |
| `users_bem`, `users_umum`, `program_kerjas` | `organizationMembers`, `generalUsers`, `featuredPrograms` |
| `wisuda_profiles`, `user_roles`, `document_versions` | `graduationProfiles`, `userRoles`, `documentVersions` |
| `content_revisions`, `audit_events` | `contentRevisions`, `auditEvents` |

Nama kolom utama: `unitId`, `userId`, `title`, `description`, `category`, `publishedAt`, `expiresAt`, `createdAt`, `updatedAt`. Gunakan akhiran `At` untuk tanggal dan jam, serta `On` untuk tanggal tanpa jam (`opensOn`, `closesOn`, `startsOn`, `endsOn`). Kolom detail lain menggunakan kata Inggris dan camelCase; daftar lengkap ada pada konstanta `COLUMNS` di migrasi penamaan.

Status `published` dengan `publishedAt` di masa depan baru muncul ketika waktunya tiba. `expiresAt` berlaku sampai akhir hari yang dipilih. Draft tanpa jadwal memiliki `publishedAt = NULL`. Kolaborator program kerja tetap memakai tabel penghubung `informationUnits`.

Input jadwal admin memakai waktu lokal WIB. Kedua aplikasi memakai `Asia/Jakarta` dan koneksi MySQL memakai `+07:00`; nilai waktu yang dikirim ke browser tetap dapat diserialisasi sebagai UTC dan ditampilkan kembali dalam WIB. Pertahankan konfigurasi ini bersama saat memindahkan aplikasi ke server lain.

Penghapusan informasi oleh admin memakai `deletedAt` (soft delete). Situs publik dan daftar admin normal tidak menampilkan baris yang dihapus; policy per entri tetap memeriksa peran sebelum aksi hapus.

## Batas framework dan lingkungan

Tabel internal Laravel (`migrations`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `password_reset_tokens`) tetap memakai kontrak framework. Kolom autentikasi `users.email_verified_at`, `users.remember_token`, dan `users.two_factor_*` juga tetap mengikuti Laravel/Fortify agar login, verifikasi email, dan autentikasi dua faktor tidak rusak.

Nama tabel fisik multi kata menggunakan huruf kecil, misalnya `informationimages`, `informationunits`, dan `sitevisits`. Referensi tabel di kode Laravel juga memakai huruf kecil agar impor database dari MySQL lokal tetap bekerja pada server Linux yang membedakan kapitalisasi. Nama kolom tetap memakai camelCase sesuai skema.

## Pemulihan dan pemeriksaan

Sebelum migrasi aktif, salinan skema lama dibuat dan jumlah baris 40 tabel diverifikasi pada database `mspace_schema_backup_20260927_004025`. Salinan itu mengandung data pengguna; batasi akses dan hapus setelah periode pemulihan selesai. Jangan memakai `migrate:rollback` untuk penamaan ini: pemulihan memerlukan salinan database **dan kode kedua aplikasi dari sebelum migrasi**, lalu aset dibangun ulang. Arsip kode sebelum penamaan ada di `.codex-work/public-before-schema-rename.zip` dan `.codex-work/admin-before-schema-rename.zip` pada workspace publik.

Sesudah migrasi, 32 tabel domain mempunyai jumlah baris yang sama dengan salinan. Kedua aplikasi dapat membaca 59 informasi dan 2 pengguna. Tes otomatis, build, dan uji HTTP rute utama dijalankan untuk kedua aplikasi.
