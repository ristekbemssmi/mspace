# Akses dashboard M-SPACE

Dashboard menggunakan `users.admin_role` yang bernilai `admin`, `editor`, `viewer`, atau `NULL`. Nilai `NULL` berarti akun biasa tanpa akses dashboard. Kolom ini tidak boleh diisi melalui formulir pengguna atau CSV.

| Peran | Hak akses |
| --- | --- |
| admin | Semua modul, perubahan dan penghapusan, impor dan ekspor CSV, serta publikasi informasi. |
| editor | Membaca modul konten, mengelola FAQ, membuat draft informasi, dan mengubah draft informasi miliknya sendiri. |
| viewer | Membaca halaman dashboard dan modul konten. |
| NULL | Tidak dapat membuka dashboard. |

Semua rute admin mensyaratkan login, verifikasi email, peran dashboard, dan policy aksi. Pemeriksaan kepemilikan draft dilakukan di controller melalui policy model. Pendaftaran akun di dashboard aktif, tetapi akun baru tetap memiliki `admin_role = NULL` dan dialihkan ke halaman menunggu persetujuan. Admin menyetujui akun di `/admin/approvals`, lalu memilih peran. Setiap persetujuan dicatat di log aplikasi beserta ID admin, ID akun, dan peran.

## Penerapan pada database yang sudah ada

1. Pastikan email akun admin pertama yang memang berwenang sudah diketahui. Migrasi menambah kolom nullable dan tidak otomatis menaikkan hak akun mana pun.
2. Jalankan migrasi `2026_09_26_000001_add_admin_role_to_users_table.php`, `2026_09_26_000003_add_account_authentication_fields.php`, dan migrasi kolom dua faktor. Pada database bersama, ketiganya sudah dijalankan pada 26 September 2026.
3. Jalankan `php artisan admin:grant email@contoh.ac.id admin` untuk akun yang sudah ada. Periksa akses dashboard dengan akun tersebut.
4. Untuk petugas lain, jalankan perintah yang sama dengan peran `editor` atau `viewer`. `php artisan admin:grant email@contoh.ac.id none` mencabut akses; admin terakhir tidak dapat dicabut.

Jangan membuat akun admin dengan kata sandi baku di seeder. Ekspor users tidak memuat kata sandi, token, atau rahasia autentikasi dua faktor. Impor users membuat kata sandi acak sehingga akun baru harus melalui alur pemulihan kata sandi.

## Email pemulihan dan verifikasi

Atur `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, dan `MAIL_FROM_ADDRESS` ke penyedia SMTP yang dipilih. Nilai `MAIL_MAILER=log` pada instalasi lokal hanya menulis tautan reset dan verifikasi ke log; email tidak sampai ke kotak masuk. Uji pengiriman setelah kredensial SMTP tersedia. Akun yang belum memverifikasi email diarahkan ke halaman verifikasi.

Situs publik tidak memerlukan akun atau sesi autentikasi bagi pengunjung yang sekadar membaca halaman. Tabel `sessions` Laravel menyimpan sesi autentikasi/aplikasi bila driver database digunakan, bukan catatan permanen semua kunjungan. Rancangan audit perubahan konten dan aktivitas admin berada dalam `D:\herd\mspace\docs\rencana-erd-v2.md` dan belum dimigrasikan.
